// Ejemplo simplificado de src/models/user.model.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'veterinarian' | 'admin';
  telephone?: string;
}
//defino el esquema de Mongoose, creo USER y con el rol defino si es un usuario cliente, veterinario o admin
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['veterinarian', 'admin'], default: 'veterinarian' },
  telephone: { type: String },
});

// Antes de guardar, encriptamos
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>('User', UserSchema);
