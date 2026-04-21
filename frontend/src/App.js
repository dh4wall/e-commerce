import React, { useState, useEffect } from 'react';
import './App.css';

/* const API = 'http://localhost:5000'; */
// const API = 'http://YOUR_PUBLIC_IP:5000' || ' ';
const API = ' ';

function App() {
  const [page, setPage] = useState('products'); // 'products' or 'cart'
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      showMessage('❌ Failed to fetch products. Is the server running?');
    }
    setLoading(false);
  };

  // Fetch cart items
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/cart`);
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      showMessage('❌ Failed to fetch cart.');
    }
    setLoading(false);
  };

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      const res = await fetch(`${API}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        showMessage('✅ Item added to cart!');
        fetchCart();
      } else {
        showMessage('❌ Failed to add item.');
      }
    } catch (err) {
      showMessage('❌ Error connecting to server.');
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const res = await fetch(`${API}/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showMessage('🗑️ Item removed from cart.');
        fetchCart();
      } else {
        showMessage('❌ Failed to remove item.');
      }
    } catch (err) {
      showMessage('❌ Error connecting to server.');
    }
  };

  // Update quantity of a cart item (+/-)
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return; // prevent going below 1
    try {
      const res = await fetch(`${API}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        // Update state directly to avoid full re-fetch flicker
        setCartItems((prev) =>
          prev.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        showMessage('❌ Failed to update quantity.');
      }
    } catch (err) {
      showMessage('❌ Error connecting to server.');
    }
  };

  // Place order
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      showMessage('⚠️ Your cart is empty!');
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, totalAmount }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('🎉 Order placed successfully! Cart has been cleared.');
        setCartItems([]);
        setPage('products');
      } else {
        showMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      showMessage('❌ Error placing order.');
    }
  };

  // Show temporary message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  // Calculate total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>🛒 ShopEasy</h1>
        <nav>
          <button
            className={page === 'products' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => { setPage('products'); fetchProducts(); }}
          >
            Products
          </button>
          <button
            className={page === 'cart' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => { setPage('cart'); fetchCart(); }}
          >
            Cart ({cartItems.length})
          </button>
        </nav>
      </header>

      {/* Flash Message */}
      {message && <div className="flash-message">{message}</div>}

      {/* Loading */}
      {loading && <div className="loading">Loading...</div>}

      {/* Products Page */}
      {page === 'products' && (
        <main className="main">
          <h2>Available Products</h2>
          {products.length === 0 && !loading && (
            <p className="empty">No products found.</p>
          )}
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={product.image || 'https://via.placeholder.com/400x220?text=No+Image'}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x220?text=No+Image';
                  }}
                />
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <p className="price">₹{product.price.toLocaleString()}</p>
                <button
                  className="btn-add"
                  onClick={() => addToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Cart Page */}
      {page === 'cart' && (
        <main className="main">
          <h2>Your Cart</h2>
          {cartItems.length === 0 && !loading && (
            <p className="empty">Your cart is empty. Add some products!</p>
          )}
          {cartItems.length > 0 && (
            <>
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item._id}>
                    {/* Product name and unit price */}
                    <div className="cart-item-info">
                      <h4>{item.productId?.name}</h4>
                      <p className="unit-price">₹{item.productId?.price?.toLocaleString()} each</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Item subtotal + remove */}
                    <div className="cart-item-right">
                      <span className="cart-item-total">
                        ₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}
                      </span>
                      <button
                        className="btn-remove"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <p className="total">
                  Total: <strong>₹{cartTotal.toLocaleString()}</strong>
                </p>
                <button className="btn-order" onClick={placeOrder}>
                  Place Order
                </button>
              </div>
            </>
          )}
        </main>
      )}

      <footer className="footer">
        <p>ShopEasy &copy; 2025 — MERN E-Commerce App</p>
      </footer>
    </div>
  );
}

export default App;
