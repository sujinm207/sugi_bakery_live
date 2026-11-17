import React from 'react';
import ProductCard from './ProductCard';

const Featured = ({ products, onAddToCart }) => {
  return (
    <section className="featured" id="featured">
      <div className="section-header reveal">
        <span className="section-tag">Our Menu</span>
        <h2>
          Pick your <span className="gradient-text">crunch</span>{' '}
          <span className="fire-emoji">🔥</span>
        </h2>
        <p>
          Nine handmade classics, each in three sizes. Tap a size to drop it
          straight into your cart — then order in one tap on WhatsApp.
        </p>
      </div>

      <div className="items-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default Featured;
