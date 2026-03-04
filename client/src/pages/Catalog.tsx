import ProductCard from '../components/ProductCard';
import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';
import CategoriesMenu from '../components/CategoriesMenu';
import Banner from '../components/Banner';
import { useProductsStore } from '../store/useProductsStore';
import { Loader2 } from 'lucide-react';

export default function Catalog() {
  const { products, fetchProducts, isLoading, activeCategory, searchQuery } = useProductsStore();

  useEffect(() => {
    WebApp.BackButton.hide();
    fetchProducts();
  }, [fetchProducts]);

  let sectionTitle = "Barcha Mahsulotlar";
  if (searchQuery) {
    sectionTitle = `Qidiruv natijalari: "${searchQuery}"`;
  } else if (activeCategory) {
    sectionTitle = activeCategory;
  }

  return (
    <div className="pb-8 bg-tg-bg min-h-screen">
      <Banner />
      <CategoriesMenu />
      
      <div className="px-5 mt-4 min-h-[50vh]">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-sans tracking-tight">{sectionTitle}</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-10 h-10 animate-spin text-brand" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
