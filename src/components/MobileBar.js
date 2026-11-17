import React from 'react';
import { useShop, waLink, orderText } from '../constants';

// Sticky order bar — phones only (shown via CSS media query).
const MobileBar = ({ onCartClick, cartCount }) => {
  const shop = useShop();

  return (
    <div className="mobile-bar">
      <button className="btn-ghost" onClick={onCartClick}>
        🛍️ Cart ({cartCount})
      </button>
      <a
        className="btn-primary"
        href={waLink(shop.phoneRaw, orderText(shop.name))}
        target="_blank"
        rel="noopener noreferrer"
      >
        💬 Order Now
      </a>
    </div>
  );
};

export default MobileBar;
