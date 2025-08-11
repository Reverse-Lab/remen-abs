import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  structuredData
}) => {
  const currentUrl = canonical || window.location.href;

  useEffect(() => {
    // 페이지 제목 설정
    document.title = title;
    
    // 메타 태그 업데이트
    updateMetaTag('description', description);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Canonical 태그 추가/업데이트
    updateCanonicalTag(currentUrl);
    
    // Open Graph 태그 업데이트
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', ogType);
    updateMetaTag('og:image', ogImage);
    
    // Twitter Card 태그 업데이트
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // 구조화된 데이터 추가
    if (structuredData) {
      addStructuredData(structuredData);
    }

    // cleanup 함수
    return () => {
      // 컴포넌트 언마운트 시 추가된 메타 태그 정리
      cleanupMetaTags();
    };
  }, [title, description, keywords, currentUrl, ogImage, ogType, structuredData]);

  const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const updateCanonicalTag = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  };

  const addStructuredData = (data: object) => {
    // 기존 구조화된 데이터 제거
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // 새로운 구조화된 데이터 추가
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  const cleanupMetaTags = () => {
    // 추가된 메타 태그들을 정리 (필요한 경우)
    // 기본 메타 태그는 유지
  };

  // Helmet을 사용하지 않고 null 반환
  return null;
};

export default SEO; 