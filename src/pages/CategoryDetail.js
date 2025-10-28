// src/pages/CategoryDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. Importamos la función para OBTENER productos por categoría
import { getProductsByCategory } from '../data/DataService'; 
// 2. Importamos la TARJETA de producto para reusarla
import ProductCard from '../components/ProductCard'; 
import { FaArrowLeft } from 'react-icons/fa';

// 3. Recibe 'onAddToCart' como prop desde App.js
const CategoryDetailPage = ({ onAddToCart }) => {
    
    // 4. Lee el nombre de la categoría de la URL (ej: "Sushi")
    const { name } = useParams(); 

    // 5. Obtiene solo los productos de esa categoría
    const products = getProductsByCategory(name);

    // 6. Manejo de error si la categoría no existe o no tiene productos
    if (!products || products.length === 0) {
        return (
            <div className="container text-center my-5">
                <h2>No se encontraron productos en la categoría "{name}".</h2>
                <Link to="/categories" className="btn btn-primary mt-3">
                    Volver a Categorías
                </Link>
            </div>
        );
    }

    // 7. Si todo está bien, muestra la cuadrícula de productos
    return (
        <section className="container my-5">
            <Link to="/categories" className="btn btn-outline-secondary mb-4">
                <FaArrowLeft className="me-2" />
                Volver a Categorías
            </Link>
            
            <h1 className="mb-4">Mostrando: {name}</h1>
            
            <div className="row">
                {products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product}
                        onAddToCart={onAddToCart} // ¡Pasamos la función del carrito!
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoryDetailPage;