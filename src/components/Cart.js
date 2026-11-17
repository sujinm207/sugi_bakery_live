import React from 'react';
import { useShop, waLink } from '../constants';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove }) => {
  const shop = useShop();
  const FREE_AT = shop.freeDeliveryAbove;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const freeDelivery = total >= FREE_AT;
  const progress = Math.min(100, Math.round((total / FREE_AT) * 100));

  const sendWhatsAppOrder = () => {
    if (cartItems.length === 0) return;

    const lines = cartItems.map(
      (item) =>
        `• ${item.name} (${item.size}) — ₹${item.price} × ${item.quantity} = ₹${
          item.price * item.quantity
        }`
    );

    const message = [
      `Hi ${shop.name}, I'd like to place an order:`,
      '',
      ...lines,
      '',
      `Total: ₹${total}`,
      freeDelivery
        ? '🎉 Free home delivery (order above ₹' + FREE_AT + ')'
        : `📦 Adding ₹${FREE_AT - total} more would qualify for free delivery`
    ].join('\n');

    window.open(waLink(shop.phoneRaw, message), '_blank', 'noopener');
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="cart-header">
          <h3>
            Your Cart
            <small>{count} {count === 1 ? 'item' : 'items'}</small>
          </h3>
          <button className="close-cart" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="big">🛍️</span>
              <p>Your cart is empty</p>
              <p style={{ fontSize: '0.84rem' }}>
                Pick a size from the menu to get started.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                {item.image ? (
                  <img className="cart-item-thumb" src={item.image} alt={item.name} />
                ) : (
                  <span className="cart-item-thumb" style={{ display: 'grid', placeItems: 'center', fontSize: '1.6rem' }}>
                    {item.emoji}
                  </span>
                )}

                <div className="cart-item-body">
                  <div className="cart-item-header">
                    <h4>{item.name}</h4>
                    <button
                      className="remove-btn"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="cart-item-details">
                    {item.size} · ₹{item.price}
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <span className="item-total">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {freeDelivery ? (
              <div className="delivery-status free">
                🎉 You've unlocked FREE home delivery!
              </div>
            ) : (
              <div className="delivery-status pending">
                Add ₹{FREE_AT - total} more for free delivery
                <div className="delivery-bar">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="cart-total">
              <span>Total</span>
              <b>₹{total}</b>
            </div>

            <button className="btn-primary" onClick={sendWhatsAppOrder}>
              💬 Order via WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Cart;
