import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';
import { useCartStore } from '../store/useCartStore';
import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === id);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    WebApp.BackButton.show();
    const handleBack = () => navigate(-1);
    WebApp.BackButton.onClick(handleBack);

    return () => {
      WebApp.BackButton.offClick(handleBack);
      WebApp.BackButton.hide();
    };
  }, [navigate]);

  if (!product) {
    return <div className="p-4 text-center">Product not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-tg-bg">
      <div className="w-full relative bg-white">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full text-black shadow-sm">
          <ChevronLeft size={24} />
        </Button>
        <img src={product.image} alt={product.title} className="w-full h-80 object-contain p-4 mix-blend-multiply" />
      </div>
      <div className="p-6 flex-1 bg-tg-bg rounded-t-3xl -mt-6 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-tg-hint/10">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold text-tg-text leading-tight w-2/3">{product.title}</h1>
          <span className="text-xl font-bold text-tg-text">${product.price.toFixed(2)}</span>
        </div>
        <Badge variant="secondary" className="mb-6 text-xs font-bold uppercase tracking-wider text-tg-hint bg-tg-secondaryBg hover:bg-tg-secondaryBg/80">
          {product.category}
        </Badge>
        <div className="mb-24">
           <h3 className="text-lg font-bold text-tg-text mb-2">Description</h3>
           <p className="text-tg-hint text-sm leading-relaxed">
             {product.description}
           </p>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-tg-bg border-t border-tg-hint/10 z-20 max-w-screen-md mx-auto pb-8">
            <Button 
            size="lg"
            onClick={() => {
                addItem(product);
                if (WebApp.HapticFeedback) WebApp.HapticFeedback.impactOccurred('light');
            }}
            className="w-full bg-tg-button text-tg-buttonText font-bold text-lg py-6 rounded-xl shadow-md hover:opacity-90 transition-opacity"
            >
            Add to Cart
            </Button>
        </div>
      </div>
    </div>
  );
}
