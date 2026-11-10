import Link from "next/link"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/worker-ai" },
      { label: "Companies", href: "/companies" },
      { label: "Salary data", href: "/salary" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Career library", href: "/library" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand" },
      { label: "Newsroom", href: "/news" },
    ],
  },
]

const socials = [
  {
    name: "Facebook",
    href: "#",
    active: false,
    icon: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8.5c0-.3.2-.5.5-.5H14Z" fill="currentColor" stroke="none" />,
  },
  {
    name: "Dribbble",
    href: "#",
    active: true,
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M5 8c5 1 9 0 12-3M3.5 13c6-1 11 0 15 5M9 3.5c3 4 4.5 9 5 17" />
      </>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    active: false,
    icon: (
      <path
        d="M5 9h3v10H5V9Zm1.5-4.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM10 9h2.9v1.4c.5-.9 1.6-1.7 3.2-1.7 3 0 3.9 1.9 3.9 4.6V19h-3v-5.2c0-1.3-.3-2.3-1.7-2.3S13 12.5 13 13.8V19h-3V9Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
]

export default function Footer() {
  return (
    <footer className="w-full bg-black px-5 pb-8 pt-14 text-white">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* brand */}
          <div className="max-w-[240px]">
            <Link href="/" className="text-[28px] font-bold leading-none tracking-tight">
              <span className="text-sky-500">hire</span>
              <span className="text-sky-500">l</span>
              <span className="text-orange-500">oo</span>
              <span className="text-orange-500">p</span>
            </Link>
            <p className="mt-5 text-[11px] leading-relaxed text-zinc-400">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3 lg:gap-x-16">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-medium text-indigo-400">{col.title}</h4>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[11px] text-zinc-400 transition hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                  s.active
                    ? "bg-indigo-600 text-white"
                    : "bg-[#141416] text-zinc-300 hover:bg-[#1c1c1f]"
                }`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
            <span>Copyright 2024 – Programming Hero</span>
            <span className="text-zinc-300">
              <Link href="/terms" className="hover:text-white">Terms &amp; Policy</Link>
              {" - "}
              <Link href="/guidelines" className="hover:text-white">Privacy Guideline</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}