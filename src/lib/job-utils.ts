import type { Job } from "@/lib/actions/jobs"

const FREQUENCY_SHORT: Record<string, string> = {
  "per hour": "/ hr",
  "per day": "/ day",
  "per week": "/ week",
  "per month": "/ month",
  "per year": "/ yr",
}

// "€70,000 - €95,000 / yr"
export function formatSalary(job: Pick<Job, "minSalary" | "maxSalary" | "frequency">) {
  const format = (value: string) => Number(value).toLocaleString("en-US")
  const unit = FREQUENCY_SHORT[job.frequency] ?? ""
  return `€${format(job.minSalary)} - €${format(job.maxSalary)} ${unit}`.trim()
}

// "Berlin, Germany (Remote)", "Remote", or "Dhaka, Bangladesh"
export function formatLocation(job: Pick<Job, "remote" | "location">) {
  if (!job.remote) return job.location
  return job.location && job.location !== "Remote" ? `${job.location} (Remote)` : "Remote"
}

// "2026-12-20" -> "Dec 20, 2026"
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// A job is closed once its deadline has passed
export function isClosed(deadline: string) {
  return deadline < new Date().toLocaleDateString("en-CA") // compares "YYYY-MM-DD"
}

// Turns what the recruiter typed (one item per line) into a list
export function toLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean)
}