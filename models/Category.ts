import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
  title: string;
}

const CategorySchema: Schema = new mongoose.Schema({
  title: { type: String, required: true }
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
