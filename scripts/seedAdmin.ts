import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin, { IAdmin } from '../models/Admin';
import dbConnect from '../utility/dbConnect';

dbConnect().then(async () => {
  const adminEmail = 'stepscare23@gmail.com';
  const adminPassword = 'admin';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin: IAdmin = new Admin({ email: adminEmail, password: hashedPassword });
  await admin.save();
  console.log('Admin seeded');
  mongoose.connection.close();
}).catch(error => {
  console.error('Error connecting to database', error);
});
