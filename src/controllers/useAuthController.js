import { useState } from 'react';
import { authService } from '../services/authService';

export function useAuthController() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sikia_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const login = async (email, password) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const userSession = await authService.login(email, password);
      setCurrentUser(userSession);
      localStorage.setItem('sikia_user', JSON.stringify(userSession));
      return { success: true };
    } catch (err) {
      setErrorMessage(err.message || 'Gagal login, periksa email & password.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    localStorage.removeItem('sikia_user');
  };

  return {
    currentUser,
    loading,
    errorMessage,
    login,
    logout,
    isAuthenticated: Boolean(currentUser)
  };
}
