import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 전환 시 스크롤을 맨 위로 이동
    const scrollToTop = () => {
      // 부드러운 스크롤 지원 여부 확인
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // 부드러운 스크롤을 지원하지 않는 브라우저를 위한 대체 방법
        window.scrollTo(0, 0);
      }
    };

    // 즉시 스크롤 실행
    scrollToTop();

    // 추가로 requestAnimationFrame을 사용하여 확실히 스크롤 위치 초기화
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    // 모바일 환경에서의 추가 처리
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // 모바일에서는 즉시 스크롤
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop; 