// src/pages/ErrorPage.js
import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="container text-center my-5">
            <FaTimesCircle size={100} className="text-danger mb-4" />
            <h1 className="display-4 text-danger">Error en el Pago</h1>
            <p className="lead">Lo sentimos, hubo un problema al procesar tu pago simulado.</p>
            
            <Link to="/checkout" className="btn btn-warning btn-lg me-3">Intentar de Nuevo</Link>
            <Link to="/productos" className="btn btn-secondary btn-lg">Explorar Productos</Link>
        </div>
    );
};

export default ErrorPage;