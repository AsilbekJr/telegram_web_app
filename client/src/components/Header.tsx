import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

export default function Header() {
  const totalItems = useCartStore(state => state.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-tg-bg border-b border-tg-hint/20 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-tg-text">
        Mini E-commerce
      </Link>
      <Link to="/cart" className="relative p-2 text-tg-text">
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-tg-button text-tg-buttonText text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center -mt-1 -mr-1 shadow-sm">
            {totalItems}
          </span>
        )}
      </Link>
    </header>
  );
}
