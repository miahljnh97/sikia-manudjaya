import React, { useState, useEffect } from 'react';
import { useAuthController } from './controllers/useAuthController';
import LoginPage from './views/pages/LoginPage';
import LupaPasswordPage from './views/pages/LupaPasswordPage';
import DashboardPage from './views/pages/DashboardPage';

// Helper sinkronisasi URL path / hash
const getPathFromLocation = () => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname;
  if (path && path !== '/') return path;
  const hash = window.location.hash.replace('#', '');
  return hash ? `/${hash}` : '/';
};

export default function App() {
  const { currentUser, login, logout, isAuthenticated } = useAuthController();
  const [currentPath, setCurrentPath] = useState(getPathFromLocation);

  // Sync dengan browser History (Back/Forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPathFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  const handleLoginSuccess = async (email, password) => {
    const res = await login(email, password);
    if (!res.success) {
      throw new Error(res.error);
    }
    navigateTo('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigateTo('/login');
  };

  // Jika halaman lupa password
  if (currentPath === '/lupa-password') {
    return <LupaPasswordPage onBack={() => navigateTo('/login')} />;
  }

  // Jika belum login, tampilkan Login Page
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onGoToLupaPassword={() => navigateTo('/lupa-password')}
      />
    );
  }

  // Jika sudah login, tampilkan Dashboard Page sesuai role & routing
  return (
    <DashboardPage 
      currentUser={currentUser} 
      onLogout={handleLogout}
      currentPath={currentPath}
      onNavigate={navigateTo}
    />
  );
}
