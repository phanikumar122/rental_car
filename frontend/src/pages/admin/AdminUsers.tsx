import React, { useEffect, useState, useCallback } from 'react';
import { Shield, ShieldOff, CheckCircle, Phone, Mail } from 'lucide-react';
import api, { getImageUrl } from '../../utils/api';

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  licenseUrl?: string;
  licenseVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  _count: { bookings: number };
}

interface Meta { total: number; page: number; totalPages: number; }

const AdminUsers: React.FC = () => {
  const [users,   setUsers]   = useState<UserRow[]>([]);
  const [meta,    setMeta]    = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetch = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get<{ data: UserRow[]; meta: Meta }>(`/api/admin/users?page=${p}&limit=15`);
      setUsers(res.data.data);
      setMeta(res.data.meta);
    } catch { setError('Failed to load users.'); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetch(page); }, [fetch, page]);

  const toggle = async (id: string, blocked: boolean) => {
    try {
      await api.put(`/api/admin/users/${id}/${blocked ? 'unblock' : 'block'}`);
      fetch(page);
    } catch { alert('Action failed.'); }
  };

  const verify = async (id: string) => {
    try { await api.put(`/api/admin/users/${id}/verify-license`); fetch(page); }
    catch { alert('Action failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users <span className="text-gray-400 font-normal text-base">({meta.total})</span></h1>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    {['User', 'Contact', 'Bookings', 'License', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users found.</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                            {u.avatarUrl ? (
                              <img src={getImageUrl(u.avatarUrl)} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <Shield className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${u.email}`} className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-xs">
                          <Mail className="h-3 w-3" /> {u.email}
                        </a>
                        {u.phone && (
                          <a href={`tel:${u.phone}`} className="flex items-center gap-1 text-gray-600 hover:text-green-600 text-xs mt-0.5">
                            <Phone className="h-3 w-3" /> {u.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-gray-700">{u._count.bookings}</td>
                      <td className="px-4 py-3">
                        {u.licenseUrl ? (
                          <div className="flex flex-col gap-1">
                            <a href={getImageUrl(u.licenseUrl)} target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline">View License</a>
                            {u.licenseVerified ? (
                              <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="h-3 w-3" /> Verified</span>
                            ) : (
                              <button onClick={() => verify(u.id)} className="text-xs text-left text-orange-600 hover:text-orange-800 underline">Verify</button>
                            )}
                          </div>
                        ) : <span className="text-gray-400 text-xs">Not uploaded</span>}
                      </td>
                      <td className="px-4 py-3">
                        {u.isBlocked ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Blocked</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => toggle(u.id, u.isBlocked)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              u.isBlocked
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {u.isBlocked ? <><Shield className="h-3 w-3" /> Unblock</> : <><ShieldOff className="h-3 w-3" /> Block</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Page {meta.page} of {meta.totalPages}</p>
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

export default AdminUsers;
