import React from 'react';
import { useShop, waLink, orderText } from '../constants';

// Settings store multi-line text with \n; render each line.
const lines = (text) =>
  String(text || '')
    .split('\n')
    .map((line, i, all) => (
      <React.Fragment key={i}>
        {line}
        {i < all.length - 1 && <br />}
      </React.Fragment>
    ));

const Contact = () => {
  const shop = useShop();

  return (
    <section className="contact-section" id="contact">
      <div className="contact-grid">
        <div className="contact-info reveal">
          <span className="section-tag">Come Say Hi</span>
          <h2>
            Find us in <span className="gradient-text">Kanyakumari</span>
          </h2>

          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <strong>Visit our bakery</strong>
              <p>{lines(shop.address)}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">🕘</span>
            <div>
              <strong>Opening hours</strong>
              <p>{lines(shop.hours)}</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <strong>Phone / WhatsApp</strong>
              <p>{shop.phone}</p>
            </div>
          </div>
        </div>

        <div className="contact-card reveal">
          <span className="wa-icon">💬</span>
          <h3>Order in one tap</h3>
          <p>
            Send us your order on WhatsApp and we'll confirm it right away.
            Free home delivery on orders above ₹{shop.freeDeliveryAbove}.
          </p>
          <a
            className="btn-primary"
            href={waLink(shop.phoneRaw, orderText(shop.name))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order Now on WhatsApp
          </a>
          <span className="fine">We'll confirm your order and delivery details</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
