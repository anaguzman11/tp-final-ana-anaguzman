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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-summer-brown/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-summer-beige dark:border-zinc-800 flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-summer-beige dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-summer-lime/10 dark:bg-summer-lime/10 rounded-xl">
                            <span className="material-icons-round text-summer-lime">history_edu</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-summer-brown dark:text-bone">Historia Clínica</h3>
                            <p className="text-sm text-summer-brown/50 dark:text-summer-beige/50 font-medium">{petName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-summer-beige/10 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <span className="material-icons-round text-summer-beige">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="text-sm font-bold ml-1 text-summer-brown dark:text-summer-beige">Nuevo Registro Médico</label>
                        <input
                            className="w-full px-4 py-2.5 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all text-summer-brown dark:text-bone"
                            placeholder="Motivo de la visita (ej: Vacunación)"
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                            required
                        />
                        <textarea
                            className="w-full p-4 bg-summer-beige/10 dark:bg-zinc-800 border border-summer-beige/50 rounded-2xl focus:ring-2 focus:ring-summer-lime/30 outline-none transition-all resize-none min-h-[100px] text-summer-brown dark:text-bone"
                            placeholder="Describe el síntoma, diagnóstico o tratamiento..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-summer-lime hover:brightness-110 disabled:opacity-50 text-summer-brown px-6 py-2 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
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

                    <hr className="border-summer-beige/30 dark:border-zinc-800" />

                    {/* Timeline */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-summer-brown/40 dark:text-summer-beige/40">Historial</h4>
                        {isLoading ? (
                            <div className="py-10 text-center text-summer-beige animate-pulse">Cargando historial...</div>
                        ) : records.length === 0 ? (
                            <div className="py-10 text-center text-summer-beige italic">No hay registros médicos previos.</div>
                        ) : (
                            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-summer-beige/30 dark:before:bg-zinc-800">
                                {records.map((record) => (
                                    <div key={record._id} className="relative">
                                        <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-summer-cyan z-10"></div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-summer-cyan bg-summer-cyan/10 px-2 py-0.5 rounded-md">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs font-bold text-summer-brown dark:text-summer-beige">{record.reason}</span>
                                                </div>
                                                {record.veterinarian && (
                                                    <span className="text-[10px] text-summer-brown/40 dark:text-summer-beige/40 flex items-center gap-1 font-medium">
                                                        <span className="material-icons-round text-[12px]">person</span>
                                                        {record.veterinarian.name}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-summer-brown/70 dark:text-summer-beige leading-relaxed text-sm">
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
