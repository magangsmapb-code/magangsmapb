import { GeofenceAttendance } from '@/components/attendance/geofence-attendance';

export default function DeveloperPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Developer Control Center</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Konfigurasi model AI, master sekolah, token exam, audit logs, dan role management.
        </p>
        <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Portal Absensi Siswa</h2>
          <GeofenceAttendance />
        </div>
      </div>
    </main>
  );
}
