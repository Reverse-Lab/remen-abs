import { productService, Product } from '../services/firebaseService';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface SitemapConfig {
  baseUrl: string;
  staticRoutes: SitemapUrl[];
  dynamicRoutes?: {
    products?: boolean;
    categories?: boolean;
  };
}

// 기본 정적 라우트 정의
const STATIC_ROUTES: SitemapUrl[] = [
  {
    loc: '/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    loc: '/about',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: '/products',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    loc: '/products?brand=렉서스',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: '/products?brand=벤츠',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: '/products?brand=BMW',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: '/products?brand=아우디',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: '/remanufacturing',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: '/cart',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.6
  },
  {
    loc: '/checkout',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.7
  },
  {
    loc: '/order-complete',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.5
  },
  {
    loc: '/order-history',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.6
  },
  {
    loc: '/contact',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: '/privacy',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.4
  },
  {
    loc: '/terms',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.4
  },
  {
    loc: '/refund-policy',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.4
  }
];

// 제품별 동적 라우트 생성
export const generateProductUrls = async (baseUrl: string): Promise<SitemapUrl[]> => {
  try {
    const products = await productService.getAllProducts();
    return products.map(product => ({
      loc: `/products/${product.id}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.8
    }));
  } catch (error) {
    console.error('Error generating product URLs:', error);
    return [];
  }
};

// XML 형식으로 sitemap 생성
export const generateSitemapXml = (urls: SitemapUrl[], baseUrl: string): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetEnd = '</urlset>';

  const urlEntries = urls.map(url => {
    const fullUrl = `${baseUrl}${url.loc}`;
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  return `${xmlHeader}
${urlsetStart}
${urlEntries}
${urlsetEnd}`;
};

// 전체 sitemap 생성
export const generateFullSitemap = async (baseUrl: string = 'https://www.remen-abs.com'): Promise<string> => {
  try {
    // 정적 라우트
    const staticUrls = STATIC_ROUTES;
    
    // 동적 제품 라우트
    const productUrls = await generateProductUrls(baseUrl);
    
    // 모든 URL 결합
    const allUrls = [...staticUrls, ...productUrls];
    
    // XML 생성
    return generateSitemapXml(allUrls, baseUrl);
  } catch (error) {
    console.error('Error generating full sitemap:', error);
    // 에러 시 기본 정적 라우트만 포함
    return generateSitemapXml(STATIC_ROUTES, baseUrl);
  }
};

// 새 라우트 추가 함수
export const addNewRoute = (path: string, priority: number = 0.5, changefreq: SitemapUrl['changefreq'] = 'weekly'): void => {
  const newRoute: SitemapUrl = {
    loc: path,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq,
    priority
  };
  
  // STATIC_ROUTES에 새 라우트 추가
  STATIC_ROUTES.push(newRoute);
  
  console.log(`New route added to sitemap: ${path}`);
};

// 라우트 제거 함수
export const removeRoute = (path: string): void => {
  const index = STATIC_ROUTES.findIndex(route => route.loc === path);
  if (index !== -1) {
    STATIC_ROUTES.splice(index, 1);
    console.log(`Route removed from sitemap: ${path}`);
  }
}; 