import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';
import api from '../../utils/api';
import type { Feedback } from '../../types';

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = useCallback(async () => {
    try {
      const response = await api.get<{ data: Feedback[] }>('/api/feedback');
      setFeedbacks(response.data.data);
    } catch {
      setError('Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/api/feedback/${id}/approve`, { isApproved: !currentStatus });
      fetchFeedbacks();
    } catch {
      alert('Failed to update status.');
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await api.delete(`/api/feedback/${id}`);
      fetchFeedbacks();
    } catch {
      alert('Failed to delete feedback.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" /> Customer Feedback
        </h1>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Customer</th>
                  <th className="px-6 py-3 text-left font-medium">Rating</th>
                  <th className="px-6 py-3 text-left font-medium w-1/3">Message</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No feedback received yet.
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{f.name}</div>
                        <div className="text-xs text-gray-500">{f.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < f.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <p className="line-clamp-2 text-xs italic">"{f.message}"</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${
                          f.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {f.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleApproval(f.id, f.isApproved)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              f.isApproved ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={f.isApproved ? 'Unapprove' : 'Approve'}
                          >
                            {f.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => deleteFeedback(f.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
