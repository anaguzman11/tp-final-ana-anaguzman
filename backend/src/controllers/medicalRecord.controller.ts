import { Request, Response } from 'express';
import MedicalRecord from '../models/medicalRecord.model';
import Pet from '../models/pet.model';
import { JwtPayload } from '../types/auth';

export const createMedicalRecord = async (req: Request, res: Response) => {
    try {
        const { petId, reason, description } = req.body;
        const user = (req as any).user as JwtPayload;

        // Verificar que la mascota existe y pertenece al usuario (o el usuario es admin/veterinario)
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        // Seguridad básica: solo el dueño o un admin/veterinario puede añadir registros
        if (pet.owner.toString() !== user.id && user.role === 'client') {
            return res.status(403).json({ error: "No tienes permiso para añadir registros a esta mascota" });
        }

        const newRecord = new MedicalRecord({
            pet: petId,
            reason,
            description,
            veterinarian: user.id
        });

        const savedRecord = await newRecord.save();
        return res.status(201).json(savedRecord);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el registro médico" });
    }
};

export const getMedicalRecordsByPet = async (req: Request, res: Response) => {
    try {
        const { petId } = req.params;
        const user = (req as any).user as JwtPayload;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        // Solo el dueño, veterinarios o admins pueden ver la historia clínica
        if (pet.owner.toString() !== user.id && user.role === 'client') {
            return res.status(403).json({ error: "No tienes permiso para ver la historia de esta mascota" });
        }

        const records = await MedicalRecord.find({ pet: petId }).sort({ date: -1 }).populate('veterinarian', 'name');
        return res.json(records);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener la historia clínica" });
    }
};

export const getAllMedicalRecords = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as JwtPayload;

        // Solo veterinarios o admins pueden ver todos los registros
        if (user.role === 'client') {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const records = await MedicalRecord.find()
            .sort({ date: -1 })
            .limit(20)
            .populate('pet', 'name')
            .populate('veterinarian', 'name');

        return res.json(records);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener los registros" });
    }
};
