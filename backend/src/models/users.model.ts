// Ejemplo simplificado de src/models/user.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'client' | 'veterinarian' | 'admin';
}
//defino el esquema de Mongoose, creo USER y con el rol defino si es un usuario cliente, veterinario o admin
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['client', 'veterinarian', 'admin'], default: 'client' },
});

export default model<IUser>('User', UserSchema);
