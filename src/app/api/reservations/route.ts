import { startOfToday } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import Completed from '../../../../models/Completed';
import Reservation from '../../../../models/Reservation';
import dbConnect from '../../../../utility/dbConnect';

dbConnect();

export async function POST(request: NextRequest) {
  const { firstName, lastName, date, ServiceId, mobile } = await request.json();

  if (!firstName || !date || !ServiceId || !mobile) {
    return NextResponse.json({ message: 'Name, date, and ServiceId are required' }, { status: 400 });
  }

  const reservationDate = date;

  // Check how many reservations exist for the given date
  const existingReservations = await Reservation.find({ date: reservationDate });

  if (existingReservations.length === 1) {
    // If this is the second reservation for the same date, add it to the Completed model
    const completedEntry = new Completed({ date: reservationDate });
    await completedEntry.save();

    const newReservation = new Reservation({
      name: firstName + lastName || "",
      date: reservationDate,
      ServiceId: ServiceId,
      mobile
    });
    await newReservation.save();

    return NextResponse.json({ message: 'This time slot has now been fully booked and added to the Completed list' });
  }

  // If it's not the second reservation, create a new reservation
  const newReservation = new Reservation({
    name: firstName + lastName || "",
    date: reservationDate,
    ServiceId: ServiceId,
    mobile
  });

  await newReservation.save();

  return NextResponse.json(newReservation, { status: 200 });
}

// GET request handler to retrieve all reservations starting from today
export async function GET(request: NextRequest) {
  const today = startOfToday(); // Get the start of the current day

  try {
    const reservations = await Reservation.find({ date: { $gte: today } }).populate('ServiceId', 'title price').exec();
    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ message: 'Error fetching reservations' }, { status: 500 });
  }
}
