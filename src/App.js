import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Featured from './components/Featured';
import About from './components/About';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Footer from './components/Footer';

const products = [
  {
    id: 1,
    name: 'Banana Chips',
    emoji: '🍌',
    description: 'Crispy golden banana chips made from fresh Kerala bananas',
    image: '/images/banana_chips_outdoor.webp',
    gif: '/images/banana-chips.gif',
    sizes: [
      { name: '250g', price: 80 },
      { name: '500g', price: 160 },
      { name: '1kg', price: 320 }
    ]
  },
  {
    id: 2,
    name: 'Mixture',
    emoji: '🥜',
    description: 'Traditional South Indian mixture with peanuts, curry leaves and spices',
    image: '/images/mixture_snacks.webp',
    gif: '/images/mixture.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  },
  {
    id: 3,
    name: 'Seeval',
    emoji: '🍜',
    description: 'Thin and crispy rice noodles, perfect tea-time snack',
    image: '/images/seeval.webp',
    gif: '/images/seeval.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  },
  {
    id: 4,
    name: 'Karasev',
    emoji: '🌶️',
    description: 'Spicy and crunchy gram flour noodles with authentic taste',
    image: '/images/karasev.webp',
    gif: '/images/karasev.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  },
  {
    id: 5,
    name: 'Oma Podi',
    emoji: '🌿',
    description: "Traditional grandmother's recipe podi with aromatic spices",
    image: '/images/omapodi.webp',
    gif: '/images/oma-podi.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  },
  {
    id: 6,
    name: 'Arisi Muruku',
    emoji: '🌀',
    description: 'Spiral-shaped rice flour snack, crispy and delicious',
    image: '/images/muruku.webp',
    gif: '/images/arisi-muruku.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  },
  {
    id: 7,
    name: 'Pakoda',
    emoji: '🥟',
    description: 'Crispy deep-fried fritters with spices and herbs',
    image: '/images/pakkoda_image.webp',
    gif: '/images/pakoda.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  },
  {
    id: 8,
    name: 'Masala Kadalai',
    emoji: '🥜',
    description: 'Spicy roasted peanuts with aromatic masala coating',
    image: '/images/kadalai_image.webp',
    gif: '/images/masala-kadalai.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  },
  {
    id: 9,
    name: 'Red Andhra Murukku',
    emoji: '🌶️',
    description: 'Spicy red chili flavored murukku from Andhra style',
    image: '/images/red andra murukku.webp',
    gif: '/images/red-andhra-murukku.gif',
    sizes: [
      { name: '250g', price: 60 },
      { name: '500g', price: 120 },
      { name: '1kg', price: 240 }
    ]
  }
];

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product, size) => {
    const cartItem = {
      id: `${product.id}-${size.name}`,
      name: product.name,
      size: size.name,
      price: size.price,
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
  };

  const handleUpdateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="App">
      <Header onCartClick={() => setIsCartOpen(true)} cartCount={cartCount} />
      <Hero />
      <Featured products={products} onAddToCart={handleAddToCart} />
      <About />
      <Contact />
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default App;
