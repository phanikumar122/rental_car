import React, { useEffect, useState, useCallback } from 'react';
import { User, Phone, FileText, CheckCircle, Clock, AlertCircle, X, Camera, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api, { getImageUrl } from '../utils/api';
import { generateInvoice } from '../utils/invoiceGenerator';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Booking {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  car: { name: string; type: string; images: string[]; pricePerDay: number };
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  PENDING:   <Clock    className="h-4 w-4 text-yellow-500" />,
  CONFIRMED: <CheckCircle className="h-4 w-4 text-green-500" />,
  CANCELLED: <X        className="h-4 w-4 text-red-500"    />,
  COMPLETED: <CheckCircle className="h-4 w-4 text-blue-500" />,
};

const Profile: React.FC = () => {
  const { user, setUser } = useAuth() as any;

  const [bookings,    setBookings]    = useState<Booking[]>([]);
  const [loadingB,    setLoadingB]    = useState(true);
  const [name,        setName]        = useState(user?.name || '');
  const [phone,       setPhone]       = useState(user?.phone || '');
  const [address,     setAddress]     = useState(user?.address || '');
  const [licenseUrl,  setLicenseUrl]  = useState(user?.licenseUrl || '');
  const [saving,      setSaving]      = useState(false);
  const [savingLic,   setSavingLic]   = useState(false);
  const [msg,         setMsg]         = useState('');
  const [cancelling,  setCancelling]  = useState<string | null>(null);
  const [uploading,   setUploading]   = useState(false);

  const [oldPassword,  setOldPassword]  = useState('');
  const [newPassword,  setNewPassword]  = useState('');
  const [showOld,      setShowOld]      = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [changingPw,   setChangingPw]   = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get<Booking[]>('/api/bookings/user');
      setBookings(res.data);
    } catch { /* silent */ }
    finally  { setLoadingB(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleDownloadInvoice = (b: Booking) => {
    if (!user) return;
    generateInvoice({
      bookingId:   b.id,
      customer: {
        name:      user.name,
        phone:     user.phone || 'N/A',
        email:     user.email,
        address:   user.address || 'N/A'
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

  const saveProfile = async () => {
    setSaving(true); setMsg('');
    try {
      const res = await api.put<typeof user>('/api/auth/profile', { name, phone, address });
      if (setUser) setUser(res.data);
      setMsg('Profile updated successfully!');
    } catch { setMsg('Failed to update profile.'); }
    finally  { setSaving(false); }
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) return;
    setChangingPw(true); setMsg('');
    try {
      await api.put('/api/auth/change-password', { oldPassword, newPassword });
      setMsg('Password updated successfully!');
      setOldPassword(''); setNewPassword('');
    } catch (err: any) { 
      setMsg(err?.response?.data?.error || 'Failed to update password.'); 
    }
    finally  { setChangingPw(false); }
  };

  const saveLicense = async () => {
    if (!licenseUrl) return;
    setSavingLic(true); setMsg('');
    try {
      await api.post('/api/auth/license', { licenseUrl });
      setMsg('License URL saved. Awaiting admin verification.');
    } catch { setMsg('Failed to save license.'); }
    finally  { setSavingLic(false); }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true); setMsg('');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/api/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (setUser) {
        setUser({ ...user, avatarUrl: res.data.avatarUrl });
      }
      setMsg('Profile picture updated!');
    } catch { setMsg('Failed to upload picture.'); }
    finally  { setUploading(false); }
  };

  const cancelBooking = async (id: string) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await api.delete(`/api/bookings/${id}`);
      fetchBookings();
    } catch (err: any) { alert(err?.response?.data?.error || 'Failed to cancel.'); }
    finally  { setCancelling(null); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {user?.avatarUrl ? (
                    <img src={getImageUrl(user.avatarUrl)} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-blue-600" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {msg && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                {msg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House No, Street, Area, City, Pincode"
              />
            </div>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>

          {/* Security / Password Change */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" /> Security
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showOld ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={changePassword}
              disabled={changingPw || !oldPassword || !newPassword}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {changingPw ? 'Updating…' : 'Update Password'}
            </button>
          </div>

          {/* Driving License */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Driving License
            </h2>
            {user?.licenseVerified && (
              <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
                <CheckCircle className="h-4 w-4" /> Your license has been verified.
              </div>
            )}
            {!user?.licenseVerified && user?.licenseUrl && (
              <div className="flex items-center gap-2 text-yellow-600 text-sm mb-3">
                <AlertCircle className="h-4 w-4" /> License submitted — awaiting admin verification.
              </div>
            )}
            <div className="flex gap-3 mb-4">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={licenseUrl}
                onChange={e => setLicenseUrl(e.target.value)}
                placeholder="Paste your license image URL here"
              />
              <button
                onClick={saveLicense}
                disabled={savingLic}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {savingLic ? 'Saving…' : 'Submit'}
              </button>
            </div>
            {licenseUrl && (
              <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden bg-gray-50 max-w-sm mx-auto sm:mx-0">
                <p className="px-3 py-2 text-[10px] uppercase font-bold text-gray-400 bg-white border-b border-gray-50">Preview</p>
                <img src={licenseUrl} alt="License Preview" className="w-full h-auto object-contain max-h-48" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">My Bookings</h2>
            </div>
            {loadingB ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
            ) : bookings.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No bookings yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <div key={b.id} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {b.car?.images?.[0] ? (
                          <img src={getImageUrl(b.car.images[0])} alt={b.car.name} className="h-14 w-20 sm:h-12 sm:w-16 object-cover rounded-lg bg-gray-100" />
                        ) : (
                          <div className="h-14 w-20 sm:h-12 sm:w-16 bg-gray-100 rounded-lg" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-gray-900 truncate">{b.car?.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(b.startDate).toLocaleDateString('en-IN')} → {new Date(b.endDate).toLocaleDateString('en-IN')}
                        </p>
                        <p className="text-xs font-bold text-primary">₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-gray-50">
                        {(b.status === 'CONFIRMED' || b.status === 'COMPLETED') && (
                          <button
                            onClick={() => handleDownloadInvoice(b)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
                          >
                            <FileText className="h-3 w-3" /> Invoice
                          </button>
                        )}
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                          {STATUS_ICON[b.status]}
                          <span className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase">{b.status}</span>
                        </div>
                      {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                        <button
                          onClick={() => cancelBooking(b.id)}
                          disabled={cancelling === b.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 disabled:opacity-50"
                        >
                          <X className="h-3 w-3" /> {cancelling === b.id ? '…' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
