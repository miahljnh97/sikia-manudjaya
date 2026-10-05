/**
 * Schema Mapper Terpusat (Single Source of Truth) untuk SIKIA
 * Menangani konversi dua arah antara Front-End (UI model) dan Database (Supabase PostgreSQL)
 */
import {
  normalizePeserta,
  tentukanJenisPeserta,
  hitungUsiaDariTglLahir,
  resolveDusunId,
  resolveTipeId,
  toDbStatusKehadiran,
  fromDbStatusKehadiran,
  formatPesertaDbPayload,
  TIPE_MAP,
  DUSUN_MAP,
  DUSUN_NAME_MAP,
  isValidUUID
} from './pesertaAdapter';

export {
  // Peserta
  normalizePeserta as pesertaFromDb,
  formatPesertaDbPayload as pesertaToDb,
  formatPesertaDbPayload,
  normalizePeserta,
  tentukanJenisPeserta,
  hitungUsiaDariTglLahir,

  // Status Kehadiran
  toDbStatusKehadiran as kunjunganStatusToDb,
  fromDbStatusKehadiran as kunjunganStatusFromDb,
  toDbStatusKehadiran,
  fromDbStatusKehadiran,

  // Foreign Key Resolvers & Maps
  resolveDusunId,
  resolveTipeId,
  isValidUUID,
  TIPE_MAP,
  DUSUN_MAP,
  DUSUN_NAME_MAP
};
