import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Info, Phone } from 'lucide-react';

const TARIFF_CARDS = [
  {
    title: "Airport Transfer",
    price: "₹11 – ₹25",
    unit: "/ Km",
    desc: "Comfortable and punctual airport pickup & drop services with professional drivers."
  },
  {
    title: "Outstation Trips",
    price: "₹13 – ₹30",
    unit: "/ Km",
    desc: "Ideal for long-distance journeys, family trips, and weekend getaways."
  },
  {
    title: "Daily Rentals",
    price: "₹1,800 – ₹5,000",
    unit: "/ Day",
    desc: "Flexible daily rental plans for meetings, shopping, and local travel."
  },
  {
    title: "Event & Wedding Rentals",
    price: "₹3,500 – ₹10,000",
    unit: "/ Day",
    desc: "Premium vehicles for weddings, events, and corporate occasions."
  }
];

const Tariffs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Info Banner */}
          <div className="bg-[#fef3c7] text-[#92400e] rounded-md p-4 mb-10 flex items-center gap-3">
            <Info className="h-5 w-5 flex-shrink-0" fill="currentColor" stroke="#fef3c7" />
            <span className="text-sm font-medium">Prices may vary based on vehicle type, distance, and duration.</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TARIFF_CARDS.map((card, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                <h3 className="text-2xl font-bold text-primary mb-2">{card.title}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-[#ea580c]">{card.price}</span>
                  <span className="text-sm font-semibold text-gray-600">{card.unit}</span>
                </div>
                <p className="text-sm text-gray-800 mb-8 flex-grow leading-relaxed">
                  {card.desc}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <a href="tel:+919246669729" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors">
                    <Phone className="h-4 w-4" fill="currentColor" /> Call
                  </a>
                  <a href="https://wa.me/919246669729" target="_blank" rel="noopener noreferrer" className="border-2 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tariffs;
