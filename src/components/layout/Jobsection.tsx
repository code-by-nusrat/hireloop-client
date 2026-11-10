import Link from "next/link"

const jobs = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: "Frontend Developer",
  description:
    "Showcase your commitment to diversity and inclusion by highlighting initiatives",
  location: "New York, USA",
  type: "Hybrid",
  pay: "€25–€40/hour",
}))

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

const StackIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
)

const CoinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9.5a3.5 3.5 0 1 0 0 5M8 11h5M8 13h5" />
  </svg>
)

const Tag = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-300">
    {icon}
    {children}
  </span>
)

export default function JobsSection() {
  return (
    <section className="relative mx-auto w-full max-w-[1100px] bg-[#050506] px-5 py-20 text-white">
      {/* top decoration */}
      <div className="mx-auto mb-10 h-[3px] w-8 rounded-full bg-sky-300/80" />

      {/* heading */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
          <span className="h-1.5 w-1.5 bg-indigo-500" />
          Smart Job Discovery
          <span className="h-1.5 w-1.5 bg-indigo-500" />
        </div>
        <h2 className="mt-4 max-w-[420px] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          The roles you&apos;d never find by searching
        </h2>
        <div className="mt-4 h-[3px] w-8 rounded-full bg-pink-300/80" />
      </div>

      {/* cards */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="flex flex-col rounded-2xl bg-[#141416] p-5 transition hover:bg-[#19191c]"
          >
            <h3 className="text-xl font-medium tracking-tight">{job.title}</h3>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">{job.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag icon={<PinIcon />}>{job.location}</Tag>
              <Tag icon={<StackIcon />}>{job.type}</Tag>
              <Tag icon={<CoinIcon />}>{job.pay}</Tag>
            </div>

            <Link
              href={`/jobs/${job.id}`}
              className="mt-8 inline-flex items-center gap-2 pl-2 text-xs text-zinc-200 transition hover:text-white"
            >
              Apply Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </article>
        ))}
      </div>

      {/* view all */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/jobs"
          className="rounded-lg bg-white px-5 py-2.5 text-xs font-medium text-black transition hover:bg-zinc-200"
        >
          View all job open
        </Link>
      </div>

      {/* bottom decoration */}
      <div className="mx-auto mt-12 h-[3px] w-8 rounded-full bg-sky-300/80" />
    </section>
  )
}