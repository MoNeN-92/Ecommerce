// lib/api/products.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
      cache: 'no-store', // Always fetch fresh data
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

export async function createProduct(data, token) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create product');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}