// src/components/CategoryCard.js
import React from 'react';
import { Link } from 'react-router-dom';

// Recibe el nombre y la URL de la imagen como props
const CategoryCard = ({ categoryName, imageUrl }) => {
    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm text-center">
                
                {/* 1. La imagen es un enlace a la categoría */}
                <Link to={`/category/${categoryName}`} className="text-decoration-none">
                    <img 
                        src={imageUrl} 
                        className="card-img-top" 
                        alt={`Categoría ${categoryName}`}
                        // Estilo para que todas las imágenes se vean uniformes
                        style={{ height: '200px', objectFit: 'cover' }} 
                    />
                </Link>
                
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                        {/* 2. El título también es un enlace */}
                        <Link to={`/category/${categoryName}`} className="text-dark text-decoration-none">
                            {categoryName}
                        </Link>
                    </h5>
                    {/* Esta etiqueta <p> es válida porque solo contiene texto */}
                    <p className="card-text text-muted">
                        Ver todos los productos en esta categoría.
                    </p>
                    
                    {/* 3. Botón al fondo (mt-auto empuja el botón abajo) */}
                    <Link 
                        to={`/category/${categoryName}`} 
                        className="btn btn-primary mt-auto"
                    >
                        Ver Productos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;