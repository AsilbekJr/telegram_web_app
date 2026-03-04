import type { Product } from '../types';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="flex h-full group">
      <Card className="flex flex-col w-full overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white border-transparent hover:border-brand/10 shadow-sm rounded-2xl relative">
        <div className="w-full pt-[100%] relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-contain p-5 mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out" />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow bg-white">
          <Badge variant="secondary" className="w-fit mb-2 text-[10px] text-brand bg-brand/10 uppercase font-black tracking-widest">{product.category}</Badge>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 font-display transition-colors group-hover:text-brand">{product.title}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-left flex flex-col items-start gap-3 mt-auto bg-white border-t border-gray-50/50">
          <span className="font-black text-gray-900 text-lg tracking-tight">${product.price.toFixed(2)}</span>
          <Button 
            onClick={handleAdd}
            size="sm"
            className="w-full bg-brand hover:bg-brand-blue text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 h-10 rounded-xl"
          >
            Savatga
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
