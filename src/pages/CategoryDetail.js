import React, { useMemo } from 'react'; // Importamos useMemo para eficiencia
import { useParams, Link } from 'react-router-dom';
import * as DataService from '../data/DataService'; // Usamos el alias para consistencia
import ProductCard from '../components/ProductCard'; 
import { FaArrowLeft } from 'react-icons/fa';

/**
 * Componente de página que muestra todos los productos de una categoría específica.
 * Recibe 'onAddToCart' (función de App.js) para añadir productos al carrito.
 */
const CategoryDetailPage = ({ onAddToCart }) => {
    
    // Obtener el parámetro 'name' de la URL (ej: /category/Empanadas)
    const { name } = useParams(); 
    
    // Aseguramos que el nombre de la categoría sea legible y correcto
    const categoryName = name ? decodeURIComponent(name.replace(/%20/g, ' ')) : 'Sin Categoría';
    
    // Usamos useMemo para filtrar productos solo cuando la categoría cambie
    const products = useMemo(() => {
        if (!name) return [];
        // Llama a la función del DataService para obtener los productos filtrados
        return DataService.getProductsByCategory(categoryName);
    }, [categoryName]);

    // Renderizado condicional si no se encuentran productos
    if (!products || products.length === 0) {
        return (
            <div className="container text-center my-5 py-5">
                <h1 className="display-5 mb-4">Categoría: {categoryName}</h1>
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">Lo sentimos</h4>
                    No se encontraron productos disponibles en la categoría **"{categoryName}"**.
                </div>
                <Link to="/categories" className="btn btn-primary mt-3">
                    <FaArrowLeft className="me-2" /> Volver a Categorías
                </Link>
            </div>
        );
    }

    // Renderizado principal
    return (
        <section className="container my-5">
            <Link to="/categories" className="btn btn-outline-secondary mb-4">
                <FaArrowLeft className="me-2" />
                Volver a Categorías
            </Link>
            
            <h1 className="mb-4 display-5 fw-bold text-gray-800 border-bottom pb-2">
                Mostrando: {categoryName}
                <small className="text-muted fs-6 ms-3">({products.length} Productos)</small>
            </h1>
            
            <div className="row g-4">
                {products.map(product => (
                    // Aseguramos que el layout use las columnas de Bootstrap
                    <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        {/* El componente ProductCard ya tiene la protección interna para 'null' */}
                        <ProductCard 
                            product={product}
                            onAddToCart={onAddToCart}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryDetailPage;
