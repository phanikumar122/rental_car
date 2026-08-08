import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Briefcase, Settings, Loader2 } from 'lucide-react';
import api, { getImageUrl } from '../utils/api';
import type { Car } from '../types';

const Fleets: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/api/cars', { params: { limit: 50 } });
        setCars(response.data.data || []);
      } catch (err: any) {
        console.error('Error fetching cars:', err);
        setError('Failed to load fleets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Fleets</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of well-maintained vehicles to suit your specific travel needs.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">
              {error}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">
              No vehicles available in our fleet right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cars.map((car) => (
                <div key={car.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-all duration-300 group">
                  <div className="w-full sm:w-1/2 aspect-video sm:aspect-auto sm:h-64 bg-white relative overflow-hidden p-4 flex items-center justify-center">
                    <img 
                      src={car.images && car.images.length > 0 ? getImageUrl(car.images[0]) : '/assets/images/carlogo.png'} 
                      alt={car.name} 
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-8 w-full sm:w-1/2 flex flex-col justify-center bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{car.name}</h3>
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full uppercase">
                        {car.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm flex-grow">
                      Experience comfort and style with our premium {car.name}.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" /> {car.seating} Seats
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" /> 2+ Bags
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" /> {car.transmission}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Fleets;
