import { z } from 'zod';

export const attendanceRequestSchema = z.object({
  user_id: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  distance: z.number().nonnegative(),
  accuracy: z.number().nonnegative(),
  selfie_url: z.string().url().optional(),
  status: z.enum(['present', 'late', 'rejected']),
});

export const examEvaluationSchema = z.object({
  exam_id: z.string().min(1),
  student_id: z.string().min(1),
  question: z.string().min(10),
  rubric: z.array(z.string()).min(1),
  response: z.string().min(1),
});
