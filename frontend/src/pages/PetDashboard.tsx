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
    const [searchTerm, setSearchTerm] = useState('');

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
                alert("No se pudo eliminar la mascota.");
            }
        }
    };

    const filteredPets = Array.isArray(pets) ? pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.owner?.name && pet.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* CABECERA UNIFICADA EN VERDE LIMA */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-summer-lime/20 rounded-2xl">
                        <span className="material-icons-round text-summer-lime text-2xl">auto_stories</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-summer-lime">Gestión de Mascotas</h2>
                        <p className="text-summer-brown/70 dark:text-summer-beige text-sm font-medium">Administra y registra los pacientes de la clínica</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* FORMULARIO DE REGISTRO - ESTILO SUMMER */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-summer-beige dark:border-zinc-800 shadow-sm sticky top-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-summer-brown dark:text-summer-beige mb-6 flex items-center gap-2">
                                <span className="material-icons-round text-xs">add_circle</span>
                                Nuevo Registro
                            </h3>
                            <form onSubmit={handleAddPet} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Nombre</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none text-summer-brown dark:text-bone transition-all"
                                        placeholder="Ej: Firulais"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Especie</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none text-summer-brown dark:text-bone transition-all"
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
                                    <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Dueño Responsable</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none text-summer-brown dark:text-bone transition-all"
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
                                    className="w-full bg-summer-lime hover:brightness-110 text-summer-brown font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                                >
                                    <span className="material-icons-round text-sm">add</span>
                                    {isSubmitting ? 'Registrando...' : 'Registrar Mascota'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* LISTADO DE MASCOTAS CON BUSCADOR */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-summer-beige dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-summer-beige dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-sm font-bold uppercase text-summer-brown dark:text-summer-beige">Pacientes Registrados</h3>
                                <div className="relative w-full md:w-64">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-summer-beige text-sm">search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre, dueño..."
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
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-summer-brown dark:text-summer-beige">Mascota</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-summer-brown dark:text-summer-beige">Dueño</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-summer-brown dark:text-summer-beige">Info</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase text-summer-brown dark:text-summer-beige text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-summer-beige/30 dark:divide-zinc-800">
                                        {filteredPets.map((pet) => (
                                            <tr key={pet._id} className="hover:bg-summer-cyan/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-summer-lime/10 flex items-center justify-center text-summer-lime">
                                                            <span className="material-icons-round text-xl">
                                                                {pet.species === 'Dog' ? 'pets' : pet.species === 'Cat' ? 'savings' : 'flutter_dash'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-summer-brown dark:text-bone">{pet.name}</span>
                                                            <span className="text-xs text-summer-brown/50 dark:text-summer-beige/50 italic">{pet.breed}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-summer-brown/80 dark:text-summer-beige">
                                                    {pet.owner?.name || 'S/D'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded-full bg-summer-cyan/10 text-summer-cyan text-xs font-bold">
                                                        {pet.age} años
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 transition-opacity">
                                                        <button
                                                            onClick={() => setSelectedPet({ id: pet._id, name: pet.name })}
                                                            className="p-2 text-summer-cyan hover:bg-summer-cyan/10 rounded-lg transition-colors"
                                                            title="Ver Historial"
                                                        >
                                                            <span className="material-icons-round text-lg">history</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingPet(pet)}
                                                            className="p-2 text-summer-brown hover:bg-summer-brown/10 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <span className="material-icons-round text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(pet._id)}
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
                                {filteredPets.length === 0 && !isLoading && (
                                    <div className="p-12 text-center text-summer-beige italic">
                                        No se encontraron mascotas registradas.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedPet && (
                <PetHistoryModal
                    petId={selectedPet.id}
                    petName={selectedPet.name}
                    onClose={() => setSelectedPet(null)}
                />
            )}
            {editingPet && (
                <EditPetModal
                    pet={editingPet}
                    onClose={() => setEditingPet(null)}
                    onUpdate={fetchPets}
                />
            )}
        </DashboardLayout>
    );
};

export default PetDashboard;
