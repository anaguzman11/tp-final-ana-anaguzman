import { Request, Response } from 'express';
import HistorialClinico from '../models/historialClinico.model';
import Pet from '../models/pet.model';
import { JwtPayload } from '../types/auth';

export const createHistorialClinico = async (req: Request, res: Response) => {
    try {
        const { petId, reason, description } = req.body;
        const user = (req as any).user as JwtPayload;

        // Verificar que la mascota existe y pertenece al usuario (o el usuario es admin/veterinario)
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }


        const newRecord = new HistorialClinico({
            pet: petId,
            reason,
            description,
            veterinarian: user.id
        });

        const savedRecord = await newRecord.save();
        return res.status(201).json(savedRecord);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el historial clínico" });
    }
};

export const getHistorialClinicoByPet = async (req: Request, res: Response) => {
    try {
        const { petId } = req.params;
        const user = (req as any).user as JwtPayload;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        const records = await HistorialClinico.find({ pet: petId }).sort({ date: -1 }).populate('veterinarian', 'name');
        return res.json(records);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener la historia clínica" });
    }
};

export const getAllHistorialClinico = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as JwtPayload;

        // Solo veterinarios o admins pueden ver todos los registros
        {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        const records = await HistorialClinico.find()
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
