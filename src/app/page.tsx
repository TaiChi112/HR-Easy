import { auth } from "@/auth";
import Link from "next/link";

export default async function LandingPage() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8 md:pb-20">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:px-6">
          <Link href="/" className="text-base font-semibold tracking-tight text-white sm:text-lg">
            HR Easy
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com/TaiChi112/HR-Easy"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
            >
              GitHub
            </a>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="rounded-lg border border-cyan-300/30 bg-transparent px-3 py-1.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-200/10 hover:text-white"
            >
              {isAuthenticated ? "Dashboard" : "Sign In"}
            </Link>
          </div>
        </nav>

        <section className="mx-auto mt-16 flex w-full max-w-4xl flex-col items-center text-center sm:mt-24">
          <p className="rounded-full border border-cyan-300/40 bg-cyan-200/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Enterprise HR Platform
          </p>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Fast and Modern HRM System for Teams
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-slate-300 sm:text-lg">
            Streamline employee records, attendance tracking, and payroll workflows in a single
            dashboard built for growing teams.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 hover:shadow-cyan-500/30 sm:w-auto"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 hover:shadow-cyan-500/30 sm:w-auto"
              >
                Get Started
              </Link>
            )}
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/70 hover:bg-white/10 sm:w-auto"
            >
              Explore Features
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}