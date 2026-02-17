import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            alert('¡Bienvenido a Ayudando Patitas!');
            navigate('/dashboard');
        } catch (error: any) {
            alert('Error: Credenciales incorrectas');
        }
    };

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
            <button
                className="fixed top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-900 shadow-lg text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-all z-50 border border-slate-200 dark:border-slate-800"
                onClick={toggleDarkMode}
            >
                <span className="material-icons-outlined block dark:hidden">dark_mode</span>
                <span className="material-icons-outlined hidden dark:block">light_mode</span>
            </button>

            <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 dark:bg-sky-900/10 rounded-full blur-[100px] -z-10"></div>

                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-2xl mb-4">
                            <span className="material-icons-round text-blue-500 text-5xl">pets</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Ayudando Patitas</h1>
                        <p className="text-slate-500 dark:text-slate-400">Plataforma de gestión veterinaria</p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-semibold mb-6 text-center">Iniciar Sesión</h2>
                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400 text-sm">alternate_email</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white"
                                        placeholder="ejemplo@correo.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
                                    <a className="text-xs text-blue-500 hover:underline" href="#">¿Olvidaste tu contraseña?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400 text-sm">lock</span>
                                    <input
                                        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-icons-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2" type="submit">
                                <span>Entrar</span>
                                <span className="material-icons-round text-sm">login</span>
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                ¿No tienes una cuenta? <Link className="text-blue-500 font-semibold hover:underline" to="/register">Crear cuenta</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;

