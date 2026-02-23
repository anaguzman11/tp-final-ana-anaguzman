import { Request, Response } from 'express';
import Pet from '../models/pet.model';
import { validationResult } from 'express-validator';
import { JwtPayload } from '../types/auth';

// REGISTRAR una nueva mascota
export const createPet = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = (req as any).user as JwtPayload;
    const { name, species, breed, age, owner } = req.body;

    const finalOwnerId = owner || user.id;

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

// LISTAR todas las mascotas
export const getMyPets = async (req: Request, res: Response) => {
  try {
    const pets = await Pet.find({}).populate('owner', 'name email');
    return res.json(pets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las mascotas' });
  }
};

// OBTENER los detalles de una mascota por su ID
export const getPetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).populate('owner', 'name email');

    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }
    return res.json(pet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la mascota por ID' });
  }
};

// ACTUALIZAR UNA MASCOTA
export const updatePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // El admin puede editar cualquier mascota
    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
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

// ELIMINAR UNA MASCOTA
export const deletePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedPet = await Pet.findByIdAndDelete(id);

    if (!deletedPet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
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
