import { useState } from 'react';
import { authService } from '../services/authService';

export function useAuthController() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sikia_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed) {
        const email = (parsed.user?.email || parsed.email || '').toLowerCase();
        if ((email.includes('bidan') || email === 'bidan.desa@manudjaya.id') && parsed.role !== 'Bidan Desa') {
          parsed.role = 'Bidan Desa';
          if (!parsed.nama || parsed.nama === 'Annisa Wati') parsed.nama = 'Bidan Siti, S.Tr.Keb';
        } else if ((email.includes('admin') || email === 'admin.desa@manudjaya.id') && parsed.role !== 'Super Admin') {
          parsed.role = 'Super Admin';
          if (!parsed.nama || parsed.nama === 'Annisa Wati') parsed.nama = 'Bambang Sudarmono, S.STP';
        } else if ((email.includes('ibu') || email === 'ibu.balita@manudjaya.id') && parsed.role !== 'Ibu Balita') {
          parsed.role = 'Ibu Balita';
          if (!parsed.nama || parsed.nama === 'Annisa Wati') parsed.nama = 'Ibu Aminah';
        }
      }
      return parsed;
    } catch (e) {
      return null;
    }
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
