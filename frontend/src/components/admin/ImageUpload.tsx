import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import api from '../../utils/api';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload to our local backend
      const { data } = await api.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success! Return the public URL
      onUploadSuccess(data.publicUrl);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.error || 'Upload failed. Make sure the server is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          ) : (
            <Upload className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload'}
          </span>
        </label>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;
