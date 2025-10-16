// frontend/app/products/page.js
import { Suspense } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { getProducts, getFeaturedProducts } from '@/lib/api/products';
import { Package, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Loading skeleton component
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

// Loading component
function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function ProductsPage() {
  let products = [];
  let featuredProducts = [];
  let error = null;

  try {
    // Fetch both regular and featured products
    const [productsResponse, featuredResponse] = await Promise.allSettled([
      getProducts({ limit: 50 }),
      getFeaturedProducts()
    ]);

    if (productsResponse.status === 'fulfilled') {
      products = productsResponse.value?.data || [];
    }

    if (featuredResponse.status === 'fulfilled') {
      featuredProducts = featuredResponse.value?.data || [];
    }

    // If both failed, set error
    if (productsResponse.status === 'rejected' && featuredResponse.status === 'rejected') {
      throw new Error('Failed to load products');
    }
  } catch (err) {
    error = err.message;
    console.error('Failed to load products:', err);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            All Products
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Discover our collection of amazing products
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-700 text-sm sm:text-base">
                  Error loading products
                </p>
                <p className="text-red-600 text-xs sm:text-sm mt-1">{error}</p>
                <p className="text-red-600 text-xs sm:text-sm mt-2">
                  Make sure your backend server is running
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Products Section */}
        {!error && featuredProducts.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                ⭐ Featured Products
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={`featured-${product.id}`} product={product} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              All Products
            </h2>
            {products.length > 0 && (
              <span className="text-sm sm:text-base text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </span>
            )}
          </div>

          {/* Empty State */}
          {!error && products.length === 0 && featuredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Package className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                No products found
              </p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Add some products from the admin panel
              </p>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <Suspense fallback={<ProductsLoading />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Suspense>
          )}
        </div>

        {/* Bottom spacing */}
        <div className="h-8 sm:h-12"></div>
      </div>
    </div>
  );
}