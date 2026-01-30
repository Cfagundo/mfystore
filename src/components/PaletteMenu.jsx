import React from 'react';
import './PaletteMenu.css';

const PaletteMenu = ({ onFilter, onAction, activeFilter }) => {
    const paletteItems = [
        {
            id: 1,
            type: 'filter',
            color: '#000000',
            label: '#000000',
            subLabel: 'MATTE BLACK PRODUCTS',
            bgColor: '#000000',
            textColor: '#fff'
        },
        {
            id: 3,
            type: 'filter',
            color: '#3F3F3F',
            label: '#3F3F3F',
            subLabel: 'MATTE GREY PRODUCTS',
            bgColor: '#343434',
            textColor: '#fff'
        },
        {
            id: 7,
            type: 'filter',
            color: '#B8B8B8',
            label: '#B8B8B8',
            subLabel: 'MATTE SILVER PRODUCTS',
            bgColor: '#9D9D9D',
            textColor: '#000'
        },
        {
            id: 8,
            type: 'action',
            action: 'all',
            label: 'ALL PRODUCTS',
            bgColor: '#B8B8B8', // Keep matching silver/light theme or adjust? User didn't specify color change, just position.
            // The bgColors seem to follow a gradient.
            // About was #1A1A1A (Dark). All was #B8B8B8 (Light).
            // If we put "All" at pos 4, and "About" at pos 8...
            // Should we swap colors too to keep the gradient?
            // "can you swap the 'all products model' with the 'about us' model"
            // Usually means swap the *items*, keeping their inherent properties (colors).
            // But the gradient...
            // Let's keep the item's own color ("All" is light, "About" is dark).
            // This might break the "dark-to-light" flow if it exists.
            // Let's look: Black -> 343434 -> 9D9D9D -> 1A1A1A (Wait, 9D is Light, 1A is Dark).
            // The gradient is mixed.
            // I will just move the item objects.
            bgColor: '#B8B8B8',
            textColor: '#000'
        },
        {
            id: 4,
            type: 'action',
            action: 'follow',
            color: '#B8B8B8',
            label: 'FOLLOW US, STAY UPDATED',
            bgColor: '#4E4E4E',
            textColor: '#fff'
        },
        {
            id: 5,
            type: 'action',
            action: 'affiliate',
            color: '#3F3F3F',
            label: 'AFFILIATE SIGN-UP',
            bgColor: '#696969',
            textColor: '#fff'
        },
        {
            id: 6,
            type: 'action',
            action: 'support',
            color: '#B8B8B8',
            label: 'CUSTOMER SUPPORT',
            bgColor: '#838383',
            textColor: '#fff'
        },
        {
            id: 2,
            type: 'action',
            action: 'about',
            color: '#3F3F3F',
            label: 'ABOUT US',
            bgColor: '#1A1A1A',
            textColor: '#fff'
        },
    ];

    const handleClick = (item) => {
        if (item.type === 'filter') {
            onFilter(item.color);
        } else {
            onAction(item.action);
        }
    };

    return (
        <div className="palette-menu-container">
            <div className="palette-grid">
                {paletteItems.map((item) => {
                    const isActive = item.type === 'filter' && item.color === activeFilter;
                    return (
                        <button
                            key={item.id}
                            className={`palette-item ${isActive ? 'active' : ''}`}
                            style={{
                                backgroundColor: item.bgColor || item.color,
                                color: item.textColor,
                                border: 'none',
                                boxShadow: isActive ? '0 0 10px rgba(0,0,0,0.5)' : '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => handleClick(item)}
                        >
                            <span className="palette-label">
                                {item.label}
                                {item.subLabel && (
                                    <div className="palette-sublabel">
                                        {item.subLabel}
                                    </div>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="palette-footer-text">
                <span className="scrolling-text-content">matte for you • [concrete collection]</span>
            </div>
        </div>
    );
};

export default PaletteMenu;
