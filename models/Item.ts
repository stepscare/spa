import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IItem extends Document {
  title: string;
  price: string;
  categoryId: mongoose.Schema.Types.ObjectId;
}

const ItemSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
export default Item;
