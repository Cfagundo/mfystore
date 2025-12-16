import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import { products as staticProducts } from './data/products';
import { fetchAllProducts } from './shopify';

import AllProducts from './components/AllProducts';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [storeProducts, setStoreProducts] = useState(staticProducts); // Start with static, replace with dynamic
  const [zoomLevel, setZoomLevel] = useState(0);

  React.useEffect(() => {
    // Load products from Shopify
    const loadData = async () => {
      const liveProducts = await fetchAllProducts();
      if (liveProducts && liveProducts.length > 0) {
        console.log("Loaded Shopify Products:", liveProducts);
        setStoreProducts(liveProducts);
      }
    };
    loadData();
  }, []);

  const addToCart = (product) => {
    // TODO: integrate with Shopify Checkout
    setCartItems([...cartItems, product]);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev + 1) % 3);
  };

  return (
    <Router>
      <div className="app">
        <Header cartCount={cartItems.length} onZoomClick={toggleZoom} />

        <Routes>
          <Route path="/" element={<Home products={storeProducts} addToCart={addToCart} />} />
          <Route path="/womens" element={<Home products={storeProducts} addToCart={addToCart} />} />
          <Route path="/new" element={<Home products={storeProducts} addToCart={addToCart} />} />
          <Route path="/slides" element={<Home products={storeProducts} addToCart={addToCart} />} />
          <Route path="/all" element={<AllProducts products={storeProducts} />} />

          <Route path="/product/:id" element={<ProductDetail products={storeProducts} addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
