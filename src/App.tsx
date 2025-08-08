import React, { useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
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
import './App.css';

// 로딩 컴포넌트
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

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
    { path: "/contact", element: <Contact /> },
    { path: "/privacy", element: <Privacy /> },
    { path: "/terms", element: <Terms /> },
    { path: "/refund-policy", element: <RefundPolicy /> },
    { path: "/admin", element: <Admin /> },
    { path: "/repair-service", element: <RepairService /> }
  ], []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              <ScrollToTop />
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
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </Suspense>
  );
});

App.displayName = 'App';

export default App;
