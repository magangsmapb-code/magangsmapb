import Link from 'next/link';

export default function MuridPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Portal Murid</p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard Siswa</h1>
          </div>
          <Link href="/" className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50">
            Kembali
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['Jadwal hari ini', '7 Mata Pelajaran • 4 kegiatan ekstrakurikuler'],
            ['Absensi', '5/5 hadir • 0 izin'],
            ['Nilai', 'Rata-rata 88.7'] ,
            ['Ujian', 'Matematika: 22 September 09:00'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
