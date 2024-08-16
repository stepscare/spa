import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
}

const AdminSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
