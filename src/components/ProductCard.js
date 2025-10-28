// src/components/ProductCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
// 1. Importar 'Link' para la navegación
import { Link } from 'react-router-dom';

/**
 * Componente que muestra la tarjeta de un producto.
 * @param {object} props
 * @param {object} props.product - El objeto producto a mostrar.
 * @param {function} props.onAddToCart - Función para añadir el producto al carrito.
 */
const ProductCard = ({ product, onAddToCart }) => {

    // Formateo del precio a moneda local (Chile: CLP)
    const formattedPrice = product.price.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    });

    // 2. Ruta de detalle corregida a PLURAL
    const detailUrl = `/products/${product.id}`;

    return (
        <Card className="shadow-lg border-0 h-100 d-flex flex-column transition duration-300 hover:scale-[1.02] hover:shadow-xl rounded-xl">
            
            {/* 3. Imagen envuelta en Link (con la ruta corregida) */}
            <Link to={detailUrl}>
                <Card.Img 
                    variant="top" 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="rounded-t-xl object-cover h-48 w-full"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/600x400/CCCCCC/333333?text=Sin+Imagen"; 
                    }}
                />
            </Link>
            
            <Card.Body className="d-flex flex-column p-3">
                
                {/* 4. Título envuelto en Link (con la ruta corregida) */}
                <Card.Title className="text-xl font-bold mb-1 text-gray-800">
                    <Link to={detailUrl} className="text-dark text-decoration-none">
                        {product.name}
                    </Link>
                </Card.Title>
                
                {product.isOffer && (
                    <span className="badge bg-danger text-uppercase mb-2 self-start">Oferta!</span>
                )}
                
                {/* Descripción y Categoría */}
                <Card.Text className="text-sm text-gray-600 flex-grow-1">
                    <small className="text-muted">{product.category}</small>
                    <div className="mt-1 line-clamp-2">{product.description}</div>
                </Card.Text>

                {/* Precio */}
                <h5 className="my-2 font-extrabold text-2xl text-primary-500">{formattedPrice}</h5>
                
                {/* Botones de Acción */}
                <div className="d-grid gap-2 mt-2">
                    <Button 
                        variant="primary" 
                        onClick={() => onAddToCart(product, 1)}
                        className="btn-block rounded-lg shadow-md font-semibold"
                        disabled={product.stock === 0} // Añadido: Deshabilitar si no hay stock
                    >
                        {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                    </Button>
                    
                    {/* 5. Botón 'Ver Detalle' usa 'Link' (con la ruta corregida) */}
                    <Button 
                        as={Link} 
                        to={detailUrl}
                        variant="outline-secondary" 
                        className="btn-block rounded-lg"
                    >
                        Ver Detalle
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;