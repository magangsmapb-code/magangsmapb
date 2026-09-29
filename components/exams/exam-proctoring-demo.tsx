'use client';

import { useEffect, useState } from 'react';

export function ExamProctoringDemo() {
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState('Sesi ujian aman sedang aktif.');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (document.fullscreenElement === null) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        setWarning('Browser menolak fullscreen otomatis; lanjutkan dengan persetujuan pengguna.');
      }
    };

    requestFullscreen();

    const onViolation = () => {
      setViolations((prev) => {
        const next = prev + 1;
        setWarning(`Pelanggaran ${next} dari 3. Ujian akan otomatis disubmit pada pelanggaran terakhir.`);

        if (next >= 3) {
          setWarning('Pelanggaran ke-3 terdeteksi. Ujian otomatis disubmit.');
          return 3;
        }
        return next;
      });
    };

    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement !== null);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') onViolation();
    };
    const handleBlur = () => onViolation();

    const preventDefaultEvent = (event: Event) => {
      event.preventDefault();
      onViolation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', preventDefaultEvent);
    document.addEventListener('copy', preventDefaultEvent);
    document.addEventListener('paste', preventDefaultEvent);
    document.addEventListener('cut', preventDefaultEvent);
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const blockedKeys = ['F12', 'PrintScreen', 'Alt', 'Meta'];
      const ctrlBlocked = event.ctrlKey && ['u', 's', 'p', 'c', 'v', 'x'].includes(event.key.toLowerCase());
      const isBlockedKey = blockedKeys.includes(event.key) || ctrlBlocked;

      if (isBlockedKey) {
        event.preventDefault();
        onViolation();
      }
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', preventDefaultEvent);
      document.removeEventListener('copy', preventDefaultEvent);
      document.removeEventListener('paste', preventDefaultEvent);
      document.removeEventListener('cut', preventDefaultEvent);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">Status proctoring</p>
        <p className="mt-2">{warning}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Full Screen</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{isFullscreen ? 'Aktif' : 'Belum'}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Violation</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{violations}/3</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Token</p>
          <p className="mt-2 text-xl font-bold text-slate-900">VALID</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-700">Soal Ujian – Matematika</p>
        <h3 className="mt-3 text-xl font-semibold">Jika 2x + 3 = 11, maka nilai x adalah...</h3>
        <div className="mt-5 space-y-3">
          {['A. 2', 'B. 3', 'C. 4', 'D. 5'].map((option) => (
            <label key={option} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <input type="radio" name="exam-choice" />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
