import React, { useEffect, useState } from 'react';
import { generateFullSitemap, addNewRoute, removeRoute } from '../utils/sitemapGenerator';

interface DynamicSitemapProps {
  baseUrl?: string;
}

const DynamicSitemap: React.FC<DynamicSitemapProps> = ({ baseUrl = 'https://www.remen-abs.com' }) => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateSitemap();
  }, [baseUrl]);

  const generateSitemap = async () => {
    try {
      setLoading(true);
      const xml = await generateFullSitemap(baseUrl);
      setSitemapXml(xml);
      setError(null);
    } catch (err) {
      console.error('Error generating sitemap:', err);
      setError('Sitemap 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 새 페이지 추가 함수 (관리자용)
  const addNewPage = (path: string, priority: number = 0.5) => {
    addNewRoute(path, priority);
    generateSitemap(); // sitemap 재생성
  };

  // 페이지 제거 함수 (관리자용)
  const removePage = (path: string) => {
    removeRoute(path);
    generateSitemap(); // sitemap 재생성
  };

  if (loading) {
    return <div>Loading sitemap...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>동적 Sitemap</h2>
      <button onClick={generateSitemap}>Sitemap 재생성</button>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
        {sitemapXml}
      </pre>
    </div>
  );
};

export default DynamicSitemap; 