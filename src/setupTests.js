// src/setupTests.js (VERSIÓN FINAL Y ESTABLE SIN jest.requireActual)

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// --- MOCK GLOBAL PARA REACT-ROUTER-DOM (SOLUCIÓN AL ERROR ENOENT) ---
// Mockeamos el módulo completo sin usar jest.requireActual para evitar conflictos
// con la resolución de módulos de Jest en este entorno.
jest.mock('react-router-dom', () => ({
    // Mock de los Hooks principales
    useNavigate: jest.fn(() => jest.fn()),
    useParams: jest.fn(() => ({ id: '1', name: 'testCategory' })), 
    useLocation: jest.fn(() => ({ pathname: '/test-path' })),
    // Mock de los Componentes principales (importantes para ProductCard.js)
    Link: ({ to, children }) => <a href={to}>{children}</a>,
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ children }) => <div>{children}</div>,
}));

// Mock del servicio de datos (importante para que las pruebas de ProductCard no fallen)
jest.mock('./data/DataService', () => ({
    // Simula las funciones de DataService con valores de retorno fijos
    getProducts: jest.fn(() => []),
    getProductById: jest.fn((id) => ({ 
        id: parseInt(id), 
        name: 'Mock Product', 
        price: 1000, 
        stock: 10,
        category: 'Mock Category' 
    })),
    // Mock de todas las funciones CRUD/Query para estabilidad
    getCategories: jest.fn(() => ['Mock Category']),
    getOfferProducts: jest.fn(() => []),
    getProductsByCategory: jest.fn(() => []),
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
}));
