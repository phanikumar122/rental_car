import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';

interface Location { id: string; name: string; address: string; city: string; }

const empty = { name: '', address: '', city: '' };

const AdminLocations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [form,      setForm]      = useState(empty);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);

  const fetch = useCallback(async () => {
    try {
      const res = await api.get<Location[]>('/api/locations');
      setLocations(res.data);
    } catch { setError('Failed to load locations.'); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd  = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (l: Location) => { setForm({ name: l.name, address: l.address, city: l.city }); setEditId(l.id); setShowForm(true); };
  const cancel   = () => { setShowForm(false); setEditId(null); setForm(empty); };

  const save = async () => {
    if (!form.name || !form.address) return;
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/api/locations/${editId}`, form);
      } else {
        await api.post('/api/locations', form);
      }
      await fetch();
      cancel();
    } catch { setError('Save failed.'); }
    finally  { setSaving(false); }
  };

  const deleteLocation = async (id: string) => {
    if (!window.confirm('Delete this location?')) return;
    try { await api.delete(`/api/locations/${id}`); await fetch(); }
    catch (err: any) { alert(err?.response?.data?.error || 'Delete failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" /> Add Location
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4">{editId ? 'Edit Location' : 'New Location'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['name', 'city', 'address'] as const).map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={field === 'name' ? 'e.g. Chennai Airport' : field === 'city' ? 'e.g. Chennai' : 'Full address'}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
              <Check className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                {['Name', 'City', 'Address', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {locations.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No locations yet. Add one above.</td></tr>
              ) : locations.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                  <td className="px-4 py-3 text-gray-600">{l.city}</td>
                  <td className="px-4 py-3 text-gray-500">{l.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(l)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteLocation(l.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminLocations;
