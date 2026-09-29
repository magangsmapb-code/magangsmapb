import { ExamProctoringDemo } from '@/components/exams/exam-proctoring-demo';

export default function GuruPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Guru Workspace</h1>
        <p className="mt-3 text-slate-600">
          Manajemen kelas, bank soal, ujian token, koreksi otomatis, rekap nilai, dan absensi.
        </p>
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200">
          <ExamProctoringDemo />
        </div>
      </div>
    </main>
  );
}
