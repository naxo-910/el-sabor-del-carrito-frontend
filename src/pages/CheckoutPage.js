// src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMapMarkerAlt, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

// Componente CheckoutPage que recibe el carrito, total y funciones de App.js
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

    // Validaciones simples (solo verifica que no estén vacíos y el formato básico)
    const isFormValid = formData.nombre && formData.email && formData.direccion && formData.comuna && /^\d{16}$/.test(formData.tarjeta) && /^\d{3}$/.test(formData.cvv);

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("El carrito está vacío.");
            navigate('/products'); // Cambiado a /products para coherencia
            return;
        }

        if (isFormValid) {
            // 💡 Simulación de Lógica de Pago
            const paymentSuccessful = Math.random() < 0.8; // 80% de éxito

            if (paymentSuccessful) {
                onCheckoutComplete(); // Llama a la función que vacía el carrito en App.js
                // navigate('/success') // La redirección ya se hace en App.js al vaciar el carrito
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
                                {cart.map(item => (
                                    <li key={item.product.id} className="list-group-item d-flex justify-content-between lh-sm align-items-center">
                                        <div>
                                            <h6 className="my-0">{item.product.name}</h6>
                                            <small className="text-muted d-flex align-items-center">
                                                Cantidad:
                                                {/* Botones para ajustar cantidad */}
                                                <button
                                                    className="btn btn-sm btn-outline-secondary ms-2 me-1 py-0 px-2"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1} // Deshabilita si es 1
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                {item.quantity}
                                                <button
                                                    className="btn btn-sm btn-outline-secondary ms-1 me-2 py-0 px-2"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
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
                            {/* Sección 1: Datos de Envío */}
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

                            {/* Sección 2: Pago Simulado */}
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

