import { useCartStore } from '../store/useCartStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { items, removeItem, decreaseQuantity, addItem, totalPrice } = useCartStore();
  const navigate = useNavigate();
  const total = totalPrice();

  useEffect(() => {
    WebApp.BackButton.show();
    const handleBack = () => navigate(-1);
    WebApp.BackButton.onClick(handleBack);

    if (items.length > 0) {
      WebApp.MainButton.show();
      WebApp.MainButton.setParams({
        text: `PAY $${total.toFixed(2)}`,
        is_visible: true
      });
      
      const handleCheckout = async () => {
        try {
          WebApp.MainButton.showProgress();
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: items.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })),
              totalAmount: total,
              initData: WebApp.initData,
              queryId: WebApp.initDataUnsafe?.query_id,
              userId: WebApp.initDataUnsafe?.user?.id
            })
          });

          const data = await response.json();
          WebApp.MainButton.hideProgress();

          if (data.success) {
            WebApp.showAlert(`Order placed successfully! Please check your Telegram chat for the invoice.`);
            WebApp.close();
          } else {
            WebApp.showAlert(`Failed to process order: ${data.error || 'Unknown error'}`);
          }
        } catch (error) {
           WebApp.MainButton.hideProgress();
           WebApp.showAlert('An error occurred while communicating with the server.');
           console.error('Checkout error:', error);
        }
      };
      
      WebApp.MainButton.onClick(handleCheckout);
      
      return () => {
        WebApp.BackButton.offClick(handleBack);
        WebApp.MainButton.offClick(handleCheckout);
        WebApp.MainButton.hide();
      };
    } else {
      WebApp.MainButton.hide();
      return () => {
        WebApp.BackButton.offClick(handleBack);
      };
    }
  }, [items, total, navigate]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-tg-secondaryBg p-6 rounded-full mb-6 text-tg-hint">
          <Trash2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-tg-text mb-2">Cart is empty</h2>
        <p className="text-tg-hint mb-8 text-sm">Looks like you haven't added any items yet.</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-tg-button text-tg-buttonText font-bold py-6 px-8 rounded-xl shadow-sm hover:opacity-90"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 top-0 relative bg-tg-bg min-h-screen">
      <div className="flex items-center mb-6 pt-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2 text-tg-text hover:bg-tg-secondaryBg">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold text-tg-text">Shopping Cart</h1>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 p-3 bg-tg-secondaryBg rounded-2xl border border-tg-hint/10 shadow-sm">
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            
            <div className="flex flex-col justify-between flex-1 py-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-tg-text text-sm leading-tight pr-2">{item.title}</h3>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <span className="font-bold text-tg-text">${item.price.toFixed(2)}</span>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center bg-tg-bg rounded-lg border border-tg-hint/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-tg-hint hover:text-tg-text hover:bg-transparent"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-6 text-center text-sm font-bold text-tg-text">{item.quantity}</span>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-tg-hint hover:text-tg-text hover:bg-transparent"
                    onClick={() => addItem(item)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-tg-secondaryBg rounded-2xl p-4 border border-tg-hint/10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-tg-hint font-medium text-sm">Subtotal</span>
          <span className="text-tg-text font-bold">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-tg-hint font-medium text-sm">Delivery fees</span>
          <span className="text-green-500 font-bold text-sm">Free</span>
        </div>
        <div className="h-px w-full bg-tg-hint/20 my-3"></div>
        <div className="flex justify-between items-center text-lg mt-2">
          <span className="text-tg-text font-bold">Total</span>
          <span className="text-tg-text font-black text-xl">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
