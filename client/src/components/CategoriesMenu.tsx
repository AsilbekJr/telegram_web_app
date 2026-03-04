import * as Icons from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCategoriesStore } from '../store/useCategoriesStore';
import { useProductsStore } from '../store/useProductsStore';
import { useEffect } from 'react';

export default function CategoriesMenu() {
  const { categories, fetchCategories, isLoading } = useCategoriesStore();
  const { activeCategory, setActiveCategory } = useProductsStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoading) {
    return (
      <div className="py-6">
        <h2 className="text-xl font-bold text-tg-text mb-4 px-4 font-display">Ommabop kategoriyalar</h2>
        <div className="flex px-4 space-x-3 overflow-hidden">
           {[1,2,3].map(i => <div key={i} className="min-w-[160px] h-20 rounded-2xl bg-tg-hint/10 animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="py-6 bg-white/5">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-xl font-bold text-tg-text font-display">Ommabop kategoriyalar</h2>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap outline-none">
        <div className="flex w-max space-x-3 px-4 pb-4">
          {categories.map((category) => {
            const isActive = activeCategory === category.name;
            return (
            <div 
              key={category.id} 
              onClick={() => setActiveCategory(isActive ? null : category.name)}
              className={`flex items-center justify-between w-[180px] h-24 p-4 rounded-2xl ${isActive ? 'bg-[#E5E7EB] border-brand shadow-md' : 'bg-[#F3F4F6] border-transparent'} cursor-pointer group hover:bg-[#E5E7EB] transition-all duration-300 shadow-sm border hover:border-brand/10`}
            >
              <div className="flex flex-col justify-center flex-1 pr-2">
                <span className={`text-sm font-bold leading-tight line-clamp-2 ${isActive ? 'text-brand' : 'text-[#1d212a]'}`}>
                  {category.name}
                </span>
                {/* Fallback to icon if no image yet */}
                {!category.image && (
                    <div className="mt-1 opacity-40">
                        {(() => {
                            const IconComponent = (Icons as any)[category.icon] || Icons.CircleDot;
                            return <IconComponent size={14} />;
                        })()}
                    </div>
                )}
              </div>
              
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as any).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                    {(() => {
                        const IconComponent = (Icons as any)[category.icon] || Icons.CircleDot;
                        return <IconComponent size={24} className="text-tg-text/30" />;
                    })()}
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
