import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../constants';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#featured', label: 'Menu' },
  { href: '#about', label: 'Our Story' },
  { href: '#contact', label: 'Contact' }
];

const Header = ({ onCartClick, cartCount }) => {
  const shop = useShop();
  const promo = shop.promo && shop.promo.length ? shop.promo : [shop.tagline];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pop the counter whenever something is added.
  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 450);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
    return undefined;
  }, [cartCount]);

  return (
    <>
      <div className="promo-banner">
        <div className="promo-track">
          {[...promo, ...promo].map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <nav className="nav">
          <a className="logo" href="#home" style={{ textDecoration: 'none' }}>
            <span className="logo-mark">🥨</span>
            <span className="logo-text">
              {shop.name}
              <small>Kanyakumari</small>
            </span>
          </a>

          <div className="nav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>

          <div className="nav-actions">
            <button className="cart-btn" onClick={onCartClick} aria-label="Open cart">
              🛍️ <span className="cart-label">Cart</span>
              <span className={`cart-count ${bump ? 'bump' : ''}`}>{cartCount}</span>
            </button>
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
