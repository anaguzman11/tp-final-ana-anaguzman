import bcrypt from "bcrypt";
import User from "../models/users.model";
import jwt, { SignOptions } from "jsonwebtoken";

import { JwtPayload, UserRole } from '../types/auth';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}

const secretKey: string = process.env.JWT_SECRET;

export const seedAdmin = async () => {
  // 1. Borramos el admin viejo que tiene la contraseña "rota"
  await User.deleteOne({ email: 'admin@admin.com' });

  // 2. Creamos el nuevo. 
  // IMPORTANTE: Si tu modelo tiene bcrypt.hash en el .pre('save'), 
  // mandá la contraseña en TEXTO PLANO acá.
  const admin = new User({
    name: 'Administrador',
    email: 'admin@admin.com',
    password: 'admin1234', // Texto plano para que el modelo lo encripte UNA SOLA VEZ
    role: 'admin'
  });

  await admin.save();
  console.log('✅ Admin reseteado con éxito');
};

/**
 * Registra un nuevo usuario
 */
export const register = async (
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.CLIENT, // Enum para el valor por defecto
  telephone?: string
): Promise<string> => {
  const newUser = new User({
    name,
    email,
    password, // El hook del modelo lo hasheará
    role,
    telephone,
  });

  const savedUser = await newUser.save();
  return savedUser.id;
};

/**
 * Inicia sesión y genera un token JWT
 */
export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`[DEBUG] Usuario no encontrado para el email: ${email}`);
    throw new Error("Usuario no encontrado");
  }

  const isValid = await bcrypt.compare(password, user.password);
  console.log(`[DEBUG] Resultado de bcrypt.compare: ${isValid}`);
  if (!isValid) throw new Error("Credenciales inválidas");

  const payload: JwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role as UserRole,
  };

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "1h",
    issuer: "patitas-felices-api",
  };

  return jwt.sign(payload, secretKey, options);
};
