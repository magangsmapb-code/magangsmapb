import Link from 'next/link';

const roles = [
  {
    title: 'Developer',
    description: 'Full system control, model configuration, audit logs, and school token management.',
    href: '/developer',
  },
  {
    title: 'Guru',
    description: 'Class management, question bank, exam authoring, AI scoring, attendance, and grades.',
    href: '/guru',
  },
  {
    title: 'Murid',
    description: 'Schedule dashboard, geofenced attendance, secure CBT, assignment hand-in, and score history.',
    href: '/murid',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">SMA PEMBERDAYAAN BANGSA</p>
            <h1 className="mt-3 text-4xl font-bold">SIAKAD AI</h1>
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            RBAC • Supabase • Next.js • AI
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-sm">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">Platform Overview</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight">
              Sistem akademik modern, aman, dan terintegrasi dengan AI untuk sekolah digital.
            </h2>
            <p className="mt-5 max-w-xl text-base text-slate-300">
              Fitur utama mencakup absensi anti-kecurangan berbasis geofence, ujian terkunci dengan proctoring,
              koreksi esai otomatis, serta dashboard role-based access untuk developer, guru, dan murid.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-400">
                Lihat Dashboard
              </Link>
              <Link href="/developer" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10">
                Role Management
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Key Capabilities</p>
            <ul className="mt-5 space-y-4 text-sm text-slate-200">
              <li>• GPS geofence validation with server-side time enforcement</li>
              <li>• Secure CBT engine with fullscreen lock and tab violation detection</li>
              <li>• Gemini-powered exam question generation and essay evaluation</li>
              <li>• Supabase Postgres schema with RLS and storage policies</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {roles.map((role) => (
            <Link key={role.title} href={role.href} className="group rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:border-emerald-400/40 hover:bg-slate-800">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                {role.title}
              </div>
              <p className="text-slate-300">{role.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
