import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockProducts';
import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';

export default function Catalog() {
  useEffect(() => {
    WebApp.BackButton.hide();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-tg-text mb-6">Explore Catalog</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
