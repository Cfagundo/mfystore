import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import PaletteMenu from './PaletteMenu';
import { X } from 'lucide-react';
import './Home.css';

import CustomScrollbar from './CustomScrollbar';

const Home = ({ products }) => {
    const navigate = useNavigate();
    const [filterColor, setFilterColor] = useState(null); // null means all
    const [activeModal, setActiveModal] = useState(null); // 'affiliate', 'support', 'follow'
    const aboutRef = useRef(null);

    const filteredProducts = filterColor
        ? products.filter(p =>
            p.color === filterColor ||
            (p.variants && p.variants.some(v => v.color === filterColor))
        )
        : products;

    // Show only first 3 for the "3 products at a time" rule, or all if filtered?
    // The prompt says "shows all three items in a horizontal row". 
    // Let's show the first 3 of the filtered list.
    const displayProducts = filteredProducts.slice(0, 3);

    const handlePaletteAction = (action) => {
        if (action === 'about') {
            aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'all') {
            navigate('/all');
        } else {
            setActiveModal(action);
        }
    };

    const [isClosing, setIsClosing] = useState(false);

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setActiveModal(null);
            setIsClosing(false);
        }, 200); // Match animation duration
    };

    return (
        <div className="home-container page-transition">
            <CustomScrollbar />
            {/* Logo Section */}
            {/* Logo Section */}
            <div className="logo-container">
                <img src="/mfy-logo.png" alt="MFY Logo" className="mfy-logo" />
            </div>

            {/* Product Row */}
            <div className="featured-products container">
                {displayProducts.length > 0 ? (
                    displayProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            displayColor={filterColor} // Pass the active filter
                        />
                    ))
                ) : (
                    <div className="no-products">NO PRODUCTS FOUND IN THIS COLOR</div>
                )}
            </div>

            {/* Palette Menu */}
            <PaletteMenu onFilter={setFilterColor} onAction={handlePaletteAction} activeFilter={filterColor} />

            {/* About Section */}
            <div ref={aboutRef} id="about-section" className="about-section container">
                <h2>FAQ</h2>
                <div className="faq-content">
                    <div className="faq-item">
                        <strong>Is Product Inventory kept in house or Pre-Order?</strong>
                        <p>All product inventory is kept in house and ships in 1-2 days after order is placed.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Does this run true to size?</strong>
                        <p>Yes. Our products run true to size!</p>
                    </div>
                    <div className="faq-item">
                        <strong>Is the fabric see-through?</strong>
                        <p>No. The 220–240 GSM provides excellent coverage, structure, and a smooth finish—no sheerness when wet.</p>
                    </div>
                    <div className="faq-item">
                        <strong>How does it feel on the body?</strong>
                        <p>Smooth, supportive, and slightly compressive. It hugs without digging in and retains its shape wear after wear. The fabric has high stretch and recovery, with elastane content designed to move with your body and snap back into place.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Does it provide support?</strong>
                        <p>Yes. The density and elastane blend offer natural compression and hold, helping sculpt and support without feeling restrictive.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Is it sustainable?</strong>
                        <p>Yes. The elastane blend ensures excellent shape retention, even with regular swimming and sun exposure. With proper care, fading and peeling are minimal. The fabric is engineered for color retention and durability.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Is it chlorine and salt-water safe?</strong>
                        <p>Yes. The fabric and heat-transfer logos are chlorine resistant, making it suitable for pools, oceans, and frequent wear.</p>
                    </div>
                    <div className="faq-item">
                        <strong>Is it quick-drying?</strong>
                        <p>Yes. Recycled nylon dries quickly and doesn’t stay heavy or water-logged after swimming.</p>
                    </div>
                    <div className="faq-item">
                        <strong>How should I care for it?</strong>
                        <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
                            <li>Rinse in cold water after use</li>
                            <li>Hand wash or gentle cycle</li>
                            <li>Lay flat to dry</li>
                            <li>Avoid bleach, and fabric softeners</li>
                        </ul>
                    </div>
                    <div className="faq-item">
                        <strong>Can I return the swimsuit after purchase?</strong>
                        <p>For hygienic purposes, swimwear is final sale and cannot be returned or exchanged.</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'affiliate' && (
                <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}><X /></button>
                        <h2>AFFILIATE SIGN-UP</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            console.log('Affiliate Signup:', data);
                            alert('Thank you for applying! We will be in touch shortly.');
                            closeModal();
                        }}>
                            <div className="input-group">
                                <label>FIRST NAME</label>
                                <input name="firstName" type="text" className="input-field" required />
                            </div>
                            <div className="input-group">
                                <label>LAST NAME</label>
                                <input name="lastName" type="text" className="input-field" required />
                            </div>
                            <div className="input-group">
                                <label>INSTAGRAM HANDLE</label>
                                <input name="instagram" type="text" className="input-field" required />
                            </div>
                            <div className="input-group">
                                <label>PHONE NUMBER</label>
                                <input name="phone" type="tel" className="input-field" required placeholder="+1 (555) 000-0000" />
                            </div>
                            <button type="submit" className="submit-btn">SUBMIT REQUEST</button>
                        </form>
                    </div>
                </div>
            )}

            {activeModal === 'support' && (
                <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}><X /></button>
                        <h2>CUSTOMER SUPPORT</h2>
                        <form>
                            <div className="input-group">
                                <label>EMAIL ADDRESS</label>
                                <input type="email" className="input-field" />
                            </div>
                            <div className="input-group">
                                <label>HOW CAN WE HELP?</label>
                                <textarea className="input-field" rows="4"></textarea>
                            </div>
                            <button type="submit" className="submit-btn">SEND MESSAGE</button>
                        </form>
                    </div>
                </div>
            )}

            {activeModal === 'follow' && (
                <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
                    <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}><X /></button>
                        <h2>FOLLOW US</h2>
                        <div className="social-links" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <a
                                href="https://www.instagram.com/matteforyouswim/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', textDecoration: 'none' }}
                            >
                                INSTAGRAM
                            </a>
                            <a
                                href="https://www.tiktok.com/@matteforyouswim"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', textDecoration: 'none' }}
                            >
                                TIKTOK
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
