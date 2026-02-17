import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/axios';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeFilter === 'All') {
      return orders;
    }
    return orders.filter(order => order.status === activeFilter);
  };

  const getOrderCount = (status) => {
    if (status === 'All') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#fbbf24',
      'Confirmed': '#3b82f6',
      'Shipped': '#8b5cf6',
      'Delivered': '#10b981',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': '⏳',
      'Confirmed': '✓',
      'Shipped': '🚚',
      'Delivered': '✅',
      'Cancelled': '❌'
    };
    return icons[status] || '📦';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const filteredOrders = filterOrders();

  return (
    <div className="orders-container">
      {/* Header */}
      <header className="orders-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">
              <img src='https://media.licdn.com/dms/image/v2/C560BAQGFmiG4Jygz_Q/company-logo_200_200/company-logo_200_200/0/1645613625104/avanexa_technologies_logo?e=2147483647&v=beta&t=29xmQadM7XNBggmCoudRgZ4bJLrz_hafZoKZtxIy23Y' alt="Logo" />
            </span>
            <span>ShopEase</span>
          </div>

          <nav className="nav-menu">
            <button onClick={() => navigate('/products')} className="nav-link">
               Home
            </button>
            <button onClick={() => navigate('/my-orders')} className="nav-link active">
               My Orders
            </button>
            <button onClick={() => navigate('/cart')} className="nav-link">
              Cart
            </button>
          </nav>

          <button onClick={() => navigate('/')} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Orders Content */}
      <div className="orders-content">
        <div className="orders-header-section">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All Orders
            <span className="count-badge">{getOrderCount('All')}</span>
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'Confirmed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Confirmed')}
          >
            ✓ Confirmed
            <span className="count-badge">{getOrderCount('Confirmed')}</span>
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'Shipped' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Shipped')}
          >
             Shipped
            <span className="count-badge">{getOrderCount('Shipped')}</span>
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'Delivered' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Delivered')}
          >
             Delivered
            <span className="count-badge">{getOrderCount('Delivered')}</span>
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'Cancelled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Cancelled')}
          >
             Cancelled
            <span className="count-badge">{getOrderCount('Cancelled')}</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <button onClick={() => navigate('/products')} className="shop-btn">
              Start Shopping
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} orders found</h2>
            <p>{activeFilter === 'All' ? 'Start shopping to see your orders here' : `You don't have any ${activeFilter.toLowerCase()} orders yet`}</p>
            <button onClick={() => setActiveFilter('All')} className="shop-btn">
              View All Orders
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header-row">
                  <div className="order-info">
                    <h3>Order #{order.orderId}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                    <span className="status-icon">{getStatusIcon(order.status)}</span>
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <div className="item-price">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="delivery-info">
                    <p><strong>Deliver to:</strong> {order.userDetails.name}</p>
                    <p className="address">{order.userDetails.address}</p>
                  </div>
                  <div className="order-total">
                    <span>Total Amount</span>
                    <span className="total-price">₹{order.total}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="view-details-btn"
                  >
                    View Details
                  </button>
                  {order.status === 'Delivered' && (
                    <button className="reorder-btn">
                      🔄 Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="close-btn">×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span>Order ID:</span>
                <strong>{selectedOrder.orderId}</strong>
              </div>
              <div className="detail-row">
                <span>Order Date:</span>
                <strong>{formatDate(selectedOrder.createdAt)}</strong>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedOrder.status) }}>
                  {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                </span>
              </div>
              
              <h3>Customer Details</h3>
              <div className="detail-row">
                <span>Name:</span>
                <strong>{selectedOrder.userDetails.name}</strong>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <strong>{selectedOrder.userDetails.email}</strong>
              </div>
              <div className="detail-row">
                <span>Phone:</span>
                <strong>{selectedOrder.userDetails.phone}</strong>
              </div>
              <div className="detail-row">
                <span>Address:</span>
                <strong>{selectedOrder.userDetails.address}</strong>
              </div>

              <h3>Order Items</h3>
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="modal-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>₹{item.price} × {item.quantity}</p>
                  </div>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}

              <div className="modal-total">
                <span>Total Amount:</span>
                <strong>₹{selectedOrder.total}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
