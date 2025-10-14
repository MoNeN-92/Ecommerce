// lib/api/orders.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function createOrder(orderData) {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!res.ok) throw new Error('Failed to create order');
    return await res.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}