import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowLeft } from 'lucide-react';
import { createCheckout, addItemToCheckout } from '../shopify'; // Import Shopify helpers
import './Cart.css';

const Cart = ({ cartItems }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const shipping = 0; // Calculated at next step usually
    const taxes = 0;
    const total = subtotal + shipping + taxes;

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            // 1. Create a checkout
            const checkout = await createCheckout();

            // 2. Map cart items to line items (Shopify expects variants)
            const lineItems = cartItems.map(item => ({
                variantId: item.variants?.find(v => v.color === item.color)?.id || item.id, // Must be variant ID
                quantity: 1
            }));

            // Note: If our static/dummy items don't have real Shopify Variant IDs, this will fail.
            // We need to protect against that.
            const validItems = lineItems.filter(item => item.variantId && item.variantId.includes('gid://'));

            if (validItems.length === 0) {
                alert("No valid Shopify items in cart. (Are you using test data?)");
                setIsLoading(false);
                return;
            }

            // 3. Add items
            const checkoutWithItems = await addItemToCheckout(checkout.id, validItems);

            // 4. Redirect
            if (checkoutWithItems.webUrl) {
                window.location.href = checkoutWithItems.webUrl;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Checkout failed. Check console.");
            setIsLoading(false);
        }
    };

    return (
        <div className="cart-container container page-transition">
            <button className="back-home-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
            </button>
            <div className="cart-header-mobile">
                <Link to="/"><ChevronLeft /></Link>
                <span></span>
                <span></span>
            </div>

            <div className="cart-layout">
                {/* Left Column: Form - This is largely decorative in this simple redirect flow, 
                    unless we store this and pass it to Shopify via URL params (advanced). 
                    For now, we leave it but the real action is the button. */}
                <div className="cart-form">
                    <div className="form-section">
                        <h3>CONTACT INFORMATION</h3>
                        <div className="form-group">
                            <label>EMAIL ADDRESS</label>
                            <input type="email" className="input-field" disabled={isLoading} />
                        </div>
                        {/* Hidden actual complex fields for now to avoid confusion */}
                        <div className="summary-row">
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                Enter your details clearly at the next step on our secure checkout.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="cart-summary">
                    <h3>ORDER SUMMARY</h3>

                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">YOUR CART IS EMPTY</div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <span>{item.code} {item.size ? `(Size ${item.size})` : ''}</span>
                                    <span>${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>SUBTOTAL</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>SHIPPING</span>
                            <span>CALCULATED AT NEXT STEP</span>
                        </div>
                        <div className="summary-row total">
                            <span>TOTAL</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0 || isLoading}
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                padding: '15px',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {isLoading ? 'REDIRECTING...' : 'PROCEED TO PAYMENT'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
