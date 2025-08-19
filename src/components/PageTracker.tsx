import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';

const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // 페이지 제목 가져오기
    const getPageTitle = (pathname: string): string => {
      switch (pathname) {
        case '/':
          return '홈페이지 - 재생ABS';
        case '/about':
          return '회사소개 - 재생ABS';
        case '/products':
          return '제품목록 - 재생ABS';
        case '/cart':
          return '장바구니 - 재생ABS';
        case '/checkout':
          return '주문하기 - 재생ABS';
        case '/order-complete':
          return '주문완료 - 재생ABS';
        case '/order-history':
          return '주문내역 - 재생ABS';
        case '/contact':
          return '문의하기 - 재생ABS';
        case '/privacy':
          return '개인정보처리방침 - 재생ABS';
        case '/terms':
          return '이용약관 - 재생ABS';
        case '/refund-policy':
          return '환불정책 - 재생ABS';
        case '/admin':
          return '관리자페이지 - 재생ABS';
        case '/repair-service':
          return '수리서비스 - 재생ABS';
        default:
          if (pathname.startsWith('/products/')) {
            return '제품상세 - 재생ABS';
          }
          return '재생ABS';
      }
    };

    const pageTitle = getPageTitle(location.pathname);
    
    // 페이지 방문 추적
    analyticsService.trackPageView(location.pathname, pageTitle);
    
    // 페이지 제목 업데이트
    document.title = pageTitle;
  }, [location.pathname]);

  return null; // 이 컴포넌트는 렌더링하지 않음
};

export default PageTracker;
