import React, { useState, useEffect } from 'react';
import { useShop, waLink, orderText } from '../constants';

const Hero = ({ products = [] }) => {
  const shop = useShop();
  const showcase = products.slice(0, 5);
  const [active, setActive] = useState(0);

  // Cycle the hero photo so the real product shots do the selling.
  useEffect(() => {
    if (showcase.length < 2) return undefined;
    const id = setInterval(
      () => setActive((i) => (i + 1) % showcase.length),
      2600
    );
    return () => clearInterval(id);
  }, [showcase.length]);

  const scrollToMenu = () => {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  const current = showcase[active];

  return (
    <section className="hero" id="home">
      <div className="hero-text reveal">
        <div className="hero-eyebrow">
          <b>New</b> Handmade in Kanyakumari
        </div>

        <h1>
          <span className="fire-emoji">🔥</span> Snacks that
          <span className="line-2 gradient-text">disappear fast.</span>
        </h1>

        <p>
          Traditional South Indian recipes, handmade in small batches with
          locally sourced ingredients — the authentic crunch you grew up with.{' '}
          <span className="glitter-emoji">✨</span>
        </p>

        <div className="hero-cta">
          <button className="btn-primary" onClick={scrollToMenu}>
            🍽️ Explore the Menu
          </button>
          <a
            className="btn-ghost"
            href={waLink(shop.phoneRaw, orderText(shop.name))}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Order on WhatsApp
          </a>
        </div>

        <div className="hero-trust">
          <span className="trust-chip"><i>👐</i> 100% handmade</span>
          <span className="trust-chip"><i>🚚</i> Free delivery over ₹{shop.freeDeliveryAbove}</span>
          <span className="trust-chip"><i>🌿</i> Locally sourced</span>
        </div>
      </div>

      <div className="hero-visual reveal">
        <div className="hero-glow" />
        <div className="hero-ring" />

        <div className="hero-stage">
          {showcase.map((p, i) => (
            <img
              key={p.id}
              src={p.image}
              alt={p.name}
              className={i === active ? 'active' : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        <div className="hero-badge left">
          <span className="dot" />
          {current ? `${current.name} · from ₹${Math.min(...current.sizes.map((s) => s.price))}` : 'Fresh batch'}
        </div>

        <div className="hero-badge right">
          <em>★</em> Handmade in small batches
        </div>
      </div>
    </section>
  );
};

export default Hero;
