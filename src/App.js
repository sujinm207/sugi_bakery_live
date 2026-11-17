import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Featured from './components/Featured';
import About from './components/About';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Footer from './components/Footer';
import MobileBar from './components/MobileBar';
import { ShopContext } from './constants';
import { fetchProducts, fetchSettings } from './api';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from './defaultData';

/* Fade sections in as they scroll into view.
   Re-runs when the product list changes, so cards added by the
   admin are picked up by the observer too. */
function useScrollReveal(deps) {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [shop, setShop] = useState(DEFAULT_SETTINGS);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load the live menu. If the API is unreachable we keep the
  // bundled snapshot rather than showing an empty shop.
  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([fetchProducts(), fetchSettings()]).then(([p, s]) => {
      if (cancelled) return;
      if (p.status === 'fulfilled' && Array.isArray(p.value) && p.value.length) {
        setProducts(p.value);
      }
      if (s.status === 'fulfilled' && s.value && s.value.phoneRaw) {
        setShop(s.value);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useScrollReveal([products.length]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleAddToCart = useCallback((product, size) => {
    const cartItem = {
      id: `${product.id}-${size.name}`,
      name: product.name,
      size: size.name,
      price: size.price,
      image: product.image,
      emoji: product.emoji,
      quantity: 1
    };

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, cartItem];
    });
  }, []);

  const handleUpdateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider value={shop}>
      <div className="App">
        <Header onCartClick={() => setIsCartOpen(true)} cartCount={cartCount} />
        <Hero products={products} />
        <Ticker products={products} />
        <Featured products={products} onAddToCart={handleAddToCart} />
        <About products={products} />
        <Contact />
        <Footer />
        <MobileBar onCartClick={() => setIsCartOpen(true)} cartCount={cartCount} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
        />
      </div>
    </ShopContext.Provider>
  );
}

export default App;
