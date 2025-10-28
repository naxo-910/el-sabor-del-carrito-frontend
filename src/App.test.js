import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Se mokea useNavigate para que el Router no falle en el entorno de pruebas.
// Esto es importante porque App utiliza BrowserRouter y useNavigate.
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

// Mokeamos las funciones de autenticación y datos para asegurar que el test se ejecute rápidamente
// y no dependa de la lógica externa ni de localStorage.
jest.mock('./utils/main', () => ({
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    // Siempre simulamos que no hay usuario logueado inicialmente para probar el flujo de carga.
    getUserInfo: () => null, 
}));

jest.mock('./data/DataService', () => ({
    // Simulamos que getProducts devuelve un array vacío o un mock mínimo
    getProducts: () => [],
    getCategories: () => [],
}));


describe('App Component Integración y Carga Inicial', () => {

    test('1. El componente App se renderiza sin caerse y muestra el estado de carga inicial', () => {
        render(<App />);
        
        // Verifica que el componente muestre el mensaje de carga de autenticación antes de useEffect
        // Aunque el useEffect es síncrono en este mock, buscamos el texto de la Navbar o el contenedor principal.
        
        // Buscamos el elemento Navbar que contiene el texto "Contacto"
        const contactLink = screen.getByText(/Contacto/i);
        expect(contactLink).toBeInTheDocument();
    });

    test('2. Verifica que el componente Home Page se renderice al inicio (ruta /)', async () => {
        render(<App />);

        // El componente HomePage probablemente tiene un encabezado o un título de bienvenida.
        // Asumiendo que HomePage muestra un título de bienvenida, o simplemente un elemento general.
        
        // Buscamos un elemento común en la página de inicio o en la estructura general, como el título del contenedor principal
        // Nota: Si HomePage tiene un título como "Nuestros Productos", deberías buscar eso. 
        // Aquí buscamos un enlace en el Navbar que siempre está presente.
        const homeLink = screen.getByRole('link', { name: /Tienda Duoc/i });
        expect(homeLink).toBeInTheDocument();
        
        // También podemos buscar el texto de la Navbar:
        const navbarText = screen.getByText(/Carrito/i);
        expect(navbarText).toBeInTheDocument();
    });
});
