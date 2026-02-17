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

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brandTeal/10 rounded-2xl">
                        <span className="material-icons-round text-brandTeal text-2xl">history_edu</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-brandTeal dark:text-white">Historial Clínico</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Registro centralizado de atenciones y diagnósticos</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">Nueva Entrada Clínica</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Mascota</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
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
                                <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Motivo de Visita</label>
                                <input
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                                    placeholder="Ej: Control, Vacuna, etc."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Observaciones y Tratamiento</label>
                                <textarea
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white resize-none"
                                    rows={3}
                                    placeholder="Detalle el diagnóstico..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                                    <span className="material-icons-round text-sm">save</span>
                                    Guardar Entrada
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brandCream-dark dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-brandCream-dark dark:border-slate-800">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Registros Recientes</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fecha</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mascota</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Motivo</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Diagnóstico</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">Cargando registros...</td></tr>
                                    ) : records.length === 0 ? (
                                        <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No hay registros recientes.</td></tr>
                                    ) : (
                                        records.map((record) => (
                                            <tr key={record._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-slate-500">{new Date(record.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-semibold">{record.pet?.name || 'Mascota eliminada'}</td>
                                                <td className="px-6 py-4 text-sm">{record.reason}</td>
                                                <td className="px-6 py-4 text-sm italic text-slate-500 dark:text-slate-400">{record.description}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MedicalHistoryPage;
