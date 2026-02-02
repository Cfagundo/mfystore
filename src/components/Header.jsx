import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Info, ArrowLeft, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount, onZoomClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/' || location.pathname === '/womens' || location.pathname === '/new' || location.pathname === '/slides';
    const isAllProducts = location.pathname === '/all';

    const [currentTime, setCurrentTime] = useState(new Date());
    const [timezone, setTimezone] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Get Local Timezone Abbreviation
        try {
            const tz = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
                .formatToParts(new Date())
                .find(part => part.type === 'timeZoneName')?.value;

            // Clean up: If it returns "GMT-5" style, keep it. If "Pacific Standard Time", try to abbreviate?
            // "short" usually gives "EST", "PST", "CST".
            // Some browsers might give "GMT-5". 
            if (tz) setTimezone(tz.toUpperCase());
        } catch (e) {
            console.error(e);
        }

        return () => clearInterval(timer);
    }, []);

    // Format time: H:MM:SS
    // Note: Assuming User wants 12-hour format or 24? "H:MM:SS" often implies 1-12. 
    // Let's go with 12 hour to be safe for a "store" aesthetic, or 24 if "raw aesthetic".
    // given aesthetic (raw), maybe 24h? undefined. typical digital clock is 12h.
    // Let's stick to 12h without AM/PM text if just "H:MM:SS" requested literally, 
    // but usually AM/PM is needed to know day/night.
    // Wait, the icon indicates day/night. So 12h is fine.

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    // Reverted to 12h format
    // 24-hour format (Military Time)
    const displayHours = hours.toString().padStart(2, '0');
    const isDay = hours >= 6 && hours < 18;

    const timeString = `${displayHours}:${minutes}:${seconds}`;

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
                <div className="time-display">

                    <span className="time-text">{timeString}</span>
                    {isDay ? <Sun size={16} fill="black" stroke="none" /> : <Moon size={16} fill="black" stroke="none" />}
                </div>


                <Link to="/cart" className="cart-icon-container">
                    <ShoppingBag size={20} strokeWidth={1} />
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
            </div>
        </header>
    );
};

export default Header;
