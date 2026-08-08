import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24">
      {/* Overlapping "OUR FLEETS" Button */}
      <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 z-10">
        <Link to="/fleets" className="bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary hover:text-white transition-colors flex items-center gap-2">
          <Send className="h-5 w-5" /> OUR FLEETS
        </Link>
      </div>

      {/* Main Footer Content */}
      <div className="bg-footer-bg pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-white/20 pb-12">
            <div className="flex items-start gap-4">
              <MapPin className="h-8 w-8 text-primary mt-1 flex-shrink-0" fill="currentColor" stroke="white" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">ADDRESS</h4>
                <p className="text-gray-800 text-sm leading-relaxed">
                  43-77-6A, Opposite Bhagath Singh<br/>
                  Park, Krishna Hotel Center, Azith Singh<br/>
                  Nagar,<br/>
                  Vijayawada, Andhra Pradesh – 520015,<br/>
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-8 w-8 text-primary mt-1 flex-shrink-0" fill="currentColor" stroke="white" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">PHONE</h4>
                <p className="text-gray-800 text-sm">
                  9246669729<br/>
                  9951479729
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-8 w-8 text-primary mt-1 flex-shrink-0" fill="currentColor" stroke="white" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">WORKING HOURS</h4>
                <p className="text-gray-800 text-sm">
                  365 Days & 24x7 Operational<br/>
                  Call us anytime
                </p>
              </div>
            </div>
          </div>

          {/* Middle Row: Links and Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1 */}
            <div>
              <p className="text-gray-800 text-sm leading-relaxed">
                Royal travels the leading car rentals in<br/>
                Vijayawada, established in 2001. Our<br/>
                travel agency is recognized as the top<br/>
                player in the car rental category.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Our Services</h4>
              <ul className="space-y-3 text-sm text-gray-800">
                <li><a href="#" className="hover:text-primary transition-colors">Daily Taxi Services</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Monthly Cab Rentals</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Airport Transfer</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tourism Packages</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tempo Travelers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bus Travel Services</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Important Links</h4>
              <ul className="space-y-3 text-sm text-gray-800">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/fleets" className="hover:text-primary transition-colors">Fleets</Link></li>
                <li><Link to="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
                <li><Link to="/tariffs" className="hover:text-primary transition-colors">Tariffs</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-footer-bottom py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-900">
          <p className="mb-1">Copyright &copy; {new Date().getFullYear()} Royal Car Travels. All rights reserved.</p>
          <p>
            <a href="#" className="hover:underline">Privacy Policy</a> |{' '}
            <a href="#" className="hover:underline">Disclaimer</a> |{' '}
            <a href="#" className="hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
