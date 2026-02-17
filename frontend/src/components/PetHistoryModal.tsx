import React, { useState, useEffect } from 'react';
import api from '../api/axios';

interface MedicalRecord {
    _id: string;
    date: string;
    reason: string;
    description: string;
    veterinarian?: {
        name: string;
    };
}

interface PetHistoryModalProps {
    petId: string;
    petName: string;
    onClose: () => void;
}

const PetHistoryModal: React.FC<PetHistoryModalProps> = ({ petId, petName, onClose }) => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [newReason, setNewReason] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/medical-records/pet/${petId}`);
            setRecords(response.data);
        } catch (error) {
            console.error("Error fetching medical records", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [petId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReason.trim() || !newDescription.trim()) return;

        setIsSubmitting(true);
        try {
            await api.post('/medical-records', { petId, reason: newReason, description: newDescription });
            setNewReason('');
            setNewDescription('');
            fetchRecords();
        } catch (error) {
            alert("Error al guardar el registro médico");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-brandCream-dark dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-brandCream-dark dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brandTeal/10 rounded-xl">
                            <span className="material-icons-round text-brandTeal">history_edu</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Historia Clínica</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{petName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <span className="material-icons-round text-slate-400">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Nuevo Registro Médico</label>
                        <input
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="Motivo de la visita (ej: Vacunación)"
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            required
                        />
                        <textarea
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none min-h-[100px] text-slate-900 dark:text-white"
                            placeholder="Describe el síntoma, diagnóstico o tratamiento..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary hover:opacity-90 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span className="material-icons-round animate-spin text-sm">sync</span>
                                ) : (
                                    <span className="material-icons-round text-sm">add</span>
                                )}
                                <span>Agregar Registro</span>
                            </button>
                        </div>
                    </form>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    {/* Timeline */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Historial</h4>
                        {isLoading ? (
                            <div className="py-10 text-center text-slate-400 animate-pulse">Cargando historial...</div>
                        ) : records.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 italic">No hay registros médicos previos.</div>
                        ) : (
                            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                {records.map((record) => (
                                    <div key={record._id} className="relative">
                                        <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-primary z-10"></div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{record.reason}</span>
                                                </div>
                                                {record.veterinarian && (
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <span className="material-icons-round text-[12px]">person</span>
                                                        {record.veterinarian.name}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {record.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetHistoryModal;
