import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Check, X, Tag, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../utils/api';

interface Offer {
  id: string;
  code: string;
  discountPercentage: number;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    code: '',
    discountPercentage: 10,
    validUntil: '',
    isActive: true,
  });

  const fetchOffers = useCallback(async () => {
    try {
      const res = await api.get<Offer[]>('/api/offers');
      setOffers(res.data);
    } catch {
      setError('Failed to load offers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleSave = async () => {
    if (!form.code || !form.validUntil) {
      setError('Code and expiry date are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/api/offers', form);
      await fetchOffers();
      setShowForm(false);
      setForm({ code: '', discountPercentage: 10, validUntil: '', isActive: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await api.put(`/api/offers/${id}`, { isActive: !current });
      await fetchOffers();
    } catch {
      alert('Failed to update status.');
    }
  };

  const deleteOffer = async (id: string) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await api.delete(`/api/offers/${id}`);
      await fetchOffers();
    } catch {
      alert('Delete failed.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="h-6 w-6 text-primary" /> Offers & Coupons
        </h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-medium transition-colors"
        >
          {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Create Coupon</>}
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-5">New Discount Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Coupon Code</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                placeholder="e.g. SAVE20"
                value={form.code}
                onChange={e => setForm({...form, code: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Discount (%)</label>
              <input 
                type="number"
                min="1"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.discountPercentage}
                onChange={e => setForm({...form, discountPercentage: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Valid Until</label>
              <input 
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.validUntil}
                onChange={e => setForm({...form, validUntil: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm font-bold transition-all shadow-md active:scale-95"
            >
              {saving ? 'Creating...' : <><Check className="h-4 w-4" /> Save Coupon</>}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Coupon</th>
                  <th className="px-6 py-4 text-left font-medium">Discount</th>
                  <th className="px-6 py-4 text-left font-medium">Expires On</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {offers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No active coupons. Create one above!</td></tr>
                ) : offers.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-bold text-gray-900 tracking-wider">{o.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-md font-bold text-xs">
                        {o.discountPercentage}% OFF
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {new Date(o.validUntil).toLocaleDateString()}
                        {new Date(o.validUntil) < new Date() && <span className="text-red-500 ml-1 font-medium">(Expired)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(o.id, o.isActive)} className="flex items-center gap-1 transition-all">
                        {o.isActive 
                          ? <><ToggleRight className="h-6 w-6 text-green-500" /><span className="text-[10px] uppercase font-bold text-green-600">Active</span></>
                          : <><ToggleLeft className="h-6 w-6 text-gray-400" /><span className="text-[10px] uppercase font-bold text-gray-400">Inactive</span></>
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteOffer(o.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
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

export default AdminOffers;
