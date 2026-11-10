"use client"

import { useState } from "react"

const plans = [
  {
    name: "Starter",
    price: 0,
    featured: false,
    icon: (
      <path d="m3 8 4 4 5-7 5 7 4-4-2 11H5L3 8Z" />
    ),
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Growth",
    price: 17,
    featured: true,
    icon: (
      <>
        <path d="M4 20V14M10 20V9M16 20V4" />
      </>
    ),
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Premium",
    price: 99,
    featured: false,
    icon: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
]

const YEARLY_DISCOUNT = 0.25

export default function PricingSection() {
  const [yearly, setYearly] = useState(false)

  const priceFor = (p: number) =>
    yearly ? Math.round(p * (1 - YEARLY_DISCOUNT)) : p

  return (
    <section className="w-full bg-black px-5 py-20 text-white">
      <div className="mx-auto max-w-[1100px]">
        {/* heading */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            <span className="h-1.5 w-1.5 bg-indigo-500" />
            Pricing
            <span className="h-1.5 w-1.5 bg-indigo-500" />
          </div>
          <h2 className="mt-3 max-w-[420px] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Pay for the leverage, not the listings
          </h2>
        </div>

        {/* toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-full bg-[#1a1a1d] p-1 text-xs">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 font-medium transition ${
                !yearly ? "bg-white text-black" : "text-zinc-300"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-medium transition ${
                yearly ? "bg-white text-black" : "text-zinc-300"
              }`}
            >
              Yearly
              <span className="rounded-full bg-fuchsia-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                25%
              </span>
            </button>
          </div>
        </div>

        {/* cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-5 ${
                plan.featured
                  ? "border-white/10 bg-gradient-to-b from-[#222225] to-[#131315] shadow-[0_10px_40px_rgba(0,0,0,0.6)] md:-my-2 md:py-7"
                  : "border-white/10 bg-[#070708]"
              }`}
            >
              {/* top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#1d1722]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d8b4fe"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {plan.icon}
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">
                    ${priceFor(plan.price)}
                  </span>
                  <span className="text-[10px] text-zinc-400">/month</span>
                </div>
              </div>

              {/* features */}
              <p className="mt-7 text-xs font-medium text-zinc-200">
                Start building your insights hub:
              </p>
              <ul className="mt-4 space-y-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[11px] text-zinc-400">
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded bg-white/10 text-[11px] leading-none text-zinc-200">
                      +
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* button */}
              <button
                type="button"
                className={`mt-10 flex w-full items-center justify-between rounded-lg px-4 py-3 text-xs font-medium transition ${
                  plan.featured
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "bg-[#2a2a2d] text-zinc-100 hover:bg-[#333337]"
                }`}
              >
                Choose This Plan
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}