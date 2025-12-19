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

    const getDynamicCode = (variant) => {
        if (!variant) return product.code;
        // Logic from ProductDetail: Split base name and append color
        const baseName = product.code.includes(' - ') ? product.code.split(' - ')[0] : product.code;
        return `${baseName} - ${getColorName(variant.color)}`;
    };

    // State
    const [currentImage, setCurrentImage] = useState(product.image);
    const [currentCode, setCurrentCode] = useState(product.code);
    const [currentColor, setCurrentColor] = useState(product.color); // Default to main product color
    const [currentIndex, setCurrentIndex] = useState(0);

    React.useEffect(() => {
        // If a specific color is forced via props (e.g. from Home filter)
        if (displayColor) {
            const variant = product.variants?.find(v => v.color === displayColor);
            if (variant) {
                setCurrentImage(variant.image);
                setCurrentCode(getDynamicCode(variant));
                setCurrentColor(variant.color);
            } else if (product.color === displayColor) {
                setCurrentImage(product.image);
                setCurrentCode(product.code);
                setCurrentColor(product.color);
            }
        } else {
            // Only cycle if variants exist and there are multiple unique colors with images
            if (product.variants && product.variants.length > 1) {
                const interval = setInterval(() => {
                    setCurrentIndex(prevIndex => {
                        const nextIndex = (prevIndex + 1) % product.variants.length;
                        const nextVariant = product.variants[nextIndex];
                        setCurrentImage(nextVariant.image);
                        setCurrentCode(getDynamicCode(nextVariant));
                        setCurrentColor(nextVariant.color);
                        return nextIndex;
                    });
                }, 6000); // 6 seconds

                return () => clearInterval(interval);
            } else {
                // Default to initial product state (First variant or main product)
                // No cycling.
                setCurrentImage(product.image);
                setCurrentCode(product.code);
                setCurrentColor(product.color);
            }
        }
    }, [product, displayColor]);

    const handleMouseMove = (e) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <Link
            to={`/product/${encodeURIComponent(product.id)}`}
            state={{ selectedColor: currentColor }} // Pass current color to detail page
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
