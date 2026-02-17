import bcrypt from "bcrypt";
import User from "../models/users.model";
import jwt, { SignOptions } from "jsonwebtoken";

import { JwtPayload, UserRole } from '../types/auth';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}

const secretKey: string = process.env.JWT_SECRET;

/**
 * Registra un nuevo usuario
 */
export const register = async (
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.CLIENT // Enum para el valor por defecto
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
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
  if (!user) throw new Error("Usuario no encontrado");

  const isValid = await bcrypt.compare(password, user.password);
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
