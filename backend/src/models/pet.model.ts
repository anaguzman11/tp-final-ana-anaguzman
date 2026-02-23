import { Schema, model, Document, Types } from 'mongoose';

export interface IPet extends Document {
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Other';
  breed: string;
  age: number;
  owner: Types.ObjectId;
}

const PetSchema = new Schema<IPet>({
  name: { type: String, required: true, trim: true },
  species: { type: String, required: true, enum: ['Dog', 'Cat', 'Bird', 'Other'] },
  breed: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});


export default model<IPet>('Pet', PetSchema); 
