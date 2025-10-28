// src/pages/Categories.js
import React from 'react';
import CategoryCard from '../components/CategoryCard'; // 1. Importar el componente de tarjeta
import { FaLayerGroup } from 'react-icons/fa'; // (Usamos tu icono)

// 2. ¡IMPORTANTE! Recibir 'products' como prop (además de 'getCategories')
// Esto viene de App.js (como arreglamos en el paso anterior)
const CategoriesPage = ({ getCategories, products }) => {
    
    // 3. Obtener la lista de nombres de categorías (ej: ['Empanadas', 'Sushi', ...])
    const categories = getCategories();

    /**
     * 4. ¡ESTA ES LA SOLUCIÓN A LAS IMÁGENES ROTAS!
     * Esta función busca el primer producto de la lista que coincida
     * con el nombre de la categoría y usa su imagen.
     */
    const getCategoryImage = (categoryName) => {
        // Buscar en la lista completa de productos que recibimos de App.js
        const firstProduct = products.find(p => p.category === categoryName);
        
        // Si encontramos un producto y tiene imagen, la usamos
        if (firstProduct && firstProduct.imageUrl) {
            return firstProduct.imageUrl;
        }
        
        // Si la categoría está vacía o el producto no tiene imagen, usamos un placeholder
        // (Asegúrate de tener esta imagen en 'public/images/placeholder.jpg')
        return '/images/placeholder.jpg'; 
    };

    return (
        <section className="container my-5">
            <h1 className="mb-4">
                Explora por Categoría <FaLayerGroup className="ms-2" />
            </h1>
            
            {/* 5. Contenedor 'row' de Bootstrap para la cuadrícula */}
            <div className="row">
                {categories.length > 0 ? (
                    // 6. Mapear cada nombre de categoría
                    categories.map(categoryName => {
                        
                        // 7. Obtener la imagen dinámicamente usando nuestra nueva función
                        const imageUrl = getCategoryImage(categoryName);
                        
                        return (
                            <CategoryCard 
                                key={categoryName}
                                categoryName={categoryName}
                                imageUrl={imageUrl} // Pasar la imagen encontrada
                            />
                        );
                    })
                ) : (
                    <div className="col-12">
                        <p className="text-center text-muted">No se encontraron categorías.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoriesPage;