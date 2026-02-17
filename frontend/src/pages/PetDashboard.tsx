import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
}

const PetDashboard = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('Dog');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPets = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/pets/my');
            setPets(response.data);
        } catch (error) {
            console.error("Error al traer mascotas", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPets(); }, []);

    const handleAddPet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/pets/register', { name, species, breed: breed || 'Desconocida', age });
            setName('');
            setBreed('');
            setAge(0);
            fetchPets();
        } catch (error) {
            alert("Error al agregar mascota");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Seguro que quieres borrar a esta mascota?")) {
            try {
                await api.delete(`/pets/${id}`);
                fetchPets();
            } catch (error) {
                alert("No se pudo eliminar");
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <span className="material-icons-round text-blue-500 text-2xl">auto_stories</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Gestión de Mascotas</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Administra y registra los pacientes de la clínica</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
                                <span className="material-icons-round text-xs">add_circle</span>
                                Nuevo Registro
                            </h3>
                            <form onSubmit={handleAddPet} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Nombre</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="Ej: Firulais"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Especie</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
                                        value={species}
                                        onChange={(e) => setSpecies(e.target.value)}
                                    >
                                        <option value="Dog">Perro</option>
                                        <option value="Cat">Gato</option>
                                        <option value="Bird">Ave</option>
                                        <option value="Other">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Raza</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="Ej: Labrador"
                                        value={breed}
                                        onChange={(e) => setBreed(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <span className="material-icons-round text-sm">save</span>
                                    Guardar Mascota
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Listado de Mascotas</h3>
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-xs font-bold rounded-full">
                                    {pets.length} Registros
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Mascota</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Especie / Raza</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-10 text-center text-slate-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="material-icons-round animate-spin">sync</span>
                                                        <span>Cargando mascotas...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : pets.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">
                                                    No hay mascotas registradas aún.
                                                </td>
                                            </tr>
                                        ) : (
                                            pets.map((pet) => (
                                                <tr key={pet._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                                <span className="material-icons-round text-xl">pets</span>
                                                            </div>
                                                            <span className="font-semibold text-slate-700 dark:text-slate-200">{pet.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm">
                                                            <span className="text-slate-900 dark:text-slate-100 font-medium">{pet.species}</span>
                                                            <span className="text-slate-500 dark:text-slate-400 ml-2">({pet.breed})</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                                title="Editar"
                                                            >
                                                                <span className="material-icons-round text-sm">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(pet._id)}
                                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                                title="Eliminar"
                                                            >
                                                                <span className="material-icons-round text-sm">delete</span>
                                                            </button>
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

export default PetDashboard;

