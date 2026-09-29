'use client';

import { useEffect, useState } from 'react';
import { SCHOOL_TARGET, haversineDistanceKm, isLikelyMockGPS } from '@/lib/geofence';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export function GeofenceAttendance() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Siap memvalidasi lokasi dan selfie');
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Browser tidak mendukung geolocation.');
      return;
    }

    setLoading(true);
    setStatus('Mengambil lokasi GPS...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const dist = haversineDistanceKm(latitude, longitude, SCHOOL_TARGET.lat, SCHOOL_TARGET.lng);
        setLocation({ lat: latitude, lng: longitude, accuracy });
        setDistance(dist);

        if (accuracy > SCHOOL_TARGET.allowedAccuracyMeters || dist > SCHOOL_TARGET.radiusMeters) {
          setStatus('Lokasi ditolak: akurasi GPS atau jarak melebihi batas validasi.');
        } else {
          setStatus(`Lokasi valid. Jarak ${dist.toFixed(1)} m dari target sekolah.`);
        }
        setLoading(false);
      },
      (error) => {
        setStatus(`Gagal mengambil lokasi: ${error.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSelfieSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelfieFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus('Selfie siap dikirim. Pastikan kamera real-time dan belum dari galeri.');
  };

  const submitAttendance = async () => {
    if (!location) {
      setStatus('Lokasi belum diambil.');
      return;
    }

    const mockSignal = isLikelyMockGPS(location.accuracy);
    const dist = distance ?? haversineDistanceKm(location.lat, location.lng, SCHOOL_TARGET.lat, SCHOOL_TARGET.lng);

    if (mockSignal || dist > SCHOOL_TARGET.radiusMeters || location.accuracy > SCHOOL_TARGET.allowedAccuracyMeters) {
      setStatus('Absensi ditolak karena validasi GPS gagal.');
      return;
    }

    if (!selfieFile) {
      setStatus('Wajib mengunggah selfie langsung dari kamera.');
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const fileName = `attendance/${Date.now()}-${selfieFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('attendance-records').upload(fileName, selfieFile, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) throw uploadError;

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/attendance-records/${uploadData?.path}`;

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'demo-user',
          lat: location.lat,
          lng: location.lng,
          distance: dist,
          accuracy: location.accuracy,
          selfie_url: publicUrl,
          status: dist <= 30 ? 'present' : 'late',
        }),
      });

      const payload = await res.json();

      if (!res.ok) throw new Error(payload.error ?? 'Attendance failed');

      setStatus(`Absensi berhasil disimpan. Status: ${payload.status}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      setStatus(`Absensi gagal: ${message}`);
    }
  };

  const isValid = Boolean(location && !isLikelyMockGPS(location.accuracy) && (distance ?? 0) <= SCHOOL_TARGET.radiusMeters && selfieFile);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-medium">Status validasi</p>
        <p className="mt-2">{status}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={captureLocation}
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Mendeteksi lokasi...' : 'Ambil Lokasi GPS'}
        </button>

        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 font-medium text-slate-700">
          <input type="file" accept="image/*" capture="user" className="hidden" onChange={onSelfieSelect} />
          Ambil Selfie Real-time
        </label>
      </div>

      {previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <img src={previewUrl} alt="Selfie preview" className="h-64 w-full rounded-xl object-cover" />
        </div>
      ) : null}

      {location ? (
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latitude</p>
            <p className="mt-1 text-lg font-semibold">{location.lat.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Longitude</p>
            <p className="mt-1 text-lg font-semibold">{location.lng.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Akurasi</p>
            <p className="mt-1 text-lg font-semibold">{location.accuracy.toFixed(0)} m</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Jarak ke target</p>
            <p className="mt-1 text-lg font-semibold">{(distance ?? 0).toFixed(1)} m</p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={submitAttendance}
        disabled={!isValid}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Validasi & Simpan Kehadiran
      </button>
    </div>
  );
}
