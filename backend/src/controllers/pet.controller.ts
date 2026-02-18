import { Request, Response } from 'express';
import Pet from '../models/pet.model';
import { validationResult } from 'express-validator';
import { JwtPayload } from '../types/auth';

// Función para REGISTRAR una nueva mascota (solo para usuarios logeados)
export const createPet = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = (req as any).user as JwtPayload;
    const { name, species, breed, age, owner } = req.body;
    const finalOwnerId = owner || user.id; // Si viene owner en el body lo usamos, si no el del token

    const newPet = new Pet({
      name,
      species,
      breed,
      age: Number(age),
      owner: finalOwnerId,
    });

    const savedPet = await newPet.save();
    return res.status(201).json(savedPet);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al registrar la mascota' });
  }
};

// Función para LISTAR las mascotas de un usuario específico
export const getMyPets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as JwtPayload;

    let query = {};
    // Si es cliente, solo ve las suyas. Si es admin o vet, ve todas.
    if (user.role === 'client') {
      query = { owner: user.id };
    }

    const pets = await Pet.find(query).populate('owner', 'name email');
    return res.json(pets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las mascotas' });
  }
};

// Función para OBTENER los detalles de una mascota específica por su ID
export const getPetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as JwtPayload;
    let query: any = { _id: id };
    // Si es cliente, solo puede ver la suya. Si es admin/vet, ve cualquiera.
    if (user.role === 'client') {
      query.owner = user.id;
    }

    const pet = await Pet.findOne(query).populate('owner', 'name email');

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

    const user = (req as any).user as JwtPayload;

    let query: any = { _id: id };
    if (user.role === 'client') {
      query.owner = user.id;
    }

    const updatedPet = await Pet.findOneAndUpdate(
      query,
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

    let query: any = { _id: id };
    if (user.role === 'client') {
      query.owner = user.id;
    }

    const deletedPet = await Pet.findOneAndDelete(query);

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
