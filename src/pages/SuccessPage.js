// src/pages/SuccessPage.js
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (
        <div className="container text-center my-5">
            <FaCheckCircle size={100} className="text-success mb-4" />
            <h1 className="display-4 text-success">¡Compra Exitosa!</h1>
            <p className="lead">Tu pedido ha sido procesado y el carrito ha sido vaciado (RF-06 cumplido).</p>
            <Link to="/" className="btn btn-primary btn-lg">Volver al Home</Link>
        </div>
    );
};

export default SuccessPage;