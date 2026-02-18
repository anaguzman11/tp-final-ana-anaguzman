import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import PetHistoryModal from '../components/PetHistoryModal';
import EditPetModal from '../components/EditPetModal';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    owner: { _id: string, name: string };
}

interface Owner {
    _id: string;
    name: string;
}

const PetDashboard = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('Dog');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState<number>(0);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [owners, setOwners] = useState<Owner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState<{ id: string, name: string } | null>(null);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPets = async () => {
        setIsLoading(true);
        try {
            const [petsRes, ownersRes] = await Promise.all([
                api.get('/pets/my'),
                api.get('/auth/clients')
            ]);
            setPets(petsRes.data);
            setOwners(ownersRes.data);
        } catch (error) {
            console.error("Error al traer datos", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPets(); }, []);

    const handleAddPet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await api.post('/pets/register', {
                name,
                species,
                breed: breed || 'Desconocida',
                age,
                owner: selectedOwner
            });
            setName('');
            setBreed('');
            setAge(0);
            setSelectedOwner('');
            fetchPets();
        } catch (error) {
            alert("Error al agregar mascota");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Seguro que quieres borrar a esta mascota?")) {
            try {
                await api.delete(`/pets/${id}`);
                fetchPets();
            } catch (error) {
                alert("No se pudo eliminar: " + (error as any).response?.data?.error || "Error desconocido");
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brandTeal/10 dark:bg-brandGreen/10 rounded-2xl">
                        <span className="material-icons-round text-brandTeal dark:text-brandGreen text-2xl">auto_stories</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#2C5F5D] dark:text-white">Gestión de Mascotas</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">Administra y registra los pacientes de la clínica</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-brandCream-dark dark:border-slate-800 shadow-sm sticky top-8">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                                <span className="material-icons-round text-xs">add_circle</span>
                                Nuevo Registro
                            </h3>
                            <form onSubmit={handleAddPet} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Nombre</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white"
                                        placeholder="Ej: Firulais"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Especie</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none text-slate-900 dark:text-white"
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
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Raza</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white"
                                        placeholder="Ej: Labrador"
                                        value={breed}
                                        onChange={(e) => setBreed(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Dueño Responsable</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                                        value={selectedOwner}
                                        onChange={(e) => setSelectedOwner(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar Dueño...</option>
                                        {owners.map(owner => (
                                            <option key={owner._id} value={owner._id}>{owner.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    {isSubmitting ? (
                                        <span className="material-icons-round animate-spin text-sm">sync</span>
                                    ) : (
                                        <span className="material-icons-round text-sm">save</span>
                                    )}
                                    Guardar Mascota
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brandCream-dark dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-brandCream-dark dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Listado de Mascotas</h3>
                                <span className="px-3 py-1 bg-brandTeal/10 text-brandTeal text-xs font-bold rounded-full">
                                    {pets.length} Registros
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mascota</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Especie / Raza</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Acciones</th>
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
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
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
                                                                onClick={() => setSelectedPet({ id: pet._id, name: pet.name })}
                                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                                title="Historia Clínica"
                                                            >
                                                                <span className="material-icons-round text-sm">history_edu</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingPet(pet)}
                                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
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
            {editingPet && (
                <EditPetModal
                    pet={editingPet}
                    onClose={() => setEditingPet(null)}
                    onUpdate={fetchPets}
                />
            )}
            {selectedPet && (
                <PetHistoryModal
                    petId={selectedPet.id}
                    petName={selectedPet.name}
                    onClose={() => setSelectedPet(null)}
                />
            )}
        </DashboardLayout>
    );
};

export default PetDashboard;

