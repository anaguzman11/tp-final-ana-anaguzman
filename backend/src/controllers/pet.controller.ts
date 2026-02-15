import { Request, Response } from 'express';
import Pet from '../models/pet.model';
import { validationResult } from 'express-validator';
import { JwtPayload } from '../types/auth';

// Función para registrar una nueva mascota (solo para usuarios logeados)
export const createPet = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = (req as any).user as JwtPayload;
    const ownerId = user.id;

    const { name, species, breed, age } = req.body;

    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      owner: ownerId,
    });

    const savedPet = await newPet.save();
    return res.status(201).json(savedPet);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al registrar la mascota' });
  }
};

// Función para listar las mascotas de un usuario específico
export const getMyPets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as JwtPayload;
    const ownerId = user.id;

    // Busca todas las mascotas, y **popula** los campos 'name' y 'email' del dueño
    const pets = await Pet.find({ owner: ownerId }).populate('owner', 'name email');
    return res.json(pets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las mascotas' });
  }
};

// Función para obtener los detalles de una mascota específica por su ID
export const getPetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as JwtPayload; // Obtenemos el usuario del token
    const ownerId = user.id;

    // ✅ Solución: Usamos findOne para buscar por _id Y ownerId
    const pet = await Pet.findOne({ _id: id, owner: ownerId }).populate('owner', 'name email');

    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada o no te pertenece" });
    }
    return res.json(pet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la mascota por ID' });
  }
};

// FUNCIÓN PARA ACTUALIZAR UNA MASCOTA (Solo si es el dueño)
export const updatePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Obtenemos el ID del usuario del token (gracias al middleware authenticate)
    const user = (req as any).user as JwtPayload;
    const ownerId = user.id;

    // Buscamos por ID de mascota Y por ID de dueño para asegurar la propiedad
    const updatedPet = await Pet.findOneAndUpdate(
      { _id: id, owner: ownerId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ error: "Mascota no encontrada o no tienes permiso para editarla" });
    }

    return res.json({
      message: "Mascota actualizada correctamente",
      pet: updatedPet
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar la mascota" });
  }
};

// FUNCIÓN PARA ELIMINAR UNA MASCOTA (Solo si es el dueño)
export const deletePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as JwtPayload;
    const ownerId = user.id;

    // Intentamos borrar asegurándonos que el dueño sea el que está logueado
    const deletedPet = await Pet.findOneAndDelete({ _id: id, owner: ownerId });

    if (!deletedPet) {
      return res.status(404).json({ error: "Mascota no encontrada o no tienes permiso para eliminarla" });
    }

    return res.json({
      message: "Mascota eliminada correctamente",
      pet: deletedPet
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar la mascota" });
  }
};
