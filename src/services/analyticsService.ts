import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { app } from '../firebase';

interface VisitorStats {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  timestamp: Date;
}

interface TimeRangeStats {
  hourly: { [hour: string]: number };
  daily: { [date: string]: number };
  weekly: { [week: string]: number };
  monthly: { [month: string]: number };
}

class AnalyticsService {
  private analytics: any = null;
  private db: any = null;

  constructor() {
    if (app) {
      try {
        this.analytics = getAnalytics(app);
        this.db = getFirestore(app);
      } catch (error) {
        console.error('Analytics service initialization failed:', error);
      }
    }
  }

  // 방문자 추적 (페이지 방문 시 호출)
  async trackPageView(pagePath: string, pageTitle: string) {
    try {
      // Firebase Analytics 이벤트 로깅
      if (this.analytics) {
        logEvent(this.analytics, 'page_view', {
          page_path: pagePath,
          page_title: pageTitle,
        });
      }

      // Firestore에 방문자 통계 저장
      await this.updateVisitorStats(pagePath);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // 방문자 통계 업데이트
  private async updateVisitorStats(pagePath: string) {
    if (!this.db) return;

    try {
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0];
      const hourKey = today.getHours().toString().padStart(2, '0');
      const weekKey = this.getWeekKey(today);
      const monthKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;

      const statsRef = doc(this.db, 'analytics', 'visitorStats');
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        // 기존 통계 업데이트
        await updateDoc(statsRef, {
          [`daily.${dateKey}`]: increment(1),
          [`hourly.${hourKey}`]: increment(1),
          [`weekly.${weekKey}`]: increment(1),
          [`monthly.${monthKey}`]: increment(1),
          totalVisitors: increment(1),
          lastUpdated: new Date(),
        });
      } else {
        // 새로운 통계 문서 생성
        const initialStats = {
          totalVisitors: 1,
          uniqueVisitors: 1,
          pageViews: 1,
          daily: { [dateKey]: 1 },
          hourly: { [hourKey]: 1 },
          weekly: { [weekKey]: 1 },
          monthly: { [monthKey]: 1 },
          createdAt: new Date(),
          lastUpdated: new Date(),
        };
        await setDoc(statsRef, initialStats);
      }

      // 페이지별 통계 업데이트
      const pageStatsRef = doc(this.db, 'analytics', 'pageStats');
      const pageStatsDoc = await getDoc(pageStatsRef);

      if (pageStatsDoc.exists()) {
        await updateDoc(pageStatsRef, {
          [`pages.${pagePath}`]: increment(1),
          totalPageViews: increment(1),
          lastUpdated: new Date(),
        });
      } else {
        const initialPageStats = {
          pages: { [pagePath]: 1 },
          totalPageViews: 1,
          createdAt: new Date(),
          lastUpdated: new Date(),
        };
        await setDoc(pageStatsRef, initialPageStats);
      }
    } catch (error) {
      console.error('Error updating visitor stats:', error);
    }
  }

  // 주차 키 생성 (YYYY-WW 형식)
  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  }

  // 방문자 통계 가져오기
  async getVisitorStats(): Promise<TimeRangeStats | null> {
    if (!this.db) return null;

    try {
      const statsRef = doc(this.db, 'analytics', 'visitorStats');
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        const data = statsDoc.data();
        return {
          hourly: data.hourly || {},
          daily: data.daily || {},
          weekly: data.weekly || {},
          monthly: data.monthly || {},
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting visitor stats:', error);
      return null;
    }
  }

  // 총 방문자 수 가져오기
  async getTotalVisitors(): Promise<number> {
    if (!this.db) return 0;

    try {
      const statsRef = doc(this.db, 'analytics', 'visitorStats');
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        return statsDoc.data().totalVisitors || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting total visitors:', error);
      return 0;
    }
  }

  // 페이지별 통계 가져오기
  async getPageStats(): Promise<{ [page: string]: number } | null> {
    if (!this.db) return null;

    try {
      const pageStatsRef = doc(this.db, 'analytics', 'pageStats');
      const pageStatsDoc = await getDoc(pageStatsRef);

      if (pageStatsDoc.exists()) {
        return pageStatsDoc.data().pages || {};
      }
      return null;
    } catch (error) {
      console.error('Error getting page stats:', error);
      return null;
    }
  }

  // 시간대별 통계 데이터 포맷팅
  formatHourlyData(hourlyData: { [hour: string]: number }) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    return hours.map(hour => ({
      hour: `${hour}:00`,
      visitors: hourlyData[hour] || 0,
    }));
  }

  // 일별 통계 데이터 포맷팅 (최근 30일)
  formatDailyData(dailyData: { [date: string]: number }) {
    const dates = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dates.push({
        date: dateKey,
        visitors: dailyData[dateKey] || 0,
        displayDate: `${date.getMonth() + 1}/${date.getDate()}`,
      });
    }
    
    return dates;
  }

  // 주별 통계 데이터 포맷팅 (최근 12주)
  formatWeeklyData(weeklyData: { [week: string]: number }) {
    const weeks = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7));
      const weekKey = this.getWeekKey(date);
      weeks.push({
        week: weekKey,
        visitors: weeklyData[weekKey] || 0,
        displayWeek: `${date.getMonth() + 1}/${date.getDate()}`,
      });
    }
    
    return weeks;
  }

  // 월별 통계 데이터 포맷팅 (최근 12개월)
  formatMonthlyData(monthlyData: { [month: string]: number }) {
    const months = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      months.push({
        month: monthKey,
        visitors: monthlyData[monthKey] || 0,
        displayMonth: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      });
    }
    
    return months;
  }
}

export const analyticsService = new AnalyticsService();
