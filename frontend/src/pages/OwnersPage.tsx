import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

interface Owner {
    _id: string;
    name: string;
    email: string;
    telephone?: string;
}

const OwnersPage = () => {
    const [owners, setOwners] = useState<Owner[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchOwners = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/auth/clients');
            setOwners(response.data);
        } catch (error) {
            console.error("Error al traer dueños", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchOwners(); }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password: 'temporaryPassword123!', role: 'client', telephone });
            setName('');
            setEmail('');
            setTelephone('');
            alert('Dueño registrado exitosamente');
            fetchOwners();
        } catch (error) {
            alert("Error al registrar dueño");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brandTeal/10 rounded-2xl">
                        <span className="material-icons-round text-brandTeal text-2xl">person</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-brandTeal dark:text-white">Gestión de Dueños</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Administra la información de contacto de los clientes</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                                <span className="material-icons-round text-xs">add_circle</span>
                                Nuevo Registro
                            </h3>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Nombre Completo</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                                        placeholder="Ej: Juan Pérez"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                                        placeholder="juan@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Teléfono</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                                        placeholder="+56 9..."
                                        value={telephone}
                                        onChange={(e) => setTelephone(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <span className="material-icons-round text-sm">add</span>
                                    Registrar Dueño
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brandCream-dark dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-brandCream-dark dark:border-slate-800">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Listado de Dueños</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nombre</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email / Teléfono</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {isLoading ? (
                                            <tr><td colSpan={2} className="px-6 py-10 text-center text-slate-400 italic">Cargando dueños...</td></tr>
                                        ) : owners.length === 0 ? (
                                            <tr><td colSpan={2} className="px-6 py-10 text-center text-slate-400 italic">No hay dueños registrados.</td></tr>
                                        ) : (
                                            owners.map((owner) => (
                                                <tr key={owner._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{owner.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm">
                                                            <div className="text-slate-900 dark:text-slate-100 font-medium">{owner.email}</div>
                                                            <div className="text-slate-500 dark:text-slate-400">{owner.telephone || 'Sin teléfono'}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnersPage;
