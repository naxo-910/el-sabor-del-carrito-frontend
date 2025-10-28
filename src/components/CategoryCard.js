import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Componente que muestra una tarjeta individual de categoría.
 * Recibe el nombre de la categoría y la URL de la imagen principal.
 */
const CategoryCard = ({ categoryName, imageUrl }) => {
    
    // Ruta a la página de detalle de la categoría
    const detailUrl = `/category/${categoryName}`;

    // Estilo para asegurar que el texto se lea sobre la imagen
    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fondo oscuro semitransparente
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        transition: 'background-color 0.3s'
    };
    
    // Placeholder para la imagen
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/600x400/333333/FFFFFF?text=Sin+Imagen";
    };

    return (
        <div className="category-card-container">
            <Link to={detailUrl} className="text-decoration-none">
                <Card className="text-white text-center border-0 shadow-lg rounded-xl overflow-hidden cursor-pointer transition duration-300 hover:scale-[1.03] hover:shadow-2xl">
                    <div style={{ position: 'relative' }}>
                        
                        {/* Imagen de Fondo */}
                        <Card.Img
                            variant="top"
                            src={imageUrl}
                            alt={`Categoría ${categoryName}`}
                            onError={handleImageError}
                            className="object-cover w-full h-64 md:h-80 transition duration-300 transform hover:brightness-110"
                            style={{ height: '300px' }}
                        />
                        
                        {/* Overlay Oscuro con Título (asegura legibilidad) */}
                        <div style={overlayStyle}>
                            <Card.Title className="text-3xl font-extrabold text-white uppercase tracking-wider z-20 p-2 transform transition duration-300 hover:scale-105">
                                {categoryName}
                            </Card.Title>
                        </div>
                    </div>
                </Card>
            </Link>
        </div>
    );
};

export default CategoryCard;
