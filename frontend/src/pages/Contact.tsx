import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';

const adminPhone = import.meta.env['VITE_ADMIN_PHONE'] as string || '+91XXXXXXXXXX';
const adminWA    = import.meta.env['VITE_ADMIN_WHATSAPP'] as string || '+91XXXXXXXXXX';

const Contact: React.FC = () => {
  const waLink = `https://wa.me/${adminWA.replace('+', '')}?text=${encodeURIComponent('Hi, I need help with my rental car booking.')}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gray-900 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-gray-300 text-lg">We're here to help — reach us anytime.</p>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Call */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Call Us</h2>
                <p className="text-gray-500 text-sm mb-4">Available Mon–Sat, 9 AM – 7 PM</p>
                <p className="text-lg font-semibold text-gray-800 mb-4">{adminPhone}</p>
              </div>
              <a
                href={`tel:${adminPhone}`}
                id="contact-call-btn"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                <Phone className="h-5 w-5" /> Call Now
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Chat on WhatsApp</h2>
                <p className="text-gray-500 text-sm mb-4">Get instant replies on WhatsApp</p>
                <p className="text-lg font-semibold text-gray-800 mb-4">{adminWA}</p>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                id="contact-whatsapp-btn"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Mail,    title: 'Email',    value: 'support@royalcar.in'   },
              { icon: MapPin,  title: 'Location', value: 'Pan India Pickup Points' },
              { icon: Clock,   title: 'Hours',    value: 'Mon–Sat, 9 AM – 7 PM'  },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
