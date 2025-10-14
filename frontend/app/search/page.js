'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { Search, Loader2 } from 'lucide-react';

// 🔥 SearchContent კომპონენტი - სადაც useSearchParams გამოიყენება
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);

  const searchProducts = async (searchQuery) => {
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {loading ? (
                <>Searching for &quot;<span className="font-medium">{query}</span>&quot;...</>
              ) : (
                <>
                  Found {products.length} {products.length === 1 ? 'result' : 'results'} for &quot;
                  <span className="font-medium">{query}</span>&quot;
                </>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Searching products...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && searched && products.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h2>
            <p className="text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* No Query */}
        {!query && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Enter a search term
            </h2>
            <p className="text-gray-500">
              Use the search bar to find products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 Main SearchPage კომპონენტი Suspense wrapper-ით
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}