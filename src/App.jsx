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
  const [storeProducts, setStoreProducts] = useState(staticProducts); // Start with static, replace with dynamic if Shopify data is available
  const [zoomLevel, setZoomLevel] = useState(0);

  React.useEffect(() => {
    // HYBRID MODE: Fetch availability from Shopify and merge into Static Data
    const loadInventory = async () => {
      try {
        const liveProducts = await fetchAllProducts();

        if (liveProducts && liveProducts.length > 0) {
          // Create a deep copy of static products to modify
          const mergedProducts = JSON.parse(JSON.stringify(staticProducts));

          // Helper to normalize Shopify IDs (Handle Base64 vs Raw GID)
          const normalizeId = (id) => {
            if (!id) return '';
            if (id.includes('gid://')) return id;
            try {
              return atob(id);
            } catch (e) {
              return id;
            }
          };

          // Create a lookup map for live variants by ID
          const liveVariantMap = new Map();
          liveProducts.forEach(p => {
            p.variants.forEach(v => {
              const decodedId = normalizeId(v.id);
              // Also strip query params for safety
              const cleanId = decodedId.split('?')[0];
              liveVariantMap.set(cleanId, v);
            });
          });

          mergedProducts.forEach(staticProd => {
            // Sync Variants based on exact Shopify ID match
            staticProd.variants.forEach(staticVar => {
              if (staticVar.shopifyId) {
                const cleanStaticId = staticVar.shopifyId.split('?')[0];
                if (liveVariantMap.has(cleanStaticId)) {
                  const liveVar = liveVariantMap.get(cleanStaticId);
                  // Check availableForSale (V2 API) or available (Legacy)
                  staticVar.available = liveVar.availableForSale !== undefined ? liveVar.availableForSale : liveVar.available;
                  console.log(`Synced ${staticVar.color}: Available = ${staticVar.available}`);
                }
              }
            });
          });

          console.log("Synced Inventory with Shopify.");
          setStoreProducts(mergedProducts);
        }
      } catch (error) {
        console.error("Inventory sync failed:", error);
      }
    };

    // Initial load: Static
    setStoreProducts(staticProducts);
    // Then attempt sync
    loadInventory();
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
