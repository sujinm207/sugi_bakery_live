import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="item-card">
      {product.image || product.gif ? (
        <div className="product-image-container" style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', pointerEvents: 'none' }}>
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name}
              className="static-img"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', transition: 'opacity 0.3s ease' }}
            />
          )}
          {product.gif && (
            <img 
              src={product.gif} 
              alt={`${product.name} GIF`}
              className="gif-img"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', opacity: 0, transition: 'opacity 0.3s ease' }}
            />
          )}
        </div>
      ) : (
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 2s ease-in-out infinite' }}>
          {product.emoji}
        </div>
      )}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="price-options">
        {product.sizes.map((size) => (
          <button
            key={size.name}
            className="size-btn"
            onClick={() => onAddToCart(product, size)}
          >
            <span className="size">{size.name}</span>
            <span className="price">₹{size.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
