import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../../../models/Admin';
import dbConnect from '../../../../utility/dbConnect';

dbConnect();

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {

  const { email, password } = await req.json();

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // Create JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return new Response(
      JSON.stringify({ token }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Internal server error', error }),
      { status: 500 }
    );
  }
}
