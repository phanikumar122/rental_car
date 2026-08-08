import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import api, { getImageUrl } from '../../utils/api';
import ImageUpload from '../../components/admin/ImageUpload';

interface Location { id: string; name: string; }
interface Car {
  id: string; name: string; type: string; fuel: string; transmission: string;
  seating: number; mileage?: string; pricePerDay: number; pricePerHour?: number;
  availability: boolean; images: string[]; locationId: string; location: { name: string };
}

const CAR_TYPES     = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'MUV', 'Minivan'];
const FUELS         = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'AMT'];

const emptyForm = {
  name: '', type: 'Sedan', fuel: 'Petrol', transmission: 'Manual',
  seating: 5, mileage: '', pricePerDay: 0, pricePerHour: '', locationId: '', images: '',
};

const AdminCars: React.FC = () => {
  const [cars,      setCars]      = useState<Car[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [form,      setForm]      = useState(emptyForm);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const [carsRes, locsRes] = await Promise.all([
        api.get<{ data: Car[] }>('/api/cars?limit=50'),
        api.get<Location[]>('/api/locations'),
      ]);
      setCars(carsRes.data.data);
      setLocations(locsRes.data);
    } catch { setError('Failed to load data.'); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (c: Car) => {
    setForm({
      name: c.name, type: c.type, fuel: c.fuel, transmission: c.transmission,
      seating: c.seating, mileage: c.mileage || '', pricePerDay: c.pricePerDay,
      pricePerHour: c.pricePerHour?.toString() || '', 
      locationId: c.locationId || '',
      images: (c.images || []).join(', '),
    });
    setEditId(c.id);
    setShowForm(true);
    setError('');
  };

  const cancel = () => { setShowForm(false); setEditId(null); };

  const save = async () => {
    if (!form.name || !form.pricePerDay || !form.locationId) {
      setError('Name, price, and location are required.'); return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name, type: form.type, fuel: form.fuel, transmission: form.transmission,
        seating: Number(form.seating), mileage: form.mileage || null,
        pricePerDay: Number(form.pricePerDay),
        pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : null,
        locationId: form.locationId,
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editId) await api.put(`/api/cars/${editId}`, payload);
      else        await api.post('/api/cars', payload);
      await fetchAll();
      cancel();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Save failed.');
    } finally { setSaving(false); }
  };

  const deleteCar = async (id: string) => {
    if (!window.confirm('Delete this car?')) return;
    try { await api.delete(`/api/cars/${id}`); await fetchAll(); }
    catch (err: any) { alert(err?.response?.data?.error || 'Delete failed.'); }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try { await api.put(`/api/cars/${id}`, { availability: !current }); await fetchAll(); }
    catch { alert('Failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cars</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" /> Add Car
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold mb-5">{editId ? 'Edit Car' : 'Add New Car'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Car Name *</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Toyota Innova" />
            </div>
            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {CAR_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {/* Fuel */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fuel</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.fuel} onChange={e => setForm(f => ({ ...f, fuel: e.target.value }))}>
                {FUELS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {/* Transmission */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Transmission</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.transmission} onChange={e => setForm(f => ({ ...f, transmission: e.target.value }))}>
                {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {/* Seating */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Seating</label>
              <input type="number" min="2" max="15"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.seating} onChange={e => setForm(f => ({ ...f, seating: Number(e.target.value) }))} />
            </div>
            {/* Mileage */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mileage</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))} placeholder="e.g. 15 km/l" />
            </div>
            {/* Price per day */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Price / Day (₹) *</label>
              <input type="number" min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.pricePerDay} onChange={e => setForm(f => ({ ...f, pricePerDay: Number(e.target.value) }))} />
            </div>
            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.locationId} onChange={e => setForm(f => ({ ...f, locationId: e.target.value }))}>
                <option value="">Select location…</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            {/* Images */}
            <div className="sm:col-span-2 lg:col-span-1">
              <ImageUpload 
                onUploadSuccess={(url) => setForm(f => ({ ...f, images: f.images ? `${f.images}, ${url}` : url }))} 
              />
              <div className="mt-2">
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Image URLs (comma-separated)</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  value={form.images} 
                  onChange={e => setForm(f => ({ ...f, images: e.target.value }))} 
                  placeholder="Paste links or use upload above..." 
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
              <Check className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Car'}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {['Car', 'Type / Fuel', 'Specs', 'Price/Day', 'Location', 'Available', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cars.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No cars yet. Add one above.</td></tr>
                ) : cars.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c.images?.[0] ? (
                          <img src={getImageUrl(c.images[0])} alt={c.name} className="h-10 w-14 object-cover rounded-lg bg-gray-100" />
                        ) : (
                          <div className="h-10 w-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">No img</div>
                        )}
                        <span className="font-medium text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <p>{c.type}</p>
                      <p className="text-xs text-gray-400">{c.fuel}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      <p>{c.transmission} · {c.seating} seats</p>
                      {c.mileage && <p>{c.mileage}</p>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">₹{c.pricePerDay.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.location?.name}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAvailability(c.id, c.availability)} className="flex items-center gap-1 text-xs">
                        {c.availability
                          ? <><ToggleRight className="h-5 w-5 text-green-500" /><span className="text-green-600">Yes</span></>
                          : <><ToggleLeft  className="h-5 w-5 text-gray-400"  /><span className="text-gray-500">No</span></>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => deleteCar(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
