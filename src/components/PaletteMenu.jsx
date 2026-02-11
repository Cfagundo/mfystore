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
            bgColor: '#242424',
            textColor: '#fff'
        },
        {
            id: 7,
            type: 'filter',
            color: '#B8B8B8',
            label: '#B8B8B8',
            subLabel: 'MATTE WHITE PRODUCTS',
            bgColor: '#484848',
            textColor: '#fff'
        },
        {
            id: 8,
            type: 'action',
            action: 'all',
            label: 'ALL PRODUCTS',
            bgColor: '#6C6C6C',
            textColor: '#fff'
        },
        {
            id: 4,
            type: 'action',
            action: 'follow',
            color: '#B8B8B8',
            label: 'FOLLOW US, STAY UPDATED',
            bgColor: '#909090',
            textColor: '#000'
        },
        {
            id: 5,
            type: 'action',
            action: 'affiliate',
            color: '#3F3F3F',
            label: 'AFFILIATE SIGN-UP',
            bgColor: '#B4B4B4',
            textColor: '#000'
        },
        {
            id: 6,
            type: 'action',
            action: 'support',
            color: '#B8B8B8',
            label: 'CUSTOMER SUPPORT',
            bgColor: '#D8D8D8',
            textColor: '#000'
        },
        {
            id: 2,
            type: 'action',
            action: 'about',
            color: '#3F3F3F',
            label: 'FAQ',
            bgColor: '#FCFCFC',
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
                <span className="scrolling-text-content">matteforyou LLC • [concrete collection]</span>
            </div>
        </div>
    );
};

export default PaletteMenu;
