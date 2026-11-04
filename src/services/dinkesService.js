import { exportToCsvFile } from '../utils/exportUtils';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

// Baseline fallback data agar UI tetap interaktif saat database baru diinisialisasi
const FALLBACK_STATS = {
  totalPosyandu: 26,
  totalPosyanduTarget: 28,
  posyanduTrend: '+4%',
  totalKunjungan: 1248,
  kunjunganTrend: '+12%',
  bayiDitimbang: 1036,
  bayiPersenSasaran: 83,
  bayiTrend: '+9%',
  balitaDitimbang: 892,
  balitaPersenSasaran: 72,
  balitaTrend: '+11%',
  ibuHamilDiperiksa: 168,
  ibuHamilPersenSasaran: 89,
  ibuHamilTrend: '+6%',
  ibuNifas: 72,
  ibuNifasPersenSasaran: 77,
  ibuNifasTrend: '+7%',
  imunisasiLengkap: 638,
  imunisasiBelumLengkap: 254
};

const FALLBACK_TREN = [
  { bulan: 'Jan', total: 280, balita: 180, ibuHamil: 60, ibuNifas: 40 },
  { bulan: 'Feb', total: 295, balita: 190, ibuHamil: 65, ibuNifas: 40 },
  { bulan: 'Mar', total: 310, balita: 200, ibuHamil: 70, ibuNifas: 40 },
  { bulan: 'Apr', total: 315, balita: 205, ibuHamil: 70, ibuNifas: 40 },
  { bulan: 'Mei', total: 325, balita: 210, ibuHamil: 72, ibuNifas: 43 },
  { bulan: 'Jun', total: 330, balita: 212, ibuHamil: 75, ibuNifas: 43 },
  { bulan: 'Jul', total: 335, balita: 215, ibuHamil: 75, ibuNifas: 45 },
  { bulan: 'Agu', total: 340, balita: 218, ibuHamil: 74, ibuNifas: 48 },
  { bulan: 'Sep', total: 345, balita: 215, ibuHamil: 73, ibuNifas: 57 },
  { bulan: 'Okt', total: 350, balita: 220, ibuHamil: 72, ibuNifas: 58 },
  { bulan: 'Nov', total: 355, balita: 222, ibuHamil: 75, ibuNifas: 58 },
  { bulan: 'Des', total: 360, balita: 225, ibuHamil: 76, ibuNifas: 59 }
];

const FALLBACK_IBU_RISIKO = [
  { id: 'ih-01', no: 1, namaIbu: 'Siti Rahayu', nik: '3275014405940001', usiaKehamilan: '32 minggu', hasilPemeriksaan: 'TD: 140/90 mmHg', posyandu: 'Mandiri Jaya', desa: 'Mandiri Jaya', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', catatanMedis: 'Hipertensi gestasional trimester 3', rekomendasiDinkes: 'Pemberian antihipertensi profilaksis dan jadwal evaluasi mingguan.' },
  { id: 'ih-02', no: 2, namaIbu: 'Nur Khasanah', nik: '3275015507960002', usiaKehamilan: '28 minggu', hasilPemeriksaan: 'LILA: 21 cm', posyandu: 'Terang Sari', desa: 'Sungai Raya', tanggalPeriksa: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', catatanMedis: 'Kurang Energi Kronis (KEK)', rekomendasiDinkes: 'Penyaluran biskuit PMT Ibu Hamil dan pendampingan kader gizi.' },
  { id: 'ih-03', no: 3, namaIbu: 'Rina Lestari', nik: '3275016609980003', usiaKehamilan: '24 minggu', hasilPemeriksaan: 'Hb: 10,5 g/dL', posyandu: 'Sungai Raya', desa: 'Sungai Raya', tanggalPeriksa: '20 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', catatanMedis: 'Anemia ringan dalam kehamilan', rekomendasiDinkes: 'Edukasi konsumsi TTD dan makanan tinggi zat besi.' },
  { id: 'ih-04', no: 4, namaIbu: 'Dewi Anggraini', nik: '3275017701020004', usiaKehamilan: '26 minggu', hasilPemeriksaan: 'Usia: 17 tahun', posyandu: 'Harapan', desa: 'Harapan', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', catatanMedis: 'Kehamilan usia remaja <20 tahun', rekomendasiDinkes: 'KIE psikososial, nutrisi remaja, dan persiapan rujukan bersalin.' },
  { id: 'ih-05', no: 5, namaIbu: 'Putri Amelia', nik: '3275018803970005', usiaKehamilan: '30 minggu', hasilPemeriksaan: 'Riwayat preeklamsia sebelumnya', posyandu: 'Mulia', desa: 'Mulia', tanggalPeriksa: '24 Okt 2026', statusTindakLanjut: 'Rujuk', catatanMedis: 'Riwayat obstetri buruk / Preeklamsia rekuren', rekomendasiDinkes: 'Rujukan terencana ke Sp.OG RSUD Kabupaten.' },
  { id: 'ih-06', no: 6, namaIbu: 'Siti Aminah', nik: '3200000000000003', usiaKehamilan: '28 minggu', hasilPemeriksaan: 'TD: 135/85 mmHg, Anemia Ringan', posyandu: 'Manud Jaya', desa: 'Manud Jaya', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', catatanMedis: 'Borderline prehipertensi dengan anemia', rekomendasiDinkes: 'Pemantauan tensi 2x seminggu di Posyandu.' },
  { id: 'ih-07', no: 7, namaIbu: 'Megawati Sukma', nik: '3275019904930007', usiaKehamilan: '34 minggu', hasilPemeriksaan: 'LILA: 22 cm, BB turun', posyandu: 'Dahlia 3', desa: 'Tanjung Sari', tanggalPeriksa: '21 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', catatanMedis: 'KEK dengan kenaikan BB tidak adekuat', rekomendasiDinkes: 'Intervensi nutrisi protein tinggi dan kontrol USG.' },
  { id: 'ih-08', no: 8, namaIbu: 'Hesti Wulandari', nik: '3275011105950008', usiaKehamilan: '36 minggu', hasilPemeriksaan: 'Letak sungsang / Bokong', posyandu: 'Mawar 2', desa: 'Sungai Raya', tanggalPeriksa: '22 Okt 2026', statusTindakLanjut: 'Rujuk', catatanMedis: 'Malpresentasi janin trimester 3 akhir', rekomendasiDinkes: 'Rujukan ke RSUD untuk skrining versi luar / rencana SC.' },
  { id: 'ih-09', no: 9, namaIbu: 'Tari Safitri', nik: '3275012206920009', usiaKehamilan: '18 minggu', hasilPemeriksaan: 'GDA: 195 mg/dL', posyandu: 'Cempaka 2', desa: 'Mulia', tanggalPeriksa: '19 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', catatanMedis: 'Kecurigaan Diabetes Melitus Gestasional (DMG)', rekomendasiDinkes: 'Pemeriksaan TTGO lanjutan di Lab Puskesmas.' },
  { id: 'ih-10', no: 10, namaIbu: 'Ayu Kartika', nik: '3275013307990010', usiaKehamilan: '31 minggu', hasilPemeriksaan: 'TD: 150/95 mmHg, Proteinuria +1', posyandu: 'Kenanga 5', desa: 'Soreang Baru', tanggalPeriksa: '24 Okt 2026', statusTindakLanjut: 'Rujuk', catatanMedis: 'Preeklamsia Ringan (PER)', rekomendasiDinkes: 'Rujukan segera ke Faskes Rujukan Tingkat Lanjut (FKRTL).' },
  { id: 'ih-11', no: 11, namaIbu: 'Yuliana Saputri', nik: '3275014408910011', usiaKehamilan: '22 minggu', hasilPemeriksaan: 'LILA: 20,5 cm', posyandu: 'Melati 1', desa: 'Mandiri Jaya', tanggalPeriksa: '20 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', catatanMedis: 'KEK Berat', rekomendasiDinkes: 'Intervensi paket PMT Pemulihan 90 hari.' },
  { id: 'ih-12', no: 12, namaIbu: 'Laila Fitriani', nik: '3275015509930012', usiaKehamilan: '27 minggu', hasilPemeriksaan: 'Hb: 8,9 g/dL', posyandu: 'Anggrek 4', desa: 'Harapan', tanggalPeriksa: '22 Okt 2026', statusTindakLanjut: 'Rujuk', catatanMedis: 'Anemia Sedang-Berat', rekomendasiDinkes: 'Rujukan ke Puskesmas untuk evaluasi terapi besi parenteral.' },
  { id: 'ih-13', no: 13, namaIbu: 'Novita Sari', nik: '3275016610940013', usiaKehamilan: '33 minggu', hasilPemeriksaan: 'Edema tungkai bawah bilateral', posyandu: 'Flamboyan 3', desa: 'Purnama', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', catatanMedis: 'Retensi cairan fisiologis tanpa proteinuria', rekomendasiDinkes: 'Edukasi elevasi kaki dan diet rendah garam.' },
  { id: 'ih-14', no: 14, namaIbu: 'Endah Retno', nik: '3275017711900014', usiaKehamilan: '35 minggu', hasilPemeriksaan: 'Grande Multiparitas (Hamil ke-5)', posyandu: 'Kamboja 2', desa: 'Melati', tanggalPeriksa: '24 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', catatanMedis: 'Risiko tinggi atonia uteri pasca persalinan', rekomendasiDinkes: 'Konseling KB pasca salin dan persiapan donor darah pendamping.' },
  { id: 'ih-15', no: 15, namaIbu: 'Dian Kusuma', nik: '3275018812980015', usiaKehamilan: '29 minggu', hasilPemeriksaan: 'DJJ Takikardia >160x/menit', posyandu: 'Teratai 4', desa: 'Sumber Makmur', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Rujuk', catatanMedis: 'Gawat janin relatif / takikardia janin', rekomendasiDinkes: 'Observasi ketat CTG di Puskesmas PONED.' },
  { id: 'ih-16', no: 16, namaIbu: 'Ratna Juwita', nik: '3275019901960016', usiaKehamilan: '20 minggu', hasilPemeriksaan: 'Riwayat Abortus Berulang 2x', posyandu: 'Manud Jaya', desa: 'Manud Jaya', tanggalPeriksa: '21 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', catatanMedis: 'Inkompetensi serviks teratasi', rekomendasiDinkes: 'Pemantauan istirahat tirah baring dan kontrol berkala.' },
  { id: 'ih-17', no: 17, namaIbu: 'Kartika Dewi', nik: '3275011102920017', usiaKehamilan: '38 minggu', hasilPemeriksaan: 'KPD (Ketuban Pecah Dini)', posyandu: 'Mawar 2', desa: 'Sungai Raya', tanggalPeriksa: '25 Okt 2026', statusTindakLanjut: 'Rujuk', catatanMedis: 'Emergensi obstetri KPD aterm', rekomendasiDinkes: 'Evakuasi cepat ke VK Bersalin RSUD.' },
  { id: 'ih-18', no: 18, namaIbu: 'Indah Permata', nik: '3275012203970018', usiaKehamilan: '25 minggu', hasilPemeriksaan: 'Pertambahan BB minim (<0.5kg/bln)', posyandu: 'Bougenville 1', desa: 'Manud Jaya', tanggalPeriksa: '24 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', catatanMedis: 'Hambatan asupan nutrisi karena mual', rekomendasiDinkes: 'Konsultasi diet gizi seimbang oleh Nutrisionis Puskesmas.' }
];

const FALLBACK_BALITA_STUNTING = [
  { id: 'st-01', no: 1, namaAnak: 'Ardi Pratama', nik: '3275021102240001', usia: '18 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 68 cm', bbUkur: 'BB: 7,8 kg', posyandu: 'Tanjung Sari', desa: 'Tanjung Sari', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Sangat Pendek (Severely Stunted)', intervensiPmt: 'Pemberian makanan tambahan lokal kaya protein hewani telur & ikan.' },
  { id: 'st-02', no: 2, namaAnak: 'Aisyah Azzahra', nik: '3275022204240002', usia: '24 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 80 cm', bbUkur: 'BB: 9,1 kg', posyandu: 'Sungai Raya', desa: 'Sungai Raya', tanggalUkur: '20 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Monitoring kenaikan TB/U bulanan dan asupan susu formula khusus.' },
  { id: 'st-03', no: 3, namaAnak: 'Rizki Maulana', nik: '3275023306230003', usia: '36 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 85 cm', bbUkur: 'BB: 10,8 kg', posyandu: 'Mandiri Jaya', desa: 'Mandiri Jaya', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Skrining infeksi kronis (TBC anak) di Puskesmas.' },
  { id: 'st-04', no: 4, namaAnak: 'Nayla Putri', nik: '3275024408240004', usia: '20 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 70 cm', bbUkur: 'BB: 7,5 kg', posyandu: 'Harapan', desa: 'Harapan', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Rujuk', statusGizi: 'Sangat Pendek & Gizi Kurang', intervensiPmt: 'Rujukan ke Dokter Spesialis Anak (Sp.A) RSUD Kabupaten.' },
  { id: 'st-05', no: 5, namaAnak: 'Zidan Maulana', nik: '3275025510230005', usia: '30 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 84 cm', bbUkur: 'BB: 10,2 kg', posyandu: 'Mulia', desa: 'Mulia', tanggalUkur: '21 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pendampingan kader posyandu untuk konsumsi gizi seimbang.' },
  { id: 'st-06', no: 6, namaAnak: 'Kenzo Alfarizi', nik: '3275026612240006', usia: '14 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 69 cm', bbUkur: 'BB: 7,6 kg', posyandu: 'Manud Jaya', desa: 'Manud Jaya', tanggalUkur: '23 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Intervensi PMT Pemulihan biskuit balita gizi.' },
  { id: 'st-07', no: 7, namaAnak: 'Bilqis Khumaira', nik: '3275027702240007', usia: '19 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 71 cm', bbUkur: 'BB: 7,9 kg', posyandu: 'Kenanga 5', desa: 'Soreang Baru', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Edukasi pola asuh dan sanitasi air minum keluarga.' },
  { id: 'st-08', no: 8, namaAnak: 'Fathir Ahmad', nik: '3275028804230008', usia: '34 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 83 cm', bbUkur: 'BB: 10,1 kg', posyandu: 'Flamboyan 3', desa: 'Purnama', tanggalUkur: '20 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Evaluasi grafik KMS bulanan menunjukkan kenaikan positif.' },
  { id: 'st-09', no: 9, namaAnak: 'Mikayla Anindita', nik: '3275029906240009', usia: '16 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 68 cm', bbUkur: 'BB: 7,3 kg', posyandu: 'Kamboja 2', desa: 'Melati', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Rujuk', statusGizi: 'Sangat Pendek (Severely Stunted)', intervensiPmt: 'Rujukan tata laksana stunting dengan red flags faskes sekunder.' },
  { id: 'st-10', no: 10, namaAnak: 'Alvino Rayyan', nik: '3275021108230010', usia: '28 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 81 cm', bbUkur: 'BB: 9,7 kg', posyandu: 'Teratai 4', desa: 'Sumber Makmur', tanggalUkur: '23 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Suplementasi mikronutrien taburia zat besi dan seng.' },
  { id: 'st-11', no: 11, namaAnak: 'Zahra Humaira', nik: '3275022210240011', usia: '12 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 65 cm', bbUkur: 'BB: 6,8 kg', posyandu: 'Bougenville 1', desa: 'Manud Jaya', tanggalUkur: '25 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Sangat Pendek (Severely Stunted)', intervensiPmt: 'Edukasi MP-ASI berkualitas kaya asam amino esensial.' },
  { id: 'st-12', no: 12, namaAnak: 'Raffasya Malik', nik: '3275023312230012', usia: '22 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 76 cm', bbUkur: 'BB: 8,8 kg', posyandu: 'Mawar 3', desa: 'Sungai Raya', tanggalUkur: '21 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Terjadi kenaikan tinggi badan 1,2 cm pasca intervensi.' },
  { id: 'st-13', no: 13, namaAnak: 'Naura Salsabila', nik: '3275024401240013', usia: '21 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 74 cm', bbUkur: 'BB: 8,3 kg', posyandu: 'Anggrek 2', desa: 'Harapan', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pemberian suplemen vitamin A dan obat cacing rutin.' },
  { id: 'st-14', no: 14, namaAnak: 'Dhafin Raditya', nik: '3275025503230014', usia: '35 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 84 cm', bbUkur: 'BB: 10,4 kg', posyandu: 'Dahlia 1', desa: 'Tanjung Sari', tanggalUkur: '20 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Kondisi stabil, nafsu makan meningkat.' },
  { id: 'st-15', no: 15, namaAnak: 'Syakila Azkadina', nik: '3275026605240015', usia: '17 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 69 cm', bbUkur: 'BB: 7,4 kg', posyandu: 'Cempaka 1', desa: 'Mulia', tanggalUkur: '23 Okt 2026', statusTindakLanjut: 'Rujuk', statusGizi: 'Sangat Pendek & Anemia', intervensiPmt: 'Rujukan pemeriksaan Hb dan evaluasi malabsorpsi usus.' },
  { id: 'st-16', no: 16, namaAnak: 'Hafiz Ibnu', nik: '3275027707230016', usia: '31 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 82 cm', bbUkur: 'BB: 9,9 kg', posyandu: 'Melati 3', desa: 'Mandiri Jaya', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pemberian paket pangan hewani bergizi kerja sama desa.' },
  { id: 'st-17', no: 17, namaAnak: 'Alula Farzana', nik: '3275028809240017', usia: '15 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 67 cm', bbUkur: 'BB: 7,1 kg', posyandu: 'Kenanga 2', desa: 'Soreang Baru', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Sangat Pendek (Severely Stunted)', intervensiPmt: 'Kunjungan rumah (home visit) kader posyandu tiap pekan.' },
  { id: 'st-18', no: 18, namaAnak: 'Kenzie Danendra', nik: '3275029911230018', usia: '26 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 79 cm', bbUkur: 'BB: 9,3 kg', posyandu: 'Flamboyan 1', desa: 'Purnama', tanggalUkur: '21 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Ibu aktif mengikuti kelas gizi balita.' },
  { id: 'st-19', no: 19, namaAnak: 'Aqila Nadhifa', nik: '3275021101240019', usia: '23 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 75 cm', bbUkur: 'BB: 8,6 kg', posyandu: 'Kamboja 1', desa: 'Melati', tanggalUkur: '20 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pendampingan sanitasi jamban sehat keluarga.' },
  { id: 'st-20', no: 20, namaAnak: 'Bima Sakti', nik: '3275022203230020', usia: '33 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 83 cm', bbUkur: 'BB: 10,0 kg', posyandu: 'Teratai 1', desa: 'Sumber Makmur', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pemberian susu tinggi energi sesuai panduan gizi puskesmas.' },
  { id: 'st-21', no: 21, namaAnak: 'Chelsea Olivia', nik: '3275023305240021', usia: '19 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 72 cm', bbUkur: 'BB: 8,0 kg', posyandu: 'Manud Jaya', desa: 'Manud Jaya', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pertumbuhan mulai mendekati kurva normal hijau.' },
  { id: 'st-22', no: 22, namaAnak: 'Gibran Rakabuming', nik: '3275024407230022', usia: '29 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 81 cm', bbUkur: 'BB: 9,8 kg', posyandu: 'Mawar 2', desa: 'Sungai Raya', tanggalUkur: '23 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pemberian makanan olahan ikan gabus dan daun kelor.' },
  { id: 'st-23', no: 23, namaAnak: 'Khadijah Maryam', nik: '3275025509240023', usia: '13 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 66 cm', bbUkur: 'BB: 6,9 kg', posyandu: 'Anggrek 4', desa: 'Harapan', tanggalUkur: '25 Okt 2026', statusTindakLanjut: 'Rujuk', statusGizi: 'Sangat Pendek (Severely Stunted)', intervensiPmt: 'Rujukan lanjutan curiga kelainan genetik/skeletal.' },
  { id: 'st-24', no: 24, namaAnak: 'Faris Althaf', nik: '3275026611230024', usia: '25 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 78 cm', bbUkur: 'BB: 9,2 kg', posyandu: 'Dahlia 3', desa: 'Tanjung Sari', tanggalUkur: '21 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Monitoring berat dan tinggi badan mingguan di poskesdes.' },
  { id: 'st-25', no: 25, namaAnak: 'Safiyya Almahyra', nik: '3275027701240025', usia: '21 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 74 cm', bbUkur: 'BB: 8,4 kg', posyandu: 'Cempaka 2', desa: 'Mulia', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pemberian suplemen zink 10mg selama 14 hari.' },
  { id: 'st-26', no: 26, namaAnak: 'Reyhan Alvaro', nik: '3275028803230026', usia: '35 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 84 cm', bbUkur: 'BB: 10,5 kg', posyandu: 'Melati 1', desa: 'Mandiri Jaya', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Tinggi badan naik konsisten dalam 2 bulan.' },
  { id: 'st-27', no: 27, namaAnak: 'Shanita Rahma', nik: '3275029905240027', usia: '18 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 70 cm', bbUkur: 'BB: 7,7 kg', posyandu: 'Kenanga 5', desa: 'Soreang Baru', tanggalUkur: '20 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Edukasi pentingnya protein hewani harian untuk balita.' },
  { id: 'st-28', no: 28, namaAnak: 'Yusuf Habibi', nik: '3275021107230028', usia: '27 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 80 cm', bbUkur: 'BB: 9,6 kg', posyandu: 'Flamboyan 3', desa: 'Purnama', tanggalUkur: '23 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Intervensi nutrisi keluarga berhasil diterapkan.' },
  { id: 'st-29', no: 29, namaAnak: 'Zivanna Letisha', nik: '3275022209240029', usia: '14 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 67 cm', bbUkur: 'BB: 7,0 kg', posyandu: 'Kamboja 2', desa: 'Melati', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Sangat Pendek (Severely Stunted)', intervensiPmt: 'Intervensi formula F-75/F-100 pemulihan gizi.' },
  { id: 'st-30', no: 30, namaAnak: 'Aditya Pratama', nik: '3275023311230030', usia: '32 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 83 cm', bbUkur: 'BB: 10,2 kg', posyandu: 'Teratai 4', desa: 'Sumber Makmur', tanggalUkur: '21 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Keluarga menerima bantuan sembako gizi desa.' },
  { id: 'st-31', no: 31, namaAnak: 'Talita Humaira', nik: '3275024401240031', usia: '22 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 75 cm', bbUkur: 'BB: 8,7 kg', posyandu: 'Manud Jaya', desa: 'Manud Jaya', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Pemantauan konsumsi garam beryodium dan air bersih.' },
  { id: 'st-32', no: 32, namaAnak: 'Ibrahim Pasha', nik: '3275025503230032', usia: '36 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 85 cm', bbUkur: 'BB: 10,9 kg', posyandu: 'Sungai Raya', desa: 'Sungai Raya', tanggalUkur: '25 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti', statusGizi: 'Pendek (Stunted)', intervensiPmt: 'Perbaikan status gizi mendekati batas median.' }
];

const FALLBACK_REKAP_POSYANDU = [
  { no: 1, nama: 'Manud Jaya', desa: 'Manud Jaya', totalKunjungan: 156, totalPasien: 156, totalBayi: 156, totalBalita: 156, totalIbuHamil: 156, totalIbuNifas: 156, trend: '↑ 12%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 2, nama: 'Mawar 2', desa: 'Sungai Raya', totalKunjungan: 124, totalPasien: 124, totalBayi: 124, totalBalita: 124, totalIbuHamil: 124, totalIbuNifas: 124, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 3, nama: 'Anggrek 4', desa: 'Harapan', totalKunjungan: 144, totalPasien: 144, totalBayi: 144, totalBalita: 144, totalIbuHamil: 144, totalIbuNifas: 144, trend: '↑ 10%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 4, nama: 'Dahlia 3', desa: 'Tanjung Sari', totalKunjungan: 137, totalPasien: 137, totalBayi: 137, totalBalita: 137, totalIbuHamil: 137, totalIbuNifas: 137, trend: '↑ 9%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 5, nama: 'Cempaka 2', desa: 'Mulia', totalKunjungan: 130, totalPasien: 130, totalBayi: 130, totalBalita: 130, totalIbuHamil: 130, totalIbuNifas: 130, trend: '↑ 11%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 6, nama: 'Melati 1', desa: 'Mandiri Jaya', totalKunjungan: 122, totalPasien: 122, totalBayi: 122, totalBalita: 122, totalIbuHamil: 122, totalIbuNifas: 122, trend: '↑ 7%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 7, nama: 'Kenanga 5', desa: 'Soreang Baru', totalKunjungan: 118, totalPasien: 118, totalBayi: 118, totalBalita: 118, totalIbuHamil: 118, totalIbuNifas: 118, trend: '↑ 6%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 8, nama: 'Flamboyan 3', desa: 'Purnama', totalKunjungan: 115, totalPasien: 115, totalBayi: 115, totalBalita: 115, totalIbuHamil: 115, totalIbuNifas: 115, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 9, nama: 'Kamboja 2', desa: 'Melati', totalKunjungan: 110, totalPasien: 110, totalBayi: 110, totalBalita: 110, totalIbuHamil: 110, totalIbuNifas: 110, trend: '↑ 5%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 10, nama: 'Teratai 4', desa: 'Sumber Makmur', totalKunjungan: 108, totalPasien: 108, totalBayi: 108, totalBalita: 108, totalIbuHamil: 108, totalIbuNifas: 108, trend: '↑ 7%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 11, nama: 'Bougenville 1', desa: 'Manud Jaya', totalKunjungan: 98, totalPasien: 98, totalBayi: 98, totalBalita: 98, totalIbuHamil: 98, totalIbuNifas: 98, trend: '↑ 6%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 12, nama: 'Mawar 3', desa: 'Sungai Raya', totalKunjungan: 95, totalPasien: 95, totalBayi: 95, totalBalita: 95, totalIbuHamil: 95, totalIbuNifas: 95, trend: '↑ 4%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 13, nama: 'Anggrek 2', desa: 'Harapan', totalKunjungan: 92, totalPasien: 92, totalBayi: 92, totalBalita: 92, totalIbuHamil: 92, totalIbuNifas: 92, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 14, nama: 'Dahlia 1', desa: 'Tanjung Sari', totalKunjungan: 88, totalPasien: 88, totalBayi: 88, totalBalita: 88, totalIbuHamil: 88, totalIbuNifas: 88, trend: '↑ 5%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 15, nama: 'Cempaka 1', desa: 'Mulia', totalKunjungan: 85, totalPasien: 85, totalBayi: 85, totalBalita: 85, totalIbuHamil: 85, totalIbuNifas: 85, trend: '↑ 7%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 16, nama: 'Melati 3', desa: 'Mandiri Jaya', totalKunjungan: 82, totalPasien: 82, totalBayi: 82, totalBalita: 82, totalIbuHamil: 82, totalIbuNifas: 82, trend: '↑ 4%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 17, nama: 'Kenanga 2', desa: 'Soreang Baru', totalKunjungan: 78, totalPasien: 78, totalBayi: 78, totalBalita: 78, totalIbuHamil: 78, totalIbuNifas: 78, trend: '↑ 3%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 18, nama: 'Flamboyan 1', desa: 'Purnama', totalKunjungan: 75, totalPasien: 75, totalBayi: 75, totalBalita: 75, totalIbuHamil: 75, totalIbuNifas: 75, trend: '↑ 6%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 19, nama: 'Kamboja 1', desa: 'Melati', totalKunjungan: 72, totalPasien: 72, totalBayi: 72, totalBalita: 72, totalIbuHamil: 72, totalIbuNifas: 72, trend: '↑ 5%', terakhirDiperbarui: '30/10/2026 21:50' },
  { no: 20, nama: 'Teratai 1', desa: 'Sumber Makmur', totalKunjungan: 70, totalPasien: 70, totalBayi: 70, totalBalita: 70, totalIbuHamil: 70, totalIbuNifas: 70, trend: '↑ 4%', terakhirDiperbarui: '30/10/2026 21:50' }
];

const FALLBACK_REKAP_DESA = [
  { no: 1, desa: 'Manud Jaya', jumlahPosyandu: 72, totalPasien: 156, totalBayi: 156, totalBalita: 156, totalIbuHamil: 156, totalIbuNifas: 156, trend: '↑ 12%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 32, ibuRisiko: 6, imunisasiRendah: 18 },
  { no: 2, desa: 'Sungai Raya', jumlahPosyandu: 68, totalPasien: 124, totalBayi: 124, totalBalita: 124, totalIbuHamil: 124, totalIbuNifas: 124, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 22, ibuRisiko: 4, imunisasiRendah: 12 },
  { no: 3, desa: 'Tanjung Sari', jumlahPosyandu: 56, totalPasien: 144, totalBayi: 144, totalBalita: 144, totalIbuHamil: 144, totalIbuNifas: 144, trend: '↑ 10%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 16, ibuRisiko: 3, imunisasiRendah: 10 },
  { no: 4, desa: 'Melati', jumlahPosyandu: 51, totalPasien: 137, totalBayi: 137, totalBalita: 137, totalIbuHamil: 137, totalIbuNifas: 137, trend: '↑ 9%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 6, ibuRisiko: 1, imunisasiRendah: 4 },
  { no: 5, desa: 'Mulia', jumlahPosyandu: 130, totalPasien: 130, totalBayi: 130, totalBalita: 130, totalIbuHamil: 130, totalIbuNifas: 130, trend: '↑ 11%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 14, ibuRisiko: 2, imunisasiRendah: 8 },
  { no: 6, desa: 'Mandiri Jaya', jumlahPosyandu: 45, totalPasien: 122, totalBayi: 122, totalBalita: 122, totalIbuHamil: 122, totalIbuNifas: 122, trend: '↑ 7%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 8, ibuRisiko: 2, imunisasiRendah: 5 },
  { no: 7, desa: 'Soreang Baru', jumlahPosyandu: 42, totalPasien: 118, totalBayi: 118, totalBalita: 118, totalIbuHamil: 118, totalIbuNifas: 118, trend: '↑ 6%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 18, ibuRisiko: 3, imunisasiRendah: 9 },
  { no: 8, desa: 'Purnama', jumlahPosyandu: 38, totalPasien: 115, totalBayi: 115, totalBalita: 115, totalIbuHamil: 115, totalIbuNifas: 115, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 5, ibuRisiko: 1, imunisasiRendah: 3 },
  { no: 9, desa: 'Harapan', jumlahPosyandu: 35, totalPasien: 110, totalBayi: 110, totalBalita: 110, totalIbuHamil: 110, totalIbuNifas: 110, trend: '↑ 5%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 12, ibuRisiko: 2, imunisasiRendah: 7 },
  { no: 10, desa: 'Sumber Makmur', jumlahPosyandu: 30, totalPasien: 108, totalBayi: 108, totalBalita: 108, totalIbuHamil: 108, totalIbuNifas: 108, trend: '↑ 7%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 9, ibuRisiko: 1, imunisasiRendah: 4 }
];

export const dinkesService = {
  // Master Filter Options
  getFilterOptions() {
    return {
      periode: ['Oktober 2024', 'September 2024', 'Agustus 2024', 'Juli 2024'],
      kecamatan: ['Semua Kecamatan', 'Kecamatan Manud Jaya', 'Kecamatan Sumberrejo', 'Kecamatan Melati Jaya'],
      desa: [
        'Semua Desa',
        'Desa Manud Jaya',
        'Desa Sungai Raya',
        'Desa Tanjung Sari',
        'Desa Harapan',
        'Desa Mulia',
        'Desa Mandiri Jaya',
        'Desa Soreang Baru',
        'Desa Purnama',
        'Desa Melati',
        'Desa Sumber Makmur'
      ],
      posyandu: [
        'Semua Posyandu',
        'Manud Jaya',
        'Mawar 2',
        'Anggrek 4',
        'Dahlia 3',
        'Cempaka 2',
        'Melati 1',
        'Kenanga 5',
        'Flamboyan 3',
        'Kamboja 2',
        'Teratai 4',
        'Bougenville 1',
        'Mawar 3',
        'Anggrek 2',
        'Dahlia 1',
        'Cempaka 1',
        'Melati 3',
        'Kenanga 2',
        'Flamboyan 1',
        'Kamboja 1',
        'Teratai 1'
      ]
    };
  },

  /**
   * Mengambil daftar seluruh posyandu secara dinamis dari database Supabase
   * Menggabungkan master tabel posyandu dan dinkes_rekapitulasi_posyandu
   */
  async getDaftarPosyandu() {
    const list = new Set();
    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Ambil dari master tabel posyandu
        const { data: posData } = await supabase
          .from('posyandu')
          .select('nama')
          .eq('is_suspended', false)
          .order('nama', { ascending: true });
        if (posData && posData.length > 0) {
          posData.forEach(p => p.nama && list.add(p.nama.trim()));
        }

        // 2. Ambil dari dinkes_rekapitulasi_posyandu
        const { data: dinkesPos } = await supabase
          .from('dinkes_rekapitulasi_posyandu')
          .select('nama')
          .order('no', { ascending: true });
        if (dinkesPos && dinkesPos.length > 0) {
          dinkesPos.forEach(p => p.nama && list.add(p.nama.trim()));
        }

        // 3. Ambil juga posyandu dari dinkes_balita_stunting
        const { data: stuntingPos } = await supabase
          .from('dinkes_balita_stunting')
          .select('posyandu')
          .limit(100);
        if (stuntingPos && stuntingPos.length > 0) {
          stuntingPos.forEach(p => p.posyandu && list.add(p.posyandu.trim()));
        }
      } catch (e) {
        console.warn('Gagal fetch daftar posyandu dari database:', e);
      }
    }

    // Baseline fallback jika belum terhubung database
    if (list.size === 0) {
      FALLBACK_REKAP_POSYANDU.forEach(p => list.add(p.nama));
    }

    return Array.from(list);
  },

  // 1. Dashboard 6 Stat Cards
  async getDashboardStats() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_dashboard_summary')
          .select('*')
          .limit(1)
          .single();

        if (!error && data) {
          return {
            totalPosyandu: data.total_posyandu ?? 26,
            totalPosyanduTarget: data.total_posyandu_target ?? 28,
            posyanduTrend: data.posyandu_trend ?? '+4%',
            totalKunjungan: data.total_kunjungan ?? 1248,
            kunjunganTrend: data.kunjungan_trend ?? '+12%',
            bayiDitimbang: data.bayi_ditimbang ?? 1036,
            bayiPersenSasaran: data.bayi_persen_sasaran ?? 83,
            bayiTrend: data.bayi_trend ?? '+9%',
            balitaDitimbang: data.balita_ditimbang ?? 892,
            balitaPersenSasaran: data.balita_persen_sasaran ?? 72,
            balitaTrend: data.balita_trend ?? '+11%',
            ibuHamilDiperiksa: data.ibu_hamil_diperiksa ?? 168,
            ibuHamilPersenSasaran: data.ibu_hamil_persen_sasaran ?? 89,
            ibuHamilTrend: data.ibu_hamil_trend ?? '+6%',
            ibuNifas: data.ibu_nifas ?? 72,
            ibuNifasPersenSasaran: data.ibu_nifas_persen_sasaran ?? 77,
            ibuNifasTrend: data.ibu_nifas_trend ?? '+7%',
            imunisasiLengkap: data.imunisasi_lengkap_balita ?? 638,
            imunisasiBelumLengkap: data.imunisasi_belum_lengkap_balita ?? 254
          };
        }
      } catch (e) {
        console.warn('Fallback ke stats default dinkes:', e);
      }
    }

    return FALLBACK_STATS;
  },

  // 2. Line Chart Tren Kunjungan Posyandu
  async getTrenKunjungan() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_tren_bulanan')
          .select('*')
          .order('urutan', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            bulan: d.bulan,
            total: d.total,
            balita: d.balita,
            ibuHamil: d.ibu_hamil,
            ibuNifas: d.ibu_nifas
          }));
        }
      } catch (e) {
        console.warn('Fallback ke tren kunjungan default:', e);
      }
    }

    return FALLBACK_TREN;
  },

  // 3. Top 5 Posyandu Kunjungan Tertinggi
  async getTopPosyandu() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_rekapitulasi_posyandu')
          .select('*')
          .order('total_kunjungan', { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          return data.map((item, idx) => ({
            no: idx + 1,
            nama: item.nama,
            desa: item.desa,
            totalKunjungan: item.total_kunjungan,
            totalPasien: item.total_pasien,
            totalBayi: item.total_bayi,
            totalBalita: item.total_balita,
            totalIbuHamil: item.total_ibu_hamil,
            totalIbuNifas: item.total_ibu_nifas,
            trend: item.trend,
            terakhirDiperbarui: item.terakhir_diperbarui
          }));
        }
      } catch (e) {
        console.warn('Fallback ke top posyandu default:', e);
      }
    }

    return FALLBACK_REKAP_POSYANDU.slice(0, 5);
  },

  // 4. Daftar Ibu Hamil Berisiko Tinggi (18 Data)
  async getIbuHamilRisiko() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_ibu_hamil_risiko')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            namaIbu: item.nama_ibu,
            nik: item.nik,
            usiaKehamilan: item.usia_kehamilan,
            hasilPemeriksaan: item.hasil_pemeriksaan,
            posyandu: item.posyandu,
            desa: item.desa,
            tanggalPeriksa: item.tanggal_periksa,
            statusTindakLanjut: item.status_tindak_lanjut,
            catatanMedis: item.catatan_medis,
            rekomendasiDinkes: item.rekomendasi_dinkes
          }));
        }
      } catch (e) {
        console.warn('Fallback ke ibu hamil risiko default:', e);
      }
    }

    return FALLBACK_IBU_RISIKO;
  },

  // 5. Daftar Balita dengan Indikasi Stunting (32 Data)
  async getBalitaStunting() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_balita_stunting')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            namaAnak: item.nama_anak,
            nik: item.nik,
            usia: item.usia,
            jenisKelamin: item.jenis_kelamin,
            hasilUkur: item.hasil_ukur,
            bbUkur: item.bb_ukur,
            posyandu: item.posyandu,
            desa: item.desa,
            tanggalUkur: item.tanggal_ukur,
            statusTindakLanjut: item.status_tindak_lanjut,
            statusGizi: item.status_gizi,
            intervensiPmt: item.intervensi_pmt
          }));
        }
      } catch (e) {
        console.warn('Fallback ke balita stunting default:', e);
      }
    }

    return FALLBACK_BALITA_STUNTING;
  },

  // 6. Rekapitulasi Berdasarkan Posyandu (20 Posyandu)
  async getRekapitulasiByPosyandu() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_rekapitulasi_posyandu')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            nama: item.nama,
            desa: item.desa,
            totalKunjungan: item.total_kunjungan,
            totalPasien: item.total_pasien,
            totalBayi: item.total_bayi,
            totalBalita: item.total_balita,
            totalIbuHamil: item.total_ibu_hamil,
            totalIbuNifas: item.total_ibu_nifas,
            trend: item.trend,
            terakhirDiperbarui: item.terakhir_diperbarui
          }));
        }
      } catch (e) {
        console.warn('Fallback ke rekap posyandu default:', e);
      }
    }

    return FALLBACK_REKAP_POSYANDU;
  },

  // 7. Rekapitulasi Berdasarkan Desa (10 Desa)
  async getRekapitulasiByDesa() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_rekapitulasi_desa')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            desa: item.desa,
            jumlahPosyandu: item.jumlah_posyandu,
            totalPasien: item.total_pasien,
            totalBayi: item.total_bayi,
            totalBalita: item.total_balita,
            totalIbuHamil: item.total_ibu_hamil,
            totalIbuNifas: item.total_ibu_nifas,
            trend: item.trend,
            terakhirDiperbarui: item.terakhir_diperbarui,
            kasusStunting: item.kasus_stunting,
            ibuRisiko: item.ibu_risiko,
            imunisasiRendah: item.cakupan_imunisasi_rendah
          }));
        }
      } catch (e) {
        console.warn('Fallback ke rekap desa default:', e);
      }
    }

    return FALLBACK_REKAP_DESA;
  },

  // 8. Update Status Tindak Lanjut
  async updateStatusTindakLanjut(tipe, id, statusBaru) {
    if (isSupabaseConfigured && supabase) {
      try {
        const table = tipe === 'ibu' ? 'dinkes_ibu_hamil_risiko' : 'dinkes_balita_stunting';
        const { error } = await supabase
          .from(table)
          .update({ status_tindak_lanjut: statusBaru, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (!error) return { success: true };
      } catch (e) {
        console.warn('Gagal update status di Supabase:', e);
      }
    }
    return { success: true, localOnly: true };
  },

  // 9. Export Data ke CSV (Mendukung fleksibel arguments)
  exportToCsv(arg1, arg2, arg3) {
    if (typeof arg1 === 'string' && Array.isArray(arg2) && Array.isArray(arg3)) {
      return exportToCsvFile({ filename: arg1, headers: arg2, rows: arg3 });
    }
    if (Array.isArray(arg1) && typeof arg2 === 'string') {
      const data = arg1;
      const filename = arg2;
      if (data.length === 0) {
        return exportToCsvFile({ filename, headers: ['Data Kosong'], rows: [] });
      }
      if (Array.isArray(data[0])) {
        return exportToCsvFile({ filename, headers: arg3 || [], rows: data });
      }
      const headers = arg3 || Object.keys(data[0]);
      const rows = data.map((item) => headers.map((h) => item[h] ?? ''));
      return exportToCsvFile({ filename, headers, rows });
    }
    if (arg1 && typeof arg1 === 'object') {
      return exportToCsvFile(arg1);
    }
  }
};
