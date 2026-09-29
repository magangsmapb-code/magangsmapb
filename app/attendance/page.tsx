import { GeofenceAttendance } from '@/components/attendance/geofence-attendance';

export default function AttendancePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Absensi Kehadiran</h1>
        <p className="mt-3 text-slate-600">Validasi GPS, akurasi, selfie liveness, dan waktu server.</p>
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
          <GeofenceAttendance />
        </div>
      </div>
    </main>
  );
}
