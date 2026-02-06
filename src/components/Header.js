import React from 'react';

const Header = ({ onCartClick, cartCount }) => {
  return (
    <>
      <div className="promo-banner">
        🚚 FREE HOME DELIVERY on orders above ₹500!
      </div>
      <header className="header">
        <nav className="nav">
          <div className="logo">Sugi Bakery</div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#featured">Menu</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="cart-btn" onClick={onCartClick}>
            🛍️ Cart ({cartCount})
          </button>
        </nav>
      </header>
    </>
  );
};

export default Header;
