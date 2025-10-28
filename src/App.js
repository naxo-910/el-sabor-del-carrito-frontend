// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Importaciones de Estilos
import 'bootstrap/dist/css/bootstrap.min.css'; 

// LÓGICA DE NEGOCIO Y UTILIDADES
import * as DataService from './data/DataService'; // Ruta correcta
import { login, logout, register, getUserInfo } from './utils/main'; // Ruta correcta

// Importaciones de Componentes y Páginas
import Navbar from './components/Navbar'; // Ruta correcta
import AuthModal from './components/AuthModal'; // Ruta correcta

import HomePage from './pages/Home';
import ContactPage from './pages/Contact';
import ProductsPage from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import OffersPage from './pages/Offers';
import CategoriesPage from './pages/Categories';
import CategoryDetailPage from './pages/CategoryDetail';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';
import AdminPage from './pages/AdminPage';

// --- CAMBIO 1: Clave para guardar el carrito en localStorage ---
const CART_STORAGE_KEY = 'elSaborDelCarrito_cart';

// Componente Wrapper que contiene toda la lógica y rutas
function MainAppLogic() {
    // ESTADOS CENTRALIZADOS
    
    // --- CAMBIO 1 (Continuación): Cargar el carrito desde localStorage al iniciar ---
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (e) {
            console.error("Error al cargar el carrito desde localStorage, iniciando vacío.", e);
            return [];
        }
    });

    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const navigate = useNavigate();

    // Cargar productos y revisar sesión al inicio
    useEffect(() => {
        setProducts(DataService.getProducts());
        const userInfo = getUserInfo(); // Lee desde localStorage
        if (userInfo) {
            setUser(userInfo);
        }
        setAuthReady(true);
    }, []); // Se ejecuta solo una vez al montar

    // --- CAMBIO 2: Guardar el carrito en localStorage CADA VEZ que cambie ---
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]); // Se ejecuta cada vez que el estado 'cart' se modifica

    // CÁLCULOS
    const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    // LÓGICA DE CARRITO (Ahora persistirá automáticamente)
    const addToCart = (productToAdd, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === productToAdd.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { product: productToAdd, quantity: quantity }];
        });
    };

    const updateCartItemQuantity = (productId, newQuantity) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.product.id !== productId);
            } else {
                return prevCart.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }
        });
    };

    const removeCartItem = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };

    const handleCheckoutComplete = () => {
        setCart([]); // Esto disparará el 'useEffect' y guardará el carrito vacío
        navigate('/success');
    };

    const handleCartModal = () => {
        if (cart.length === 0) {
             console.log("Tu carrito está vacío.");
             navigate('/checkout'); 
        } else {
            navigate('/checkout');
        }
    };

    // LÓGICA DE AUTENTICACIÓN
    const handleLogin = (username, password) => {
        const loggedInUser = login(username, password); 
        setUser(loggedInUser);
        setShowAuthModal(false);
        if (loggedInUser && loggedInUser.isAdmin) {
            navigate('/admin');
        } else if (loggedInUser) {
            navigate('/');
        }
        return loggedInUser;
    };

    const handleLogout = () => {
        logout(); 
        setUser(null);
        navigate('/');
    };

    const handleRegister = (newUserData) => {
        const registeredUser = register(newUserData); 
        setUser(registeredUser);
        setShowAuthModal(false);
        if (registeredUser) {
            navigate('/');
        }
        return registeredUser;
    };

    const handleProductsChange = () => {
        setProducts(DataService.getProducts());
    };

    if (!authReady) {
        return <div className="vh-100 d-flex justify-content-center align-items-center"><h2>Cargando...</h2></div>;
    }

    return (
        <div className="App">
            <Navbar
                cartItems={cart}
                user={user}
                onLogout={handleLogout}
                handleLoginModal={() => setShowAuthModal(true)}
                handleCartModal={handleCartModal}
            />

            <main className="container my-4" style={{ minHeight: '80vh' }}>
                <Routes>
                    {/* Rutas Base */}
                    <Route path="/" element={<HomePage products={products} addToCart={addToCart} />} />
                    <Route path="/contacto" element={<ContactPage />} />

                    {/* Rutas de Productos y Navegación */}
                    <Route path="/products" element={<ProductsPage onAddToCart={addToCart} products={products} />} />
                    <Route path="/products/:id" element={<ProductDetailPage onAddToCart={addToCart} />} />
                    <Route path="/offers" element={<OffersPage onAddToCart={addToCart} products={products} />} />
                    <Route 
                        path="/categories" 
                        element={<CategoriesPage 
                            getCategories={DataService.getCategories} 
                            products={products} 
                        />} 
                    />
                    <Route path="/category/:name" element={<CategoryDetailPage onAddToCart={addToCart} />} />

                    {/* Rutas de Checkout */}
                    <Route
                        path="/checkout"
                        element={
                            <CheckoutPage
                                cart={cart}
                                total={cartTotal}
                                onCheckoutComplete={handleCheckoutComplete}
                                updateQuantity={updateCartItemQuantity} 
                                removeItem={removeCartItem}            
                            />
                        }
                    />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/error" element={<ErrorPage />} />

                    {/* Ruta de Administración */}
                    {user && user.isAdmin ? (
                        <Route path="/admin" element={<AdminPage
                            products={products}
                            getCategories={DataService.getCategories}
                            user={user}
                            onProductsChange={handleProductsChange} 
                        />} />
                    ) : (
                        <Route path="/admin" element={<ErrorPage message="Acceso Denegado. Solo para Administradores." />} />
                    )}

                    {/* Manejo de Rutas No Encontradas */}
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </main>

            {/* Modal de Autenticación */}
            <AuthModal
                show={showAuthModal}
                handleClose={() => setShowAuthModal(false)}
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
        </div>
    );
}

// El componente App solo renderiza el Router y el MainAppLogic dentro
function App() {
    return (
        <Router>
            <MainAppLogic />
        </Router>
    )
}

export default App;