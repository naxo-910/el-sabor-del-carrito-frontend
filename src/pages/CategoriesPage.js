// src/pages/CategoriesPage.js (VERSIÓN FINAL Y 100% FUNCIONAL)
import React from 'react';
import { Link } from 'react-router-dom';
import { FaLayerGroup, FaArrowRight } from 'react-icons/fa';
import * as DataService from '../data/DataService'; 
import { Row, Col } from 'react-bootstrap'; // Importamos Bootstrap para las columnas

// Eliminamos importaciones de componentes de tarjeta para evitar conflictos
const CategoriesPage = () => {
    
    // Obtenemos las categorías directamente del DataService
    const categories = DataService.getCategories();

    if (!categories || categories.length === 0) {
        return (
            <div className="container my-5 text-center">
                <h2 className="text-primary">No hay categorías disponibles.</h2>
            </div>
        );
    }

    return (
        <section className="container my-5">
            <h1 className="mb-4">
                Explora por Categoría <FaLayerGroup className="ms-2" />
            </h1>
            
            {/* Usamos Row y Col de Bootstrap */}
            <Row> 
                {categories.map(categoryName => (
                    // La tarjeta (el div) se renderiza directamente aquí
                    <Col key={categoryName} lg={4} md={6} className="mb-4">
                        <div className="card h-100 shadow-sm text-center p-4">
                            <h5 className="card-title fs-4">{categoryName}</h5>
                            <p className="card-text text-muted">
                                Ver todos los productos en esta categoría.
                            </p>
                            <Link 
                                to={`/category/${categoryName}`} 
                                className="btn btn-primary mt-auto"
                            >
                                <FaArrowRight className="me-1" /> Ir a Productos
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default CategoriesPage;