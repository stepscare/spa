'use client'
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Reservation {
  _id: string;
  name: string;
  date: string;
  mobile: string;
  ServiceId: Item;
}

interface Item {
  _id: string;
  title: string;
  price: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get<Reservation[]>('/api/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mt-8">
        <Link href="/admin">
          <span className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            Go to Admin Page
          </span>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Reservations</h1>
      <ul className="space-y-4">
        {reservations.map((reservation) => (
          <li key={reservation._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <div className="text-lg font-semibold text-gray-700">{reservation.name}</div>
            <div className="text-gray-500">{new Date(reservation.date).toLocaleString()}</div>
            <div className="text-gray-600">{reservation.mobile}</div>
            <div className="mt-4">
              <span className="font-medium text-gray-700">Service:</span> 
              <span className="ml-2 text-gray-800">{reservation.ServiceId?.title}</span>
              <span className="ml-4 text-green-600">SAR {reservation.ServiceId?.price}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
