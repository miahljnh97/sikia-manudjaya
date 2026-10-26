/**
 * @typedef {Object} Peserta
 * @property {number|string} id
 * @property {string} nama
 * @property {string} nik
 * @property {'Ibu Hamil'|'Balita'|'Bayi'|'Lansia'} jenis_peserta
 * @property {string} usia
 * @property {string} alamat
 * @property {'Sudah Hadir'|'Belum Hadir'|'Tidak Hadir'} status_kehadiran
 * @property {string|null} waktu_hadir
 */

// Master data peserta resmi Posyandu Desa Manud Jaya (Sinkron dengan Supabase)
export const INITIAL_DUMMY_PESERTA = [
  {
    "id": "7ce45374-b870-42fe-9d32-b0ebadd8a9fa",
    "nama": "Aesture",
    "nik": "3200000000000007",
    "no_kk": "",
    "tgl_lahir": "1996-05-06",
    "tanggal_lahir": "1996-05-06",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 2",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": false,
    "is_suspended": true,
    "status": "Tidak Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "c2000000-0000-0000-0000-000000000001",
    "nama": "Aisyah Putri Rahma",
    "nik": "3200000000000211",
    "no_kk": "",
    "tgl_lahir": "2025-11-10",
    "tanggal_lahir": "2025-11-10",
    "jenis_kelamin": "P",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "081200000203",
    "telepon": "081200000203",
    "alamat": "Dusun 1, RT 03 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": "c1000000-0000-0000-0000-000000000003",
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "06b1c286-adb3-4c40-a6cf-51e7c0fa5a12",
    "nama": "Alea Shanum Almahira",
    "nik": "3275082400090001",
    "no_kk": "",
    "tgl_lahir": "2025-01-01",
    "tanggal_lahir": "2025-01-01",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 3",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": "d5eeb9a6-3509-44ec-8fce-e95f3edd1a73",
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "6ffa00a7-127a-48b7-b9eb-67ea7a346c19",
    "nama": "Ariana Venti",
    "nik": "3200000000000006",
    "no_kk": "",
    "tgl_lahir": "2024-01-30",
    "tanggal_lahir": "2024-01-30",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 3",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "b0d0ceae-d9bb-4c7c-b569-3c22a1bd96fd",
    "nama": "Ariana Venti",
    "nik": "3200000000000004",
    "no_kk": "",
    "tgl_lahir": "",
    "tanggal_lahir": "",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "3a7c81d2-9901-4c12-88ef-123456789abc",
    "ibu_id": null,
    "aktif": false,
    "is_suspended": true,
    "status": "Tidak Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "3a7c81d2-9901-4c12-88ef-123456789abc",
      "kode": "bayi",
      "nama": "Bayi"
    }
  },
  {
    "id": "15d93fd4-d04b-4603-b6f1-3d0a1c9bbf2f",
    "nama": "Ayes",
    "nik": "3200000000000002",
    "no_kk": "",
    "tgl_lahir": "2013-08-12",
    "tanggal_lahir": "2013-08-12",
    "jenis_kelamin": "P",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "081380909606",
    "telepon": "081380909606",
    "alamat": "Dusun 1",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "3a51c129-19f3-4c59-abdd-0d89898eef76",
    "nama": "Bela nusantara",
    "nik": "1234567891234567",
    "no_kk": "",
    "tgl_lahir": "1969-06-13",
    "tanggal_lahir": "1969-06-13",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 2",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "7e4f92a1-8812-4d34-99fe-abcdef123456",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "7e4f92a1-8812-4d34-99fe-abcdef123456",
      "kode": "lansia",
      "nama": "Lansia"
    }
  },
  {
    "id": "0f154ec8-374f-451e-ba80-5cbea9780554",
    "nama": "Bela wati",
    "nik": "3275889900122244",
    "no_kk": "",
    "tgl_lahir": "1992-10-09",
    "tanggal_lahir": "1992-10-09",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": null,
    "no_wa": "082299110212",
    "telepon": "082299110212",
    "alamat": "Jakarta",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "c1000000-0000-0000-0000-000000000001",
    "nama": "Dewi Anggraeni",
    "nik": "3200000000000201",
    "no_kk": "",
    "tgl_lahir": "1994-04-15",
    "tanggal_lahir": "1994-04-15",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": "Hendra Wijaya",
    "no_wa": "081200000201",
    "telepon": "081200000201",
    "alamat": "Dusun 3, RT 01 / RW 02, Desa Manud Jaya",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "b2222222-2222-2222-2222-222222222222",
    "nama": "Dian Pranata",
    "nik": "3200000000000099",
    "no_kk": "3200000000000000",
    "tgl_lahir": "2025-07-15",
    "tanggal_lahir": "2025-07-15",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "082211333153",
    "telepon": "082211333153",
    "alamat": "Dusun 2, RT 02 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": "55af67c9-6695-4435-b4ea-2720efd73c92",
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "c1000000-0000-0000-0000-000000000002",
    "nama": "Fitri Handayani",
    "nik": "3200000000000202",
    "no_kk": "",
    "tgl_lahir": "1997-09-03",
    "tanggal_lahir": "1997-09-03",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": "Dimas Saputra",
    "no_wa": "081200000202",
    "telepon": "081200000202",
    "alamat": "Dusun 2, RT 02 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "d5eeb9a6-3509-44ec-8fce-e95f3edd1a73",
    "nama": "Ibu Ratna",
    "nik": "3275082400000001",
    "no_kk": "",
    "tgl_lahir": "2021-01-01",
    "tanggal_lahir": "2021-01-01",
    "jenis_kelamin": "L",
    "status_ibu": "nifas",
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 3, Desa Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "7e4f92a1-8812-4d34-99fe-abcdef123456",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "7e4f92a1-8812-4d34-99fe-abcdef123456",
      "kode": "lansia",
      "nama": "Lansia"
    }
  },
  {
    "id": "abd8686d-13a6-4746-883e-2e1c960ffb8e",
    "nama": "John Afk",
    "nik": "3271080101110001",
    "no_kk": "",
    "tgl_lahir": "2026-10-01",
    "tanggal_lahir": "2026-10-01",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": null,
    "aktif": false,
    "is_suspended": true,
    "status": "Tidak Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "eb12b211-0e51-4ce2-88af-4760b87d783b",
    "nama": "Lana Del Ray",
    "nik": "3200000000000005",
    "no_kk": "",
    "tgl_lahir": "2026-09-08",
    "tanggal_lahir": "2026-09-08",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 3",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "3a7c81d2-9901-4c12-88ef-123456789abc",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "3a7c81d2-9901-4c12-88ef-123456789abc",
      "kode": "bayi",
      "nama": "Bayi"
    }
  },
  {
    "id": "c1000000-0000-0000-0000-000000000003",
    "nama": "Lestari Wulandari",
    "nik": "3200000000000203",
    "no_kk": "",
    "tgl_lahir": "1995-12-20",
    "tanggal_lahir": "1995-12-20",
    "jenis_kelamin": "P",
    "status_ibu": "menyusui",
    "nama_suami": "Rudi Hartono",
    "no_wa": "081200000203",
    "telepon": "081200000203",
    "alamat": "Dusun 1, RT 03 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "982eab39-a984-4404-a4d5-9d56ffdb5af7",
    "nama": "Maryam",
    "nik": "3200000000000001",
    "no_kk": "",
    "tgl_lahir": "",
    "tanggal_lahir": "",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 3",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "7e4f92a1-8812-4d34-99fe-abcdef123456",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "7e4f92a1-8812-4d34-99fe-abcdef123456",
      "kode": "lansia",
      "nama": "Lansia"
    }
  },
  {
    "id": "71ab4b1f-9a80-40b2-8c2f-f3b6211f35d2",
    "nama": "Nailin Sukmawati",
    "nik": "1234567892211445",
    "no_kk": "",
    "tgl_lahir": "2026-01-04",
    "tanggal_lahir": "2026-01-04",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "214fbe12-2216-4e61-9b12-9fccca445e84",
    "nama": "Najwa Sihab",
    "nik": "1234567890123456",
    "no_kk": "",
    "tgl_lahir": "1992-01-01",
    "tanggal_lahir": "1992-01-01",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Dusun 3",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "c2000000-0000-0000-0000-000000000003",
    "nama": "Naufal Akbar",
    "nik": "3200000000000213",
    "no_kk": "",
    "tgl_lahir": "2020-03-02",
    "tanggal_lahir": "2020-03-02",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "081200000205",
    "telepon": "081200000205",
    "alamat": "Dusun 2, RT 01 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": "c1000000-0000-0000-0000-000000000005",
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "c1000000-0000-0000-0000-000000000004",
    "nama": "Nurhayati",
    "nik": "3200000000000204",
    "no_kk": "",
    "tgl_lahir": "1992-06-11",
    "tanggal_lahir": "1992-06-11",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": "Joko Susilo",
    "no_wa": "081200000204",
    "telepon": "081200000204",
    "alamat": "Dusun 3, RT 02 / RW 02, Desa Manud Jaya",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "c2000000-0000-0000-0000-000000000002",
    "nama": "Rafi Pratama",
    "nik": "3200000000000212",
    "no_kk": "",
    "tgl_lahir": "2024-05-18",
    "tanggal_lahir": "2024-05-18",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "081200000204",
    "telepon": "081200000204",
    "alamat": "Dusun 3, RT 02 / RW 02, Desa Manud Jaya",
    "dusun": "Dusun 3",
    "dusun_id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": "c1000000-0000-0000-0000-000000000004",
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "3250c081-51e4-44af-b2b6-5535c73f2c41",
      "kode": "DS-03",
      "nama": "Dusun 3"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "c1000000-0000-0000-0000-000000000005",
    "nama": "Sari Rahayu",
    "nik": "3200000000000205",
    "no_kk": "",
    "tgl_lahir": "1990-02-27",
    "tanggal_lahir": "1990-02-27",
    "jenis_kelamin": "P",
    "status_ibu": null,
    "nama_suami": "Anwar Hidayat",
    "no_wa": "081200000205",
    "telepon": "081200000205",
    "alamat": "Dusun 2, RT 01 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "55af67c9-6695-4435-b4ea-2720efd73c92",
    "nama": "Siti Aminah",
    "nik": "3200000000000003",
    "no_kk": "",
    "tgl_lahir": "1996-02-28",
    "tanggal_lahir": "1996-02-28",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": "Ahmad Fauzi",
    "no_wa": "081234567890",
    "telepon": "081234567890",
    "alamat": "Dusun 2, RT 02 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "488a2c6a-92ee-478e-af12-80d5c4548ba2",
    "nama": "Sri angraini",
    "nik": "1234567892233445",
    "no_kk": "",
    "tgl_lahir": "1992-09-10",
    "tanggal_lahir": "1992-09-10",
    "jenis_kelamin": "P",
    "status_ibu": "hamil",
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
    "ibu_id": null,
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "b5e84397-0be0-4515-9fe1-6222b6792bc3",
      "kode": "ibu_hamil",
      "nama": "Ibu Hamil"
    }
  },
  {
    "id": "90876706-2c55-4b8a-b1e7-fa54fd98ca31",
    "nama": "Sukma Ayu",
    "nik": "1234567899876543",
    "no_kk": "",
    "tgl_lahir": "",
    "tanggal_lahir": "",
    "jenis_kelamin": "L",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "-",
    "telepon": "-",
    "alamat": "Manud Jaya",
    "dusun": "Dusun 1",
    "dusun_id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": null,
    "aktif": false,
    "is_suspended": true,
    "status": "Tidak Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "fbe91bbd-c11a-4a19-90ba-ca78f929d791",
      "kode": "DS-01",
      "nama": "Dusun 1"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  },
  {
    "id": "c2000000-0000-0000-0000-000000000004",
    "nama": "Zahra Aulia",
    "nik": "3200000000000214",
    "no_kk": "",
    "tgl_lahir": "2023-08-21",
    "tanggal_lahir": "2023-08-21",
    "jenis_kelamin": "P",
    "status_ibu": null,
    "nama_suami": null,
    "no_wa": "081200000205",
    "telepon": "081200000205",
    "alamat": "Dusun 2, RT 01 / RW 01, Desa Manud Jaya",
    "dusun": "Dusun 2",
    "dusun_id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
    "tipe_id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
    "ibu_id": "c1000000-0000-0000-0000-000000000005",
    "aktif": true,
    "is_suspended": false,
    "status": "Aktif",
    "status_kehadiran": "Belum Hadir",
    "waktu_hadir": null,
    "dusun_relasi": {
      "id": "200a7c92-6671-4b31-a39f-0a03e1fb4a9f",
      "kode": "DS-02",
      "nama": "Dusun 2"
    },
    "tipe_peserta_relasi": {
      "id": "29bad3a5-2808-4ebd-be57-391ff0126b80",
      "kode": "balita",
      "nama": "Balita"
    }
  }
];

export const DUMMY_ACCOUNTS = {
  kader: {
    email: 'kader.posyandu@manudjaya.id',
    role: 'Kader Posyandu',
    nama: 'Annisa Wati',
  },
  bidan: {
    email: 'bidan.desa@manudjaya.id',
    role: 'Bidan Desa',
    nama: 'Bidan Siti, S.Tr.Keb',
  },
  ibu_hamil: {
    email: 'ibu.hamil@manudjaya.id',
    role: 'Ibu',
    nama: 'Najwa Sihab',
    peserta_id: '214fbe12-2216-4e61-9b12-9fccca445e84', // Ibu Hamil Saja (Belum punya anak)
  },
  ibu_balita: {
    email: 'ibu.balita@manudjaya.id',
    role: 'Ibu',
    nama: 'Siti Aminah',
    peserta_id: 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73', // Ibu Balita Saja (Alea Shanum Almahira)
  },
  ibu_hamil_anak: {
    email: 'ibu.hamil.anak@manudjaya.id',
    role: 'Ibu',
    nama: 'Siti Aminah',
    peserta_id: '55af67c9-6695-4435-b4ea-2720efd73c92', // Ibu Hamil dengan Balita (Dian Pranata)
  },
  ibu: {
    email: 'ibu.hamil@manudjaya.id',
    role: 'Ibu',
    nama: 'Najwa Sihab',
    peserta_id: '214fbe12-2216-4e61-9b12-9fccca445e84',
  },
  admin: {
    email: 'admin.desa@manudjaya.id',
    role: 'Super Admin',
    nama: 'Bambang Sudarmono, S.STP',
  }
};

/**
 * Helper untuk mendapatkan peserta_id yang valid berdasarkan data user login.
 * Memastikan persona ibu hamil, ibu balita, dan ibu hamil-balita memiliki ID peserta yang tepat.
 */
export function getPesertaIdFromUser(user) {
  if (!user) return null;
  if (user.peserta_id) return user.peserta_id;
  const email = (user.user?.email || user.email || '').toLowerCase().trim();
  const nama = (user.nama || '').toLowerCase().trim();
  if (email === 'ibu.balita@manudjaya.id' || (email.includes('balita') && !email.includes('hamil')) || nama.includes('ratna')) {
    return 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73';
  }
  if (email === 'ibu.hamil@manudjaya.id' || (email.includes('hamil') && !email.includes('anak') && !email.includes('balita')) || nama.includes('najwa')) {
    return '214fbe12-2216-4e61-9b12-9fccca445e84';
  }
  if (email.includes('hamil.anak') || email === 'siti.aminah@manudjaya.id' || nama.includes('aminah') || nama.includes('siti')) {
    return '55af67c9-6695-4435-b4ea-2720efd73c92';
  }
  return user.user?.id || user.id || null;
}
