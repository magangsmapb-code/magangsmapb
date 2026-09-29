import { NextRequest } from 'next/server';
import { attendanceRequestSchema } from '@/lib/validation';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = attendanceRequestSchema.parse(body);

    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from('attendance_logs').insert({
      user_id: payload.user_id,
      check_in_time: new Date().toISOString(),
      lat: payload.lat,
      lng: payload.lng,
      distance: payload.distance,
      selfie_url: payload.selfie_url ?? null,
      status: payload.status,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      ok: true,
      status: payload.status,
      message: payload.status === 'present' ? 'Kehadiran berhasil diverifikasi.' : 'Kehadiran tercatat walau terlambat.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bad request';
    return Response.json({ error: message }, { status: 400 });
  }
}
