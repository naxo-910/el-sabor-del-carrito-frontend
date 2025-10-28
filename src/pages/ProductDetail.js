import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import * as DataService from '../data/DataService'; 
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

/**
 * Componente de página que muestra el detalle de un solo producto.
 * Implementa la selección de cantidad y chequeo de stock.
 */
const ProductDetailPage = ({ onAddToCart }) => {
    
    // Carga síncrona de datos al inicio
    const { id } = useParams();
    const product = DataService.getProductById(id); 
    
    // --- HOOKS: Deben ir primero, SIEMPRE ---
    // 1. Estado para la cantidad a añadir (esencial para el carrito)
    const [quantity, setQuantity] = useState(1);

    // 2. Formatear precio (usa useMemo para eficiencia)
    // Se llama antes de la redirección
    const formattedPrice = useMemo(() => {
        // Protección adicional dentro del useMemo en caso de que product sea null/undefined
        if (!product || typeof product.price !== 'number') return 'Precio no disponible';
        
        return product.price.toLocaleString('es-CL', { 
            style: 'currency', 
            currency: 'CLP',
            minimumFractionDigits: 0 // Formato chileno sin decimales
        });
    }, [product ? product.price : null]); // Depende de product.price solo si product existe
    
    // --- VERIFICACIÓN DE SEGURIDAD Y REDIRECCIÓN ---
    if (!product) {
        // Redirige si el producto no existe o el ID es inválido
        return <Navigate to="/products" replace />; 
    }
    
    // Variables y cálculos
    const isAvailable = product.stock > 0;
    const maxQuantity = product.stock;

    // --- FUNCIÓN CORREGIDA: Incluye la cantidad en el onAddToCart ---
    const handleAddToCart = () => {
        // Chequeos de stock, disponibilidad y cantidad válida (mayor a 0 y menor que el stock)
        if (isAvailable && quantity > 0 && quantity <= maxQuantity) {
            onAddToCart(product, quantity); // <-- Pasa la cantidad
            setQuantity(1); // Reiniciar la cantidad después de añadir
        }
    };
    
    // --- Manejo del cambio de cantidad en el input ---
    const handleQuantityChange = (e) => {
        const val = parseInt(e.target.value);
        if (val >= 1 && val <= maxQuantity) {
            setQuantity(val);
        } else if (val === 0) {
             setQuantity(1); // No permitir 0
        }
    };


    return (
        <div className="container my-5">
            
            {/* Botón para volver a la categoría (navegación lógica) */}
            <Link to={`/category/${product.category}`} className="btn btn-outline-secondary btn-sm mb-4">
                <FaArrowLeft className="me-2" /> Volver a {product.category}
            </Link>
            
            <div className="row g-0 border rounded shadow-lg">
                {/* Columna de la Imagen */}
                <div className="col-md-6 mb-md-0">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="img-fluid rounded-start-lg w-100" 
                        style={{ height: '450px', objectFit: 'cover' }}
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = "https://placehold.co/600x450/CCCCCC/333333?text=Sin+Imagen"; 
                        }}
                    />
                </div>
                
                {/* Columna de la Información */}
                <div className="col-md-6 p-4 d-flex flex-column justify-content-between">
                    <div>
                        <h6 className="text-muted text-uppercase">{product.category}</h6>
                        <h1 className="display-4 fw-bold">{product.name}</h1>
                        
                        {product.isOffer && (
                            <span className="badge bg-danger text-uppercase mb-3 fs-6">¡Oferta!</span>
                        )}

                        {/* Badge de Stock */}
                        <span className={`badge fs-6 bg-${isAvailable ? 'success' : 'danger'} mb-3 ms-2`}>
                            {isAvailable ? `En Stock: ${product.stock}` : 'Agotado'}
                        </span>
                        
                        <h2 className="text-primary mt-3 mb-4 fw-bolder">{formattedPrice}</h2>
                        
                        {/* Descripción */}
                        <p className="lead border-start border-3 border-secondary ps-3">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-4 pt-3 border-top">
                        {/* Control de cantidad */}
                        <Form className="d-flex align-items-center mb-3">
                            <Form.Group as={Row} className="me-3 mb-0 align-items-center" controlId="formQuantity">
                                <Form.Label column sm="4" className="fw-semibold text-nowrap">Cantidad:</Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max={maxQuantity}
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        disabled={!isAvailable}
                                        style={{ width: '80px' }}
                                    />
                                </Col>
                            </Form.Group>
                        </Form>

                        {/* Botón de Añadir al Carrito con chequeos robustos */}
                        <Button 
                            className="btn btn-lg btn-warning mt-3 w-100 shadow-sm" 
                            onClick={handleAddToCart}
                            disabled={!isAvailable || quantity > maxQuantity || quantity < 1}
                        >
                            <FaShoppingCart className="me-2" /> 
                            {isAvailable ? 'Añadir al Carrito' : 'Agotado'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
