"use client"

import { Suspense, useEffect, useState } from "react"
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation"
import { Bookmark, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getJobs, type Job } from "@/lib/actions/jobs"
import { SiteHeader } from "@/components/layout/site-header"
import Link from "next/link"

/* ------------------------------------------------------------------ */
/* 1. Filter options (shared lists you can reuse in other pages)       */
/* ------------------------------------------------------------------ */

type FilterOption = { label: string; value: string }

const toOptions = (values: string[]): FilterOption[] =>
    values.map((value) => ({ label: value, value }))

const JOB_TYPES = toOptions(["Full-time", "Part-time", "Contract", "Internship"])

const CATEGORIES = toOptions([
    "Engineering & Tech",
    "Design",
    "Marketing",
    "Sales",
    "Product",
    "Finance",
    "Operations",
    "Customer Support",
])

const WORK_MODES: FilterOption[] = [
    { label: "Remote", value: "true" },
    { label: "On-site", value: "false" },
]

const ALL = "all" // the "All" option clears the filter

/* ------------------------------------------------------------------ */
/* 2. Small formatting helpers                                         */
/* ------------------------------------------------------------------ */

const FREQUENCY_SHORT: Record<string, string> = {
    "per hour": "/ hr",
    "per day": "/ day",
    "per week": "/ week",
    "per month": "/ month",
    "per year": "/ yr",
}

// "€70,000 - €95,000 / yr"
function formatSalary(job: Job) {
    const format = (value: string) => Number(value).toLocaleString("en-US")
    const unit = FREQUENCY_SHORT[job.frequency] ?? ""
    return `€${format(job.minSalary)} - €${format(job.maxSalary)} ${unit}`.trim()
}

// "Berlin, Germany (Remote)", "Remote", or "Dhaka, Bangladesh"
function formatLocation(job: Job) {
    if (!job.remote) return job.location
    return job.location && job.location !== "Remote" ? `${job.location} (Remote)` : "Remote"
}

/* ------------------------------------------------------------------ */
/* 3. Reusable pieces                                                  */
/* ------------------------------------------------------------------ */

function SearchBar({
    defaultValue,

}: {
    defaultValue: string
}) {
    const router = useRouter()
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        console.log(data)
        const search = data.searchField;
        const params = new URLSearchParams()
        params.set('search', search as string);
        router.push(`/browse-jobs?${params.toString()}`)
        // const value = new FormData(e.currentTarget).get("search")
        // onSearch(String(value ?? "").trim())
    }

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="flex items-center gap-2 rounded-xl border bg-card/60 p-3 sm:p-4"
        >
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    name="searchField"
                    defaultValue={defaultValue}
                    placeholder="Search by job title, keywords..."
                    aria-label="Search jobs"
                    className="h-10 pl-9"
                />
            </div>
            <Button type="submit" className="h-10 px-5">
                Search Jobs
            </Button>
        </form>
    )
}

type FilterGroupProps = {
    title: string
    name: string // the URL param this group controls, e.g. "jobType"
    options: FilterOption[]
    selected: string // the value from the URL, or "" when nothing is selected
    onChange: (name: string, value: string) => void
}

function FilterGroup({ title, name, options, selected, onChange }: FilterGroupProps) {
    // A radio can't be un-ticked, so we add an "All" option to clear the filter
    const allOptions = [{ label: "All", value: ALL }, ...options]

    // Ignore upper/lower case: the URL may say "part-time" while the option is "Part-time"
    const current =
        allOptions.find((option) => option.value.toLowerCase() === selected.toLowerCase())?.value ??
        ALL

    return (
        <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-medium text-foreground">{title}</legend>

            <RadioGroup
                value={current}
                onValueChange={(value) => onChange(name, String(value))}
                className="gap-2.5"
            >
                {allOptions.map((option, index) => {
                    const id = `${name}-${index}`
                    return (
                        <div key={option.value} className="flex items-center gap-2.5">
                            <RadioGroupItem id={id} value={option.value} />
                            <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-muted-foreground">
                                {option.label}
                            </Label>
                        </div>
                    )
                })}
            </RadioGroup>
        </fieldset>
    )
}

function JobCard({ job }: { job: Job }) {
    const router = useRouter()
    const handleJobDetail = (jobId: string) => {

        router.push(`/browse-jobs/${jobId}`)
    }
    return (
        <article onClick={() => handleJobDetail(job._id)} className="flex items-start gap-4 rounded-xl border bg-card/60 p-4 sm:p-5">
            {/* There is no logo field yet, so we show the company's first letter */}
            <div
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-lg font-semibold text-primary"
            >
                {job.company.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
                <div className="space-y-1">
                    {/* <h3 className="truncate text-base font-semibold text-foreground sm:text-lg">
            {job.title}
          </h3> */}
                    <h3 className="truncate text-base font-semibold text-foreground sm:text-lg">
                        <Link href={`/browse-jobs/${job._id}`} className="hover:text-primary">
                            {job.title}
                        </Link>
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                        {job.company} • {formatLocation(job)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{formatSalary(job)}</Badge>
                    <Badge variant="secondary">{job.jobType}</Badge>
                    <Badge variant="outline">{job.remote ? "Remote" : "On-site"}</Badge>
                </div>
            </div>

            <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={`Save ${job.title}`}

            >
                <Bookmark />
            </Button>
        </article>
    )
}

/* ------------------------------------------------------------------ */
/* 4. The page                                                         */
/* ------------------------------------------------------------------ */

function BrowseJobs() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.toString() // e.g. "jobType=Part-time&isRemote=true"

    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Load the jobs again every time the URL query changes
    useEffect(() => {
        let ignore = false

        async function loadJobs() {
            try {
                const data = await getJobs(query)
                if (!ignore) {
                    setJobs(data)
                    setError("")
                }
            } catch {
                if (!ignore) setError("Could not load jobs. Is your server running?")
            } finally {
                if (!ignore) setLoading(false)
            }
        }

        loadJobs()
        return () => {
            ignore = true
        }
    }, [query])

    // Sets one URL param, or removes it when the value is empty or "all".
    // Changing the URL makes the effect above fetch the new results.
    function updateParam(name: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())

        if (value && value !== ALL) params.set(name, value)
        else params.delete(name)

        const next = params.toString()
        router.push(next ? `${pathname}?${next}` : pathname, { scroll: false })
    }

    return (
        <>
            <SiteHeader></SiteHeader>
            <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <SearchBar
                    defaultValue={searchParams.get("search") ?? ""}

                />

                <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
                    {/* ---------- Filters ---------- */}
                    <aside className="space-y-6 rounded-xl border bg-card/60 p-5 lg:self-start">
                        <h2 className="text-lg font-semibold text-foreground">Filters</h2>

                        <FilterGroup
                            title="Job Type"
                            name="jobType"
                            options={JOB_TYPES}
                            selected={searchParams.get("jobType") ?? ""}
                            onChange={updateParam}
                        />
                        <FilterGroup
                            title="Category"
                            name="category"
                            options={CATEGORIES}
                            selected={searchParams.get("category") ?? ""}
                            onChange={updateParam}
                        />
                        <FilterGroup
                            title="Work Mode"
                            name="isRemote"
                            options={WORK_MODES}
                            selected={searchParams.get("isRemote") ?? ""}
                            onChange={updateParam}
                        />
                    </aside>

                    {/* ---------- Results ---------- */}
                    <section aria-labelledby="results-heading" className="space-y-4">
                        <h2 id="results-heading" className="text-lg font-semibold text-foreground">
                            Found {jobs.length} Professional {jobs.length === 1 ? "Job" : "Jobs"}
                        </h2>

                        {loading && <p className="py-10 text-center text-muted-foreground">Loading jobs...</p>}

                        {!loading && error && (
                            <p className="rounded-xl border bg-card/60 p-8 text-center text-destructive">{error}</p>
                        )}

                        {!loading && !error && jobs.length === 0 && (
                            <p className="rounded-xl border bg-card/60 p-8 text-center text-muted-foreground">
                                No jobs match your search. Try changing the filters.
                            </p>
                        )}

                        {!loading && !error && jobs.length > 0 && (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    )
}

// useSearchParams must be inside <Suspense>, or `npm run build` shows an error
export default function BrowseJobPage() {
    return (
        <Suspense fallback={<p className="py-10 text-center text-muted-foreground">Loading...</p>}>
            <BrowseJobs />
        </Suspense>
    )
}