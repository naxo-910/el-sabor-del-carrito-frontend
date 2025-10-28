import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMapMarkerAlt, FaPlus, FaMinus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { Alert } from 'react-bootstrap';
import * as DataService from '../data/DataService'; 

// Función auxiliar para obtener el stock actual de un producto desde la fuente global
const getRealStock = (productId) => {
    const product = DataService.getProductById(productId);
    return product ? product.stock : 0;
};

// Formateador de moneda (para uniformidad)
const formatCLP = (amount) => {
    return amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
};


// --- Componente de Fila del Carrito (CON VERIFICACIÓN DE STOCK) ---
const CartItemRow = ({ item, updateQuantity, removeItem }) => {
    
    // Obtenemos el stock real del producto desde la fuente de datos
    const realStock = getRealStock(item.product.id); 
    const isOverStock = item.quantity > realStock;
    const canIncrease = item.quantity < realStock;
    const isAvailable = realStock > 0;
    
    // Clase para resaltar si la cantidad supera el stock
    const quantityClass = isOverStock ? 'fw-bold text-danger' : '';

    return (
        <li key={item.product.id} className={`list-group-item d-flex justify-content-between lh-sm align-items-center ${isOverStock ? 'border-danger border-3' : ''}`}>
            <div>
                <h6 className="my-0">{item.product.name}</h6>
                <small className="text-muted d-flex align-items-center">
                    Cantidad:
                    {/* Botón para restar */}
                    <button
                        className="btn btn-sm btn-outline-secondary ms-2 me-1 py-0 px-2"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1} 
                    >
                        <FaMinus size={10} />
                    </button>
                    <span className={quantityClass}>{item.quantity}</span>
                    {/* Botón para sumar - Deshabilitado si ya alcanzó el stock real */}
                    <button
                        className="btn btn-sm btn-outline-secondary ms-1 me-2 py-0 px-2"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={!canIncrease} // Deshabilitado si ya alcanzó el stock real
                    >
                        <FaPlus size={10} />
                    </button>
                    {!isAvailable && <span className="text-danger small">(Agotado)</span>}
                    {isOverStock && <span className="ms-2 text-danger small"><FaExclamationTriangle /> ¡Excede Stock!</span>}
                </small>
            </div>
            <div className="d-flex align-items-center">
                <span className="text-muted me-3">
                    {formatCLP(item.product.price * item.quantity)}
                </span>
                {/* Botón para eliminar */}
                <button
                    className="btn btn-sm btn-outline-danger py-0 px-2"
                    onClick={() => removeItem(item.product.id)}
                    title="Eliminar del carrito"
                >
                    <FaTrash size={12} />
                </button>
            </div>
        </li>
    );
};

// --- Componente CheckoutPage ---
const CheckoutPage = ({ cart, total, onCheckoutComplete, updateQuantity, removeItem, user }) => {
    const navigate = useNavigate();

    // Estado para el manejo de errores no fatales (reemplaza alert())
    const [errorMessage, setErrorMessage] = useState('');
    const [showStockAlert, setShowStockAlert] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: user?.name || '',
        email: user?.email || '',
        direccion: '',
        comuna: '',
        tarjeta: '',
        cvv: ''
    });

    // Validación del formulario (usa useMemo para recalcular solo cuando cambia formData o cart)
    const isFormValid = formData.nombre && formData.email && formData.direccion && formData.comuna && /^\d{16}$/.test(formData.tarjeta) && /^\d{3}$/.test(formData.cvv);
    
    // Chequeo de stock general (para deshabilitar el botón de pago)
    const hasStockIssues = cart.some(item => item.quantity > getRealStock(item.product.id) || getRealStock(item.product.id) === 0);

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        if (cart.length === 0) {
            setErrorMessage("El carrito está vacío. Agrega productos para continuar.");
            setTimeout(() => navigate('/products'), 2000);
            return;
        }

        if (hasStockIssues) {
            setErrorMessage('Hay productos en el carrito que exceden el stock disponible. Por favor, ajusta las cantidades.');
            return;
        }
        
        if (!isFormValid) {
            setErrorMessage('Por favor, completa correctamente todos los campos obligatorios.');
            return;
        }

        // --- Simulación de Lógica de Pago (RF-03) ---
        const paymentSuccessful = Math.random() < 0.8; // 80% de éxito

        // Generar un número de orden simulado para las páginas de éxito/error
        const orderNumber = Math.floor(Math.random() * 90000000) + 10000000;
        
        // Guardar la información de la orden para las páginas de confirmación (uso de localStorage temporalmente)
        const orderSummary = { 
            orderNumber, 
            cart, 
            total, 
            formData 
        };
        localStorage.setItem('lastOrderSummary', JSON.stringify(orderSummary));
        
        if (paymentSuccessful) {
            onCheckoutComplete(); // Vacía el carrito en App.js
            navigate(`/success?order=${orderNumber}`);
        } else {
            navigate(`/error?order=${orderNumber}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4">Finalizar Compra</h1>

            {/* Alerta de Error (Reemplaza alert()) */}
            {errorMessage && (
                <Alert variant="danger" className="text-center">
                    <FaExclamationTriangle className="me-2" />
                    {errorMessage}
                </Alert>
            )}

            {cart.length === 0 && !errorMessage ? (
                 <div className="alert alert-warning text-center">
                    Tu carrito está vacío. <a href="/products">Agrega productos</a> para continuar.
                 </div>
            ) : (
                <div className="row">
                    {/* Carrito de Compra (Columna Derecha en móviles, Izquierda en PC) */}
                    <div className="col-lg-5 order-lg-2 mb-4">
                        <div className="card shadow-sm p-4 bg-light">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-primary">Tu Carrito</span>
                                <span className="badge bg-primary rounded-pill">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {cart.map(item => (
                                    <CartItemRow 
                                        key={item.product.id} 
                                        item={item} 
                                        updateQuantity={updateQuantity} 
                                        removeItem={removeItem} 
                                    />
                                ))}
                                <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                                    <span>Total a Pagar (CLP)</span>
                                    <strong>{formatCLP(total)}</strong>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Formulario de Checkout (Columna Izquierda en móviles, Derecha en PC) */}
                    <div className="col-lg-7 order-lg-1">
                        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
                            
                            {/* Información de Envío */}
                            <h4 className="mb-3 border-bottom pb-2"><FaMapMarkerAlt className="me-2" /> Información de Envío</h4>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="col-md-7">
                                    <label htmlFor="direccion" className="form-label">Dirección</label>
                                    <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
                                </div>
                                <div className="col-md-5">
                                    <label htmlFor="comuna" className="form-label">Comuna</label>
                                    <select className="form-select" id="comuna" name="comuna" value={formData.comuna} onChange={handleChange} required>
                                        <option value="">Selecciona...</option>
                                        <option>Santiago</option>
                                        <option>Viña del Mar</option>
                                        <option>Valparaíso</option>
                                        <option>Cerrillos</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="my-4" />

                            {/* Información de Pago */}
                            <h4 className="mb-3 border-bottom pb-2"><FaCreditCard className="me-2" /> Pago Simulado</h4>
                            <div className="row g-3 mb-4">
                                <div className="col-md-7">
                                    <label htmlFor="tarjeta" className="form-label">Número de Tarjeta (16 dígitos)</label>
                                    <input type="text" className="form-control" id="tarjeta" name="tarjeta" value={formData.tarjeta} onChange={handleChange} required maxLength="16" pattern="\d{16}" title="Debe ingresar 16 dígitos numéricos"/>
                                </div>
                                <div className="col-md-5">
                                    <label htmlFor="cvv" className="form-label">CVV (3 dígitos)</label>
                                    <input type="text" className="form-control" id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} required maxLength="3" pattern="\d{3}" title="Debe ingresar 3 dígitos numéricos"/>
                                </div>
                            </div>

                            <button 
                                className="w-100 btn btn-warning btn-lg" 
                                type="submit" 
                                disabled={!isFormValid || hasStockIssues}
                            >
                                Pagar {formatCLP(total)}
                            </button>
                            {hasStockIssues && (
                                <small className="text-danger mt-2 d-block text-center fw-bold">
                                    Ajusta las cantidades para poder pagar (hay ítems sin stock o excedidos).
                                </small>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
