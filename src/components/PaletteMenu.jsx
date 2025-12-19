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
            bgColor: '#343434', // Adjusted to match gradient flow if needed? No, let's keep original distinct colors.
            // Actually let's just move the object.
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
            id: 2,
            type: 'action',
            action: 'about',
            color: '#3F3F3F',
            label: 'ABOUT US',
            bgColor: '#1A1A1A',
            textColor: '#fff'
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
            id: 8,
            type: 'action',
            action: 'all',
            label: 'ALL PRODUCTS',
            bgColor: '#B8B8B8', // Keep as is
            textColor: '#000'
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
                <span className="scrolling-text-content">matte for you</span>
            </div>
        </div>
    );
};

export default PaletteMenu;
