import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types/auth';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido en el middleware de autenticación.");
}

const secretKey: string = process.env.JWT_SECRET;

// Middleware genérico para verificar el token JWT
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: "Token de autenticación requerido" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido (Bearer <token>)" });
  }

  jwt.verify(token, secretKey, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }

    (req as any).user = userPayload as JwtPayload;
    next();
  });
};

export const authorize = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload;

    if (user && user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ error: "Acceso denegado: permisos insuficientes" });
    }
  };
};
