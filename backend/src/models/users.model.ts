import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'veterinarian' | 'admin' | 'client';
  telephone?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['veterinarian', 'admin', 'client'], default: 'veterinarian' },
  telephone: { type: String },
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>('User', UserSchema);
