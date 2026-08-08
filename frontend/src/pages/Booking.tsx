import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate }     from 'react-router-dom';
import { Calendar, CreditCard, Tag, Car as CarIcon, Clock } from 'lucide-react';
import api, { getImageUrl }       from '../utils/api';
import { useAuth }                    from '../context/AuthContext';
import type { Car }                   from '../types';
import Navbar                         from '../components/Navbar';
import Footer                         from '../components/Footer';

const Booking: React.FC = () => {
  const { id }                      = useParams<{ id: string }>();
  const navigate                    = useNavigate();
  const { token }                   = useAuth();

  const [car,       setCar]         = useState<Car | null>(null);
  
  // Initialize from URL params if available
  const queryParams = new URLSearchParams(window.location.search);
  const [pickupDate, setPickupDate] = useState(queryParams.get('pickup') || '');
  const [pickupTime, setPickupTime] = useState(queryParams.get('pickupTime') || '');
  const [dropDate,   setDropDate]   = useState(queryParams.get('drop') || '');
  const [dropTime,   setDropTime]   = useState(queryParams.get('dropTime') || '');
  
  const [offerCode, setOfferCode]   = useState('');
  const [discount,  setDiscount]    = useState(0);
  const [error,     setError]       = useState('');
  const [success,   setSuccess]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validate coupon code
  useEffect(() => {
    const validateCoupon = async () => {
      if (!offerCode || offerCode.length < 3) {
        setDiscount(0);
        return;
      }
      try {
        const res = await api.post<{ discountPercentage: number }>('/api/offers/validate', { code: offerCode });
        setDiscount(res.data.discountPercentage);
      } catch {
        setDiscount(0);
      }
    };
    const timer = setTimeout(validateCoupon, 500);
    return () => clearTimeout(timer);
  }, [offerCode]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get<Car>(`/api/cars/${id}`);
        setCar(response.data);
      } catch {
        setError('Failed to load car details. Please go back and try again.');
      }
    };
    fetchCar();
  }, [id]);

  const calculateTotal = useCallback((): number => {
    if (!pickupDate || !dropDate || !car) return 0;
    
    // Create date objects for comparison
    const startStr = `${pickupDate}T${pickupTime || '00:00'}`;
    const endStr   = `${dropDate}T${dropTime || '00:00'}`;
    const start = new Date(startStr);
    const end   = new Date(endStr);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 0;
    
    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    let basePrice = days * car.pricePerDay;
    if (discount > 0) {
      basePrice -= (basePrice * discount) / 100;
    }
    return basePrice;
  }, [pickupDate, pickupTime, dropDate, dropTime, car, discount]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const startStr = `${pickupDate}T${pickupTime || '09:00'}`;
      const endStr   = `${dropDate}T${dropTime || '09:00'}`;
      
      await api.post('/api/bookings', {
        carId:     id,
        startDate: startStr,
        endDate:   endStr,
        offerCode: offerCode || undefined,
      });
      setSuccess('Booking successful! Redirecting to your dashboard…');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      const message = err?.response?.data?.error ?? 'Booking failed. Please check your dates and try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error ? (
          <div className="text-center p-8">
            <CarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={() => navigate('/')} className="btn-primary mt-6">
              Back to Home
            </button>
          </div>
        ) : (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Finalize Booking</h1>
          <p className="text-gray-500 text-center mb-10">You're just one step away from your journey.</p>

          {/* Car Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-6 border border-blue-100 shadow-sm">
            <div className="w-32 h-20 bg-white rounded-xl shadow-inner overflow-hidden shrink-0 flex items-center justify-center">
              {car.imageKey || (car.images && car.images[0]) ? (
                <img src={getImageUrl(car.imageKey || car.images[0])} alt={car.name} className="w-full h-full object-cover" />
              ) : (
                <CarIcon className="h-10 w-10 text-gray-300" />
              )}
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
              <p className="text-gray-500 text-sm font-medium">{car.type} &bull; {car.location?.name}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-white rounded-full text-primary font-bold text-sm shadow-sm border border-blue-100">
                ₹{car.pricePerDay.toLocaleString()} / day
              </div>
            </div>
          </div>

          {error   && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 border border-red-100 animate-shake">
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 flex items-center gap-3 border border-green-100">
              <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pickup */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Pickup</label>
                <div className="flex gap-2">
                  <div className="relative flex-[1.5]">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Date"
                      className="input-field pl-10 w-full"
                      value={pickupDate}
                      onFocus={(e) => e.target.type = 'date'}
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Time"
                      className="input-field pl-10 w-full"
                      value={pickupTime}
                      onFocus={(e) => e.target.type = 'time'}
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Drop */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Drop</label>
                <div className="flex gap-2">
                  <div className="relative flex-[1.5]">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Date"
                      className="input-field pl-10 w-full"
                      value={dropDate}
                      onFocus={(e) => e.target.type = 'date'}
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      onChange={(e) => setDropDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Time"
                      className="input-field pl-10 w-full"
                      value={dropTime}
                      onFocus={(e) => e.target.type = 'time'}
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      onChange={(e) => setDropTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Offer Code <span className="text-gray-400 font-normal lowercase">(Optional)</span>
              </label>
              <div className="relative max-w-xs">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="EX: ROYAL20"
                  className="input-field pl-10 uppercase font-mono tracking-widest"
                  value={offerCode}
                  onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-gray-500 font-medium">Estimated Amount</p>
                  <p className="text-xs text-gray-400">Taxes and service fees included</p>
                  {discount > 0 && (
                    <p className="text-green-600 text-xs font-bold mt-1 animate-bounce">
                      ✨ {discount}% Discount Applied!
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-4xl font-extrabold text-primary">
                    {totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={totalAmount <= 0 || submitting}
                className="btn-primary w-full text-xl py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale disabled:scale-100"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <>
                    <CreditCard className="h-6 w-6" /> Confirm Booking
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
