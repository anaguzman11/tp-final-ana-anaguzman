import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // ✅ Enviamos todos los campos necesarios, incluido el role
            await api.post('/auth/register', {
                name,
                email,
                password,
                role: 'client'
            });
            alert('¡Cuenta creada! Ahora puedes loguearte.');
            navigate('/');
        } catch (error) {
            console.error("Error completo:", error);
            alert('Error al crear la cuenta. Revisa los datos.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>📝 Registro - Patitas Felices</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                /><br /><br />
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
                <button type="submit">Crear Cuenta</button>
            </form>
            <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
        </div>
    );
};

export default RegisterPage;


