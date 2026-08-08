import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, LayoutDashboard, Users, CalendarDays, MapPin, LogOut, Menu, X, MessageSquare, Tag } from 'lucide-react';

const NAV_LINKS = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/cars',      label: 'Cars',      icon: Car             },
  { to: '/admin/bookings',  label: 'Bookings',  icon: CalendarDays    },
  { to: '/admin/users',     label: 'Users',     icon: Users           },
  { to: '/admin/locations', label: 'Locations', icon: MapPin          },
  { to: '/admin/feedback',  label: 'Feedback',  icon: MessageSquare   },
  { to: '/admin/offers',    label: 'Offers',    icon: Tag             },
];

const AdminLayout: React.FC = () => {
  const { logout }    = useAuth();
  const navigate      = useNavigate();
  const location      = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const NavItem = ({ to, label, icon: Icon, exact }: typeof NAV_LINKS[0]) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        (exact ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + '/'))
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col">
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">Royal Admin</span>
          </Link>
        </div>
        <nav className="flex-grow p-3 space-y-1">
          {NAV_LINKS.map(l => <NavItem key={l.to} {...l} />)}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-gray-900">Royal Admin</span>
        </Link>
        <button onClick={() => setOpen(o => !o)} className="p-2 text-gray-600 hover:text-gray-900">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/40" onClick={() => setOpen(false)}>
          <aside className="absolute top-14 left-0 bottom-0 w-64 bg-white p-3 space-y-1 shadow-xl" onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(l => <NavItem key={l.to} {...l} />)}
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium mt-4">
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-grow md:p-8 p-4 pt-16 md:pt-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
