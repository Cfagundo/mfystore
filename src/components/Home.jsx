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
                <p>
                    We are MFY, dedicated to bringing you the most comfortable, sleek aesthetic.
                </p>
                <p>
                    Our current palette features #000000 (matte black), #3F3F3F (matte silver), and #B8B8B8 (matte white).
                </p>
                <p>
                    Contact us to join our affiliate program to earn while you wear.
                </p>
                <p>
                    All inventory is held in-house and ships between 2-3 days.
                </p>
                <p>
                    This is season 01!
                </p>
            </div>

            {/* Modals */}
            {activeModal === 'affiliate' && (
                <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}><X /></button>
                        <h2>AFFILIATE SIGN-UP</h2>
                        <form>
                            <div className="input-group">
                                <label>FIRST NAME</label>
                                <input type="text" className="input-field" />
                            </div>
                            <div className="input-group">
                                <label>LAST NAME</label>
                                <input type="text" className="input-field" />
                            </div>
                            <div className="input-group">
                                <label>INSTAGRAM HANDLE</label>
                                <input type="text" className="input-field" />
                            </div>
                            <div className="input-group">
                                <label>PHONE NUMBER</label>
                                <input type="tel" className="input-field" />
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
                            {/* Placeholders for icons */}
                            <button style={{ fontSize: '20px', fontWeight: 'bold' }}>INSTAGRAM</button>
                            <button style={{ fontSize: '20px', fontWeight: 'bold' }}>TIKTOK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
