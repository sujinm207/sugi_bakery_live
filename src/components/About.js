import React from 'react';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <div className="about-text">
          <h2>👨👩👧👦 About Sugi Bakery 🏪</h2>
          <p>
            🌱 Sugi Bakery began as a small family venture to preserve traditional snacks. We use locally sourced ingredients and maintain handmade techniques to deliver the authentic crunch you love. 💝
          </p>
          <div className="stats">
            <div className="stat">
              <span className="number">🌾</span>
              <span className="label">Fresh Ingredients</span>
            </div>
            <div className="stat">
              <span className="number">👨🍳</span>
              <span className="label">Handmade</span>
            </div>
            <div className="stat">
              <span className="number">❤️</span>
              <span className="label">Made with Love</span>
            </div>
          </div>
        </div>
        <div className="about-visual">
          <div className="visual-element">🥨</div>
        </div>
      </div>
    </section>
  );
};

export default About;
