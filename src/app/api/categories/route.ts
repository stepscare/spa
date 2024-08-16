import { NextRequest, NextResponse } from 'next/server';
import Category from '../../../../models/Category';
import dbConnect from '../../../../utility/dbConnect';
import { verifyToken } from '../../../../utility/jwt';

dbConnect();

export async function GET(request: NextRequest) {
  const categories = await Category.find({});
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  console.log(token)
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title } = await request.json();
  const newCategory = new Category({ title });
  await newCategory.save();
  return NextResponse.json(newCategory, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  await Category.findByIdAndDelete(id);
  return NextResponse.json({}, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, title } = await request.json();
  const updatedCategory = await Category.findByIdAndUpdate(id, { title }, { new: true });
  return NextResponse.json(updatedCategory);
}
