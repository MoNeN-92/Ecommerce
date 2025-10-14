// app/products/page.js

import ProductCard from '@/components/products/ProductCard';
import { getProducts } from '@/lib/api/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  let products = [];
  let error = null;

  try {
    const response = await getProducts();
    products = response.data || [];
  } catch (err) {
    error = err.message;
    console.error('Failed to load products:', err);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-gray-600 mt-2">Discover our collection of amazing products</p>
        </div>
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading products</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Make sure your backend server is running on port 5000</p>
          </div>
        )}
        
        {/* Empty State */}
        {!error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Add some products from the admin panel</p>
          </div>
        )}
        
        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}