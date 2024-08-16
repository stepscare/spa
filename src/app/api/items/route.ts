import { NextRequest, NextResponse } from 'next/server';
import Item from '../../../../models/Item';
import dbConnect from '../../../../utility/dbConnect';
import { verifyToken } from '../../../../utility/jwt';

dbConnect();

export async function GET(request: NextRequest) {
  const items = await Item.find({}).populate('categoryId', 'title'); // Populate category title
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, price, header, categoryId } = await request.json();
  
  if (!title || !price || !categoryId) {
    return NextResponse.json({ message: 'Title, price, and categoryId are required' }, { status: 400 });
  }

  const newItem = new Item({ title, price, header, categoryId });
  await newItem.save();
  return NextResponse.json(newItem, { status: 201 });
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

  await Item.findByIdAndDelete(id);
  return NextResponse.json({}, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, price, header, categoryId } = await request.json();
  
  if (!id || !title || !price || !categoryId) {
    return NextResponse.json({ message: 'ID, title, price, and categoryId are required' }, { status: 400 });
  }

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    { title, price, header, categoryId },
    { new: true }
  );
  
  return NextResponse.json(updatedItem);
}
