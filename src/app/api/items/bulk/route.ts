import { NextRequest, NextResponse } from 'next/server';
import Item from '../../../../../models/Item';
import { verifyToken } from '../../../../../utility/auth';
import dbConnect from '../../../../../utility/dbConnect';

dbConnect();


export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const items = await request.json();
  
  if (!Array.isArray(items) || items.some(item => !item.title || !item.price || !item.categoryId)) {
    return NextResponse.json({ message: 'Each item must have title, price, and categoryId' }, { status: 400 });
  }

  const newItems = await Item.insertMany(items);
  return NextResponse.json(newItems, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const updates = await request.json();
  
  if (!Array.isArray(updates) || updates.some(update => !update.id || !update.title || !update.price || !update.categoryId)) {
    return NextResponse.json({ message: 'Each update must have id, title, price, and categoryId' }, { status: 400 });
  }

  const updatedItems = await Promise.all(updates.map(update => 
    Item.findByIdAndUpdate(update.id, { title: update.title, price: update.price, header: update.header, categoryId: update.categoryId }, { new: true })
  ));
  
  return NextResponse.json(updatedItems);
}
