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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm flex flex-col transition-all duration-300">
      <div className="px-5 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-1 hover:opacity-80 transition-opacity">
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
      
      {/* Search Bar - Sleek and Modern */}
      <div className="px-5 pb-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand sm:text-sm transition-all duration-300 shadow-inner text-gray-900"
            placeholder="Qanday mahsulot izlayapsiz?"
          />
        </div>
      </div>
    </header>
  );
}
