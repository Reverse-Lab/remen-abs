import React, { useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageTracker from './components/PageTracker';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderComplete from './pages/OrderComplete';
import OrderHistory from './pages/OrderHistory';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import Admin from './pages/Admin';
import RepairService from './pages/RepairService';
import UserProfile from './pages/UserProfile';
import './App.css';

// 로딩 컴포넌트
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// 에러 바운더리 컴포넌트
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              페이지를 불러오는 중 문제가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-4">
              잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = React.memo(() => {
  // 라우트 설정을 메모이제이션
  const routes = useMemo(() => [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/products", element: <Products /> },
    { path: "/products/:id", element: <ProductDetail /> },
    { path: "/cart", element: <Cart /> },
    { path: "/checkout", element: <Checkout /> },
    { path: "/order-complete", element: <OrderComplete /> },
    { path: "/order-history", element: <OrderHistory /> },
    { path: "/profile", element: <UserProfile /> },
    { path: "/contact", element: <Contact /> },
    { path: "/privacy", element: <Privacy /> },
    { path: "/terms", element: <Terms /> },
    { path: "/refund-policy", element: <RefundPolicy /> },
    { path: "/admin", element: <Admin /> },
    { path: "/repair-service", element: <RepairService /> }
  ], []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <NotificationProvider>
                <Router>
                  <ScrollToTop />
                  <PageTracker />
                  <div className="App">
                    <Header />
                    <main>
                      <Routes>
                        {routes.map((route) => (
                          <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                          />
                        ))}
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </NotificationProvider>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
