import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, X, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import './ProductDetail.css';

const ProductDetail = ({ addToCart, products: propProducts }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Use passed products or fallback to static import
    const productList = propProducts || products;
    const product = productList.find(p => p.id === id);
    const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    if (!product) return <div>Product not found</div>;

    // Use images directly from the product object
    // If no distinct images array, fallback to single image
    const images = (product.images && product.images.length > 0)
        ? product.images
        : (product.image ? [product.image] : []);

    const hasMultipleImages = images.length > 1;

    const handlePrevImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    };

    const handleNextImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) return;
        setIsAdding(true);

        const specificVariantId = product.sizeVariants?.[selectedSize]?.id;

        // Pass the product to the cart
        addToCart({
            ...product,
            shopifyId: specificVariantId,
            size: selectedSize,
            quantity: quantity,
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
    useEffect(() => {
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
                {/* Logo removed from here as it is now in Header */}

                {/* Color Selector Removed */}

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
                    <h1 className="detail-code">{product.code}</h1>
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
                                <h2>{product.available === false ? 'UNAVAILABLE' : 'SELECT SIZE'}</h2>
                                <button className="close-btn" onClick={() => setIsSizeSelectorOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            {product.available === false ? (
                                <div className="sold-out-overlay-msg" style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>SOLD OUT</h3>
                                    <p style={{ color: '#666' }}>This item is currently out of stock.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="size-price">
                                        ${quantity === 1 ? '60.00' : (quantity === 2 ? '105.00' : '150.00')}
                                    </div>

                                    <div className="size-grid" style={{ marginBottom: '20px' }}>
                                        {['SML', 'MED', 'LRG'].map(size => {
                                            const isSizeAvailable = product.sizeVariants?.[size]?.available !== false;
                                            return (
                                                <button
                                                    key={size}
                                                    disabled={!isSizeAvailable}
                                                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                                    style={{
                                                        ...(selectedSize === size ? { background: '#333', color: '#fff' } : {}),
                                                        ...(!isSizeAvailable ? { opacity: 0.3, textDecoration: 'line-through', cursor: 'not-allowed' } : {})
                                                    }}
                                                    onClick={() => isSizeAvailable && setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Bundle / Quantity Selector */}
                                    <div className="qty-section" style={{ marginBottom: '20px' }}>
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
