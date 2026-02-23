import { Request, Response } from 'express';
import Pet from '../models/pet.model';

// Listar todas las mascotas  
export const getAllPets = async (req: Request, res: Response) => {
  try {

    const pets = await Pet.find({}).populate('owner', 'name email');

    return res.json(pets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la lista completa de mascotas' });
  }
};
