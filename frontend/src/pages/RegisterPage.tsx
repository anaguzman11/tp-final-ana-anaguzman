import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
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

    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    React.useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="bg-brandCream dark:bg-slate-950 text-secondary dark:text-slate-100 min-h-screen transition-colors duration-300">
            <button
                className="fixed top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-900 shadow-lg text-slate-600 dark:text-slate-400 hover:text-primary transition-all z-50 border border-brandCream-dark dark:border-slate-800"
                onClick={toggleDarkMode}
            >
                <span className="material-icons-outlined block dark:hidden">dark_mode</span>
                <span className="material-icons-outlined hidden dark:block">light_mode</span>
            </button>

            <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/5 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 dark:bg-accent/5 rounded-full blur-[100px] -z-10"></div>

                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-brandTeal/10 rounded-2xl mb-4">
                            <span className="material-icons-round text-brandTeal text-5xl">person_add</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-white mb-2">Patitas Felices</h1>
                        <p className="text-slate-500 dark:text-slate-400">Únete a nuestra comunidad veterinaria</p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-brandCream-dark dark:border-slate-800">
                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Nombre Completo</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400 text-sm">person</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
                                        placeholder="Tu nombre completo"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400 text-sm">alternate_email</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
                                        placeholder="ejemplo@correo.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Contraseña</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400 text-sm">lock</span>
                                    <input
                                        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
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

                            <button className="w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2" type="submit">
                                <span>Registrarme</span>
                                <span className="material-icons-round text-sm">how_to_reg</span>
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                ¿Ya tienes cuenta? <Link className="text-primary font-semibold hover:underline" to="/">Inicia sesión</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;



