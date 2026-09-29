export type UserRole = 'developer' | 'teacher' | 'student';

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  nisn_nip: string | null;
  school_id: string | null;
  created_at: string;
};

export type AttendanceLog = {
  id: string;
  user_id: string;
  check_in_time: string;
  lat: number;
  lng: number;
  distance: number;
  selfie_url: string | null;
  status: 'present' | 'late' | 'rejected';
};

export type Exam = {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  token: string;
  start_time: string;
  duration_minutes: number;
  is_active: boolean;
};

export type Question = {
  id: string;
  exam_id: string;
  question_type: 'pg' | 'essay';
  prompt: string;
  latex_formula: string | null;
  image_url: string | null;
  options: string[] | null;
  answer_key: string | null;
  max_score: number;
};

export type ExamSession = {
  id: string;
  exam_id: string;
  student_id: string;
  start_time: string;
  status: 'active' | 'submitted' | 'violation';
  violations_count: number;
};

export type StudentAnswer = {
  id: string;
  session_id: string;
  question_id: string;
  student_response: string | null;
  uploaded_image_url: string | null;
  ai_transcription: string | null;
  ai_score: number | null;
  ai_feedback: string | null;
  is_verified: boolean;
};
