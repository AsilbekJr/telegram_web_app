import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import Admin from './pages/Admin';

function App() {
  useEffect(() => {
    // Expand the Web App to maximum height when opened
    if (WebApp.isExpanded === false) {
      WebApp.expand();
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-tg-bg text-tg-text pb-6">
        <Header />
        <main className="max-w-screen-md mx-auto w-full">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
