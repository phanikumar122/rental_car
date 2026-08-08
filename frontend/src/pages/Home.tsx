import React, { useState, useEffect, useCallback } from 'react';
import { Link }    from 'react-router-dom';
import { motion }              from 'framer-motion';
// [FIX C-07] Car icon was used but never imported — caused a runtime ReferenceError
import { MapPin, Calendar, Clock, Car as CarIcon, Phone, Star, ChevronRight } from 'lucide-react';
import Navbar                  from '../components/Navbar';
import Footer                  from '../components/Footer';
import api, { getImageUrl }      from '../utils/api';
import type { Location, Car as CarType, PaginatedResponse } from '../types';



const HERO_IMAGES = [
  { url: '/assets/images/highway.avif', text: 'Every Mile with Safety & Care' },
  { url: '/assets/images/car on road.webp', text: 'Premium Fleet at Your Fingertips' },
  { url: '/assets/images/cars in a row.avif', text: 'Drive Your Dreams Today' },
  { url: '/assets/images/monthly car.avif', text: 'Monthly Rentals Made Easy' }
];

const Home: React.FC = () => {
  const [location,    setLocation]    = useState('');
  const [pickupDate,  setPickupDate]  = useState('');
  const [pickupTime,  setPickupTime]  = useState('');
  const [dropDate,    setDropDate]    = useState('');
  const [dropTime,    setDropTime]    = useState('');
  const [locations,   setLocations]   = useState<Location[]>([]);
  
  // Car Listing State
  const [cars,        setCars]        = useState<CarType[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [meta,        setMeta]        = useState({ total: 0, page: 1, totalPages: 1 });
  const [page,        setPage]        = useState('1');
  const [tariffCars,  setTariffCars]  = useState<CarType[]>([]);
  
  // Hero Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get<Location[]>('/api/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Failed to load locations', error);
      }
    };
    const fetchTariffs = async () => {
      try {
        const response = await api.get<{ data: CarType[] }>('/api/cars?limit=50');
        setTariffCars(response.data.data);
      } catch (error) {
        console.error('Failed to load tariffs', error);
      }
    };
    fetchLocations();
    fetchTariffs();
  }, []);

  const fetchCars = useCallback(async (isSearch = false) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('available', 'true');
      params.append('page',  isSearch ? '1' : page);
      params.append('limit', '12');
      
      if (location)   params.append('location',   location);
      if (pickupDate) params.append('pickup',     pickupDate);
      if (dropDate)   params.append('drop',       dropDate);

      const response = await api.get<PaginatedResponse<CarType>>(`/api/cars?${params.toString()}`);
      setCars(response.data.data);
      setMeta(response.data.meta);
      if (isSearch) setPage('1');
    } catch {
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [location, pickupDate, dropDate, page]);

  useEffect(() => {
    fetchCars();
    // [FIX] Scroll to available-cars if hash is present
    if (window.location.hash === '#available-cars') {
      setTimeout(() => {
        document.getElementById('available-cars')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [page, fetchCars]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">

        {/* ── Hero Section ──────────────────────────────────────────────────── */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center bg-gray-900 overflow-hidden">
          {HERO_IMAGES.map((hero, index) => (
            <motion.div
              key={hero.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
              style={{ zIndex: currentImageIndex === index ? 1 : 0 }}
            >
              <img
                src={hero.url}
                alt="Backdrop"
                className="w-full h-full object-cover"
              />
              {/* Subtle gradient overlay to make text readable */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </motion.div>
          ))}

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 flex justify-between items-center">
            {/* Floating Call Button */}
            <a href="tel:+919246669729" className="hidden sm:flex bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 items-center gap-2">
              <Phone className="h-5 w-5" fill="currentColor" /> Call
            </a>

            {/* Main Text */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-grow sm:px-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-2xl text-shadow-lg">
                {HERO_IMAGES[currentImageIndex].text}
              </h1>
            </motion.div>

            {/* Floating WhatsApp Button */}
            <a href="https://wa.me/919246669729" target="_blank" rel="noopener noreferrer" className="hidden sm:flex bg-whatsapp hover:bg-whatsapp-hover text-white px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Slider Dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {HERO_IMAGES.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  currentImageIndex === index ? 'bg-primary scale-125' : 'bg-white opacity-50 hover:opacity-100'
                }`}
              ></div>
            ))}
          </div>
        </section>

        {/* ── Search Section (Moved from Hero) ──────────────────────────────── */}
        <section className="bg-gray-100 py-8 border-b border-gray-200">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full bg-white rounded-2xl shadow-md p-4 md:p-6"
            >
              <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-end">

                <div className="w-full lg:flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <select
                      className="input-field pl-10 appearance-none bg-white w-full"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full lg:flex-[1.5]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Date"
                        className="input-field pl-10 w-full"
                        value={pickupDate}
                        min={new Date().toISOString().split('T')[0]}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                        onChange={(e) => {
                          setPickupDate(e.target.value);
                          // If drop date is now earlier than new pickup date, clear it
                          if (dropDate && e.target.value > dropDate) {
                            setDropDate('');
                          }
                        }}
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
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:flex-[1.5]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Drop
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Date"
                        className="input-field pl-10 w-full"
                        value={dropDate}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                        onChange={(e) => setDropDate(e.target.value)}
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
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex-shrink-0">
                  <button type="submit" className="btn-primary w-full h-[42px] px-8">
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>


        {/* ── Available Cars Section ────────────────────────────────────────── */}
        <section id="available-cars" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Available Cars</h2>
              {!loading && <span className="text-sm text-gray-500">{meta.total} result(s)</span>}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">{error}</div>
            ) : cars.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-100">
                <CarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600">No cars found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your search filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <div key={car.id} className="card group flex flex-col">
                      <div className="relative h-48 bg-white overflow-hidden rounded-t-xl p-4 flex items-center justify-center">
                        {car.imageKey || car.images?.[0] ? (
                          <img
                            src={getImageUrl(car.imageKey || car.images[0])}
                            alt={car.name}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CarIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {!car.availability && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Unavailable
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
                          <span className="text-xs bg-blue-50 text-primary px-2 py-1 rounded font-medium">
                            {car.type}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-primary mt-auto mb-4">
                          ₹{car.pricePerDay.toLocaleString()}{' '}
                          <span className="text-sm text-gray-500 font-normal">/ day</span>
                        </div>
                        <Link
                          to={`/cars/${car.id}?pickup=${pickupDate}&pickupTime=${pickupTime}&drop=${dropDate}&dropTime=${dropTime}`}
                          className={`btn-primary w-full text-center block ${
                            !car.availability ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                          }`}
                          aria-disabled={!car.availability}
                        >
                          {car.availability ? 'View Details' : 'Currently Rented'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPage(String(p));
                          document.getElementById('available-cars')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                          Number(page) === p
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>


        {/* ── Sedans to Coach Buses Section ─────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start border-b border-gray-100 pb-16 mb-16">
              <div>
                <h3 className="text-4xl font-extrabold leading-tight">
                  <span className="block text-gray-900">From</span>
                  <span className="block text-primary">Sedans</span>
                  <span className="block text-gray-900 text-3xl">to</span>
                  <span className="block text-accent">Coach Buses</span>
                </h3>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Expect the Best</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Royal Travels offers exceptional services for clients & customers by putting in 100% work effort. You can always expect the best services from Royal – the best Vijayawada Car Rental Service.
                </p>
              </div>
              <div className="border-l-0 md:border-l border-gray-200 md:pl-12">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Travel in Comfort</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  In Royal Car Travels Vijayawada, customer comfort is the topmost thing we always take care of. Our goal is to make your travel safe, effortless, and on schedule.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold mb-8">
                  <span className="text-accent">Proudly Serving</span> <span className="text-primary">India Since 2001</span>
                </h2>
                <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                  <p>
                    Royal Car Travels is the leading car renting company in Vijayawada providing services from 2001. In our journey, we are able to make 40+ esteemed clients (companies). We aim to provide the best travel services across Andhra Pradesh.
                  </p>
                  <p>
                    Our own fleet has many number of cars from different kinds of brands. All categories of cars are available from Economy to Luxury cars at Royal Car Rentals in Vijayawada. Our vehicles are handled by well-experienced & trained drivers.
                  </p>
                  <p>
                    Royal car travels also offer the best Taxi Services in Vijayawada. We provide exclusive on-time dropping services without any delays. With help of an online booking system, you can book your rides directly from our website.
                  </p>
                  <p>
                    So, if you are looking for a Car on Rent in Vijayawada, please let us know. We are happy to provide the best budget deals for you on car rentals. You can choose your fleet of cars (A/c & Non-A/c).
                  </p>
                </div>
                <div className="mt-10">
                  <Link to="/fleets" className="text-xl font-bold flex items-center gap-2 group">
                    <span className="text-accent group-hover:underline">Our Fleets</span> 
                    <span className="text-primary">- Ready to Start</span>
                    <ChevronRight className="h-5 w-5 text-accent group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-accent/10 rounded-3xl -rotate-3"></div>
                  <img src="/assets/images/cars in a row.avif" alt="Our Fleet" className="relative rounded-3xl shadow-2xl z-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Tariffs Section ─────────────────────────────────────────── */}
        <section className="py-16 bg-surface border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary">Affordable Tariffs</h2>
              <p className="text-gray-600 mt-2">Transparent and budget-friendly pricing for every journey.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tariffCars.slice(0, 4).map((car) => (
                <div key={car.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                  <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
                  <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">{car.type}</p>
                  <div className="text-primary font-bold text-2xl mb-4">
                    ₹{car.pricePerDay.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ day</span>
                  </div>
                  <Link to={`/cars/${car.id}`} className="block text-center py-2 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/tariffs" className="inline-flex items-center gap-2 text-accent font-bold hover:underline">
                View All Tariffs <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Corporate Car Bookings Section ────────────────────────────────── */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                  <span className="text-accent">Royal Car Travels</span> – <span className="text-primary text-2xl md:text-3xl block mt-2">Corporate Car Bookings in Vijayawada</span>
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p>
                    Royal services (a Car Rental Company) are an experienced establishment, offering excellent customer service with personalized travel solutions in Vijayawada. We provide one-stop solutions for all your travel needs across Andhra Pradesh.
                  </p>
                  <p>
                    Our team is highly professional and experienced, always understanding customers. Your safety is our safety. All vehicles are equipped with GPS tracking.
                  </p>
                  <p>
                    Being one of the best car travels in Vijayawada, we successfully deliver transport services to 40+ clients.
                  </p>
                  <p>
                    We focus on punctuality, safety, and comfort. Our professional drivers are available 24×7, and our well-maintained, sanitized cars ensure a smooth journey every time.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 bg-white p-8 rounded-2xl border border-gray-100 flex flex-col items-center shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-current drop-shadow-sm" />
                  ))}
                </div>
                <ul className="space-y-4 w-full">
                  {[
                    '100% Time Punctuality',
                    'Well Professional Drivers',
                    'Highly Maintained Cars',
                    'Well Sanitized Cars',
                    'Passengers are Everything for Us',
                    'With GST Complete Billing'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                      <div className="h-2 w-2 rounded-full bg-accent"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
