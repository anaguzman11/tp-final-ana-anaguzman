import { Schema, model, Document, Types } from 'mongoose';

// 1. Definir la interfaz TypeScript para la mascota
export interface IPet extends Document {   //el extends documents hereda funciones de mongoose
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Other'; 
  breed: string; 
  age: number;
  owner: Types.ObjectId; // Referencia al ID del dueño (Usuario/Cliente)
}

// 2. Definir el Esquema de Mongoose
const PetSchema = new Schema<IPet>({
  name: { type: String, required: true, trim: true },  //el trim limpia espacios en blaco
  species: { type: String, required: true, enum: ['Dog', 'Cat', 'Bird', 'Other'] }, //el enum es un filtro. define solo esas cuenta especies
  breed: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Establece la relación con el modelo 'User'
});

// 3. Exportar el modelo
export default model<IPet>('Pet', PetSchema); //es lo que uso en el controlador para hacer consultas a la base de datos
