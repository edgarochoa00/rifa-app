'use client';

import { useState } from 'react';
import Header from '@/components/header';
import AdminLogin from '@/components/admin-login';
import AdminDashboard from '@/components/admin-dashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Header />
      {isAuthenticated ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onAuthenticate={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}
