import React from 'react';
import PencarianPasien from './components/PencarianPasien';
import Step1DataKunjungan from './components/Step1DataKunjungan';
import Step2JenisPelayanan from './components/Step2JenisPelayanan';
import Step3StatusKehadiran from './components/Step3StatusKehadiran';
import Step4Konfirmasi from './components/Step4Konfirmasi';
import RiwayatKunjunganCard from './components/RiwayatKunjunganCard';
import { useRegistrasiController } from './useRegistrasiController';

export default function RegistrasiPage({ currentUser, onBackToDashboard, onTambahPesertaBaru }) {
  const {
    mode,
    setMode,
    currentStep,
    setCurrentStep,
    searchQuery,
    setSearchQuery,
    jenisFilter,
    setJenisFilter,
    statusFilter,
    setStatusFilter,
    wilayahFilter,
    setWilayahFilter,
    handleResetFilter,
    pesertaList,
    selectedPeserta,
    riwayatList,
    handleSelectPeserta,
    kunjunganData,
    handleChangeKunjungan,
    selectedPelayanan,
    handleTogglePelayanan,
    statusKehadiran,
    setStatusKehadiran,
    catatan,
    setCatatan,
    submitting,
    handleSubmitRegistrasi
  } = useRegistrasiController(currentUser, onBackToDashboard);

  const steps = [
    { num: 1, label: 'Data Kunjungan' },
    { num: 2, label: 'Jenis Pelayanan' },
    { num: 3, label: 'Status Kehadiran' },
    { num: 4, label: 'Konfirmasi' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div>
        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
          <span>Registrasi Kunjungan</span>
          {mode === 'wizard' && (
            <>
              <span>›</span>
              <span className={currentStep === 1 ? 'text-slate-800 font-bold' : ''}>Data Kunjungan</span>
              {currentStep >= 2 && (
                <>
                  <span>›</span>
                  <span className={currentStep === 2 ? 'text-slate-800 font-bold' : ''}>Jenis Pelayanan</span>
                </>
              )}
              {currentStep >= 3 && (
                <>
                  <span>›</span>
                  <span className={currentStep === 3 ? 'text-slate-800 font-bold' : ''}>Status Kehadiran</span>
                </>
              )}
              {currentStep === 4 && (
                <>
                  <span>›</span>
                  <span className="text-slate-800 font-bold">Konfirmasi</span>
                </>
              )}
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {mode === 'pencarian' ? 'Registrasi' : 'Registrasi Kunjungan'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {mode === 'pencarian'
            ? 'Cari peserta yang akan melakukan kunjungan Posyandu.'
            : 'Lengkapi data kunjungan peserta Posyandu.'}
        </p>
      </div>

      {/* Stepper Progress Bar (Hanya tampil saat mode wizard) */}
      {mode === 'wizard' && (
        <div className="py-2">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-200 -z-0" />
            
            {steps.map((st) => {
              const isActive = currentStep === st.num;
              const isPast = currentStep > st.num;
              return (
                <div key={st.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isPast ? '✓' : st.num}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {mode === 'pencarian' ? (
        <PencarianPasien
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          jenisFilter={jenisFilter}
          setJenisFilter={setJenisFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          wilayahFilter={wilayahFilter}
          setWilayahFilter={setWilayahFilter}
          onResetFilter={handleResetFilter}
          pesertaList={pesertaList}
          onSelectPeserta={handleSelectPeserta}
          onTambahPesertaBaru={onTambahPesertaBaru}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Wizard Step Form */}
          <div className="flex-1 w-full min-w-0">
            {currentStep === 1 && (
              <Step1DataKunjungan
                peserta={selectedPeserta}
                kunjunganData={kunjunganData}
                onChangeData={handleChangeKunjungan}
                onUbahPeserta={() => setMode('pencarian')}
                onNext={() => setCurrentStep(2)}
                onBatal={() => setMode('pencarian')}
              />
            )}

            {currentStep === 2 && (
              <Step2JenisPelayanan
                peserta={selectedPeserta}
                selectedPelayanan={selectedPelayanan}
                onTogglePelayanan={handleTogglePelayanan}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <Step3StatusKehadiran
                statusKehadiran={statusKehadiran}
                onChangeStatus={setStatusKehadiran}
                catatan={catatan}
                onChangeCatatan={setCatatan}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 4 && (
              <Step4Konfirmasi
                peserta={selectedPeserta}
                kunjunganData={kunjunganData}
                selectedPelayanan={selectedPelayanan}
                statusKehadiran={statusKehadiran}
                catatan={catatan}
                onGoToStep={(stepNum) => setCurrentStep(stepNum)}
                onBack={() => setCurrentStep(3)}
                onSubmit={handleSubmitRegistrasi}
                loading={submitting}
              />
            )}
          </div>

          {/* Right Info & History Sidebar (PBI 03E) */}
          <RiwayatKunjunganCard riwayatList={riwayatList} />
        </div>
      )}
    </div>
  );
}
