import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicalRecord extends Document {
    pet: Types.ObjectId;
    date: Date;
    reason: string;
    description: string;
    veterinarian?: Types.ObjectId;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    date: { type: Date, default: Date.now },
    reason: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    veterinarian: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

export default model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
