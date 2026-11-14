'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Briefcase, MapPinOff, FileWarning, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteLogo } from "@/components/layout/site-header"

export default function NotFound() {
  const pathname = usePathname()

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Keyframes for the loop animation */}
      <style>{`
        @keyframes hl-spin { to { transform: rotate(360deg); } }
        @keyframes hl-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes hl-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes hl-blink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @media (prefers-reduced-motion: reduce) {
          .hl-anim { animation: none !important; }
        }
      `}</style>

      {/* Background: grid + brand glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-sky-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 size-96 rounded-full bg-orange-500/20 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <SiteLogo />

        {/* 4 [loop] 4 */}
        <div
          className="hl-anim flex items-center justify-center gap-1 sm:gap-3"
          style={{ animation: "hl-float 6s ease-in-out infinite" }}
          aria-label="404"
          role="img"
        >
          <span className="bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-8xl font-black leading-none text-transparent sm:text-9xl">
            4
          </span>

          <div className="relative size-24 sm:size-32">
            {/* outer ring */}
            <svg
              viewBox="0 0 100 100"
              className="hl-anim absolute inset-0 size-full"
              style={{ animation: "hl-spin 10s linear infinite" }}
            >
              <defs>
                <linearGradient id="hl-g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#hl-g1)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="190 74"
              />
            </svg>
            {/* inner ring, spins the other way */}
            <svg
              viewBox="0 0 100 100"
              className="hl-anim absolute inset-0 size-full"
              style={{ animation: "hl-spin-rev 6s linear infinite" }}
            >
              <circle
                cx="50"
                cy="50"
                r="26"
                fill="none"
                stroke="#f97316"
                strokeOpacity=".7"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="60 104"
              />
            </svg>
            {/* orbiting dot */}
            <div
              className="hl-anim absolute inset-0"
              style={{ animation: "hl-spin 4s linear infinite" }}
            >
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 rounded-full bg-sky-400 shadow-[0_0_14px_3px_rgba(56,189,248,.8)]" />
            </div>
          </div>

          <span className="bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-8xl font-black leading-none text-transparent sm:text-9xl">
            4
          </span>
        </div>

        {/* Job-posting style card */}
        <div className="w-full overflow-hidden rounded-2xl border bg-card/70 text-left shadow-xl backdrop-blur">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <FileWarning className="size-4 text-orange-500" />
              Job posting
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive">
              <span
                className="hl-anim size-1.5 rounded-full bg-destructive"
                style={{ animation: "hl-blink 1.6s ease-in-out infinite" }}
              />
              Position closed
            </span>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Senior Page Finder
              </h1>
              <p className="text-sm text-muted-foreground">
                HireLoop · Remote · Full-time
              </p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              We looked everywhere, but this page has already been filled,
              moved, or never existed in the first place. Don&apos;t worry,
              there are plenty of other openings waiting for you.
            </p>

            <dl className="grid grid-cols-1 gap-2 rounded-xl border bg-background/60 p-3 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPinOff className="mt-0.5 size-4 shrink-0 text-sky-400" />
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">Location</dt>
                  <dd className="truncate font-mono text-xs text-foreground">
                    {pathname}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 size-4 shrink-0 text-orange-500" />
                <div>
                  <dt className="text-xs text-muted-foreground">Requirement</dt>
                  <dd className="text-xs text-foreground">A working link</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/" />}
            className="rounded-full px-6"
          >
            <ArrowLeft />
            Back to home
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            size="lg"
            render={<Link href="/jobs" />}
            className="rounded-full px-6"
          >
            <Briefcase />
            Browse open jobs
          </Button>
        </div>
      </div>
    </main>
  )
}