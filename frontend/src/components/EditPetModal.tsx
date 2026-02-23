import React, { useState } from 'react';
import api from '../api/axios';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    owner: string | { _id: string, name: string };
}

interface EditPetModalProps {
    pet: Pet;
    onClose: () => void;
    onUpdate: () => void;
}

const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose, onUpdate }) => {
    const [name, setName] = useState(pet.name);
    const [species, setSpecies] = useState(pet.species);
    const [breed, setBreed] = useState(pet.breed);
    const [age, setAge] = useState(pet.age);
    const [selectedOwner, setSelectedOwner] = useState(pet.owner && typeof pet.owner === 'object' ? pet.owner._id : pet.owner || '');
    const [owners, setOwners] = useState<{ _id: string, name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await api.get('/auth/clients');
                setOwners(response.data);
            } catch (err) {
                console.error("Error al cargar dueños en modal", err);
            }
        };
        fetchOwners();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/pets/${pet._id}`, { name, species, breed, age, owner: selectedOwner });
            onUpdate();
            onClose();
        } catch (error) {
            alert("Error al actualizar la mascota");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-summer-brown/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl border border-summer-beige dark:border-zinc-800 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-summer-beige dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-summer-lime/10 dark:bg-summer-lime/10 rounded-xl">
                            <span className="material-icons-round text-summer-lime">edit</span>
                        </div>
                        <h3 className="text-xl font-bold text-summer-brown dark:text-bone">Editar Mascota</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-summer-beige/10 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <span className="material-icons-round text-summer-beige">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Nombre</label>
                        <input
                            className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Especie</label>
                        <select
                            className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
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
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Raza</label>
                        <input
                            className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Edad</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-brown dark:text-summer-beige">Dueño Responsable</label>
                        <select
                            className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                            value={selectedOwner}
                            onChange={(e) => setSelectedOwner(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar Dueño...</option>
                            {owners.map(o => (
                                <option key={o._id} value={o._id}>{o.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-summer-lime hover:brightness-110 disabled:opacity-50 text-summer-brown font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <span className="material-icons-round animate-spin text-sm">sync</span>
                            ) : (
                                <span className="material-icons-round text-sm">save</span>
                            )}
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPetModal;
