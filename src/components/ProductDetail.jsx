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

    // Initialize color from navigation state if available, but default to NULL (All colors view)
    const initialColor = location.state?.selectedColor || null;
    const [selectedColor, setSelectedColor] = useState(initialColor);

    const [isAdding, setIsAdding] = useState(false);

    if (!product) return <div>Product not found</div>;

    // Remove the useEffect that auto-selects color. We WANT it to be null initially.
    // React.useEffect(() => { ... }, []); <-- Removed

    // Determine current images based on selection
    let images = [];
    let currentVariant = null;

    if (!selectedColor) {
        // "All Colors" Mode: Show main image of each variant
        if (product.variants && product.variants.length > 0) {
            images = product.variants.map(v => v.image).filter(Boolean);
        } else {
            images = product.images || (product.image ? [product.image] : []);
        }
    } else {
        // "Specific Color" Mode
        currentVariant = product.variants?.find(v => v.color === selectedColor);
        // Showcase all images for this variant if available, otherwise fallback to single image
        if (currentVariant) {
            images = (currentVariant.images && currentVariant.images.length > 0)
                ? currentVariant.images
                : (currentVariant.image ? [currentVariant.image] : []);
        } else {
            images = product.images || [];
        }
    }

    const hasMultipleImages = images.length > 1;

    const handlePrevImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
        // Removed navigate(-1) fallback as per user request
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

    // Simple logic: Take the part before " - "
    // Helper to map color hex to name
    const getColorName = (hex) => {
        switch (hex) {
            case '#000000': return 'MATTE BLACK';
            case '#3F3F3F': return 'MATTE GREY';
            case '#B8B8B8': return 'MATTE SILVER';
            default: return '';
        }
    };

    // Derived product code based on selection
    const baseName = product.code.includes(' - ') ? product.code.split(' - ')[0] : product.code;
    const dynamicProductCode = selectedColor
        ? `${baseName} - ${getColorName(selectedColor)}`
        : baseName;

    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!selectedSize) return;
        setIsAdding(true);

        // Find specific variant ID for the selected size
        const targetVariant = product.variants?.find(v => v.color === selectedColor);
        const specificVariantId = targetVariant?.sizeIds?.[selectedSize];

        // Pass the dynamic name/code to the cart item
        addToCart({
            ...product,
            shopifyId: specificVariantId, // Store the specific Size Variant ID
            code: dynamicProductCode, // Override code/name
            name: dynamicProductCode, // Also update name if used
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            price: product.price // Unit price
        });

        // Simulate adding delay
        setTimeout(() => {
            setIsAdding(false);
            setIsSizeSelectorOpen(false);
            setSelectedSize(null);
            setQuantity(1);
        }, 1500);
    };

    // Reset when opening overlay
    React.useEffect(() => {
        if (isSizeSelectorOpen) {
            setSelectedSize(null);
            setQuantity(1);
        }
    }, [isSizeSelectorOpen]);

    return (
        <div className="product-detail-container page-transition">
            <button className="back-home-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
            </button>

            {/* Main Product View */}
            <div className="product-detail-main">

                <div className="color-selector">
                    {['#000000', '#3F3F3F', '#B8B8B8'].map(color => (
                        <button
                            key={color}
                            className={`color-option ${selectedColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                setSelectedColor(color);
                                // Since we switch to a filtered list (Single Image Mode), reset index to 0
                                setCurrentImageIndex(0);
                            }}
                        />
                    ))}
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
                                <h2>{currentVariant?.available === false ? 'UNAVAILABLE' : 'SELECT SIZE'}</h2>
                                <button className="close-btn" onClick={() => setIsSizeSelectorOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            {currentVariant?.available === false ? (
                                <div className="sold-out-overlay-msg" style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>SOLD OUT</h3>
                                    <p style={{ color: '#666' }}>This color is currently out of stock.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="size-price">
                                        ${quantity === 1 ? '60.00' : (quantity === 2 ? '105.00' : '150.00')}
                                    </div>

                                    <div className="size-grid" style={{ marginBottom: '20px' }}>
                                        {['SML', 'MED', 'LRG'].map(size => (
                                            <button
                                                key={size}
                                                className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                                style={selectedSize === size ? { background: '#333', color: '#fff' } : {}}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Bundle / Quantity Selector */}
                                    <div className="qty-section" style={{ marginBottom: '30px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>BUNDLE OPTIONS</div>
                                        <div className="size-grid">
                                            {[2, 3].map(qty => (
                                                <button
                                                    key={qty}
                                                    className={`size-option ${quantity === qty ? 'active' : ''}`}
                                                    style={quantity === qty ? { background: '#333', color: '#fff' } : {}}
                                                    onClick={() => setQuantity(quantity === qty ? 1 : qty)}
                                                >
                                                    {qty}-BUNDLE
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        className="add-to-bag-btn"
                                        onClick={handleAddToCart}
                                        disabled={!selectedSize}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            backgroundColor: selectedSize ? '#000' : '#ccc',
                                            color: '#fff',
                                            border: 'none',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            cursor: selectedSize ? 'pointer' : 'not-allowed',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        ADD TO BAG
                                    </button>

                                    <div className="size-footer">
                                        <span className="info-label">INFORMATION</span>
                                        <p className="info-text">
                                            {product.description || "Material and care information coming soon."}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export default ProductDetail;
