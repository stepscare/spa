import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Reservation extends Document {
  name: string;
  date: Date;
  mobile: string;
  ServiceId: mongoose.Schema.Types.ObjectId;
}

const ReservationSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  mobile: { type: String, required: true },
  ServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }
});

const Reservation: Model<Reservation> = mongoose.models.Reservation || mongoose.model<Reservation>('Reservation', ReservationSchema);
export default Reservation;
