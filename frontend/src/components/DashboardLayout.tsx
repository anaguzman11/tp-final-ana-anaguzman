import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const menuItems = [
        { name: 'Dueños', icon: 'person', path: '/owners' },
        { name: 'Mascotas', icon: 'pets', path: '/dashboard' },
        { name: 'Historial Clínico', icon: 'history_edu', path: '/medical-history' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-brandCream text-secondary'}`}>
            {/* Sidebar - Desktop */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-brandCream-dark dark:border-slate-800 z-30 hidden lg:block">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-secondary mb-10">
                        <span className="material-icons-round text-3xl">pets</span>
                        <h1 className="font-bold text-xl tracking-tight">Ayudando Patitas</h1>
                    </div>
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all group ${location.pathname === item.path
                                    ? 'bg-brandGreen text-secondary shadow-lg shadow-brandGreen/20 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-brandCream-dark dark:hover:bg-slate-800 hover:text-secondary'
                                    }`}
                            >
                                <span className="material-icons-round">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        className="flex items-center justify-between w-full px-4 py-3 bg-brandCream-dark dark:bg-slate-800 rounded-xl hover:opacity-80 transition-opacity text-secondary dark:text-white"
                        onClick={toggleDarkMode}
                    >
                        <span className="text-sm font-medium">Cambiar Tema</span>
                        <span className="material-icons-round text-xl dark:hidden text-slate-600">dark_mode</span>
                        <span className="material-icons-round text-xl hidden dark:block text-slate-400">light_mode</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-4 lg:p-8">
                {/* Header - Mobile */}
                <header className="flex items-center justify-between lg:hidden mb-8">
                    <div className="flex items-center gap-2 text-secondary">
                        <span className="material-icons-round text-2xl">pets</span>
                        <h1 className="font-bold text-lg">Ayudando Patitas</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white dark:bg-slate-900 border border-brandCream-dark dark:border-slate-800 rounded-full" onClick={toggleDarkMode}>
                            <span className="material-icons-round dark:hidden">dark_mode</span>
                            <span className="material-icons-round hidden dark:block">light_mode</span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" onClick={handleLogout}>
                            <span className="material-icons-round">logout</span>
                        </button>
                    </div>
                </header>

                {/* Desktop Top Header (optional but useful) */}
                <header className="hidden lg:flex items-center justify-end mb-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-500 transition-colors bg-white dark:bg-slate-900 border border-brandCream-dark dark:border-slate-800 rounded-xl shadow-sm"
                    >
                        <span className="material-icons-round">logout</span>
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </header>

                {children}
            </main>

            {/* Mobile Nav - Bottom */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 lg:hidden z-30">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-slate-400 hover:text-primary'
                            }`}
                    >
                        <span className="material-icons-round">{item.icon}</span>
                        <span className="text-[10px] font-semibold uppercase">{item.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default DashboardLayout;
