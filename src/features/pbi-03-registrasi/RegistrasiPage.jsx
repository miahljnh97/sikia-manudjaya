import React from 'react';
import PencarianPasien from './components/PencarianPasien';
import Step1DataKunjungan from './components/Step1DataKunjungan';
import Step2JenisPelayanan from './components/Step2JenisPelayanan';
import Step3StatusKehadiran from './components/Step3StatusKehadiran';
import Step4Konfirmasi from './components/Step4Konfirmasi';
import RiwayatKunjunganCard from './components/RiwayatKunjunganCard';
import { useRegistrasiController } from './useRegistrasiController';

export default function RegistrasiPage({ 
  currentUser, 
  onBackToDashboard, 
  onTambahPesertaBaru,
  currentPath = '/registrasi-kunjungan',
  onNavigate 
}) {
  const {
    mode,
    currentStep,
    goToStep,
    goToPencarian,
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
  } = useRegistrasiController(currentUser, onBackToDashboard, currentPath, onNavigate);

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
        {mode === 'wizard' && (
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mb-1">
            <button
              type="button"
              onClick={goToPencarian}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Registrasi Kunjungan
            </button>
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
          </div>
        )}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {mode === 'pencarian' ? 'Registrasi' : 'Registrasi Kunjungan'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {mode === 'pencarian'
            ? 'Cari peserta yang akan melakukan kunjungan Posyandu.'
            : 'Lengkapi data kunjungan peserta Posyandu.'}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      {mode === 'wizard' && (
        <div className="py-2">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-8 right-8 h-[2px] bg-slate-200 -z-0" />
            
            {steps.map((st) => {
              const isActive = currentStep === st.num;
              return (
                <div key={st.num} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (st.num <= currentStep) {
                        goToStep(st.num);
                      }
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-md ring-4 ring-blue-100'
                        : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {st.num}
                  </button>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive ? 'text-[#2563EB] font-bold' : 'text-slate-500'
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
                onUbahPeserta={goToPencarian}
                onNext={() => goToStep(2)}
                onBatal={goToPencarian}
              />
            )}

            {currentStep === 2 && (
              <Step2JenisPelayanan
                peserta={selectedPeserta}
                selectedPelayanan={selectedPelayanan}
                onTogglePelayanan={handleTogglePelayanan}
                onBack={() => goToStep(1)}
                onNext={() => goToStep(3)}
              />
            )}

            {currentStep === 3 && (
              <Step3StatusKehadiran
                statusKehadiran={statusKehadiran}
                onChangeStatus={setStatusKehadiran}
                catatan={catatan}
                onChangeCatatan={setCatatan}
                onBack={() => goToStep(2)}
                onNext={() => goToStep(4)}
              />
            )}

            {currentStep === 4 && (
              <Step4Konfirmasi
                peserta={selectedPeserta}
                kunjunganData={kunjunganData}
                selectedPelayanan={selectedPelayanan}
                statusKehadiran={statusKehadiran}
                catatan={catatan}
                onGoToStep={(stepNum) => goToStep(stepNum)}
                onBack={() => goToStep(3)}
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
