// src/pages/Home.js
import React from 'react';
// Importamos los componentes de diseño de Bootstrap
import { Container, Row, Col, Button } from 'react-bootstrap';
// Importamos el componente para mostrar cada producto
import ProductCard from '../components/ProductCard'; 
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // Icono para el botón

// La página ahora recibe 'products' y 'addToCart' como props desde App.js
const HomePage = ({ products, addToCart }) => {
    
    // --- LÓGICA MEJORADA ---
    // Filtramos solo los productos marcados como 'isOffer'
    let featuredProducts = products.filter(p => p.isOffer);
    
    // Si no hay ofertas, mostramos los primeros 3 productos como destacados
    if (featuredProducts.length === 0) {
        featuredProducts = products.slice(0, 3); 
    }

    return (
        <Container className="my-5">
            {/* Banner de Bienvenida */}
            <div className="text-center mb-5 p-5 bg-light rounded-3 shadow-sm">
                <h1 className="display-4 fw-bold">¡Bienvenido a El Sabor del Carrito!</h1>
                
                {/* --- TEXTO CORREGIDO --- */}
                <p className="lead text-muted">
                    Explora nuestra <span className="fw-bold">variedad de productos</span> y lleva lo mejor a tu mesa.
                </p>
                
                <Link to="/products" className="btn btn-primary btn-lg mt-3">
                    Ver Todos los Productos <FaArrowRight className="ms-1" />
                </Link>
            </div>

            {/* Sección de Productos Destacados */}
            <h2 className="text-center mb-4">Nuestros Destacados</h2>
            <Row xs={1} md={2} lg={3} className="g-4 mb-5">
                {featuredProducts.length > 0 ? (
                    featuredProducts.map(product => (
                        <Col key={product.id}>
                            <ProductCard product={product} onAddToCart={addToCart} />
                        </Col>
                    ))
                ) : (
                    <Col><p className="text-center w-100">Cargando productos...</p></Col>
                )}
            </Row>

            {/* Banner de Ofertas */}
            <div className="text-center p-4 bg-danger text-white rounded-3 shadow">
                <h3>¡No te pierdas nuestras ofertas!</h3>
                <p>Productos seleccionados con descuentos increíbles por tiempo limitado.</p>
                <Link to="/offers" className="btn btn-light btn-lg mt-2">Ver Ofertas</Link>
            </div>
        </Container>
    );
};

export default HomePage;