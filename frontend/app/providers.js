// frontend/app/providers.js
'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}