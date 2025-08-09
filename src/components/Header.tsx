import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './AuthModal';
import CartIcon from './CartIcon';

const Header: React.FC = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isAdmin, logout, loading } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();

  const handleAuthClick = useCallback((mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsMenuOpen(false);
  }, [logout]);

  const handleModeSwitch = useCallback((newMode: 'login' | 'register') => {
    setAuthMode(newMode);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleAuthModalClose = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // 헤더 클릭 이벤트를 강제로 활성화
  const handleHeaderClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 네비게이션 링크 클릭 핸들러
  const handleNavigationClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    if (target.href) {
      window.location.href = target.href;
    }
  }, []);

  // 메모이제이션된 네비게이션 링크들
  const navigationLinks = useMemo(() => [
    { to: "/", label: "홈" },
    { to: "/about", label: "회사소개" },
    { to: "/products", label: "제품" },
    { to: "/repair-service", label: "수리서비스" },
    { to: "/order-history", label: "주문내역" },
    { to: "/contact", label: "문의" }
  ], []);

  // 데스크톱 네비게이션 렌더링
  const desktopNavigation = useMemo(() => (
    <nav className="hidden md:flex items-center space-x-8 relative z-50" style={{ pointerEvents: 'auto' }}>
      {navigationLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-gray-700 hover:text-blue-600 transition-colors relative z-50 pointer-events-auto"
          style={{ pointerEvents: 'auto', zIndex: 50 }}
          onClick={handleNavigationClick}
        >
          {link.label}
        </Link>
      ))}
      
      {/* Cart Icon */}
      <CartIcon 
        onClick={(e) => {
          if (e) {
            e.stopPropagation();
          }
          navigate('/cart');
        }} 
        className="mr-4 relative z-50 pointer-events-auto" 
      />
      
      {/* Auth Buttons */}
      {user ? (
        <div className="flex items-center space-x-4 relative z-50" style={{ pointerEvents: 'auto', zIndex: 50 }}>
          <span className="text-sm text-gray-600">
            {user.email}
          </span>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              관리자
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span>로그아웃</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4 relative z-50" style={{ pointerEvents: 'auto', zIndex: 50 }}>
          <button
            onClick={() => handleAuthClick('login')}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            로그인
          </button>
          <button
            onClick={() => handleAuthClick('register')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            회원가입
          </button>
        </div>
      )}
    </nav>
  ), [user, isAdmin, navigationLinks, handleNavigationClick, handleLogout, handleAuthClick]);

  // 로딩 중일 때는 기본 헤더만 표시
  if (loading) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50" onClick={handleHeaderClick}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">REMEN_ABS</span>
            </Link>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" onClick={handleHeaderClick}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">REMEN_ABS</span>
          </Link>
          
          {/* Desktop Navigation */}
          {desktopNavigation}
          
          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  onClick={handleMenuClose}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Cart Icon */}
              <Link
                to="/cart"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                onClick={handleMenuClose}
              >
                <div className="flex items-center space-x-2">
                  <span>장바구니</span>
                  <div className="relative">
                    <ShoppingCart size={20} />
                    {cartState.totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                        {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              
              {/* Mobile Auth Buttons */}
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="text-sm text-gray-600">
                    {user.email}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={handleMenuClose}
                    >
                      관리자
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <button
                    onClick={() => {
                      handleMenuClose();
                      handleAuthClick('login');
                    }}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => {
                      handleMenuClose();
                      handleAuthClick('register');
                    }}
                    className="block w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        mode={authMode}
        onModeSwitch={handleModeSwitch}
      />
    </header>
  );
});

Header.displayName = 'Header';

export default Header; 