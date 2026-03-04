import { useState, useEffect } from 'react';
import { useProductsStore } from '../store/useProductsStore';
import { useCategoriesStore } from '../store/useCategoriesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit2, Plus, ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import WebApp from '@twa-dev/sdk';

export default function Admin() {
  const navigate = useNavigate();
  const adminId = WebApp.initDataUnsafe?.user?.id?.toString() || '';
  const adminHeaders = { 
    'Content-Type': 'application/json',
    'x-admin-id': adminId
  };
  const { products, fetchProducts, error: productsError } = useProductsStore();
  const { categories, fetchCategories, error: categoriesError } = useCategoriesStore();
  const [orders, setOrders] = useState<any[]>([]);
  
  // Product Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', image: '', category: ''
  });

  // Category Form State
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', icon: '', image: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/orders`, { headers: { 'x-admin-id': adminId } });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
       console.error("Failed to fetch orders", error);
    }
  };

  const handleSaveCategory = async () => {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    try {
       await fetch(`${baseUrl}/api/categories`, {
         method: 'POST',
         headers: adminHeaders,
         body: JSON.stringify(categoryFormData)
       });
       setIsCategoryDialogOpen(false);
       setCategoryFormData({ name: '', icon: '', image: '' });
       fetchCategories();
    } catch (error) {
       console.error("Save category error", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Haqiqatan ham ushbu kategoriyani o'chirmoqchimisiz?")) return;
    const baseUrl = import.meta.env.VITE_API_URL || '';
    try {
      const res = await fetch(`${baseUrl}/api/categories/${id}`, { 
          method: 'DELETE',
          headers: { 'x-admin-id': adminId }
      });
      if (!res.ok) {
          const errMsg = await res.text();
          alert(`O'chirishda xatolik yuz berdi: ${errMsg}`);
          return;
      }
      fetchCategories();
    } catch (error) {
      console.error("Delete category error", error);
    }
  };

  const handleSaveProduct = async () => {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const isEditing = !!editingProduct;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${baseUrl}/api/products/${editingProduct.id}` : `${baseUrl}/api/products`;

    try {
       const res = await fetch(url, {
         method,
         headers: adminHeaders,
         body: JSON.stringify({
           ...formData,
           price: parseFloat(formData.price)
         })
       });
       if (!res.ok) {
           const errMsg = await res.text();
           alert(`Saqlashda xatolik yuz berdi: ${errMsg}`);
           return;
       }
       setIsDialogOpen(false);
       setFormData({ title: '', description: '', price: '', image: '', category: '' });
       setEditingProduct(null);
       fetchProducts();
    } catch (error) {
      console.error("Save product error", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    const baseUrl = import.meta.env.VITE_API_URL || '';
    try {
      const res = await fetch(`${baseUrl}/api/products/${id}`, { 
          method: 'DELETE',
          headers: { 'x-admin-id': adminId }
      });
      if (!res.ok) {
          const errMsg = await res.text();
          alert(`O'chirishda xatolik yuz berdi: ${errMsg}`);
          return;
      }
      fetchProducts();
    } catch (error) {
      console.error("Delete product error", error);
    }
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
       title: p.title,
       description: p.description,
       price: p.price.toString(),
       image: p.image,
       category: p.category
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text p-4 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold">Boshqaruv Paneli</h1>
      </div>

      {productsError && <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm font-semibold shadow-md">Mahsulotlarni yuklashda xatolik: {productsError}</div>}
      {categoriesError && <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm font-semibold shadow-md">Kategoriyalarni yuklashda xatolik: {categoriesError}</div>}

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-tg-secondaryBg">
          <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
          <TabsTrigger value="categories">Kategoriyalar</TabsTrigger>
          <TabsTrigger value="orders">Buyurtmalar</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Barcha Mahsulotlar</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingProduct(null); setFormData({ title: '', description: '', price: '', image: '', category: '' }); }} className="bg-brand text-white shadow-sm flex items-center gap-2">
                  <Plus size={16} /> Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto bg-tg-bg">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-1">
                    <Label>Nomi</Label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Mahsulot nomi" />
                  </div>
                  <div className="space-y-1">
                    <Label>Kategoriya</Label>
                    <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Kategoriya (masalan, Electronics)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Narx ($)</Label>
                        <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Rasm URL</Label>
                    <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="space-y-1">
                    <Label>Batafsil ma'lumot</Label>
                    <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="..." />
                  </div>
                  <Button onClick={handleSaveProduct} className="w-full bg-brand text-white mt-4">Saqlash</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 bg-tg-secondaryBg rounded-xl border border-tg-hint/10">
                <div className="flex items-center gap-3">
                  <img src={p.image} className="w-12 h-12 rounded object-cover mix-blend-multiply bg-white" />
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1">{p.title}</h4>
                    <span className="text-xs text-brand font-bold">${p.price}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"><Edit2 size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)} className="h-8 w-8 text-red-500 hover:bg-red-500/10"><Trash2 size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Barcha Kategoriyalar</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCategoryFormData({ name: '', icon: '', image: '' })} className="bg-brand text-white shadow-sm flex items-center gap-2">
                  <Plus size={16} /> Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto bg-tg-bg">
                <DialogHeader>
                  <DialogTitle>Yangi Kategoriya</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-1">
                    <Label>Nomi</Label>
                    <Input value={categoryFormData.name} onChange={e => setCategoryFormData({...categoryFormData, name: e.target.value})} placeholder="Sartfonlar" />
                  </div>
                  <div className="space-y-1">
                    <Label>Lucide Ikonkasi nomi</Label>
                    <Input value={categoryFormData.icon} onChange={e => setCategoryFormData({...categoryFormData, icon: e.target.value})} placeholder="Smartphone" />
                  </div>
                  <div className="space-y-1">
                    <Label>Rasm URL (Mediapark uslubi uchun)</Label>
                    <Input value={categoryFormData.image} onChange={e => setCategoryFormData({...categoryFormData, image: e.target.value})} placeholder="https://cdn.mediapark.uz/..." />
                  </div>
                  <Button onClick={handleSaveCategory} className="w-full bg-brand text-white mt-4">Saqlash</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {categories.map(c => {
               const IconComponent = (Icons as any)[c.icon] || Icons.CircleDot;
               return (
                <div key={c.id} className="flex justify-between items-center p-3 bg-tg-secondaryBg rounded-xl border border-tg-hint/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <IconComponent size={20} className="text-brand text-opacity-80" />
                    </div>
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(c.id)} className="h-8 w-8 text-red-500 hover:bg-red-500/10"><Trash2 size={16} /></Button>
                </div>
               );
            })}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
             {orders.map(order => (
               <div key={order._id} className="p-4 bg-tg-secondaryBg rounded-xl border border-tg-hint/10 text-sm">
                 <div className="flex justify-between mb-2">
                   <div className="flex flex-col">
                     <span className="font-bold">Mijoz ID: {order.telegramUserId}</span>
                     {order.phoneNumber && <span className="text-brand font-medium">📞 {order.phoneNumber}</span>}
                   </div>
                   <span className="text-tg-hint">#{order._id.slice(-6)}</span>
                 </div>
                 <div className="text-brand font-bold mb-2">Umumiy Summa: ${order.totalAmount.toFixed(2)}</div>
                 <div className="bg-white/50 p-2 rounded-lg space-y-2 mt-3">
                   {order.items.map((item: any, i: number) => (
                     <div key={i} className="flex justify-between text-xs">
                        <span className="line-clamp-1 pr-2">{item.productId?.title || 'O\'chirilgan mahsulot'} (x{item.quantity})</span>
                        <span className="font-semibold">${item.price * item.quantity}</span>
                     </div>
                   ))}
                 </div>
                 <div className="mt-3 text-xs flex justify-between items-center font-medium">
                   Holati: <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{order.status}</span>
                 </div>
               </div>
             ))}
             {orders.length === 0 && <div className="text-center text-tg-hint py-8">Hozircha buyurtmalar yo'q.</div>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
