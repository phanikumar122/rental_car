// [FIX m-05, m-06] Removed unused Link and Calendar imports
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }     from 'react-router-dom';
import { Car as CarIcon, MapPin, CheckCircle } from 'lucide-react';
import api, { getImageUrl }             from '../utils/api';
import type { Car }                   from '../types';
import Navbar                         from '../components/Navbar';
import Footer                         from '../components/Footer';

const CarDetails: React.FC = () => {
  const { id }                  = useParams<{ id: string }>();
  const navigate                = useNavigate();
  const [car,     setCar]       = useState<Car | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState('');

  // Extract search params to carry forward
  const queryParams = new URLSearchParams(window.location.search);
  const pickup      = queryParams.get('pickup') || '';
  const pickupTime  = queryParams.get('pickupTime') || '';
  const drop        = queryParams.get('drop') || '';
  const dropTime    = queryParams.get('dropTime') || '';

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get<Car>(`/api/cars/${id}`);
        setCar(response.data);
      } catch {
        setError('Car not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <CarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">{error || 'Car not found'}</h2>
            <button onClick={() => navigate('/cars')} className="btn-primary mt-6">
              Back to Listings
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image */}
            <div className="bg-white relative aspect-video md:aspect-auto flex items-center justify-center p-8">
              {car.imageKey || car.images?.[0] ? (
                <img
                  src={getImageUrl(car.imageKey || car.images[0])}
                  alt={car.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CarIcon className="h-32 w-32 text-gray-300" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{car.name}</h1>
                <span className="bg-blue-50 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-blue-100">
                  {car.type}
                </span>
              </div>

              <div className="text-3xl font-bold text-primary mb-8">
                ₹{car.pricePerDay.toLocaleString()}{' '}
                <span className="text-lg text-gray-500 font-normal">/ day</span>
              </div>

              <div className="space-y-5 mb-10">
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="h-6 w-6 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Pickup Location</p>
                    <p className="text-gray-500 text-sm">
                      {car.location.name} — {car.location.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className={`h-6 w-6 mt-0.5 shrink-0 ${car.availability ? 'text-green-500' : 'text-red-500'}`} />
                  <div>
                    <p className="font-semibold">Availability</p>
                    <p className={`text-sm ${car.availability ? 'text-green-600' : 'text-red-500'}`}>
                      {car.availability ? 'Available for booking' : 'Currently rented out'}
                    </p>
                  </div>
                </div>
              </div>

              {car.availability ? (
                <button
                  onClick={() => navigate(`/book/${car.id}?pickup=${pickup}&pickupTime=${pickupTime}&drop=${drop}&dropTime=${dropTime}`)}
                  className="btn-primary w-full text-lg py-4 mb-4"
                >
                  Book Now
                </button>
              ) : (
                <button disabled className="btn-primary w-full text-lg py-4 opacity-50 cursor-not-allowed mb-4">
                  Not Available
                </button>
              )}

              <div className="flex gap-4">
                <a
                  href={`https://wa.me/${(import.meta.env['VITE_ADMIN_WHATSAPP'] || '').replace('+', '')}?text=${encodeURIComponent(`Hi, I want to inquire about renting the ${car.name}.`)}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-100 transition-colors"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${import.meta.env['VITE_ADMIN_PHONE']}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
                >
                  Call Admin
                </a>
              </div>
            </div>
          </div>
          
          {/* Specs Section */}
          <div className="bg-gray-50 border-t border-gray-100 p-8 md:p-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Car Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Fuel Type</p>
                <p className="font-semibold text-gray-900">{car.fuel || 'Petrol'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Transmission</p>
                <p className="font-semibold text-gray-900">{car.transmission || 'Manual'}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Seating</p>
                <p className="font-semibold text-gray-900">{car.seating || 5} Seats</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Mileage</p>
                <p className="font-semibold text-gray-900">{car.mileage || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetails;
