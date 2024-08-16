import { NextRequest, NextResponse } from 'next/server';
import Completed from '../../../../models/Completed';
import dbConnect from '../../../../utility/dbConnect';

dbConnect();

export async function GET(request: NextRequest) {
  try {
    const items = await Completed.find({}).select('date -_id');
    const dates = items.map(item => item.date);
    return NextResponse.json(dates);
  } catch (error) {
    return NextResponse.error();
  }
}
