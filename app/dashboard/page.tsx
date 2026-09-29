import Link from 'next/link';

const stats = [
  { label: 'Siswa aktif', value: '1,284' },
  { label: 'Ujian terjadwal', value: '42' },
  { label: 'Kehadiran hari ini', value: '96.4%' },
  { label: 'Essay AI terproses', value: '1,208' },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">SIAKAD AI Control Center</h1>
          </div>
          <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-200">
            Beranda
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Agenda & Aktivitas</h2>
            <div className="mt-6 space-y-5">
              {[
                '09:00 — Kelas X IPA: Ulangan Harian Matematika',
                '10:30 — Guru: validasi bank soal dan rubrik AI',
                '12:00 — Absensi siswa kehadiran geofence terkoreksi',
                '14:00 — Proktor mengawasi sesi CBT aktif',
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Status Sistem</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li>• Supabase Auth: aktif</li>
              <li>• Postgres RLS: terkonfigurasi</li>
              <li>• Storage bucket attendance-records: siap pakai</li>
              <li>• Gemini API: mode fallback / ready</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
