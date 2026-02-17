import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCartAsync } from '../store/cartSlice';
import { orderAPI } from '../api/axios';
import './Order.css';

const Order = () => {
  const { items: cartItems } = useSelector(state => state.cart);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderItems = cartItems.map(item => ({
        id: item.productId._id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const response = await orderAPI.create({
        items: orderItems,
        userDetails
      });
      
      setOrderData(response.data.order);
      setOrderPlaced(true);
      await dispatch(clearCartAsync());
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (orderPlaced) {
    return (
      <div className="order-container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <div className="order-details">
            <p><strong>Order ID:</strong> <span>{orderData.orderId}</span></p>
            <p><strong>Total Amount:</strong> <span>₹{orderData.total}</span></p>
            <p><strong>Status:</strong> <span>{orderData.status}</span></p>
          </div>
          <button onClick={() => navigate('/products')} className="continue-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <header className="order-header">
        <div className="order-header-content">
          <button onClick={() => navigate('/cart')} className="back-btn">
            ← Back
          </button>
          <h1>Checkout</h1>
        </div>
      </header>

      <div className="order-content">
        <form onSubmit={handleSubmit} className="order-form">
          <h2>Delivery Details</h2>
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={userDetails.phone}
              onChange={handleChange}
              placeholder="+91 1234567890"
              required
            />
          </div>

          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea
              name="address"
              value={userDetails.address}
              onChange={handleChange}
              placeholder="Enter your complete delivery address"
              rows="4"
              required
            />
          </div>

          <button type="submit" className="place-order-btn">
            Place Order - ₹{calculateTotal()}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => {
            const productId = item.productId._id || item.productId;
            return (
              <div key={productId} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <span className="item-price">₹{item.price * item.quantity}</span>
              </div>
            );
          })}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

