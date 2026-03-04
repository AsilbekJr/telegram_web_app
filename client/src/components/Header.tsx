import { Search, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useProductsStore } from '../store/useProductsStore';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const totalItems = useCartStore(state => state.totalItems());
  const { setSearchQuery } = useProductsStore();
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 400); // 400ms debounce
    return () => clearTimeout(timeout);
  }, [localSearch, setSearchQuery]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-tg-hint/10 shadow-sm flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center">
          <span className="text-brand">MEDIA</span>
          <span className="text-brand-blue">PARK</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 text-tg-text hover:bg-tg-secondaryBg rounded-full transition-colors">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-brand text-brand-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center -mt-1 -mr-1 shadow-sm border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Search Bar - Typical for Mediapark and E-commerce */}
      <div className="px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-tg-hint" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-tg-hint/20 rounded-xl leading-5 bg-tg-secondaryBg placeholder-tg-hint focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand focus:border-brand sm:text-sm transition-colors text-tg-text"
            placeholder="Mahsulotlarni qidirish..."
          />
        </div>
      </div>
    </header>
  );
}
