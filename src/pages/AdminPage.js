// src/pages/AdminPage.js
import React, { useState } from 'react';
import { 
    getProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getCategories 
} from '../data/DataService'; 
import { FaEdit, FaTrash, FaPlus, FaSave } from 'react-icons/fa';

// Estado inicial para un nuevo producto
const initialFormState = {
    name: '',
    price: 0,
    stock: 0,
    category: getCategories()[0] || '',
    imageUrl: '',
    isOffer: false,
    description: ''
};

const AdminPage = () => {
    // Estado local para la lista de productos y el formulario
    const [products, setProducts] = useState(getProducts());
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    // Recargar los productos después de una operación
    const refreshProducts = () => setProducts(getProducts());

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            updateProduct(formData);
        } else {
            addProduct(formData);
        }
        
        // Limpiar formulario y refrescar lista
        setFormData(initialFormState);
        setIsEditing(false);
        refreshProducts();
    };

    const handleEdit = (product) => {
        setFormData(product);
        setIsEditing(true);
        window.scrollTo(0, 0); // Ir al formulario
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            deleteProduct(id);
            refreshProducts();
        }
    };
    
    // Categorías disponibles para el selector
    const categories = getCategories();

    return (
        <div className="container my-5">
            <h1 className="mb-4">Panel de Administración (CRUD C, U, D)</h1>
            
            {/* Formulario de CREAR / EDITAR */}
            <div className="card shadow mb-5 p-4 bg-light">
                <h2>{isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
                <form onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Descripción</label>
                            <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Precio ($)</label>
                            <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required min="100" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Stock</label>
                            <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Categoría</label>
                            <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-8">
                            <label className="form-label">URL de Imagen</label>
                            <input type="text" className="form-control" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 d-flex align-items-center">
                            <div className="form-check mt-3">
                                <input className="form-check-input" type="checkbox" id="isOffer" name="isOffer" checked={formData.isOffer} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="isOffer">
                                    Marcar como Oferta
                                </label>
                            </div>
                        </div>
                        <div className="col-12 mt-4">
                            <button type="submit" className={`btn btn-${isEditing ? 'success' : 'primary'} me-2`}>
                                <FaSave className="me-2" /> {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
                            </button>
                            {isEditing && (
                                <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData(initialFormState); }}>
                                    Cancelar Edición
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Tabla de Productos Existentes */}
            <h2 className="mt-5 mb-3">Lista de Productos ({products.length})</h2>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Oferta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>${p.price.toLocaleString('es-CL')}</td>
                            <td>{p.stock}</td>
                            <td>{p.category}</td>
                            <td>{p.isOffer ? 'Sí' : 'No'}</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(p)}>
                                    <FaEdit />
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;