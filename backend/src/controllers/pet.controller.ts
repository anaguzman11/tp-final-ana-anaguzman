import { Request, Response } from 'express';
import Pet from '../models/pet.model';
import { validationResult } from 'express-validator';
import { JwtPayload, UserRole } from '../types/auth'; // Importación unificada

// Función para REGISTRAR una nueva mascota
export const createPet = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = (req as any).user as JwtPayload;
    const { name, species, breed, age, owner } = req.body;

    // Como solo hay admin, el owner siempre debería venir en el body 
    // o ser el admin mismo si se está asignando la mascota
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

// Función para LISTAR todas las mascotas (Ya no filtramos por cliente)
export const getMyPets = async (req: Request, res: Response) => {
  try {
    // Al ser solo admins, mostramos todas las mascotas de la base de datos
    const pets = await Pet.find({}).populate('owner', 'name email');
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

    // Buscamos directamente por ID sin restringir por owner
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

// FUNCIÓN PARA ACTUALIZAR UNA MASCOTA
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

// FUNCIÓN PARA ELIMINAR UNA MASCOTA
export const deletePet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // El admin puede borrar cualquier mascota
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
