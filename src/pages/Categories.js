import React, { useMemo } from 'react'; // Importamos useMemo para optimización
import CategoryCard from '../components/CategoryCard';
import { FaLayerGroup } from 'react-icons/fa';

/**
 * Componente de página que explora por categorías.
 * Asume que 'products' contiene la lista completa de productos cargada.
 */
const CategoriesPage = ({ products }) => { // 1. Eliminamos getCategories, solo necesitamos products

    // 2. Usamos useMemo para generar la lista de categorías (solo se recalcula si 'products' cambia)
    const categories = useMemo(() => {
        if (!products || products.length === 0) {
            return [];
        }
        // Extrae todos los nombres de categoría y usa Set para obtener solo los únicos.
        const categoryNames = products.map(p => p.category).filter(Boolean); // Filtramos nulls/undefineds
        return [...new Set(categoryNames)];
    }, [products]); // Dependencia: solo si el array de productos cambia

    /**
     * Esta función busca el primer producto de la lista que coincida
     * con el nombre de la categoría y usa su imagen.
     */
    const getCategoryImage = (categoryName) => {
        // Buscar en la lista completa de productos que recibimos
        const firstProduct = products.find(p => p.category === categoryName);
        
        // Si encontramos un producto y tiene imagen, la usamos
        if (firstProduct && firstProduct.imageUrl) {
            return firstProduct.imageUrl;
        }
        
        // Placeholder por defecto si no hay imagen
        return '/images/placeholder.jpg'; 
    };

    // 3. Agregamos un estado de 'Cargando' si el array de productos es nulo/vacío
    if (!products) {
        return <div className="text-center py-5">Cargando datos...</div>;
    }

    return (
        <section className="container my-5">
            <h1 className="mb-4 display-6 fw-bold text-gray-800">
                Explora por Categoría <FaLayerGroup className="ms-2 text-primary" />
            </h1>
            
            <div className="row g-4"> {/* Usamos g-4 para un mejor espaciado */}
                {categories.length > 0 ? (
                    // Mapear cada nombre de categoría
                    categories.map(categoryName => {
                        
                        // Obtener la imagen dinámicamente
                        const imageUrl = getCategoryImage(categoryName);
                        
                        return (
                            <div key={categoryName} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <CategoryCard 
                                    categoryName={categoryName}
                                    imageUrl={imageUrl}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            <h4 className="alert-heading">Sin Categorías</h4>
                            <p className="mb-0">No se encontraron productos o categorías disponibles para mostrar.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoriesPage;
