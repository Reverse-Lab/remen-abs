import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, Calendar, Clock, CalendarDays, CalendarRange } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

interface TimeRangeStats {
  hourly: { [hour: string]: number };
  daily: { [date: string]: number };
  weekly: { [week: string]: number };
  monthly: { [month: string]: number };
}

interface ChartDataItem {
  hour?: string;
  date?: string;
  week?: string;
  month?: string;
  displayDate?: string;
  displayWeek?: string;
  displayMonth?: string;
  visitors: number;
}

const VisitorStats: React.FC = () => {
  const [stats, setStats] = useState<TimeRangeStats | null>(null);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageStats, setPageStats] = useState<{ [page: string]: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTimeRange, setActiveTimeRange] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsData, totalVisitorsData, pageStatsData] = await Promise.all([
        analyticsService.getVisitorStats(),
        analyticsService.getTotalVisitors(),
        analyticsService.getPageStats(),
      ]);
      
      setStats(statsData);
      setTotalVisitors(totalVisitorsData);
      setPageStats(pageStatsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (): ChartDataItem[] => {
    if (!stats) return [];

    switch (activeTimeRange) {
      case 'hourly':
        return analyticsService.formatHourlyData(stats.hourly);
      case 'daily':
        return analyticsService.formatDailyData(stats.daily);
      case 'weekly':
        return analyticsService.formatWeeklyData(stats.weekly);
      case 'monthly':
        return analyticsService.formatMonthlyData(stats.monthly);
      default:
        return [];
    }
  };

  const getTimeRangeLabel = () => {
    switch (activeTimeRange) {
      case 'hourly': return '시간대별';
      case 'daily': return '일별';
      case 'weekly': return '주별';
      case 'monthly': return '월별';
      default: return '';
    }
  };

  const getTimeRangeIcon = () => {
    switch (activeTimeRange) {
      case 'hourly': return <Clock size={20} />;
      case 'daily': return <CalendarDays size={20} />;
      case 'weekly': return <CalendarRange size={20} />;
      case 'monthly': return <Calendar size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(item => item.visitors), 1);
  
  // 평균 방문자 수 계산 함수
  const calculateAverageVisitors = (): number => {
    if (chartData.length === 0) return 0;
    const total = chartData.reduce((sum: number, item: ChartDataItem) => sum + item.visitors, 0);
    return Math.round(total / chartData.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 방문자</p>
              <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}명</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <Eye className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 페이지뷰</p>
              <p className="text-2xl font-bold text-gray-900">
                {pageStats ? Object.values(pageStats).reduce((sum, count) => sum + count, 0).toLocaleString() : 0}회
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 페이지</p>
              <p className="text-2xl font-bold text-gray-900">
                {pageStats ? Object.keys(pageStats).length : 0}개
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">평균 방문자</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculateAverageVisitors()}명
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 차트 섹션 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">방문자 통계</h3>
            <div className="flex space-x-2">
              {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveTimeRange(range)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTimeRange === range
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getTimeRangeIcon()}
                  <span className="ml-2">
                    {range === 'hourly' && '시간대별'}
                    {range === 'daily' && '일별'}
                    {range === 'weekly' && '주별'}
                    {range === 'monthly' && '월별'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {chartData.length > 0 ? (
            <div className="space-y-4">
              {/* 차트 */}
              <div className="h-64 flex items-end space-x-2">
                {chartData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.visitors / maxValue) * 100}%` }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-1 bg-blue-500 rounded-t-lg relative group"
                    style={{ minHeight: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.visitors}명
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* X축 라벨 */}
              <div className="flex justify-between text-xs text-gray-500">
                {chartData.map((item, index) => (
                  <div key={index} className="text-center">
                    {activeTimeRange === 'hourly' && item.hour}
                    {activeTimeRange === 'daily' && item.displayDate}
                    {activeTimeRange === 'weekly' && item.displayWeek}
                    {activeTimeRange === 'monthly' && item.displayMonth}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
              <p>아직 방문자 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 페이지별 통계 */}
      {pageStats && Object.keys(pageStats).length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">페이지별 방문자 수</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(pageStats)
                .sort(([, a], [, b]) => b - a)
                .map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">
                      {page === '/' ? '홈페이지' : page}
                    </span>
                    <span className="text-sm text-gray-600">{count.toLocaleString()}회</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 새로고침 버튼 */}
      <div className="text-center">
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          통계 새로고침
        </button>
      </div>
    </div>
  );
};

export default VisitorStats;
