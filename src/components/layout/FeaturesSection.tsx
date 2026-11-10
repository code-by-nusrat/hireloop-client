const features = [
  {
    title: "Smart Search",
    desc: "Find your ideal job with advanced filters.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    title: "Salary Insights",
    desc: "Get real salary data to negotiate confidently.",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 15 4-5 3 3 5-7" />
      </>
    ),
  },
  {
    title: "Top Companies",
    desc: "Apply to vetted companies that are hiring.",
    icon: (
      <>
        <path d="M4 21V10h6v11M10 21V4h10v17M3 21h18" />
        <path d="M13 8h4M13 12h4M13 16h4" />
      </>
    ),
  },
  {
    title: "Saved Jobs",
    desc: "Manage apps & favorites on your dashboard.",
    icon: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
  },
  {
    title: "One-Click Apply",
    desc: "Simplify your job applications for an easier process!",
    icon: (
      <>
        <path d="m9 9 11 4-5 2-2 5-4-11Z" />
        <path d="M5 3v2M3 5h2M13 3v2M6.5 6.5 5 5" />
      </>
    ),
  },
  {
    title: "Resume Builder",
    desc: "Create professional resumes with modern templates.",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
  },
  {
    title: "Skill-Based Matching",
    desc: "Discover jobs that match your skills and experience.",
    icon: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />,
  },
  {
    title: "Career Growth Resources",
    desc: "Boost your career with quick interview tips.",
    icon: (
      <>
        <path d="m3 17 6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
  },
]

export default function FeaturesSection() {
  return (
    <section className="w-full bg-[#141414] px-5 py-20 text-white">
      <div className="mx-auto max-w-[1100px]">
        {/* heading */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            <span className="h-1.5 w-1.5 bg-indigo-500" />
            Features Job
            <span className="h-1.5 w-1.5 bg-indigo-500" />
          </div>
          <h2 className="mt-3 max-w-[420px] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Everything you need to succeed
          </h2>
        </div>

        {/* features grid */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl border border-white/5 bg-gradient-to-b from-[#1a1a1d] to-[#0a0a0b]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d8b4fe"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </div>
              <div className="pt-0.5">
                <h3 className="text-[13px] font-medium text-white">{f.title}</h3>
                <p className="mt-1.5 max-w-[190px] text-[11px] leading-relaxed text-zinc-500">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}