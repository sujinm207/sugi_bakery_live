import React from 'react';

const About = ({ products = [] }) => {
  const collage = products.slice(0, 3);

  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <div className="about-text reveal">
          <span className="section-tag">Our Story</span>
          <h2>
            A family kitchen, <span className="gradient-text">not a factory</span>
          </h2>
          <p>
            Sugi Bakery began as a small family venture to keep traditional
            snacks alive. We still source our ingredients locally and shape
            every batch by hand — which is why the crunch tastes the way it did
            at your grandmother's house.
          </p>

          <div className="stats">
            <div className="stat">
              <span className="number">🌾</span>
              <span className="label">Locally sourced ingredients</span>
            </div>
            <div className="stat">
              <span className="number">👐</span>
              <span className="label">Shaped &amp; fried by hand</span>
            </div>
            <div className="stat">
              <span className="number">🥨</span>
              <span className="label">Traditional family recipes</span>
            </div>
          </div>
        </div>

        <div className="about-visual reveal">
          {collage.map((p) => (
            <figure key={p.id}>
              <img src={p.image} alt={p.name} loading="lazy" />
            </figure>
          ))}
          <span className="about-stamp">👐 Handmade in small batches</span>
        </div>
      </div>
    </section>
  );
};

export default About;
