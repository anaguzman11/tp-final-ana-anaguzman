import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

interface MedicalRecord {
    _id: string;
    date: string;
    reason: string;
    description: string;
    pet: { name: string };
    veterinarian: { name: string };
}

interface Pet {
    _id: string;
    name: string;
    owner: { name: string };
}

const MedicalHistoryPage = () => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [recordsRes, petsRes] = await Promise.all([
                api.get('/medical-records/all'),
                api.get('/pets/my')
            ]);
            setRecords(recordsRes.data);
            setPets(petsRes.data);
        } catch (error) {
            console.error("Error al traer historial", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/medical-records', { petId: selectedPet, reason, description });
            setSelectedPet('');
            setReason('');
            setDescription('');
            alert('Entrada clínica guardada');
            fetchData();
        } catch (error) {
            alert("Error al guardar entrada");
        }
    };

    const filteredRecords = Array.isArray(records) ? records.filter(record =>
        (record.pet?.name && record.pet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        record.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.veterinarian?.name && record.veterinarian.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* CABECERA UNIFICADA */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-summer-lime/20 rounded-2xl">
                        <span className="material-icons-round text-summer-lime text-2xl">history_edu</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-summer-lime">Historial Clínico</h2>
                        <p className="text-summer-brown/70 dark:text-summer-beige text-sm font-medium">Registro centralizado de atenciones y diagnósticos</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* FORMULARIO DE NUEVA ENTRADA - FONDO IGUAL AL ASIDE */}
                    <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-summer-beige mb-6 flex items-center gap-2">
                            <span className="material-icons-round text-xs">add_circle</span>
                            Nueva Entrada Clínica
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-beige">Mascota</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-bone"
                                    value={selectedPet}
                                    onChange={(e) => setSelectedPet(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar Mascota...</option>
                                    {pets.map(pet => (
                                        <option key={pet._id} value={pet._id}>{pet.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-beige">Motivo de Visita</label>
                                <input
                                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-bone placeholder:text-zinc-500"
                                    placeholder="Ej: Control, Vacuna, etc."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-1.5 ml-1 text-summer-beige">Observaciones y Tratamiento</label>
                                <textarea
                                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-bone resize-none placeholder:text-zinc-500"
                                    rows={3}
                                    placeholder="Detalle el diagnóstico..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" className="bg-summer-lime text-summer-brown px-8 py-3 rounded-xl font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-2">
                                    <span className="material-icons-round text-sm">save</span>
                                    Guardar Entrada
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* TABLA DE REGISTROS CON FONDO IGUAL AL ASIDE */}
                    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-sm font-bold uppercase text-summer-beige">Listado de Atenciones</h3>
                            <div className="relative w-full md:w-64">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por mascota o motivo..."
                                    className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-summer-cyan/30 text-bone outline-none transition-all placeholder:text-zinc-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-zinc-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-summer-beige">Mascota</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-summer-beige">Motivo</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-summer-beige">Veterinario</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-summer-beige">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {filteredRecords.map((record) => (
                                        <tr key={record._id} className="hover:bg-summer-cyan/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-bone">{record.pet?.name || 'Mascota eliminada'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-summer-beige">{record.reason}</span>
                                                    <span className="text-xs text-zinc-400 line-clamp-1 italic">{record.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-summer-cyan">{record.veterinarian?.name || 'Staff'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-zinc-500">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredRecords.length === 0 && !isLoading && (
                                <div className="p-12 text-center text-zinc-600 italic">
                                    No se encontraron registros clínicos.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MedicalHistoryPage;
