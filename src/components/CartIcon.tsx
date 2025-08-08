import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartIconProps {
  onClick: (e?: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick, className = '', style }) => {
  const { state } = useCart();

  return (
    <button
      onClick={(e) => {
        if (e) {
          e.stopPropagation();
        }
        onClick(e);
      }}
      className={`relative flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 transition-colors z-[999999] pointer-events-auto ${className}`}
      style={{ pointerEvents: 'auto', zIndex: 999999, ...style }}
      aria-label="장바구니"
    >
      <ShoppingCart size={24} />
      {state.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {state.totalItems > 99 ? '99+' : state.totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon; 