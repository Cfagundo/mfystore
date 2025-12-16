import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from './ProductCard';
import './AllProducts.css';

const AllProducts = ({ products }) => {
    const navigate = useNavigate();

    return (
        <div className="all-products-container page-transition">
            {/* Logo Section - Reused from Home */}
            <div className="logo-container">
                <img src="/mfy-logo.png" alt="MFY Logo" className="mfy-logo" />
            </div>

            {/* Product Grid */}
            <div className="all-products-grid container">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default AllProducts;
