import React from 'react';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeDelivery = total >= 500;

  const sendWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    let message = "Hi Sugi Bakery, I want to place an order:\\n\\n";
    
    cartItems.forEach(item => {
      message += `${item.name} (${item.size}) - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\\n`;
    });
    
    message += `\\nTotal: ₹${total}`;
    
    if (freeDelivery) {
      message += "\\n🎉 FREE HOME DELIVERY (Order above ₹500)";
    } else {
      message += `\\n📦 Add ₹${500 - total} more for FREE delivery!`;
    }
    
    const whatsappUrl = `https://wa.me/919677494302?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      ></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p style={{ color: '#cccccc', textAlign: 'center', marginTop: '2rem' }}>
              Your cart is empty
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-header">
                  <h4>{item.name}</h4>
                  <button className="remove-btn" onClick={() => onRemove(item.id)}>
                    Remove
                  </button>
                </div>
                <div className="cart-item-details">
                  {item.size} - ₹{item.price}
                </div>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, -1)}>
                    -
                  </button>
                  <span style={{ color: 'white', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, 1)}>
                    +
                  </button>
                  <span className="item-total">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              Total: ₹{total}
            </div>
            {freeDelivery ? (
              <div className="delivery-status free">
                🎉 FREE HOME DELIVERY!
              </div>
            ) : total > 0 ? (
              <div className="delivery-status pending">
                Add ₹{500 - total} more for FREE delivery!
              </div>
            ) : null}
            <button className="btn-primary" onClick={sendWhatsAppOrder} style={{ width: '100%' }}>
              Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
