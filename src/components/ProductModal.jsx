import React, { useState } from 'react';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductModal.css';

const ProductModal = ({ product, onClose, addToCart }) => {
    const [step, setStep] = useState('detail'); // 'detail' or 'size'
    const [selectedSize, setSelectedSize] = useState(null);

    const handleAddToCart = () => {
        if (selectedSize) {
            addToCart({ ...product, size: selectedSize });
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="product-modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X size={24} /></button>

                {step === 'detail' ? (
                    <div className="pm-detail-view">
                        <div className="pm-image-container">
                            <div className="pm-placeholder-number">{product.imageId}</div>
                        </div>
                        <div className="pm-info">
                            <div className="pm-code">{product.code}</div>
                            <div className="pm-price">${product.price}</div>
                        </div>
                        <button className="pm-add-btn" onClick={() => setStep('size')}>
                            <Plus size={30} />
                        </button>
                    </div>
                ) : (
                    <div className="pm-size-view">
                        <button className="pm-back-btn" onClick={() => setStep('detail')}>
                            <ChevronLeft size={24} />
                        </button>
                        <div className="pm-size-grid">
                            {[1, 2, 3].map(size => (
                                <button
                                    key={size}
                                    className={`pm-size-btn ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && (
                            <button className="pm-confirm-btn" onClick={handleAddToCart}>
                                ADD TO CART
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductModal;
