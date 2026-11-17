import React from 'react';
import { useShop, waLink, orderText } from '../constants';

const Footer = () => {
  const shop = useShop();
  const firstAddressLine = String(shop.address || '').split('\n')[0];

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-mark">🥨</span>
            <span className="logo-text">
              {shop.name}
              <small>Kanyakumari</small>
            </span>
          </div>
          <p>
            A small family bakery keeping traditional South Indian snacks
            alive — handmade in small batches with locally sourced
            ingredients.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#featured">Menu</a>
            <a href="#about">Our Story</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div>
          <h4>Order &amp; Visit</h4>
          <div className="footer-links">
            <a
              href={waLink(shop.phoneRaw, orderText(shop.name))}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp us
            </a>
            <a href={`tel:${shop.phoneRaw}`}>📞 {shop.phone}</a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                String(shop.address || '').replace(/\n/g, ', ')
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 {firstAddressLine}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} {shop.name} · Made with ❤️ in Kanyakumari
      </div>
    </footer>
  );
};

export default Footer;
