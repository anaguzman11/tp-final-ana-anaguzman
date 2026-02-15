import { Request, Response } from 'express';
import Pet from '../models/pet.model'; // Importamos el modelo Pet

// Función para listar TODAS las mascotas (solo para veterinarios autorizados)
export const getAllPets = async (req: Request, res: Response) => {
  try {
    // El middleware 'authorize' ya verificó que el usuario es veterinario.
    // solo buscamos todos los registros de mascotas.
    // Usamos .populate('owner') para traer la info del dueño referenciado
    const pets = await Pet.find({}).populate('owner', 'name email'); 
    
    return res.json(pets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la lista completa de mascotas' });
  }
};
