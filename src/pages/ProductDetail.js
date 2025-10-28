// src/pages/ProductDetail.js
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getProductById } from '../data/DataService'; 
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const ProductDetailPage = ({ onAddToCart }) => {
    
    const { id } = useParams();
    const product = getProductById(id);

    // Si el producto no existe, redirige a la página principal de productos
    if (!product) {
        return <Navigate to="/products" replace />; 
    }
    
    // Formatear precio y verificar stock
    const formattedPrice = product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    const isAvailable = product.stock > 0;

    return (
        <div className="container my-5">
            
            {/* Botón para volver (usa el historial del navegador) */}
            <button className="btn btn-secondary mb-4" onClick={() => window.history.back()}>
                <FaArrowLeft className="me-2" /> Volver
            </button>
            
            <div className="row">
                {/* Columna de la Imagen */}
                <div className="col-md-6 mb-4">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="img-fluid rounded shadow" 
                        style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                    />
                </div>
                
                {/* Columna de la Información */}
                <div className="col-md-6">
                    <h1 className="display-4 fw-bold">{product.name}</h1>
                    
                    {/* Badge de Stock */}
                    <span className={`badge fs-6 bg-${isAvailable ? 'success' : 'danger'} mb-3`}>
                        {isAvailable ? `En Stock: ${product.stock}` : 'Agotado'}
                    </span>
                    
                    <h2 className="text-primary mt-3 mb-4">{formattedPrice}</h2>
                    
                    {/* Descripción (HTML Válido) */}
                    <p className="lead border-start border-3 border-secondary ps-3">
                        {product.description}
                    </p>
                    
                    <hr />
                    
                    {/* Botón de Añadir al Carrito */}
                    <button 
                        className="btn btn-lg btn-warning mt-3 w-100" 
                        onClick={() => onAddToCart(product)} 
                        disabled={!isAvailable}
                    >
                        <FaShoppingCart className="me-2" /> 
                        {isAvailable ? 'Añadir al Carrito' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;