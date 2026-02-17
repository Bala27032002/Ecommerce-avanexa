import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateQuantityAsync, removeFromCartAsync } from '../store/cartSlice';
import './Cart.css';

const Cart = () => {
  const { items: cartItems, loading } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    const productId = item.productId._id || item.productId;
    setUpdating(productId);

    try {
      await dispatch(updateQuantityAsync({ 
        productId: productId, 
        quantity: newQuantity 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert(error || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (item) => {
    const productId = item.productId._id || item.productId;
    
    if (!confirm('Remove this item from cart?')) return;

    try {
      await dispatch(removeFromCartAsync(productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert(error || 'Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getProductId = (item) => {
    return item.productId._id || item.productId;
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="cart-container">
      <header className="cart-header">
        <div className="cart-header-content">
          <button onClick={() => navigate('/products')} className="back-btn">
            ← Back
          </button>
          <h1>Shopping Cart ({cartItems.length} items)</h1>
        </div>
      </header>

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <button onClick={() => navigate('/products')} className="shop-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => {
                const productId = getProductId(item);
                const isUpdating = updating === productId;
                
                return (
                  <div key={productId} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <div className="item-category">{item.category}</div>
                      <h3>{item.name}</h3>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                    <div className="item-actions-wrapper">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={isUpdating || item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={isUpdating}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemove(item)} 
                        className="remove-btn"
                        disabled={isUpdating}
                      >
                        🗑️ Remove
                      </button>
                      <div className="item-total">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹0</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <button 
                onClick={() => navigate('/order')} 
                className="checkout-btn"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
