'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '@/store/useCartStore';

export default function ProductCard({ product }) {
  const { id, name, description, price, image_url, images, stock } = product;
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product, 1);
    
    // Force navbar update without alert
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Get the image URL from either images array or image_url field
  const getImageUrl = () => {
    // Check if images array exists and has items
    if (images && Array.isArray(images) && images.length > 0) {
      return images[0];
    }
    
    // Otherwise use image_url field
    if (image_url) {
      // If it's already a full URL, return as is
      if (image_url.startsWith('http://') || image_url.startsWith('https://')) {
        return image_url;
      }
      
      // If it's a relative path, add the backend URL
      if (image_url.startsWith('/uploads/')) {
        return `http://localhost:5000${image_url}`;
      }
      
      return image_url;
    }
    
    return null;
  };

  const displayImage = getImageUrl();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition">
      <Link href={`/products/${id}`}>
        <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden cursor-pointer">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
              onError={(e) => {
                console.log(`Image failed to load for product ${id}:`, displayImage);
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = '/placeholder-product.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h4 className="font-semibold mb-2 hover:text-blue-600 transition cursor-pointer">
            {name}
          </h4>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description || 'No description available'}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ₾{parseFloat(price).toFixed(2)}
          </span>
          
          <button 
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`px-4 py-2 rounded-lg transition text-sm flex items-center gap-1 ${
              stock > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {stock > 0 ? 'Add' : 'Out of Stock'}
          </button>
        </div>
        
        {/* Stock indicator */}
        {stock !== undefined && stock !== null && (
          <div className="mt-2">
            <span className={`text-xs ${
              stock > 10 ? 'text-green-600' : 
              stock > 0 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}