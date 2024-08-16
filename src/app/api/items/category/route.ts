import { NextRequest, NextResponse } from 'next/server';
import Item from '../../../../../models/Item';
import dbConnect from '../../../../../utility/dbConnect';

dbConnect();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');

  const query = categoryId ? { categoryId } : {};
  const items = await Item.find(query).populate('categoryId', 'title'); // Populate category title
  return NextResponse.json(items);
}

