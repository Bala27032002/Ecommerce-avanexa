import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync, fetchCart } from '../store/cartSlice';
import { logout } from '../store/authSlice';
import { productAPI } from '../api/axios';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    fetchProducts();
    dispatch(fetchCart());
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await productAPI.search(value);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      fetchProducts();
    }
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(product._id);
    try {
      await dispatch(addToCartAsync(product._id)).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            <span>📞 +91 1234567890</span>
            <span>Get 50% Off on Selected Items</span>
          </div>
          <div className="top-bar-right">
            <span>Eng 🌐</span>
            <span>Location 📍</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="products-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon"><img src='https://media.licdn.com/dms/image/v2/C560BAQGFmiG4Jygz_Q/company-logo_200_200/company-logo_200_200/0/1645613625104/avanexa_technologies_logo?e=2147483647&v=beta&t=29xmQadM7XNBggmCoudRgZ4bJLrz_hafZoKZtxIy23Y'/></span>
            <span>ShopEase</span>
          </div>

          <div className="header-search">
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="search-icon"></span>
          </div>

          <nav className="nav-menu">
            <button onClick={() => navigate('/products')} className="nav-link active">
              Home
            </button>
            <button onClick={() => navigate('/my-orders')} className="nav-link">
              My Orders
            </button>
            <button onClick={() => navigate('/cart')} className="nav-link">
              Cart
            </button>
          </nav>

          <div className="header-actions">
            <button onClick={() => navigate('/cart')} className="icon-btn">
              🛒 Cart
              {cartItems.length > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="banner-section">
        <div className="banner">
          <div className="banner-content">
            <h2>Grab Upto 50% Off On<br />Selected Products</h2>
            <p>Shop the best deals on electronics, fashion & more</p>
            <button className="banner-btn">Shop Now</button>
          </div>
          <div className="banner-image">🎧</div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="section-header">
          <h2>Products For You!</h2>
          <button className="filter-btn">
            <span>⚙️</span> All Filters
          </button>
        </div>

        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            products.map(product => (
              <div key={product._id} className="product-card">
                <button className="wishlist-btn">♡</button>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-badge">{product.category}</span>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating-count">(121)</span>
                  </div>
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                      disabled={addingToCart === product._id}
                    >
                      {addingToCart === product._id ? '...' : '+ Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
