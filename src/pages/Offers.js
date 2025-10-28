// src/pages/Offers.js
import React from 'react';
import ProductCard from '../components/ProductCard';
import { getOfferProducts } from '../data/DataService'; 

const OffersPage = ({ onAddToCart }) => {
    
    const offerProducts = getOfferProducts();

    return (
        <section className="offers-page">
            <h1 className="mb-4 text-danger">¡Ofertas Exclusivas! 🔥</h1>
            
            {offerProducts.length === 0 ? (
                <p className="lead alert alert-info">Lo sentimos, no hay ofertas disponibles en este momento.</p>
            ) : (
                <div className="row">
                    {
                        offerProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={onAddToCart}
                            />
                        ))
                    }
                </div>
            )}
        </section>
    );
};

export default OffersPage;