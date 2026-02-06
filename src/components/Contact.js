import React from 'react';

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-grid">
        <div className="contact-info">
          <h2>📞 Contact Us 💬</h2>
          <div className="info-item">
            <strong>🏪 Visit Our Bakery 📍</strong>
            <p>Madhavapuram Junction<br />Kanyakumari, Pincode: 629702</p>
          </div>
          <div className="info-item">
            <strong>Hours</strong>
            <p>Mon-Sat: 9:00 AM - 10:00 PM<br />Sun: 10:00 AM - 10:00 PM</p>
          </div>
          <div className="info-item">
            <strong>Phone / WhatsApp</strong>
            <p>+91 9677494302</p>
          </div>
        </div>
        <div className="contact-form">
          <h3>Order on WhatsApp</h3>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', color: '#cccccc' }}>
              🚚 FREE HOME DELIVERY on orders above ₹500!
            </p>
            <a
              href="https://wa.me/919677494302?text=Hi%20Sugi%20Bakery,%20I%20want%20to%20place%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-block', textDecoration: 'none', padding: '1rem 2rem', borderRadius: '50px' }}
            >
              Order Now on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
