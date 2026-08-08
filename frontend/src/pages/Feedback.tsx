import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import api from '../utils/api';
import type { Feedback as FeedbackType } from '../types';

const Feedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get<{ data: FeedbackType[] }>('/api/feedback?approvedOnly=true');
      setFeedbacks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch feedback', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/feedback', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', rating: 5, message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit feedback', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Customer Feedback</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read what our satisfied customers have to say about their journey with us.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Reviews List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" /> Recent Testimonials
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                feedbacks.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed italic">"{review.message}"</p>
                  </div>
                ))
              )}
            </div>

            {/* Feedback Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Leave Your Feedback</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                  Thank you! Your feedback has been submitted and is awaiting approval.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                    <option value="4">⭐⭐⭐⭐ - Good</option>
                    <option value="3">⭐⭐⭐ - Average</option>
                    <option value="2">⭐⭐ - Poor</option>
                    <option value="1">⭐ - Terrible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;

