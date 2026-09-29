-- Create schema for SIAKAD AI
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('developer', 'teacher', 'student')),
  full_name text not null,
  nisn_nip text,
  school_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  check_in_time timestamptz not null default now(),
  lat double precision not null,
  lng double precision not null,
  distance double precision not null default 0,
  selfie_url text,
  status text not null check (status in ('present', 'late', 'rejected'))
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subject text not null,
  token text not null,
  start_time timestamptz not null,
  duration_minutes integer not null default 60,
  is_active boolean not null default true
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  question_type text not null check (question_type in ('pg', 'essay')),
  prompt text not null,
  latex_formula text,
  image_url text,
  options jsonb,
  answer_key text,
  max_score integer not null default 100
);

create table if not exists public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  start_time timestamptz not null default now(),
  status text not null check (status in ('active', 'submitted', 'violation')) default 'active',
  violations_count integer not null default 0
);

create table if not exists public.student_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.exam_sessions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  student_response text,
  uploaded_image_url text,
  ai_transcription text,
  ai_score numeric(5,2),
  ai_feedback text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.attendance_logs enable row level security;
alter table public.exams enable row level security;
alter table public.questions enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.student_answers enable row level security;

create policy "Profiles are viewable by authenticated users"
on public.profiles
for select
using (auth.uid() is not null);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Teachers and developers can insert attendance logs"
on public.attendance_logs
for insert
with check (
  auth.uid() is not null
);

create policy "Users can view attendance logs related to them"
on public.attendance_logs
for select
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
);

create policy "Developers and teachers can manage exams"
on public.exams
for all
using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
)
with check (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
);

create policy "Authenticated users can view exam content"
on public.questions
for select
using (auth.uid() is not null);

create policy "Teachers and developers can manage exam questions"
on public.questions
for all
using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
)
with check (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
);

create policy "Students can manage their own exam sessions"
on public.exam_sessions
for all
using (
  auth.uid() = student_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
)
with check (
  auth.uid() = student_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
);

create policy "Students can manage their own answers"
on public.student_answers
for all
using (
  exists (
    select 1
    from public.exam_sessions es
    where es.id = session_id and es.student_id = auth.uid()
  )
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
)
with check (
  exists (
    select 1
    from public.exam_sessions es
    where es.id = session_id and es.student_id = auth.uid()
  )
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('developer', 'teacher')
  )
);

create index if not exists idx_attendance_logs_user_id on public.attendance_logs(user_id);
create index if not exists idx_exams_teacher_id on public.exams(teacher_id);
create index if not exists idx_questions_exam_id on public.questions(exam_id);
create index if not exists idx_exam_sessions_student_id on public.exam_sessions(student_id);
create index if not exists idx_student_answers_session_id on public.student_answers(session_id);
