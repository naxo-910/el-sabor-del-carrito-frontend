// src/components/AuthModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

/**
 * Modal para iniciar sesión o registrarse.
 * @param {object} props
 * @param {boolean} props.show - Si el modal está visible.
 * @param {function} props.handleClose - Función para cerrar el modal.
 * @param {function} props.onLogin - Función para manejar el inicio de sesión.
 * @param {function} props.onRegister - Función para manejar el registro.
 */
const AuthModal = ({ show, handleClose, onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        let user;
        if (isLogin) {
            user = onLogin(username, password);
            if (!user) {
                setError('Usuario o contraseña incorrectos.');
                return;
            }
        } else {
            // Lógica simple de validación para registro
            if (!username || !password || !name) {
                setError('Todos los campos son obligatorios.');
                return;
            }
            user = onRegister({ username, password, name });
        }

        if (user) {
            handleClose();
            // Limpiar campos después de un éxito
            setUsername('');
            setPassword('');
            setName('');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(''); // Limpiar errores al cambiar de modo
    };

    // Resetea el estado al cerrar
    const handleModalClose = () => {
        handleClose();
        setIsLogin(true);
        setError('');
        setUsername('');
        setPassword('');
        setName('');
    };

    return (
        <Modal show={show} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isLogin ? 'Iniciar Sesión (RF-07)' : 'Registrarse'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: admin o user"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Contraseña: password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        {isLogin ? 'Ingresar' : 'Crear Cuenta'}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="link" onClick={toggleMode}>
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AuthModal;
