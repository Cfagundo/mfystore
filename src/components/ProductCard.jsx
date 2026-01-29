import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, displayColor }) => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [showPrice, setShowPrice] = useState(false);

    // Helper to map color hex to name
    const getColorName = (hex) => {
        switch (hex) {
            case '#000000': return 'MATTE BLACK';
            case '#3F3F3F': return 'MATTE GREY';
            case '#B8B8B8': return 'MATTE SILVER';
            default: return '';
        }
    };

    // Static display - No cycling or filtering animations
    const currentImage = product.image;
    // Show full code including color name
    const currentCode = product.code;

    // No local state needed for image cycling anymore

    const handleMouseMove = (e) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <Link
            to={`/product/${encodeURIComponent(product.id)}`}
            // No state passed, allowing ProductDetail to default to "All Colors" view
            className="product-card"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowPrice(true)}
            onMouseLeave={() => setShowPrice(false)}
        >
            <div className="product-image-placeholder">
                {currentImage ? (
                    <img
                        key={currentImage} // Force re-render for animation
                        src={currentImage}
                        alt={product.name}
                        className="product-image image-fade-in"
                    />
                ) : (
                    <span className="placeholder-number">{product.imageId}</span>
                )}
            </div>
            <div className="product-info">
                <span className="product-code">{currentCode}</span>
            </div>
            {showPrice && (
                <div
                    className="price-tooltip"
                    style={{
                        left: cursorPos.x + 15,
                        top: cursorPos.y + 15
                    }}
                >
                    ${product.price}
                </div>
            )}
        </Link>
    );
};

export default ProductCard;
