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
    <Link to={`/product/${product.id}`} className="flex h-full">
      <Card className="flex flex-col w-full overflow-hidden hover:shadow-md transition-shadow bg-tg-secondaryBg border-tg-hint/10">
        <div className="w-full pt-[100%] relative bg-white border-b border-tg-hint/5">
          <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply" />
        </div>
        <CardContent className="p-3 flex flex-col flex-grow">
          <Badge variant="secondary" className="w-fit mb-2 text-[10px] text-tg-hint uppercase font-bold tracking-wider">{product.category}</Badge>
          <h3 className="font-semibold text-tg-text text-sm leading-tight mb-2 line-clamp-2">{product.title}</h3>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex flex-col items-start gap-2.5 mt-auto">
          <span className="font-extrabold text-tg-text text-lg tracking-tight">${product.price.toFixed(2)}</span>
          <Button 
            onClick={handleAdd}
            size="sm"
            className="w-full bg-brand text-white hover:bg-brand/90 font-bold shadow-sm h-9 rounded-xl"
          >
            Savatga
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
