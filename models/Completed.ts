import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Completed extends Document {
  date: Date;
}

const CompletedSchema: Schema = new mongoose.Schema({
  date: { type: Date, required: true },
});

const Completed: Model<Completed> = mongoose.models.Completed || mongoose.model<Completed>('Completed', CompletedSchema);
export default Completed;
