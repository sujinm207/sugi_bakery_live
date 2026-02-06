import React from 'react';

const Hero = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('featured');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-text">
        <h1><span className="fire-emoji">🔥</span> Your Crave-Worthy<br /><span>Snack Destination</span> <span className="glitter-emoji">✨</span></h1>
        <p>👨‍🍳 Artisan-crafted snacks that hit different! Traditional recipes meet modern vibes — crisp, flavorful, and packed with love.</p>
        <button className="btn-primary" onClick={scrollToMenu}>🍽️ Explore Menu</button>
      </div>
      <div className="hero-visual">
        <div className="hero-circle"></div>
        <div className="hero-image">🥨</div>
      </div>
    </section>
  );
};

export default Hero;
