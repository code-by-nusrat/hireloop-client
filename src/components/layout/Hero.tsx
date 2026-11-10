"use client"

import Image from "next/image"
import { useState } from "react"

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

const stats = [
    { num: "50K", label: "Active Jobs", icon: "M3 7h18v13H3zM9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" },
    { num: "12K", label: "Companies", icon: "M4 21V9h6v12M10 21V4h10v17M3 21h18M13 8h4M13 12h4M13 16h4" },
    { num: "2M", label: "Job Seekers", icon: "M5 19a6 6 0 0 1 12 0M11 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
    { num: "97%", label: "Satisfaction Rate", icon: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" },
]

export default function Hero() {
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: replace with your real search, e.g. router.push(`/jobs?q=${query}&loc=${location}`)
        console.log({ query, location })
    }

    return (
        <main className="relative mx-auto flex min-h-screen max-w-[1100px] flex-col items-center overflow-hidden bg-[#050506] px-5 pb-7 pt-24 text-white">
            {/* top fade */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[340px] bg-[radial-gradient(ellipse_at_50%_0%,#1b1b1f_0%,transparent_70%)]" />

            {/* badge */}
            <div className="flex w-full max-w-[480px] items-center gap-3">
                <i className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#0b0b0d] px-3.5 py-2 font-mono text-xs text-zinc-400">
                    <span>💼</span>
                    <span>
                        <b className="font-bold text-white">50,000+</b> NEW JOBS THIS MONTH
                    </span>
                </div>
                <i className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight sm:text-5xl">
                Find Your Dream Job Today
            </h1>
            <p className="mt-3.5 max-w-[480px] text-center text-sm leading-relaxed text-zinc-400">
                HireLoop connects top talent with world-class companies. Browse thousands of curated
                opportunities and land your next role — faster.
            </p>

            {/* search */}
            <form
                onSubmit={handleSearch}
                className="mt-7 flex w-full max-w-[640px] flex-col gap-2 rounded-2xl border border-white/10 bg-[#121216]/90 p-2 pl-4 sm:flex-row sm:items-center"
            >
                <label className="flex flex-1 items-center gap-2.5 py-2 sm:py-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-zinc-300">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Job title, skill or company"
                        className="w-full bg-transparent text-[13px] outline-none placeholder:text-zinc-500"
                    />
                </label>
                <label className="flex flex-1 items-center gap-2.5 border-t border-white/10 py-2 sm:border-l sm:border-t-0 sm:py-0 sm:pl-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-zinc-300">
                        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                    </svg>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location or Remote"
                        className="w-full bg-transparent text-[13px] outline-none placeholder:text-zinc-500"
                    />
                </label>
                <button
                    type="submit"
                    aria-label="Search"
                    className="grid h-10 w-full place-items-center rounded-[10px] bg-[#5b4cf5] transition hover:brightness-110 active:scale-95 sm:w-10"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                </button>
            </form>

            {/* trending */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
                <span className="mr-1.5">Trending Position</span>
                {trending.map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setQuery(t)}
                        className="rounded-full border border-white/10 bg-[#101013] px-3 py-1.5 text-[11px] text-zinc-200 transition hover:border-indigo-400/60 hover:bg-[#15151b]"
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* globe */}
            <section className="relative mt-2.5 min-h-[420px] w-full flex-1">
                <div className="absolute left-1/2 top-10 aspect-square w-[min(1000px,140vw)] -translate-x-1/2 overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_50%,#17171c_0%,#0a0a0d_70%)] shadow-[0_-6px_24px_2px_rgba(120,100,255,0.9),0_-24px_80px_10px_rgba(80,60,255,0.55),0_-80px_200px_40px_rgba(60,40,230,0.35),inset_0_10px_40px_rgba(130,110,255,0.45)]">
                    <Image
                        src="/images/globe.png"
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 1000px) 140vw, 1000px"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[35%] to-[#050506] to-[75%]" />
                </div>

                <p className="absolute inset-x-0 top-24 z-10 text-center text-xl font-medium leading-snug text-zinc-300 sm:top-36 sm:text-2xl">
                    Assisting over <b className="font-semibold text-white">15,000 job seekers</b>
                    <br />
                    find their dream positions.
                </p>
            </section>

            {/* stats */}
            <section className="relative z-10 mt-10 grid w-full grid-cols-2 gap-3.5 md:grid-cols-4">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="flex min-h-[136px] flex-col justify-between rounded-xl border border-white/10 bg-gradient-to-b from-[#121216] to-[#09090b] p-[18px]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
                            <path d={s.icon} />
                        </svg>
                        <div>
                            <div className="mt-5 text-[34px] font-semibold tracking-tight">{s.num}</div>
                            <div className="mt-0.5 text-xs text-zinc-400">{s.label}</div>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    )
}