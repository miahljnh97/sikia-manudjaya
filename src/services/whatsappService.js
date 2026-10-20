/**
 * WhatsApp Reminder Service via n8n iPaaS Webhook, Fonnte API & Direct wa.me Fallback
 * Sesuai Product Brief SIKIA & PBI-01 (Pengingat Jadwal Kunjungan via WhatsApp & Notifikasi)
 */

export const N8N_DEFAULT_URLS = {
  production: 'https://n8n-ozyrapo44nfh.jkt1.sumopod.my.id/webhook/kirim-pengingat',
  test: 'https://n8n-ozyrapo44nfh.jkt1.sumopod.my.id/webhook-test/kirim-pengingat'
};

// Mode n8n: 'production' | 'test' | 'custom'
export const getN8nMode = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sikia_n8n_mode') || 'production';
  }
  return 'production';
};

export const setN8nMode = (mode) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sikia_n8n_mode', mode);
    if (mode === 'production') {
      localStorage.setItem('sikia_n8n_webhook_url', N8N_DEFAULT_URLS.production);
    } else if (mode === 'test') {
      localStorage.setItem('sikia_n8n_webhook_url', N8N_DEFAULT_URLS.test);
    }
  }
};

// Baca URL Webhook n8n dari Environment Variable atau LocalStorage
export const getN8nWebhookUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sikia_n8n_webhook_url');
    if (saved && saved.trim()) return saved.trim();
    const mode = getN8nMode();
    return mode === 'test' ? N8N_DEFAULT_URLS.test : N8N_DEFAULT_URLS.production;
  }
  return import.meta.env.VITE_N8N_WEBHOOK_URL || N8N_DEFAULT_URLS.production;
};

export const setN8nWebhookUrl = (url) => {
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem('sikia_n8n_webhook_url', url.trim());
    } else {
      localStorage.removeItem('sikia_n8n_webhook_url');
    }
  }
};

// Baca token Fonnte dari Environment Variable atau LocalStorage
export const getFonnteToken = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sikia_fonnte_token');
    if (saved && saved.trim()) return saved.trim();
  }
  return import.meta.env.VITE_FONNTE_TOKEN || '';
};

export const setFonnteToken = (token) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('sikia_fonnte_token', token.trim());
    } else {
      localStorage.removeItem('sikia_fonnte_token');
    }
  }
};

/**
 * Normalisasi nomor telepon ke format internasional (misal 08123... -> 628123...)
 */
export const normalizePhoneForWhatsApp = (phone = '') => {
  if (!phone) return '6281234567890';
  let clean = String(phone).replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return clean;
};

/**
 * Kalkulasi status pengingat (H-3, H-1, Hari Ini, atau Lewat)
 * @param {string|Date} targetDateStr 
 * @returns {{ label: string, badgeColor: string, isUrgent: boolean, selisihHari: number }}
 */
export const getReminderStatus = (targetDateStr) => {
  if (!targetDateStr) return { label: 'Akan Datang', badgeColor: 'bg-slate-100 text-slate-600', isUrgent: false, selisihHari: 99 };

  try {
    const target = new Date(targetDateStr);
    const today = new Date();
    
    // Normalize hours to midnight for accurate day diff
    const dTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const dToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = dTarget.getTime() - dToday.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { label: 'Hari Ini', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', isUrgent: true, selisihHari: 0 };
    } else if (diffDays === 1) {
      return { label: 'H-1 (Besok)', badgeColor: 'bg-rose-100 text-rose-700 border-rose-200', isUrgent: true, selisihHari: 1 };
    } else if (diffDays === 3) {
      return { label: 'H-3 (Pengingat)', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', isUrgent: true, selisihHari: 3 };
    } else if (diffDays === 2) {
      return { label: 'H-2', badgeColor: 'bg-orange-100 text-orange-700 border-orange-200', isUrgent: false, selisihHari: 2 };
    } else if (diffDays > 0) {
      return { label: `H-${diffDays}`, badgeColor: 'bg-blue-50 text-blue-700 border-blue-200', isUrgent: false, selisihHari: diffDays };
    } else {
      return { label: 'Selesai / Terlewat', badgeColor: 'bg-slate-100 text-slate-500 border-slate-200', isUrgent: false, selisihHari: diffDays };
    }
  } catch {
    return { label: 'Akan Datang', badgeColor: 'bg-slate-100 text-slate-600', isUrgent: false, selisihHari: 99 };
  }
};

/**
 * Format tanggal ke format standar Indonesia DD-MM-YYYY (misal: 26-10-2026)
 * Menghilangkan embel-embel timezone ISO (T00:00:00.000Z) agar bersih diterima n8n & WhatsApp
 */
export const formatDateDMY = (dateInput) => {
  if (!dateInput) return '';
  try {
    if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateInput.trim())) {
      return dateInput.trim();
    }
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return String(dateInput);
  }
};

/**
 * Format template pesan pengingat resmi WhatsApp sesuai PBI-01 AC 2
 */
export const generateWhatsAppReminderMessage = (jadwal, namaIbu = 'Siti Aminah') => {
  const statusInfo = getReminderStatus(jadwal?.tanggal);
  const tagH = statusInfo.selisihHari === 1 ? 'PENGINGAT H-1' : (statusInfo.selisihHari === 3 ? 'PENGINGAT H-3' : 'PENGINGAT JADWAL');
  const tanggalBersih = formatDateDMY(jadwal?.tanggal) || 'Sesuai Jadwal';

  return `🔔 *${tagH} - LAYANAN KESEHATAN IBU & ANAK (SIKIA)* 🔔

Yth. Ibu *${namaIbu}*,
Mengingatkan kembali jadwal kegiatan Posyandu/Kesehatan Anda di Desa Manud Jaya:

📌 *Kegiatan:* ${jadwal?.jenis || jadwal?.jenis_kegiatan || 'Pemeriksaan Kesehatan ANC'}
🗓️ *Tanggal:* ${tanggalBersih}
⏰ *Waktu:* ${jadwal?.waktu || '09:00 - 10:00'} WIB
📍 *Lokasi:* ${jadwal?.lokasi || 'Puskesmas Manud Jaya'}
👩‍⚕️ *Petugas:* ${jadwal?.petugas || 'Bidan Siti, S.Tr.Keb'}

📝 *Catatan:* ${jadwal?.keterangan || jadwal?.catatan || 'Mohon hadir tepat waktu dan membawa Buku KIA.'}

Pastikan kondisi Ibu dan Buah Hati tetap sehat. Jika berhalangan hadir, silakan hubungi Kader Posyandu wilayah Anda.

_Salam Sehat,_
*Posyandu & Bidan Desa Manud Jaya (SIKIA)*`;
};

/**
 * Kirim pesan WhatsApp menggunakan n8n Webhook, Fonnte API, atau fallback direct wa.me
 */
export const sendWhatsAppReminder = async ({ phone, jadwal, namaIbu = 'Siti Aminah' }) => {
  const cleanPhone = normalizePhoneForWhatsApp(phone);
  const message = generateWhatsAppReminderMessage(jadwal, namaIbu);
  const n8nUrl = getN8nWebhookUrl();
  const fonnteToken = getFonnteToken();

  const directWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  // 1. Prioritas Utama: Kirim via Webhook n8n (Sesuai Product Brief Tim)
  if (n8nUrl) {
    try {
      const formattedDate = formatDateDMY(jadwal?.tanggal) || '26-10-2026';

      const response = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jadwal_id: jadwal?.id || '6719146f-3c80-4caa-bb2f-e5717d3c64fa',
          peserta_id: jadwal?.peserta_id || '55af67c9-6695-4435-b4ea-2720efd73c92',
          nama_ibu: namaIbu,
          phone: cleanPhone,
          target: cleanPhone,
          kegiatan: jadwal?.jenis || jadwal?.jenis_kegiatan || 'Pemeriksaan Kehamilan ANC',
          jenis_kegiatan: jadwal?.jenis || jadwal?.jenis_kegiatan || 'Pemeriksaan Kehamilan ANC',
          tanggal: formattedDate, // Format DD-MM-YYYY (misal: 26-10-2026) tanpa embel-embel timezone
          tanggal_dmy: formattedDate,
          tanggal_raw: jadwal?.tanggal || '2026-09-24',
          waktu_pengingat: formattedDate,
          waktu: jadwal?.waktu || '09:00 - 10:00',
          lokasi: jadwal?.lokasi || 'Puskesmas Manud Jaya',
          petugas: jadwal?.petugas || 'dr. Haryono, Sp.OG',
          catatan: jadwal?.keterangan || jadwal?.catatan || 'Membawa Buku KIA.',
          message: message,
          pesan: message,
          pesan_lengkap: message,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        return {
          success: true,
          method: 'n8n',
          message: 'Trigger pengingat WhatsApp berhasil dikirim ke n8n iPaaS!',
          waUrl: directWaUrl
        };
      } else {
        const errorText = await response.text();
        console.warn('n8n webhook response not ok:', response.status, errorText);

        if (response.status === 404) {
          return {
            success: false,
            method: 'n8n_inactive',
            message: 'Webhook n8n belum aktif (Pastikan toggle Workflow di n8n sudah Active, atau jika test URL, klik "Listen for test event"). Membuka direct WhatsApp...',
            waUrl: directWaUrl
          };
        }
      }
    } catch (err) {
      console.warn('n8n webhook network exception, falling back:', err);
    }
  }

  // 2. Prioritas Kedua: Jika token Fonnte tersedia, kirim via API Fonnte
  if (fonnteToken) {
    try {
      const formData = new FormData();
      formData.append('target', cleanPhone);
      formData.append('message', message);
      formData.append('countryCode', '62');

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: fonnteToken,
        },
        body: formData,
      });

      const resJson = await response.json();
      if (resJson.status === true || resJson.status === 'true') {
        return {
          success: true,
          method: 'fonnte',
          message: 'Pesan pengingat berhasil dikirim via Fonnte WhatsApp Gateway!',
          detail: resJson,
          waUrl: directWaUrl,
        };
      } else {
        console.warn('Fonnte API response non-ok:', resJson);
        return {
          success: false,
          method: 'fonnte_failed',
          message: resJson.reason || 'Gagal mengirim via Fonnte, silakan gunakan tombol Direct WhatsApp.',
          waUrl: directWaUrl,
        };
      }
    } catch (err) {
      console.error('Fonnte fetch error:', err);
    }
  }

  // 3. Fallback Utama: Direct Link WhatsApp (wa.me)
  return {
    success: true,
    method: 'direct',
    message: 'Membuka aplikasi WhatsApp dengan pesan pengingat resmi yang sudah terisi otomatis...',
    waUrl: directWaUrl,
  };
};
