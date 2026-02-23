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
        <div className="bg-bone dark:bg-zinc-950 text-summer-brown dark:text-bone min-h-screen transition-colors duration-300">
            {/* BOTÓN DARK MODE */}
            <button
                className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-zinc-900 shadow-lg text-summer-brown dark:text-summer-beige hover:text-summer-lime transition-all z-50 border border-summer-beige dark:border-zinc-800"
                onClick={toggleDarkMode}
            >
                <span className="material-icons-outlined block dark:hidden text-xl">dark_mode</span>
                <span className="material-icons-outlined hidden dark:block text-xl">light_mode</span>
            </button>

            <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decorativo */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-summer-lime/10 dark:bg-summer-lime/5 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-summer-cyan/10 dark:bg-summer-cyan/5 rounded-full blur-[100px] -z-10"></div>

                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        {/* ICONO EN VERDE LIMA */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-summer-lime/20 rounded-3xl mb-4 shadow-sm">
                            <span className="material-icons-round text-summer-lime text-5xl">person_add</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-summer-lime mb-2">Patitas Felices</h1>
                        <p className="text-summer-brown/60 dark:text-summer-beige/60 font-medium">Únete a nuestra comunidad veterinaria</p>
                    </div>

                    {/* CARD DE REGISTRO */}
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-summer-beige/50 dark:border-zinc-800">
                        <h2 className="text-xl font-bold mb-8 text-center text-summer-brown dark:text-summer-beige uppercase tracking-widest">Crear Cuenta</h2>

                        <form className="space-y-5" onSubmit={handleRegister}>
                            {/* CAMPO NOMBRE */}
                            <div>
                                <label className="block text-sm font-bold mb-2 ml-1 text-summer-brown dark:text-summer-beige">Nombre Completo</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-4 top-3 text-summer-beige text-sm">person</span>
                                    <input
                                        className="w-full pl-11 pr-4 py-3 bg-summer-beige/5 dark:bg-zinc-800 border border-summer-beige/50 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-summer-lime/30 focus:border-summer-lime transition-all outline-none text-summer-brown dark:text-bone placeholder:text-summer-beige/60"
                                        placeholder="Tu nombre completo"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* CAMPO EMAIL */}
                            <div>
                                <label className="block text-sm font-bold mb-2 ml-1 text-summer-brown dark:text-summer-beige">Email</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-4 top-3 text-summer-beige text-sm">alternate_email</span>
                                    <input
                                        className="w-full pl-11 pr-4 py-3 bg-summer-beige/5 dark:bg-zinc-800 border border-summer-beige/50 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-summer-lime/30 focus:border-summer-lime transition-all outline-none text-summer-brown dark:text-bone placeholder:text-summer-beige/60"
                                        placeholder="ejemplo@correo.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* CAMPO CONTRASEÑA */}
                            <div>
                                <label className="block text-sm font-bold mb-2 ml-1 text-summer-brown dark:text-summer-beige">Contraseña</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-4 top-3 text-summer-beige text-sm">lock</span>
                                    <input
                                        className="w-full pl-11 pr-12 py-3 bg-summer-beige/5 dark:bg-zinc-800 border border-summer-beige/50 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-summer-lime/30 focus:border-summer-lime transition-all outline-none text-summer-brown dark:text-bone placeholder:text-summer-beige/60"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-3 text-summer-beige hover:text-summer-brown dark:hover:text-bone transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-icons-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* BOTÓN REGISTRAR EN VERDE LIMA */}
                            <button
                                className="w-full bg-summer-lime hover:brightness-110 text-summer-brown font-bold py-4 px-4 rounded-2xl shadow-lg shadow-summer-lime/20 transition-all flex items-center justify-center gap-2 mt-4"
                                type="submit"
                            >
                                <span className="font-bold">REGISTRARME</span>
                                <span className="material-icons-round text-lg">how_to_reg</span>
                            </button>
                        </form>

                        {/* LINK AL LOGIN */}
                        <div className="mt-10 pt-6 border-t border-summer-beige/30 dark:border-zinc-800 text-center">
                            <p className="text-sm text-summer-brown/60 dark:text-summer-beige/60">
                                ¿Ya tienes cuenta? <Link className="text-summer-cyan font-bold hover:underline ml-1" to="/">Inicia sesión aquí</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
