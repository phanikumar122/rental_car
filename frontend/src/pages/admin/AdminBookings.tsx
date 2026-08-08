import React, { useEffect, useState, useCallback } from 'react';
import { Phone, Check, X, RefreshCw, FileText } from 'lucide-react';
import api from '../../utils/api';
import { generateInvoice } from '../../utils/invoiceGenerator';

interface BookingRow {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  notes?: string;
  user: { id: string; name: string; email: string; phone?: string; address?: string };
  car: { name: string; type: string; pricePerDay: number };
}

interface Meta { total: number; page: number; totalPages: number; }

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [meta,     setMeta]     = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetch = useCallback(async (p = 1, status = '') => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(p), limit: '15' });
      if (status) q.set('status', status);
      const res = await api.get<{ data: BookingRow[]; meta: Meta }>(`/api/bookings?${q}`);
      setBookings(res.data.data);
      setMeta(res.data.meta);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(page, filter); }, [fetch, page, filter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.put(`/api/bookings/${id}`, { status });
      fetch(page, filter);
    } catch { alert('Failed to update status.'); }
    finally { setUpdating(null); }
  };

  const handleDownloadInvoice = (b: BookingRow) => {
    generateInvoice({
      bookingId:   b.id,
      customer: {
        name:      b.user.name,
        phone:     b.user.phone || 'N/A',
        email:     b.user.email,
        address:   b.user.address || 'N/A'
      },
      car: {
        name:      b.car.name,
        pricePerDay: b.car.pricePerDay
      },
      startDate:   b.startDate,
      endDate:     b.endDate,
      totalAmount: b.totalAmount
    });
  };

  const waLink = (phone: string, bookingId: string) =>
    `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(`Hi, I'm contacting regarding Booking ID: ${bookingId}`)}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings <span className="text-gray-400 font-normal text-base">({meta.total})</span></h1>
        <select
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    {['User / Phone', 'Car', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No bookings found.</td></tr>
                  ) : bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{b.user?.name}</p>
                        {b.user?.phone && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <a href={`tel:${b.user.phone}`} className="flex items-center gap-1 text-green-700 text-xs hover:underline">
                              <Phone className="h-3 w-3" /> {b.user.phone}
                            </a>
                            <a href={waLink(b.user.phone, b.id)} target="_blank" rel="noreferrer"
                               className="text-xs text-emerald-600 hover:underline">WA</a>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">#{b.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{b.car?.name}</p>
                        <p className="text-xs text-gray-400">{b.car?.type}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <p>{new Date(b.startDate).toLocaleDateString('en-IN')}</p>
                        <p className="text-gray-400">→ {new Date(b.endDate).toLocaleDateString('en-IN')}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-600'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {b.status === 'PENDING' && (
                            <>
                              <button onClick={() => updateStatus(b.id, 'CONFIRMED')} disabled={updating === b.id}
                                className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs hover:bg-green-100 disabled:opacity-50">
                                <Check className="h-3 w-3" /> Approve
                              </button>
                              <button onClick={() => updateStatus(b.id, 'CANCELLED')} disabled={updating === b.id}
                                className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs hover:bg-red-100 disabled:opacity-50">
                                <X className="h-3 w-3" /> Reject
                              </button>
                            </>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <button onClick={() => updateStatus(b.id, 'COMPLETED')} disabled={updating === b.id}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 disabled:opacity-50">
                              <RefreshCw className="h-3 w-3" /> Complete
                            </button>
                          )}
                          {(b.status === 'CONFIRMED' || b.status === 'COMPLETED') && (
                            <button onClick={() => handleDownloadInvoice(b)}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200">
                              <FileText className="h-3 w-3" /> Invoice
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Page {meta.page} of {meta.totalPages} · {meta.total} bookings</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">Prev</button>
                  <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
