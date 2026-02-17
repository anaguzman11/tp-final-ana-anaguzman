import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { validationResult } from "express-validator";
import { Error } from 'mongoose';
import User from '../models/users.model';



// PARA REGISTRAR USUARIO
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    await authService.register(name, email, password, role);

    return res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    if (error instanceof Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }
};


// PARA ACTUALIZAR USUARIO
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ✅ Buscamos, actualizamos y EXCLUIMOS la contraseña en un solo paso
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,           // Para que devuelva el usuario con los cambios ya hechos
        runValidators: true  // Para que respete las reglas del Modelo (ej: email válido)
      }
    ).select('-password');   // 🛡️ SEGURIDAD: Esto quita la contraseña del resultado

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({
      message: "Datos actualizados correctamente",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};


// PARA LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`[DEBUG] Intento de login para: ${email}`);
    const token = await authService.login(email, password);

    return res.json({ token });
  } catch (error: any) {
    console.error(`[DEBUG] Error en login: ${error.message}`);
    if (error.message === "Credenciales inválidas" || error.message === "Usuario no encontrado") {
      return res.status(401).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// PARA ELIMINAR USUARIO
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtenemos el ID de la URL

    // Buscamos y eliminamos el usuario
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Respuesta de éxito (200 OK)
    return res.json({
      message: "Usuario eliminado correctamente",
      user: deletedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

// PARA OBTENER TODOS LOS CLIENTES
export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password');
    return res.json(clients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los clientes" });
  }
};
