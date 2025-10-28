// src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMapMarkerAlt, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import * as DataService from '../data/DataService'; // Importar el DataService

// Función auxiliar para obtener el stock actual de un producto desde la fuente global
const getRealStock = (productId) => {
    const product = DataService.getProductById(productId);
    return product ? product.stock : 0;
};


// --- Componente de Fila del Carrito (CON VERIFICACIÓN DE STOCK) ---
const CartItemRow = ({ item, updateQuantity, removeItem }) => {
    
    // Obtenemos el stock real del producto desde la fuente de datos
    const realStock = getRealStock(item.product.id); 
    const canIncrease = item.quantity < realStock;
    const isAvailable = realStock > 0;

    // Si el producto está agotado Y la cantidad actual es mayor que el stock real (0), 
    // deberíamos forzar una actualización a 0 (o dejarlo en el carrito, pero deshabilitado).
    // Para simplificar, deshabilitamos el botón de aumentar si el stock es 0.
    
    return (
        <li key={item.product.id} className="list-group-item d-flex justify-content-between lh-sm align-items-center">
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
                    {item.quantity}
                    {/* Botón para sumar - Deshabilitado si la cantidad actual iguala el stock real */}
                    <button
                        className="btn btn-sm btn-outline-secondary ms-1 me-2 py-0 px-2"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={!canIncrease} // Deshabilitado si ya alcanzó el stock real
                    >
                        <FaPlus size={10} />
                    </button>
                    {!isAvailable && <span className="text-danger small">(Agotado)</span>}
                </small>
            </div>
            <div className="d-flex align-items-center">
                <span className="text-muted me-3">
                    ${(item.product.price * item.quantity).toLocaleString('es-CL')}
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
const CheckoutPage = ({ cart, total, onCheckoutComplete, updateQuantity, removeItem }) => {
    const navigate = useNavigate();

    // Estado del formulario (simulamos datos de envío y pago)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
        comuna: '',
        tarjeta: '',
        cvv: ''
    });

    // Validaciones simples
    const isFormValid = formData.nombre && formData.email && formData.direccion && formData.comuna && /^\d{16}$/.test(formData.tarjeta) && /^\d{3}$/.test(formData.cvv);

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("El carrito está vacío.");
            navigate('/products');
            return;
        }
        
        // --- VERIFICACIÓN ADICIONAL DE STOCK ANTES DE PAGAR ---
        const outOfStockItems = cart.filter(item => item.quantity > getRealStock(item.product.id));

        if (outOfStockItems.length > 0) {
            alert(`No se puede completar la compra. El stock de ${outOfStockItems.map(i => i.product.name).join(', ')} ha cambiado y no está disponible en las cantidades solicitadas.`);
            // No hacemos nada, forzando al usuario a arreglar las cantidades en el checkout
            return;
        }
        
        // --- FIN DE VERIFICACIÓN ---

        if (isFormValid) {
            // 💡 Simulación de Lógica de Pago
            const paymentSuccessful = Math.random() < 0.8; // 80% de éxito

            if (paymentSuccessful) {
                onCheckoutComplete(); 
            } else {
                navigate('/error');
            }
        } else {
            alert('Por favor, completa correctamente todos los campos obligatorios del formulario (Tarjeta 16 dígitos, CVV 3 dígitos).');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container my-5">
            <h1 className="mb-4">Finalizar Compra</h1>

            {cart.length === 0 ? (
                <div className="alert alert-warning text-center">
                    Tu carrito está vacío. <a href="/products">Agrega productos</a> para continuar.
                </div>
            ) : (
                <div className="row">
                    {/* Carrito de Compra (Columna Izquierda) */}
                    <div className="col-lg-7 order-lg-2 mb-4">
                        <div className="card shadow-sm p-4 bg-light">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-primary">Tu Carrito</span>
                                <span className="badge bg-primary rounded-pill">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {/* Usa el componente CartItemRow con la lógica de stock */}
                                {cart.map(item => (
                                    <CartItemRow 
                                        key={item.product.id} 
                                        item={item} 
                                        updateQuantity={updateQuantity} 
                                        removeItem={removeItem} 
                                    />
                                ))}
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total (CLP)</span>
                                    <strong>${total.toLocaleString('es-CL')}</strong>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Formulario de Checkout (Columna Derecha) */}
                    <div className="col-lg-5 order-lg-1">
                        <form onSubmit={handleSubmit}>
                            {/* ... (Resto del formulario de envío y pago) ... */}
                            <h4 className="mb-3"><FaMapMarkerAlt className="me-2" /> Información de Envío</h4>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                                    <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="col-12">
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
                                        {/* Añadir más comunas según sea necesario */}
                                    </select>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <h4 className="mb-3"><FaCreditCard className="me-2" /> Pago Simulado</h4>
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

                            <button className="w-100 btn btn-warning btn-lg" type="submit" disabled={!isFormValid}>
                                Pagar ${total.toLocaleString('es-CL')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;