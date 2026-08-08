import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  CircleDollarSign, 
  ShieldCheck, 
  Ban, 
  XCircle, 
  UserCheck, 
  PhoneCall, 
  Trophy, 
  Car as CarIcon, 
  Users as UsersIcon 
} from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About Royal Car Travels</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for premium car rentals and comfortable journeys across India since 2001.
            </p>
          </div>
          
          {/* ── Royal Car Travels Highlights ──────────────────────────────────── */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold uppercase tracking-tight">
                <span className="text-accent">ROYAL CAR TRAVELS</span> <span className="text-primary">HIGHLIGHTS</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {[
                { icon: CircleDollarSign, title: 'FIXED RATES', desc: 'Transparent pricing with fixed rates for all quality services.' },
                { icon: ShieldCheck, title: 'RELIABLE TRANSFERS', desc: 'Reliable and safe transport services across Vijayawada.' },
                { icon: Ban, title: 'NO BOOKING FEES', desc: 'No pre-booking or hidden charges for our taxi services.' },
                { icon: XCircle, title: 'FREE CANCELLATION', desc: 'Cancel anytime with zero cancellation charges.' },
                { icon: UserCheck, title: 'BOOKING FLEXIBILITY', desc: 'Easy and quick booking directly from our website.' },
                { icon: PhoneCall, title: '24H CUSTOMER SERVICE', desc: '24×7 customer support, 365 days a year.' },
                { icon: Trophy, title: 'AWARD WINNING TEAM', desc: 'Professional drivers and technicians known for quality.' },
                { icon: UsersIcon, title: 'PARTNER BENEFITS', desc: 'Special benefits for corporate and partner clients.' },
                { icon: CarIcon, title: 'QUALITY VEHICLES', desc: 'Well-maintained vehicles ensuring comfort and safety.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <item.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 border-t border-gray-100 pt-16">
            <div>
              <img src="/assets/images/mission.jpg" alt="Our Mission" className="rounded-2xl shadow-xl w-full h-80 object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                At Royal Car Travels, our mission is to provide safe, reliable, and affordable transportation solutions to our customers. We strive to exceed expectations with every mile, ensuring your journey is as memorable as your destination.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-800 font-medium">
                  <div className="w-2 h-2 bg-primary rounded-full"></div> Uncompromising safety standards
                </li>
                <li className="flex items-center gap-3 text-gray-800 font-medium">
                  <div className="w-2 h-2 bg-primary rounded-full"></div> Exceptional customer service
                </li>
                <li className="flex items-center gap-3 text-gray-800 font-medium">
                  <div className="w-2 h-2 bg-primary rounded-full"></div> Transparent and fair pricing
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 flex-col-reverse md:flex-row-reverse">
            <div className="order-1 md:order-2">
              <img src="/assets/images/vision.webp" alt="Our Vision" className="rounded-2xl shadow-xl w-full h-80 object-cover" />
            </div>
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                To be the leading car rental service provider in the country, recognized for our commitment to quality, innovation, and customer satisfaction. We aim to continuously expand our fleet and services to cater to the evolving needs of modern travelers.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Whether you need a daily commute, an outstation trip, or a luxury vehicle for a special occasion, Royal Car Travels is here to make your journey extraordinary.
              </p>
            </div>
          </div>


        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
