// frontend/lib/api/products.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get all products with filters
export async function getProducts(params = {}) {
  const { category, search, sort, page, limit } = params;
  
  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  if (sort) queryParams.append('sort', sort);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);

  const url = `${API_URL}/products?${queryParams.toString()}`;
  
  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// ✅ Get featured products
export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_URL}/products/featured`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch featured products');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

// Get single product
export async function getProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Product not found');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// ✅ Create product with multiple images (up to 3)
export async function createProduct(formData, token) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // ❌ არ დავამატოთ 'Content-Type' - FormData თავად დაყენებს!
      },
      body: formData, // FormData object with images
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create product');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// ✅ Update product with multiple images (up to 3)
export async function updateProduct(id, formData, token) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // ❌ არ დავამატოთ 'Content-Type' - FormData თავად დაყენებს!
      },
      body: formData, // FormData object with images
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update product');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// ✅ Delete product
export async function deleteProduct(id, token) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete product');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// ✅ Search products
export async function searchProducts(query) {
  try {
    const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error('Failed to search products');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}