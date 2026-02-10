import React from 'react';
import { ShoppingBag, Info, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount, onZoomClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/' || location.pathname === '/womens' || location.pathname === '/new' || location.pathname === '/slides';
    const isAllProducts = location.pathname === '/all';



    const handleInfoClick = () => {
        if (!isHome) {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById('about-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById('about-section');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isProductPage = location.pathname.startsWith('/product/');
    const isCartPage = location.pathname === '/cart';

    return (
        <header className="header">
            <div className="header-left-group">
                {isHome ? (
                    <button className="info-btn" onClick={handleInfoClick}>
                        <Info size={20} strokeWidth={1} />
                    </button>
                ) : isAllProducts ? (
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} strokeWidth={1} />
                    </button>
                ) : (
                    <div style={{ width: 20 }}></div>
                )}

                {/* EST Label - Only show on Home or generally? Request implies global or Home. 
                    Screenshot is Home. Let's show it where it fits. */}
                {/* Removed from left */}
            </div>

            {(isCartPage || isProductPage) && (
                <div className="header-center-logo">
                    <img src="/mfy-logo.png" alt="MFY" className="header-logo-img" />
                </div>
            )}

            <div className="header-right">



                <Link to="/cart" className="cart-icon-container">
                    <ShoppingBag size={20} strokeWidth={1} />
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
            </div>
        </header>
    );
};

export default Header;
