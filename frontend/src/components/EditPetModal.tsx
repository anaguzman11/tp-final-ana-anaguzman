import React, { useState } from 'react';
import api from '../api/axios';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.put(`/pets/${pet._id}`, { name, species, breed, age });
            onUpdate();
            onClose();
        } catch (error) {
            alert("Error al actualizar la mascota");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-brandCream-dark dark:border-slate-800 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-brandCream-dark dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brandTeal/10 rounded-xl">
                            <span className="material-icons-round text-brandTeal">edit</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Editar Mascota</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <span className="material-icons-round text-slate-400">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Nombre</label>
                        <input
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Especie</label>
                        <select
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
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
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Edad</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                            min="0"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
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
