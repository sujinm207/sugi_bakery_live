import React from 'react';
import ProductCard from './ProductCard';

const Featured = ({ products, onAddToCart }) => {
  return (
    <section className="featured" id="featured">
      <div className="section-header">
        <h2>🔥 Trending Snack Collection ✨</h2>
        <p>Traditional recipes meet modern vibes</p>
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
