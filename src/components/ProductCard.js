import React, { useState, useRef, useEffect } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  // GIFs are heavy, so the file is only requested once the customer
  // actually hovers (or taps) — never on page load.
  const [gifRequested, setGifRequested] = useState(false);
  const [gifPlaying, setGifPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = (size) => {
    onAddToCart(product, size);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  const hasGif = Boolean(product.gif);
  const fromPrice = Math.min(...product.sizes.map((s) => s.price));

  const wakeGif = () => {
    if (hasGif) setGifRequested(true);
  };

  // Touch devices have no hover — tapping the photo plays the animation.
  const toggleGif = () => {
    if (!hasGif) return;
    setGifRequested(true);
    setGifPlaying((v) => !v);
  };

  return (
    <div className="item-card reveal">
      {product.tag && (
        <span className={`card-badge ${product.tagStyle || 'classic'}`}>
          {product.tag}
        </span>
      )}

      {product.image || hasGif ? (
        <div
          className={`product-image-container ${hasGif ? 'has-gif' : ''} ${gifPlaying ? 'playing' : ''}`}
          onMouseEnter={wakeGif}
          onFocus={wakeGif}
          onClick={toggleGif}
        >
          {product.image && (
            <img
              className="static-img"
              src={product.image}
              alt={product.name}
              loading="lazy"
            />
          )}

          {hasGif && gifRequested && (
            <img className="gif-img" src={product.gif} alt="" aria-hidden="true" />
          )}

          {hasGif && <span className="gif-badge">GIF</span>}
        </div>
      ) : (
        <div className="product-emoji">{product.emoji}</div>
      )}

      <div className="item-head">
        <h3>{product.name}</h3>
        <span className="item-from">
          from <b>₹{fromPrice}</b>
        </span>
      </div>

      <p>{product.description}</p>

      <div className="price-options">
        {product.sizes.map((size) => (
          <button
            key={size.name}
            className="size-btn"
            onClick={() => handleAdd(size)}
            aria-label={`Add ${size.name} of ${product.name} to cart for ₹${size.price}`}
          >
            <span className="size">{size.name}</span>
            <span className="price">₹{size.price}</span>
          </button>
        ))}
      </div>

      <span className={`added-toast ${added ? 'show' : ''}`}>✓ Added to cart</span>
    </div>
  );
};

export default ProductCard;
