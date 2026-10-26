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
        } else if (email === 'ibu.balita@manudjaya.id') {
          parsed.role = 'Ibu';
          parsed.nama = 'Ibu Ratna';
          parsed.peserta_id = 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73';
        } else if (email === 'ibu.hamil.anak@manudjaya.id' || email === 'siti.aminah@manudjaya.id') {
          parsed.role = 'Ibu';
          parsed.nama = 'Siti Aminah';
          parsed.peserta_id = '55af67c9-6695-4435-b4ea-2720efd73c92';
        } else if (email === 'ibu.hamil@manudjaya.id' || email.includes('hamil')) {
          parsed.role = 'Ibu';
          parsed.nama = 'Najwa Sihab';
          parsed.peserta_id = '214fbe12-2216-4e61-9b12-9fccca445e84';
        } else if (email.includes('ibu') || (parsed.role || '').toLowerCase().includes('ibu')) {
          parsed.role = 'Ibu';
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
      if (userSession) {
        const lowerEmail = (email || '').toLowerCase().trim();
        if (lowerEmail === 'ibu.balita@manudjaya.id' || (lowerEmail.includes('balita') && !lowerEmail.includes('hamil'))) {
          userSession.role = 'Ibu';
          userSession.peserta_id = 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73';
          userSession.nama = 'Siti Aminah';
        } else if (lowerEmail === 'ibu.hamil.anak@manudjaya.id' || lowerEmail === 'siti.aminah@manudjaya.id') {
          userSession.role = 'Ibu';
          userSession.peserta_id = '55af67c9-6695-4435-b4ea-2720efd73c92';
          userSession.nama = userSession.nama || 'Siti Aminah';
        } else if (lowerEmail === 'ibu.hamil@manudjaya.id' || lowerEmail.includes('hamil')) {
          userSession.role = 'Ibu';
          userSession.peserta_id = '214fbe12-2216-4e61-9b12-9fccca445e84';
          userSession.nama = userSession.nama || 'Najwa Sihab';
        }
      }
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
