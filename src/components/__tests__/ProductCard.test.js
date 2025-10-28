// Archivo de Pruebas Unitarias para ProductCard.js (Usando Jest/React Testing Library)

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard'; 
import '@testing-library/jest-dom'; 

// Mock de producto con stock disponible
const mockProduct = {
    id: 1,
    name: 'Empanada Pino',
    price: 1300,
    stock: 5,
    category: 'Empanadas',
    imageUrl: '/images/test.jpg',
    isOffer: false,
    description: 'La auténtica empanada chilena.'
};

// Mock de producto agotado
const mockProductAgotado = {
    ...mockProduct,
    id: 2,
    name: 'Empanada Agotada',
    stock: 0,
};

// Mock de función para añadir al carrito
const mockOnAddToCart = jest.fn();

// NO USAMOS UN WRAPPER DE FUNCIÓN, renderizamos directamente el BrowserRouter
// Esto es más simple y aísla mejor los problemas.

describe('ProductCard Componente - RNF-10 (Pruebas de Componentes)', () => {

    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        mockOnAddToCart.mockClear();
    });

    // --- Prueba de Renderizado (Renderizado Correcto y Propiedades Recibidas) ---
    test('RF-10: Renderiza la información del producto correctamente', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
            </BrowserRouter>
        );

        // Verifica que el nombre y el precio se muestren
        expect(screen.getByText('Empanada Pino')).toBeInTheDocument();
        // Nota: Si el formato del precio en el render no es $1.300, esta prueba puede fallar.
        expect(screen.getByText('$1.300')).toBeInTheDocument(); 
        
        // Verifica que el enlace de detalle esté presente
        const detailLink = screen.getByRole('link', { name: /ver detalle/i });
        expect(detailLink).toBeInTheDocument();
        expect(detailLink).toHaveAttribute('href', '/products/1');
    });

    // --- Prueba de Eventos (Simulación de Clic) ---
    test('RF-10: Llama a onAddToCart cuando se hace clic en "Añadir al Carrito"', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
            </BrowserRouter>
        );

        // Simula el clic en el botón de añadir al carrito
        const addButton = screen.getByRole('button', { name: /añadir al carrito/i });
        fireEvent.click(addButton);

        // Verifica que la función onAddToCart haya sido llamada con el producto correcto
        expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
        expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, 1);
    });

    // --- Prueba de Renderizado Condicional (Stock) ---
    test('RF-10: Deshabilita el botón si el producto está agotado (stock 0)', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProductAgotado} onAddToCart={mockOnAddToCart} />
            </BrowserRouter>
        );

        // Verifica que el texto muestre "Agotado"
        expect(screen.getByText('Agotado')).toBeInTheDocument();
        
        // Verifica que el botón esté deshabilitado (RF-02)
        const addButton = screen.getByRole('button', { name: /agotado/i });
        expect(addButton).toBeDisabled();

        // Intenta hacer clic, verifica que la función NO se llama
        fireEvent.click(addButton);
        expect(mockOnAddToCart).not.toHaveBeenCalled();
    });
    
    // --- Prueba de Protección contra Fallos (Fiabilidad 3.3.3) ---
    test('RF-10: Renderiza nulo si no se proporciona un producto', () => {
        const { container } = render(
            <BrowserRouter>
                <ProductCard product={null} onAddToCart={mockOnAddToCart} />
            </BrowserRouter>
        );
        // Verifica que el componente no renderice nada si 'product' es null/undefined
        // Nota: Ya que el componente devuelve 'null', el container.firstChild será null.
        expect(container.firstChild).toBeNull();
    });
});
