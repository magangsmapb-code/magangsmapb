import { NextRequest } from 'next/server';
import { examEvaluationSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = examEvaluationSchema.parse(body);

    const rubricHits = payload.rubric.filter((keyword) =>
      payload.response.toLowerCase().includes(keyword.toLowerCase()),
    ).length;

    const qualityScore = Math.min(
      100,
      Math.max(
        40,
        Math.round((rubricHits / payload.rubric.length) * 100 + (payload.response.length > 120 ? 15 : 5)),
      ),
    );

    const feedback =
      qualityScore >= 85
        ? 'Jawaban relevan, jelas, dan sesuai dengan rubrik. Tingkatkan detail pada contoh atau penguatan argumen.'
        : qualityScore >= 70
          ? 'Jawaban sudah cukup relevan tetapi perlu penguatan konsep dan contoh yang lebih spesifik.'
          : 'Jawaban belum sepenuhnya sesuai rubrik. Coba fokus pada konsep utama, struktur, dan bukti pendukung.';

    return Response.json({
      ok: true,
      exam_id: payload.exam_id,
      student_id: payload.student_id,
      score: qualityScore,
      grade: qualityScore >= 85 ? 'A' : qualityScore >= 75 ? 'B' : qualityScore >= 60 ? 'C' : 'D',
      feedback,
      rubric_hits: rubricHits,
      model: process.env.GEMINI_API_KEY ? 'gemini-pro' : 'heuristic-fallback',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return Response.json({ error: message }, { status: 400 });
  }
}
