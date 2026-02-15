import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token); // Guardamos el token
            alert('¡Bienvenido a Patitas Felices!');
            navigate('/dashboard'); // Nos vamos a la pantalla principal
        } catch (error) {
            alert('Error: Credenciales incorrectas');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>🐾 Patitas Felices</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br /><br />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br /><br />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default LoginPage;
