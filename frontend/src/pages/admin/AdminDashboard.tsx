import React, { useEffect, useState, useCallback } from 'react';
import { Car, Users, CalendarDays, Clock } from 'lucide-react';
import api from '../../utils/api';
import type { AdminStats } from '../../types';

interface RecentBooking {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  user: { name: string; email: string; phone?: string };
  car: { name: string };
}

const STAT_CARDS = [
  { key: 'totalBookings'   as const, label: 'Total Bookings',   icon: CalendarDays, color: 'from-blue-500 to-blue-600'   },
  { key: 'pendingBookings' as const, label: 'Pending',          icon: Clock,        color: 'from-yellow-500 to-orange-500' },
  { key: 'activeUsers'     as const, label: 'Active Users',     icon: Users,        color: 'from-green-500 to-emerald-600' },
  { key: 'availableCars'   as const, label: 'Available Cars',   icon: Car,          color: 'from-purple-500 to-purple-600' },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

const AdminDashboard: React.FC = () => {
  const [stats,    setStats]    = useState<(AdminStats & { pendingBookings?: number }) | null>(null);
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get<AdminStats & { pendingBookings: number }>('/api/admin/stats'),
        api.get<{ data: RecentBooking[] }>('/api/bookings?limit=5'),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data.data);
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  if (error) return <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className={`bg-gradient-to-br ${color} p-3 rounded-xl`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)[key] ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                {['User', 'Phone', 'Car', 'Pickup', 'Status', 'Amount'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No bookings yet</td></tr>
              ) : bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.user?.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {b.user?.phone ? (
                      <a href={`tel:${b.user.phone}`} className="text-blue-600 hover:underline">{b.user.phone}</a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{b.car?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(b.startDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
