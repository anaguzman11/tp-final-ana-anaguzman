import bcrypt from "bcrypt";
import User from "../models/users.model";
import jwt, { SignOptions } from "jsonwebtoken";

import { JwtPayload, UserRole } from '../types/auth';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}

const secretKey: string = process.env.JWT_SECRET;

export const seedAdmin = async () => {

  await User.deleteOne({ email: 'admin@admin.com' });

  const admin = new User({
    name: 'Administrador',
    email: 'admin@admin.com',
    password: 'admin1234',
    role: 'admin'
  });

  await admin.save();
  console.log('✅ Admin "admin@admin.com" (pass: admin1234) reseteado con éxito');
};

/**
 * Registra un nuevo usuario
 */
export const register = async (
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.VETERINARIAN,
  telephone?: string
): Promise<string> => {
  const newUser = new User({
    name,
    email,
    password,
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
  const user = await User.findOne({ email: email.toLowerCase() });
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
