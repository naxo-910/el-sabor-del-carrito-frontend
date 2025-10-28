import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // <-- Corregido a mayúscula para coincidir con App.js
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegura la importación de Bootstrap

// Si la aplicación fue creada con Create React App, esta es la estructura estándar.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// La llamada a reportWebVitals() ha sido eliminada para resolver el error de compilación.
