import React from 'react';
import { useAuthController } from './controllers/useAuthController';
import LoginPage from './views/pages/LoginPage';
import DashboardPage from './views/pages/DashboardPage';

export default function App() {
  const { currentUser, login, logout, isAuthenticated } = useAuthController();

  const handleLoginSuccess = async (email, password) => {
    const res = await login(email, password);
    if (!res.success) {
      throw new Error(res.error);
    }
  };

  // Jika belum login, tampilkan Login Page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Jika sudah login, tampilkan Dashboard Page sesuai role
  return <DashboardPage currentUser={currentUser} onLogout={logout} />;
}
