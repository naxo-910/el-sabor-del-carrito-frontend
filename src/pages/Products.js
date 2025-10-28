// src/pages/Products.js
import React from 'react';
import ProductCard from '../components/ProductCard'; 
// Ya no importamos 'getProducts' porque los recibimos como prop desde App.js

// 1. Recibimos 'products' (la lista) y 'onAddToCart' (la función)
const ProductsPage = ({ products, onAddToCart }) => {
    
    return (
        // 2. Usamos el contenedor estándar para consistencia
        <section className="container my-5">
            
            {/* 3. ¡Emoji corregido a empanada! */}
            <h1 className="mb-4">
                Todos Nuestros Productos <span role="img" aria-label="empanada">🥟</span>
            </h1>
            
            <div className="row">
                {
                    // 4. Usamos la lista 'products' que viene de las props
                    products && products.length > 0 ? (
                        products.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={onAddToCart}
                            />
                        ))
                    ) : (
                        // Mensaje por si no hay productos
                        <div className="col-12">
                            <p className="text-center text-muted">No hay productos para mostrar.</p>
                        </div>
                    )
                }
            </div>
        </section>
    );
};

export default ProductsPage;