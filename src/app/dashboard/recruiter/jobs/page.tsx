'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getJobs, deleteJob } from "@/lib/actions/jobs"
import type { Values } from "@/app/dashboard/recruiter/jobs/new/page"
import { DeleteJobDialog } from "@/app/components/DeleteJobDialog"

/* ------------------------------------------------------------------ */
/* 1. The shape of one job                                             */
/*    Same fields we save from the "new job" form, plus the _id        */
/*    that MongoDB adds automatically.                                 */
/* ------------------------------------------------------------------ */

export type Job = Values & { _id: string }

/* ------------------------------------------------------------------ */
/* 2. Small helper functions (they only format data for display)       */
/* ------------------------------------------------------------------ */

// "per hour" -> "/ hr", "per year" -> "/ yr" ...
const FREQUENCY_SHORT: Record<string, string> = {
    "per hour": "/ hr",
    "per day": "/ day",
    "per week": "/ week",
    "per month": "/ month",
    "per year": "/ yr",
}

// "€25 - €40 / hr"
function formatSalary(job: Job) {
    const unit = FREQUENCY_SHORT[job.frequency] ?? ""
    return `€${job.minSalary} - €${job.maxSalary} ${unit}`
}

// "2025-05-30" -> "May 30, 2025"
function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

// A job is "Active" until its deadline passes, then it is "Expired"
function getStatus(deadline: string) {
    const today = new Date().toLocaleDateString("en-CA") // "YYYY-MM-DD"
    return deadline >= today ? "Active" : "Expired"
}

/* ------------------------------------------------------------------ */
/* 3. The page                                                         */
/* ------------------------------------------------------------------ */

export default function ManageJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Load the jobs once, when the page opens
    useEffect(() => {
        async function loadJobs() {
            try {
                const data = await getJobs()
                setJobs(data)
            } catch {
                setError("Could not load jobs. Is your server running?")
            } finally {
                setLoading(false)
            }
        }
        loadJobs()
    }, [])

    // Delete a job, then remove it from the table without reloading
    async function handleDelete(id: string) {
        const sure = window.confirm("Delete this job post?")
        if (!sure) return

        try {
            await deleteJob(id)
            setJobs((current) => current.filter((job) => job._id !== id))
        } catch {
            alert("Failed to delete the job")
        }
    }

    return (
        <div className="w-full space-y-6">
            {/* ---------- Header ---------- */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
                        <span>Manage Jobs</span>
                        <span className="mx-1.5">&gt;</span>
                        <span className="text-foreground">Job Listings &amp; Postings</span>
                    </nav>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Manage Job Posts
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Review live listings and update job details across your organization.
                    </p>
                </div>

                <Button
                    nativeButton={false}
                    render={<Link href="/dashboard/recruiter/jobs/new" />}
                    className="w-full sm:w-auto"
                >
                    <Plus />
                    New Job Post
                </Button>
            </div>

            {/* ---------- Table ---------- */}
            {/* The Table component already scrolls sideways on small screens.
          We also hide less important columns on small screens (see below). */}
            <div className="rounded-xl border bg-card/60">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Job Title &amp; Category</TableHead>
                            <TableHead className="hidden md:table-cell">Company &amp; Location</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead className="hidden lg:table-cell">Compensation</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Deadline</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {/* Loading message */}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Loading jobs...
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Error message */}
                        {!loading && error && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-destructive">
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Empty message */}
                        {!loading && !error && jobs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No jobs yet. Click &quot;New Job Post&quot; to create one.
                                </TableCell>
                            </TableRow>
                        )}

                        {/* One row for every job */}
                        {jobs.map((job) => {
                            const status = getStatus(job.deadline)

                            return (
                                <TableRow key={job._id}>
                                    {/* Title + category */}
                                    <TableCell>
                                        <div className="font-medium text-foreground">{job.title}</div>
                                        <div className="text-xs text-primary">{job.category}</div>
                                    </TableCell>

                                    {/* Company + location (hidden on small screens) */}
                                    <TableCell className="hidden md:table-cell">
                                        <div className="text-sm text-foreground">{job.company}</div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="size-3" />
                                            {job.remote
                                                ? job.location
                                                    ? `Remote (${job.location})`
                                                    : "Remote"
                                                : job.location}
                                        </div>
                                    </TableCell>

                                    {/* Job type */}
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="secondary">{job.jobType}</Badge>
                                    </TableCell>

                                    {/* Salary (hidden on small and medium screens) */}
                                    <TableCell className="hidden whitespace-nowrap text-sm lg:table-cell">
                                        {formatSalary(job)}
                                    </TableCell>

                                    {/* Status: green when active, grey when expired */}
                                    <TableCell>
                                        <Badge variant={status === "Active" ? "default" : "outline"}>
                                            {status}
                                        </Badge>
                                    </TableCell>

                                    {/* Deadline */}
                                    <TableCell className="hidden whitespace-nowrap text-sm sm:table-cell">
                                        {formatDate(job.deadline)}
                                    </TableCell>

                                    {/* Edit and delete buttons */}
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                aria-label="Edit job"
                                                nativeButton={false}
                                                render={<Link href={`/dashboard/recruiter/jobs/${job._id}/edit`} />}
                                            >
                                                <Pencil />
                                            </Button>
                                            {/* <Button
                        size="icon"
                        variant="outline"
                        aria-label="Delete job"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash2 />
                      </Button> */}
                                            <DeleteJobDialog
                                                job={job}
                                                onDeleted={(id) => setJobs((current) => current.filter((j) => j._id !== id))}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
