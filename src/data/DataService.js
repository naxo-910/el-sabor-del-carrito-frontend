// src/data/DataService.js (Simulación de CRUD y Data Mock)

// ¡Datos base de los productos actualizados a tu nuevo inventario!
// Rutas de imagen verificadas según tu última confirmación.
let products = [
    {
        id: 1,
        name: "Empanada Camarón Queso",
        price: 2000, // Precio confirmado
        stock: 50,
        category: "Empanadas",
        imageUrl: "/images/empadas/camaronqueso/camaronqueso.jpg", // Ruta Verificada
        isOffer: true, // Marcado como oferta según tu descripción
        description: "Deliciosa masa rellena de camarones salteados y abundante queso derretido."
    },
    {
        id: 2,
        name: "Empanada Pino Casera",
        price: 1300, // Precio confirmado
        stock: 60,
        category: "Empanadas",
        imageUrl: "/images/empadas/de pino/de pino.jpg", // RUTA VERIFICADA (sin guion bajo)
        isOffer: false,
        description: "La auténtica empanada chilena de pino con carne picada, cebolla, huevo y aceituna."
    },
    {
        id: 3,
        name: "Hand Roll", // Nombre actualizado
        price: 3000, // Precio confirmado
        stock: 40,
        category: "Sushi",
        imageUrl: "/images/sushi/hand-roll.jpg", // Ruta Verificada
        isOffer: false,
        description: "Alga nori, arroz, pollo, palta y queso crema." // Descripción actualizada
    },
    {
        id: 4,
        name: "Empanada Jamón Queso",
        price: 1200, // Precio confirmado
        stock: 75,
        category: "Empanadas",
        imageUrl: "/images/empadas/jamonqueso/jamonqueso.jpg", // Ruta Verificada
        isOffer: true, // Marcado como oferta según tu descripción
        description: "La clásica de jamón y queso, perfecta para un snack."
    },
    {
        id: 5,
        name: "Bebida Express (Lata)", // Nombre actualizado
        price: 1000, // Precio confirmado
        stock: 100,
        category: "Bebidas",
        imageUrl: "/images/bebidas/bebidas.jpg", // Ruta Verificada
        isOffer: false,
        description: "Bebida en lata (350cc), elige tu sabor favorito."
    },
    {
        id: 6,
        name: "Bolitas Crispy (Sushi)", // Nombre actualizado
        price: 500, // Precio confirmado (UNITARIO)
        stock: 30,
        category: "Sushi",
        imageUrl: "/images/sushi/bolitaskryspy.jpg", // Ruta Verificada
        isOffer: false, // No marcado como oferta explícitamente, pero descripción la menciona
        description: "Bocados de arroz crujientes rellenos de pollo y queso. Oferta: 4x$2000."
    },
    {
        id: 7,
        name: "Empanada Solo Queso",
        price: 1000, // Precio confirmado
        stock: 80,
        category: "Empanadas",
        imageUrl: "/images/empadas/queso/queso.jpg", // Ruta Verificada
        isOffer: false,
        description: "La favorita para los amantes del queso. Cremosa y muy sabrosa."
    },
    // Productos adicionales
    {
        id: 8,
        name: "Empanada Napolitana",
        price: 1300,
        stock: 55,
        category: "Empanadas",
        imageUrl: "/images/empadas/napolitana/napolitana.jpg", // Debes tener esta imagen
        isOffer: false,
        description: "Queso, tomate y orégano. El sabor de una pizza en una empanada."
    },
     {
        id: 9,
        name: "Empanada Pollo Queso",
        price: 1300,
        stock: 65,
        category: "Empanadas",
        imageUrl: "/images/empadas/polloqueso/polloqueso.jpg", // Debes tener esta imagen
        isOffer: false,
        description: "La combinación ganadora: suave pollo desmenuzado con queso derretido."
    },
     {
        id: 10,
        name: "Sopaipillas",
        price: 350,
        stock: 120,
        category: "Frituras", // Nueva categoría
        imageUrl: "/images/sopaipillas/sopaipillas.jpg", // Debes tener esta imagen en /public/images/frituras/
        isOffer: true,
        description: "Unidad: $350. ¡Oferta: 3 por $1.000! Ideales para el invierno o la lluvia."
    },
     {
        id: 11,
        name: "Churros",
        price: 350,
        stock: 90,
        category: "Frituras", // Nueva categoría
        imageUrl: "/images/churros/churros.jpg", // Debes tener esta imagen en /public/images/frituras/
        isOffer: true,
        description: "Unidad: $350. ¡Oferta: 3 por $1.000! Crujientes y listos para bañar en salsa."
    },
];

// --- FUNCIONES DE LECTURA (READ) - ¡CON VERIFICACIÓN DE SEGURIDAD! ---
const safeProducts = () => Array.isArray(products) ? products : [];

export const getProducts = () => [...safeProducts()];

export const getProductById = (id) => safeProducts().find(p => p.id === parseInt(id));

export const getOfferProducts = () => safeProducts().filter(p => p.isOffer);

// ¡FUNCIÓN CRÍTICA CORREGIDA! Asegura que p.category exista antes de mapear.
export const getCategories = () => Array.from(new Set(safeProducts().map(p => p.category).filter(c => c)));

export const getProductsByCategory = (categoryName) =>
    safeProducts().filter(p => p.category && p.category.toLowerCase() === categoryName.toLowerCase());

// --- FUNCIONES CRUD (ADMIN) ---
export const addProduct = (newProduct) => {
    const id = safeProducts().length > 0 ? Math.max(...safeProducts().map(p => p.id)) + 1 : 1;
    const productWithId = { ...newProduct, id, stock: parseInt(newProduct.stock) || 0, price: parseFloat(newProduct.price) || 0 };
    products.push(productWithId);
    return productWithId;
};
export const updateProduct = (updatedProduct) => {
    const index = safeProducts().findIndex(p => p.id === parseInt(updatedProduct.id));
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct, stock: parseInt(updatedProduct.stock) || 0, price: parseFloat(updatedProduct.price) || 0 };
        return products[index];
    }
    return null;
};
export const deleteProduct = (id) => {
    const initialLength = safeProducts().length;
    products = safeProducts().filter(p => p.id !== parseInt(id));
    return products.length < initialLength;
};

export { products };