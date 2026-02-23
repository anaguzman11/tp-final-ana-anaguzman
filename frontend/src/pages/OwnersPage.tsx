import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import EditOwnerModal from '../components/EditOwnerModal';

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
    const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

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
            await api.post('/auth/register', {
                name,
                email,
                password: 'temporaryPassword123!',
                role: 'client',
                telephone
            });
            setName('');
            setEmail('');
            setTelephone('');
            alert('Dueño registrado exitosamente');
            fetchOwners();
        } catch (error) {
            alert("Error al registrar dueño");
        }
    };

    const handleDeleteOwner = async (id: string) => {
        if (window.confirm("¿Seguro que quieres borrar a este dueño? Esto también podría afectar el acceso si es un usuario.")) {
            try {
                await api.delete(`/auth/delete/${id}`);
                fetchOwners();
            } catch (error) {
                alert("No se pudo eliminar el dueño. Verifica tus permisos.");
            }
        }
    };

    const filteredOwners = Array.isArray(owners) ? owners.filter(owner =>
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.telephone && owner.telephone.includes(searchTerm))
    ) : [];

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* CABECERA: ICONO Y TÍTULO UNIFICADOS EN VERDE LIMA */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-summer-lime/20 rounded-2xl">
                        <span className="material-icons-round text-summer-lime text-2xl">person</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-summer-lime">
                            Gestión de Dueños
                        </h2>
                        <p className="text-summer-brown/70 dark:text-summer-beige text-sm font-medium">
                            Administra la información de contacto de los clientes
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUMNA IZQUIERDA: FORMULARIO DE REGISTRO */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-summer-beige dark:border-zinc-800 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-summer-brown dark:text-summer-beige mb-6 flex items-center gap-2">
                                <span className="material-icons-round text-xs">add_circle</span>
                                Nuevo Registro
                            </h3>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Nombre Completo</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                                        placeholder="Ej: Juan Pérez"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                                        placeholder="juan@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Teléfono</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                                        placeholder="+56 9..."
                                        value={telephone}
                                        onChange={(e) => setTelephone(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-summer-lime hover:brightness-110 text-summer-brown font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <span className="material-icons-round text-sm">add</span>
                                    Registrar Dueño
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: TABLA DE LISTADO */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-summer-beige dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-summer-beige dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-sm font-bold uppercase text-summer-brown dark:text-summer-beige">Listado de Dueños</h3>
                                <div className="relative w-full md:w-64">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-summer-beige text-sm">search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o mail..."
                                        className="w-full pl-9 pr-4 py-2 bg-summer-beige/5 dark:bg-zinc-800 border border-summer-beige rounded-xl text-sm focus:ring-2 focus:ring-summer-cyan/30 text-summer-brown dark:text-bone outline-none transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-summer-beige/10 dark:bg-zinc-800/50">
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-summer-brown dark:text-summer-beige">Dueño</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-summer-brown dark:text-summer-beige">Contacto</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-summer-brown dark:text-summer-beige text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-summer-beige/30 dark:divide-zinc-800">
                                        {filteredOwners.map((owner) => (
                                            <tr key={owner._id} className="hover:bg-summer-cyan/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-summer-cyan/20 flex items-center justify-center text-summer-cyan font-bold text-xs">
                                                            {owner.name.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-summer-brown dark:text-bone">{owner.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col text-sm">
                                                        <span className="text-summer-brown/80 dark:text-summer-beige">{owner.email}</span>
                                                        <span className="text-summer-brown/50 dark:text-summer-beige/50 italic">{owner.telephone || 'Sin teléfono'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 transition-opacity">
                                                        <button
                                                            onClick={() => setEditingOwner(owner)}
                                                            className="p-2 text-summer-cyan hover:bg-summer-cyan/10 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <span className="material-icons-round text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteOwner(owner._id)}
                                                            className="p-2 text-summer-orange hover:bg-summer-orange/10 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <span className="material-icons-round text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredOwners.length === 0 && !isLoading && (
                                    <div className="p-12 text-center text-summer-beige italic">
                                        No se encontraron resultados para "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editingOwner && (
                <EditOwnerModal
                    owner={editingOwner}
                    onClose={() => setEditingOwner(null)}
                    onUpdate={fetchOwners}
                />
            )}
        </DashboardLayout>
    );
};

export default OwnersPage;
