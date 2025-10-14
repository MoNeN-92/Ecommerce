'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUpload({ 
  onUpload, 
  multiple = false, 
  maxFiles = 5,
  existingImages = [],
  productId = null 
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Validate file count
    if (multiple && files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types and size
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Only JPG, PNG, GIF, WEBP images are allowed');
        return false;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview
    const previews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setPreview(previews);
  };

  const handleUpload = async () => {
    if (preview.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      const uploadedImages = [];

      for (const item of preview) {
        const formData = new FormData();
        formData.append('image', item.file);

        // Choose endpoint based on whether we have a productId
        const endpoint = productId 
          ? `${process.env.NEXT_PUBLIC_API_URL}/upload/product/${productId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/upload/test`; // Using test endpoint without auth
        
        console.log('📤 Uploading to:', endpoint);

        const response = await fetch(endpoint, {
          method: 'POST',
          // Only add Authorization header if we have a token
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {},
          body: formData
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Upload failed:', errorData);
          throw new Error('Upload failed');
        }

        const data = await response.json();
        console.log('✅ Upload response:', data);
        
        // Use fullUrl from response
        const imageData = {
          ...data.data,
          url: data.data.fullUrl || data.data.url // Prioritize fullUrl
        };
        
        uploadedImages.push(imageData);
      }

      // Call parent callback with uploaded images
      if (onUpload) {
        console.log('🖼️ Calling onUpload with:', uploadedImages);
        onUpload(uploadedImages);
      }

      // Clear preview
      setPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      console.log('✅ Upload successful:', uploadedImages);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePreview = (index) => {
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div className="mb-4">
        <label 
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {multiple ? `Up to ${maxFiles} images` : 'Single image'} (Max 5MB each)
            </p>
          </div>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            className="hidden"
            multiple={multiple}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Preview Section */}
      {preview.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              Preview ({preview.length} {preview.length === 1 ? 'file' : 'files'})
            </h4>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {preview.map((item, index) => (
              <div key={index} className="relative group">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="mt-1 text-xs text-gray-600 truncate">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Image</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', image);
                    e.target.src = 'https://via.placeholder.com/200?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-2 right-2 p-1 bg-green-500 text-white rounded-full">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {preview.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload {preview.length} {preview.length === 1 ? 'Image' : 'Images'}
            </>
          )}
        </button>
      )}
    </div>
  );
}