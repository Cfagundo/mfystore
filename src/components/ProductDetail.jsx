import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, X, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import './ProductDetail.css';

const ProductDetail = ({ addToCart, products: propProducts }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Use passed products or fallback to static import
    const productList = propProducts || products;
    const product = productList.find(p => p.id === id);
    const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Initialize color from navigation state if available, or default to product color
    const initialColor = location.state?.selectedColor || product?.color || null;
    const [selectedColor, setSelectedColor] = useState(initialColor);

    const [isAdding, setIsAdding] = useState(false);

    if (!product) return <div>Product not found</div>;

    // Initialize selectedColor if not set (fallback)
    React.useEffect(() => {
        if (!selectedColor && product) {
            setSelectedColor(product.color);
        }
    }, [product, selectedColor]);

    // Determine current images based on selection
    const currentVariant = product.variants?.find(v => v.color === selectedColor);
    const images = currentVariant?.images || product.images || (product.image ? [product.image] : []);

    const hasMultipleImages = images.length > 1;

    const handlePrevImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        } else {
            navigate(-1); // Default back behavior if no multiple images
        }
    };

    const handleNextImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }
    };



    // Derived product code based on selection
    // Assumes product.code is the base name e.g. "ONE PIECE" if originally "ONE PIECE - MATTE BLACK"
    // Or we simply replace the suffix if it exists, or append it.
    // The user manually renamed TS-01 to "ONE PIECE - MATTE BLACK".
    // We should probably strip the suffix and append the new one.

    // Simple logic: Take the part before " - " and append new color name.
    const baseName = product.code.includes(' - ') ? product.code.split(' - ')[0] : product.code;
    const dynamicProductCode = `${baseName} - ${getColorName(selectedColor)}`;

    const handleSizeSelect = (size) => {
        setIsAdding(true);
        // Pass the dynamic name/code to the cart item
        addToCart({
            ...product,
            code: dynamicProductCode, // Override code/name
            name: dynamicProductCode, // Also update name if used
            color: selectedColor,
            size
        });

        // Simulate adding delay
        setTimeout(() => {
            setIsAdding(false);
            // Keep the size selector open
        }, 1500);
    };

    // Determine unique colors from variants
    const uniqueColors = React.useMemo(() => {
        if (!product?.variants) return [];
        const colors = new Set();
        return product.variants.filter(v => {
            if (colors.has(v.color)) return false;
            colors.add(v.color);
            return true;
        }).map(v => v.color).filter(Boolean);
    }, [product]);

    // Helper to map color hex to name (Expanded for safety)
    const getColorName = (hex) => {
        if (!hex) return '';
        const h = hex.toUpperCase();
        if (h === '#000000') return 'MATTE BLACK';
        if (h === '#3F3F3F' || h === '#3E3E3E') return 'MATTE GREY';
        if (h === '#B8B8B8' || h === '#C0C0C0') return 'MATTE SILVER';
        if (h === '#FFFFFF') return 'MATTE WHITE';
        return 'CUSTOM COLOR'; // Fallback
    };

    // ... (rest of logic)

    return (
        <div className="product-detail-container page-transition">
            <button className="back-home-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
            </button>

            {/* Main Product View */}
            <div className="product-detail-main">

                <div className="color-selector">
                    {uniqueColors.length > 0 ? uniqueColors.map(color => (
                        <button
                            key={color}
                            className={`color-option ${selectedColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                setSelectedColor(color);
                                setCurrentImageIndex(0); // Reset carousel on color change
                            }}
                        />
                    )) : (
                        // Fallback if no variants (single product) - show nothing or single dot?
                        // If selectedColor exists, show it.
                        selectedColor && (
                            <button
                                className="color-option active"
                                style={{ backgroundColor: selectedColor }}
                            />
                        )
                    )}
                </div>

                <button className="nav-arrow left" onClick={handlePrevImage}>
                    <ChevronLeft size={24} />
                </button>

                <div className="detail-image-container">
                    {images.length > 0 ? (
                        <img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            alt={product.name}
                            className="detail-image image-fade"
                        />
                    ) : (
                        <span className="detail-placeholder-number">{product.imageId}</span>
                    )}
                </div>

                <button className="nav-arrow right" onClick={handleNextImage}>
                    <ChevronRight size={24} />
                </button>

                <div className="detail-info">
                    {hasMultipleImages && (
                        <div className="carousel-dots">
                            {images.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    style={{ cursor: 'pointer' }}
                                ></span>
                            ))}
                        </div>
                    )}
                    <h1 className="detail-code">{dynamicProductCode}</h1>
                    <p className="detail-price">${product.price}</p>

                    <button className="add-btn" onClick={() => setIsSizeSelectorOpen(true)}>
                        <Plus size={32} />
                    </button>
                </div>
            </div>

            {/* Size Selector Overlay */}
            {isSizeSelectorOpen && (
                <div className="size-selector-overlay">
                    {isAdding ? (
                        <div className="adding-animation">
                            <span className="adding-text">ADDING...</span>
                        </div>
                    ) : (
                        <div className="size-selector-content">
                            <div className="size-header">
                                <span className="help-icon">?</span>
                                <h2>SELECT SIZE</h2>
                                <button className="close-btn" onClick={() => setIsSizeSelectorOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="size-price">${product.price}</div>

                            <div className="size-grid">
                                {['SML', 'MED', 'LRG'].map(size => (
                                    <button key={size} className="size-option" onClick={() => handleSizeSelect(size)}>
                                        {size}
                                    </button>
                                ))}
                            </div>

                            <div className="size-footer">
                                <span className="info-label">INFORMATION</span>
                                <p className="info-text">
                                    {product.description || "Material and care information coming soon."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
