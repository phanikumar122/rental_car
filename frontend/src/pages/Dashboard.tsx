import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Car as CarIcon, CheckCircle, XCircle } from 'lucide-react';
import api, { getImageUrl }             from '../utils/api';
import { useAuth }                    from '../context/AuthContext';
import type { Booking, BookingStatus } from '../types';   // [FIX m-04]
import Navbar                         from '../components/Navbar';
import Footer                         from '../components/Footer';

const STATUS_BADGE: Record<BookingStatus, React.ReactNode> = {
  CONFIRMED: (
    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
      <CheckCircle className="h-3 w-3" /> Confirmed
    </span>
  ),
  PENDING: (
    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
      <Clock className="h-3 w-3" /> Pending
    </span>
  ),
  CANCELLED: (
    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
      <XCircle className="h-3 w-3" /> Cancelled
    </span>
  ),
  COMPLETED: (
    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
      <CheckCircle className="h-3 w-3" /> Completed
    </span>
  ),
};

const Dashboard: React.FC = () => {
  const { user }                    = useAuth();
  const [bookings, setBookings]     = useState<Booking[]>([]);  // [FIX m-04] typed
  const [loading,  setLoading]      = useState(true);
  const [error,    setError]        = useState('');
  const [tariffCars, setTariffCars]  = useState<any[]>([]); // Using any for simplicity here or import types
  const [loadingTariffs, setLoadingTariffs] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get<Booking[]>('/api/bookings/user');
        setBookings(response.data);
      } catch {
        setError('Failed to load your bookings. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTariffs = async () => {
      try {
        const response = await api.get('/api/cars?limit=100');
        setTariffCars(response.data.data || []);
      } catch (err) {
        console.error('Failed to load tariffs', err);
      } finally {
        setLoadingTariffs(false);
      }
    };

    fetchBookings();
    fetchTariffs();
  }, []);  // api client auto-attaches the token — no need to depend on token

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500 mt-1">Manage your bookings and account settings here.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-800">My Bookings</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>You have no bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="bg-gray-100 w-20 h-20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {booking.car.imageKey || booking.car.images?.[0] ? (
                          <img
                            src={getImageUrl(booking.car.imageKey || booking.car.images[0])}
                            alt={booking.car.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <CarIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{booking.car.name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {new Date(booking.startDate).toLocaleDateString('en-IN')}
                          {' – '}
                          {new Date(booking.endDate).toLocaleDateString('en-IN')}
                        </p>
                        <div className="mt-2">
                          {STATUS_BADGE[booking.status]}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                        <p className="text-2xl font-bold text-primary">
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                        <button
                          onClick={async () => {
                            if (!window.confirm('Are you sure you want to cancel this booking?')) return;
                            try {
                              await api.delete(`/api/bookings/${booking.id}`);
                              const res = await api.get<Booking[]>('/api/bookings/user');
                              setBookings(res.data);
                            } catch (err: any) {
                              alert(err?.response?.data?.error || 'Failed to cancel booking.');
                            }
                          }}
                          className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <CarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-800">Current Tariffs</h2>
          </div>
          <div className="p-6">
            {loadingTariffs ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : tariffCars.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No tariff data available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Vehicle Type</th>
                      <th className="px-6 py-4">Base Model</th>
                      <th className="px-6 py-4 text-right">Price per Day (Starts from)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.from(new Set(tariffCars.map(c => c.type))).map(type => {
                      const car = tariffCars.find(c => c.type === type);
                      if (!car) return null;
                      const minPrice = Math.min(...tariffCars.filter(c => c.type === type).map(c => c.pricePerDay));
                      return (
                        <tr key={type} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-900">{type}</td>
                          <td className="px-6 py-4 text-gray-500">{car.name}</td>
                          <td className="px-6 py-4 text-right font-bold text-primary">₹{minPrice.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Note:</strong> These rates are base prices. Actual rates may vary according to the 
                    <strong> distance traveled</strong>, <strong>specific vehicle type</strong>, and <strong>time duration</strong> of your rental. 
                    Final price will be calculated during the booking process.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
