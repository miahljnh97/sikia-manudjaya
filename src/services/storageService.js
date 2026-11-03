import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

export const storageService = {
  /**
   * Mengunggah file (PDF/gambar) ke Supabase Storage pada bucket 'dokumen-kia'
   * @param {File} file - Objek file dari input form browser
   * @param {string} folder - Subfolder di dalam bucket (default: 'anc')
   * @returns {Promise<{name: string, size: string, type: string, path: string, url: string}>}
   */
  async uploadDokumen(file, folder = 'anc') {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase client belum terkonfigurasi');
    }

    if (!file) {
      throw new Error('Berkas tidak valid untuk diunggah');
    }

    const fileExt = file.name.split('.').pop() || 'pdf';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueFileName = `${Date.now()}_${cleanBaseName}.${fileExt.toLowerCase()}`;
    const filePath = `${folder}/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from('dokumen-kia')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Gagal upload ke bucket dokumen-kia:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('dokumen-kia')
      .getPublicUrl(filePath);

    return {
      name: file.name,
      path: data?.path || filePath,
      url: publicUrlData?.publicUrl || '',
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type?.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')
        ? 'Dokumen PDF'
        : 'Lampiran Gambar/Scan'
    };
  },

  /**
   * Mengunduh berkas langsung sebagai blob agar nama file lokal sesuai dengan nama dokumen
   * @param {string} url - URL file
   * @param {string} filename - Nama file yang diinginkan
   */
  async downloadFileAsBlob(url, filename = 'Dokumen_Pemeriksaan.pdf') {
    if (!url) throw new Error('URL dokumen tidak ditemukan');

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal fetch file: status ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }
};
