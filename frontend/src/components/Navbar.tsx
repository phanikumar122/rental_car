import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/api';
import { 
  LogOut, User, Phone, Mail, LayoutDashboard, ChevronDown, 
  Home, Info, Car, IndianRupee, MessageSquare, Menu, X 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bar - Hidden on extra small mobile */}
      <div className="bg-topbar text-white py-2 px-4 sm:px-6 lg:px-8 text-sm hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden lg:block">Welcome to Royal Car Travels</div>
          <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+91 92466 69729</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">bookings@royalcartravels.com</span>
              <span className="sm:hidden">Email Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/assets/images/carlogo.png" alt="Royal Car Travels" className="h-10 sm:h-12 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center justify-center flex-grow gap-4 lg:gap-8 px-4">
              {[
                { name: 'Home', path: '/', icon: Home },
                { name: 'About', path: '/about', icon: Info },
                { name: 'Fleets', path: '/fleets', icon: Car },
                { name: 'Tariffs', path: '/tariffs', icon: IndianRupee },
                { name: 'Feedback', path: '/feedback', icon: MessageSquare },
              ].map((link) => (
                <motion.div key={link.path} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 font-medium hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300"
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
              
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={user.role === 'ADMIN' ? "/admin" : "/dashboard"} 
                    className="px-5 py-2 bg-primary/5 text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-primary/20 flex items-center gap-2 ml-4"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Right side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <div className="h-9 w-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
                        {user.avatarUrl ? (
                          <img src={getImageUrl(user.avatarUrl)} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[100px]">{user.name}</p>
                        <p className="text-[10px] text-gray-500 leading-tight uppercase tracking-wider">{user.role}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 py-2"
                          >
                            <Link 
                              to="/profile"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <User className="h-4 w-4 text-primary" />
                              <span>My Profile</span>
                            </Link>
                            <div className="my-1 border-t border-gray-50" />
                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Sign Out</span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Login</Link>
                )}
              </div>
              
              {/* Book Now - Hidden on mobile, shown in menu */}
              <button 
                onClick={() => {
                  if (window.location.pathname !== '/') {
                    navigate('/#available-cars');
                  } else {
                    document.getElementById('available-cars')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }} 
                className="hidden sm:flex btn-outline px-6 py-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-semibold transition-colors items-center gap-2"
              >
                Book Now
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-[280px] bg-white z-50 md:hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto py-4">
                  {[
                    { name: 'Home', path: '/', icon: Home },
                    { name: 'About', path: '/about', icon: Info },
                    { name: 'Fleets', path: '/fleets', icon: Car },
                    { name: 'Tariffs', path: '/tariffs', icon: IndianRupee },
                    { name: 'Feedback', path: '/feedback', icon: MessageSquare },
                  ].map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors border-l-4 border-transparent hover:border-primary font-medium"
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  ))}

                  {user && (
                    <Link 
                      to={user.role === 'ADMIN' ? "/admin" : "/dashboard"} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-primary bg-primary/5 font-bold"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                  )}
                </div>

                <div className="p-6 border-t border-gray-100 space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 border-2 border-white shadow-sm">
                          {user.avatarUrl ? (
                            <img src={getImageUrl(user.avatarUrl)} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-6 w-6 text-primary m-1.5" />
                          )}
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
                    >
                      Login
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (window.location.pathname !== '/') {
                        navigate('/#available-cars');
                      } else {
                        document.getElementById('available-cars')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }} 
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
