import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality sound with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics'
  },
  {
    id: '2',
    title: 'Smart Watch Series 7',
    description: 'Track your fitness, receive notifications, and stay connected with this sleek smartwatch featuring a vibrant Always-On display.',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
    category: 'Electronics'
  },
  {
    id: '3',
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable, breathable, and sustainably sourced organic cotton t-shirt. Available in various colors.',
    price: 24.50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    category: 'Clothing'
  },
  {
    id: '4',
    title: 'Leather Messenger Bag',
    description: 'Handcrafted genuine leather messenger bag with multiple compartments for laptops up to 15 inches.',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    category: 'Accessories'
  },
  {
    id: '5',
    title: 'Eco-Friendly Water Bottle',
    description: 'Double-walled insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
    category: 'Lifestyle'
  },
  {
    id: '6',
    title: 'Professional Camera Lens',
    description: '50mm f/1.8 prime lens for crisp portraits and brilliant low-light photography.',
    price: 125.00,
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800',
    category: 'Photography'
  }
];
