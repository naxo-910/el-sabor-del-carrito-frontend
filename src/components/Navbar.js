// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHome, FaTag, FaList, FaUserShield } from 'react-icons/fa';

// El componente recibe el array de items del carrito, el objeto de usuario y las funciones
const Navbar = ({ cartItems, user, handleLoginModal, onLogout }) => {
    // Calcula la cantidad total de artículos en el carrito
    // Verificación para asegurar que cartItems es un array antes de usar reduce
    const cartCount = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container">
                {/* 1. LOGO DE LA TIENDA - Ruta verificada */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        // RUTA CORREGIDA: /images/logo/logo-principal.jpg
                        src="/images/logo/logo-principal.jpg"
                        alt="Logo El Sabor del Carrito"
                        style={{ height: '40px', marginRight: '10px', borderRadius: '5px' }}
                        // Fallback por si la imagen no carga
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/ff7a00/fff?text=SC"; }}
                    />
                     <span className="text-warning fw-bold">El Sabor del Carrito</span>
                </Link>

                {/* Botón Toggler para móvil */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Enlaces de Navegación */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/"><FaHome className="me-1" /> Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/products"><FaList className="me-1" /> Productos</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/categories">Categorías</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/offers"><FaTag className="me-1" /> Ofertas</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>

                        {/* Enlace Admin (condicional) */}
                        {user && user.isAdmin && (
                            <li className="nav-item">
                                <Link className="nav-link text-info" to="/admin">
                                    <FaUserShield className="me-1" /> Panel Admin
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Sección Derecha: Usuario y Carrito */}
                <div className="d-flex align-items-center">
                    {/* Login / Logout */}
                    {user ? (
                        <>
                            <span className="navbar-text me-3 text-white fw-medium">
                                Bienvenido, {user.name || 'Usuario'}
                            </span>
                            <button className="btn btn-outline-danger me-3" onClick={onLogout}>
                                <FaUser /> Logout
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-outline-light me-3" onClick={handleLoginModal}>
                            <FaUser /> Login
                        </button>
                    )}

                    {/* Carrito */}
                    <Link to="/checkout" className="btn btn-warning position-relative">
                        <FaShoppingCart />
                        {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

