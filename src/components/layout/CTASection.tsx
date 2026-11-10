import Link from "next/link"

// curved grid: rings + radial lines around a point below the section
const CX = 500
const CY = 900
const rings = [560, 640, 720, 800, 880]
const angles = Array.from({ length: 21 }, (_, i) => 40 + i * 5) // 40° to 140°

export default function CTASection() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-black px-5 py-28 text-white sm:py-36">
      {/* 1. dark dome with glowing edge */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-30 aspect-square w-[170%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,#0b0b12_0%,#050508_60%)] shadow-[0_-2px_30px_rgba(120,100,255,0.35)] sm:w-[130%]" />

      {/* 2. curved grid lines */}
      <svg
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMin slice"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full [mask-image:linear-gradient(to_bottom,black_30%,transparent_95%)]"
        aria-hidden="true"
      >
        <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          {rings.map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} />
          ))}
          {angles.map((a) => {
            const rad = (a * Math.PI) / 180
            return (
              <line
                key={a}
                x1={CX}
                y1={CY}
                x2={CX + Math.cos(rad) * 1000}
                y2={CY - Math.sin(rad) * 1000}
              />
            )
          })}
        </g>
      </svg>

      {/* 3. blue-purple glow at the top */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_75%_at_50%_0%,rgba(84,70,255,0.95)_0%,rgba(52,40,190,0.6)_30%,rgba(30,22,110,0.25)_55%,transparent_75%)]" />

      {/* content */}
      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center text-center">
        <h2 className="max-w-[460px] text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Your next role is already looking for you
        </h2>

        <p className="mt-5 max-w-[520px] text-xs leading-relaxed text-zinc-400 sm:text-sm">
          Build a profile in three minutes. The matches start arriving tomorrow morning.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-zinc-200"
          >
            Create a free account
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg border border-white/10 bg-[#111113]/80 px-5 py-2.5 text-xs font-medium text-zinc-200 backdrop-blur transition hover:bg-[#1a1a1d]"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  )
}