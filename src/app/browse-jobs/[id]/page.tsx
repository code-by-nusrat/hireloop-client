// "use client"

// import { use, useEffect, useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Banknote, Bookmark, CalendarDays, Clock, MapPin } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { applyToJob, getJobById, type Job } from "@/lib/actions/jobs"
// import { formatDate, formatLocation, formatSalary, isClosed, toLines } from "@/lib/job-utils"
// import { SiteHeader } from "@/components/layout/site-header"
// import { useSession } from "@/lib/auth-client"
// import { Values } from "@/app/dashboard/recruiter/jobs/new/page"
// /* ------------------------------------------------------------------ */
// /* Small reusable pieces                                               */
// /* ------------------------------------------------------------------ */

// type Icon = React.ComponentType<{ className?: string }>

// // One of the four boxes under the header
// function InfoCard({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) {
//     return (
//         <div className="space-y-2 rounded-xl border bg-card/60 p-4">
//             <Icon className="size-4 text-muted-foreground" />
//             <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
//             <p className="font-semibold text-foreground">{value}</p>
//         </div>
//     )
// }

// // A titled list, used for Responsibilities and Requirements
// function BulletSection({ title, lines }: { title: string; lines: string[] }) {
//     return (
//         <section className="space-y-4">
//             <h2 className="text-lg font-semibold text-foreground">{title}</h2>
//             <ul className="list-disc space-y-3 pl-5 text-sm text-muted-foreground marker:text-primary">
//                 {lines.map((line, index) => (
//                     <li key={index}>{line}</li>
//                 ))}
//             </ul>
//         </section>
//     )
// }

// // A label on the left and a value on the right (company overview)
// function DetailRow({ label, value }: { label: string; value: string }) {
//     return (
//         <div className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-b-0">
//             <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
//             <span className="text-right font-medium text-foreground">{value}</span>
//         </div>
//     )
// }

// /* ------------------------------------------------------------------ */
// /* The page                                                            */
// /* ------------------------------------------------------------------ */

// const JobDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
//     const { id } = use(params) // params is a Promise, so a client component reads it with use()
//     const router = useRouter()
//     const { data: session, isPending } = useSession()
//     const user = session?.user
//     const [job, setJob] = useState<Job | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState("")

//     // Load the job once, when the page opens
//     useEffect(() => {
//         let ignore = false

//         async function loadJob({ job }: { job: Values }) {
//             try {
//                 const data = await getJobById(id)
//                 if (!ignore) setJob(data) // data can be null when the job doesn't exist
//             } catch {
//                 if (!ignore) setError("Could not load this job. Is your server running?")
//             } finally {
//                 if (!ignore) setLoading(false)
//             }
//         }

//         loadJob()
//         return () => {
//             ignore = true
//         }
//     }, [id])

//     //   const handleApplyNow =async (job: Job) => {
//     //     if (isPending) return // the session is still loading, so we don't know yet

//     //     // Not signed in: go to sign-in, and come back to this job afterwards
//     //     if (!user) {
//     //       router.push(`/sign-in?redirectTo=${encodeURIComponent(`/browse-jobs/${id}`)}`)
//     //       return
//     //     }
//     //     else if(user.role === "seeker"){
//     //         //save the application to the database
//     //         //TODO: only send jobID and userId or email address for the application
//     //         const application ={
//     //             jobId:id,
//     //             userId:user.id,
//     //             email:user.email,
//     //             name:user.name,
//     //             jobTitle:job.title,
//     //             companyName:job.company,
//     //         }

//     //        const res =await applyToJob(application);
//     //        if(res.inserterId){
//     //         console.log("Application submitted sucessfully")
//     //         router.push('/brwse-jobs')
//     //        }
//     //     }
//     //    else{
//     //     console.log("user is not a job seeker")
//     //    }
//     //     // Signed in: continue to apply (a page or a dialog, whichever you build)
//     //     router.push(`/browse-jobs/${id}/apply`)
//     //   }
//     const handleApplyNow = async (job: Job) => {
//         if (isPending) return // the session is still loading, so we don't know yet

//         // Not signed in: go to sign-in, and come back to this job afterwards
//         if (!user) {
//             router.push(`/sign-in?redirectTo=${encodeURIComponent(`/browse-jobs/${id}`)}`)
//             return
//         }

//         // Only job seekers can apply
//         if (user.role !== "seeker") {
//             console.log("user is not a job seeker")
//             return
//         }

//         const application = {
//             jobId: id,
//             userId: user.id,
//             email: user.email,
//             name: user.name,
//             jobTitle: job.title,
//             companyName: job.company,
//         }

//         const res = await applyToJob(application)
//         if (res.insertedId) {
//             console.log("Application submitted successfully")
//             router.push("/browse-jobs")
//         }
//     }
//     // Loading, error, or job not found
//     if (loading || !job) {
//         return (
//             <>
//                 <SiteHeader />
//                 <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
//                     <Link href="/browse-jobs" className="text-sm text-muted-foreground hover:text-foreground">
//                         &larr; Back to jobs
//                     </Link>
//                     <p className="rounded-xl border bg-card/60 p-10 text-center text-muted-foreground">
//                         {loading ? "Loading job..." : error || "Job not found."}
//                     </p>
//                 </main>
//             </>
//         )
//     }

//     // From here on, `job` is a real job
//     const closed = isClosed(job.deadline)

//     return (
//         <>
//             <SiteHeader />
//             <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
//                 <Link href="/browse-jobs" className="text-sm text-muted-foreground hover:text-foreground">
//                     &larr; Back to jobs
//                 </Link>

//                 {/* ---------- Header ---------- */}
//                 <header className="flex flex-col gap-4 rounded-xl border bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="flex min-w-0 items-center gap-4">
//                         {/* There is no logo field yet, so we show the company's first letter */}
//                         <div
//                             aria-hidden
//                             className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-2xl font-semibold text-primary"
//                         >
//                             {job.company.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="min-w-0 space-y-1.5">
//                             <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
//                                 {job.title}
//                             </h1>
//                             <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
//                                 <span>{job.company}</span>
//                                 <Badge variant={closed ? "outline" : "default"}>
//                                     {closed ? "Closed" : "Accepting applications"}
//                                 </Badge>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <Button type="button" size="icon" variant="outline" aria-label="Save job">
//                             <Bookmark />
//                         </Button>
//                         <Button
//                             type="button"
//                             onClick={handleApplyNow}

//                             className="flex-1 sm:flex-none"
//                         >
//                             Apply Now
//                         </Button>
//                     </div>
//                 </header>

//                 <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
//                     <div className="space-y-6">
//                         {/* ---------- Quick facts ---------- */}
//                         <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//                             <InfoCard icon={Banknote} label="Salary Range" value={formatSalary(job)} />
//                             <InfoCard icon={MapPin} label="Location" value={formatLocation(job)} />
//                             <InfoCard icon={Clock} label="Job Type" value={job.jobType} />
//                             <InfoCard icon={CalendarDays} label="Apply Before" value={formatDate(job.deadline)} />
//                         </div>

//                         {/* ---------- Responsibilities and requirements ---------- */}
//                         <div className="space-y-8 rounded-xl border bg-card/60 p-6">
//                             <BulletSection title="Responsibilities" lines={toLines(job.responsibilities)} />
//                             <hr />
//                             <BulletSection title="Requirements" lines={toLines(job.qualifications)} />
//                         </div>
//                     </div>

//                     {/* ---------- Company overview ---------- */}
//                     <aside className="space-y-2 rounded-xl border bg-card/60 p-5 lg:self-start">
//                         <h2 className="pb-2 text-lg font-semibold text-foreground">Company Overview</h2>
//                         <DetailRow label="Company" value={job.company} />
//                         <DetailRow label="Category" value={job.category} />
//                         <DetailRow label="Work Mode" value={job.remote ? "Remote" : "On-site"} />
//                         <DetailRow label="Job Type" value={job.jobType} />
//                     </aside>
//                 </div>
//             </main>
//         </>
//     )
// }

// export default JobDetailsPage



"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Banknote, Bookmark, CalendarDays, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { applyToJob, getJobById, type Job } from "@/lib/actions/jobs"
import { formatDate, formatLocation, formatSalary, isClosed, toLines } from "@/lib/job-utils"
import { SiteHeader } from "@/components/layout/site-header"
import { useSession } from "@/lib/auth-client"

/* ------------------------------------------------------------------ */
/* Small reusable pieces                                               */
/* ------------------------------------------------------------------ */

type Icon = React.ComponentType<{ className?: string }>

// One of the four boxes under the header
function InfoCard({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="space-y-2 rounded-xl border bg-card/60 p-4">
      <Icon className="size-4 text-muted-foreground" />
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  )
}

// A titled list, used for Responsibilities and Requirements
function BulletSection({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ul className="list-disc space-y-3 pl-5 text-sm text-muted-foreground marker:text-primary">
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </section>
  )
}

// A label on the left and a value on the right (company overview)
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-b-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

const JobDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params) // params is a Promise, so a client component reads it with use()
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load the job once, when the page opens
  useEffect(() => {
    let ignore = false

    async function loadJob() {
      try {
        const data = await getJobById(id)
        if (!ignore) setJob(data) // data can be null when the job doesn't exist
      } catch {
        if (!ignore) setError("Could not load this job. Is your server running?")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadJob()
    return () => {
      ignore = true
    }
  }, [id])

  const handleApplyNow = async (job: Job) => {
    if (isPending) return // the session is still loading, so we don't know yet

    // Not signed in: go to sign-in, and come back to this job afterwards
    if (!user) {
      router.push(`/sign-in?redirectTo=${encodeURIComponent(`/browse-jobs/${id}`)}`)
      return
    }

    // Only job seekers can apply
    if (user.role !== "seeker") {
      console.log("user is not a job seeker")
      return
    }

    const application = {
      jobId: id,
      userId: user.id,
      email: user.email,
      name: user.name,
      jobTitle: job.title,
      companyName: job.company,
    }

    const res = await applyToJob(application)
    if (res.insertedId) {
      console.log("Application submitted successfully")
      router.push("/browse-jobs")
    }
  }

  // Loading, error, or job not found
  if (loading || !job) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/browse-jobs" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to jobs
          </Link>
          <p className="rounded-xl border bg-card/60 p-10 text-center text-muted-foreground">
            {loading ? "Loading job..." : error || "Job not found."}
          </p>
        </main>
      </>
    )
  }

  // From here on, `job` is a real job
  const closed = isClosed(job.deadline)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/browse-jobs" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to jobs
        </Link>

        {/* ---------- Header ---------- */}
        <header className="flex flex-col gap-4 rounded-xl border bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {/* There is no logo field yet, so we show the company's first letter */}
            <div
              aria-hidden
              className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-2xl font-semibold text-primary"
            >
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 space-y-1.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{job.company}</span>
                <Badge variant={closed ? "outline" : "default"}>
                  {closed ? "Closed" : "Accepting applications"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" size="icon" variant="outline" aria-label="Save job">
              <Bookmark />
            </Button>
            <Button
              type="button"
              onClick={() => handleApplyNow(job)}
              disabled={closed}
              className="flex-1 sm:flex-none"
            >
              Apply Now
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-6">
            {/* ---------- Quick facts ---------- */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoCard icon={Banknote} label="Salary Range" value={formatSalary(job)} />
              <InfoCard icon={MapPin} label="Location" value={formatLocation(job)} />
              <InfoCard icon={Clock} label="Job Type" value={job.jobType} />
              <InfoCard icon={CalendarDays} label="Apply Before" value={formatDate(job.deadline)} />
            </div>

            {/* ---------- Responsibilities and requirements ---------- */}
            <div className="space-y-8 rounded-xl border bg-card/60 p-6">
              <BulletSection title="Responsibilities" lines={toLines(job.responsibilities)} />
              <hr />
              <BulletSection title="Requirements" lines={toLines(job.qualifications)} />
            </div>
          </div>

          {/* ---------- Company overview ---------- */}
          <aside className="space-y-2 rounded-xl border bg-card/60 p-5 lg:self-start">
            <h2 className="pb-2 text-lg font-semibold text-foreground">Company Overview</h2>
            <DetailRow label="Company" value={job.company} />
            <DetailRow label="Category" value={job.category} />
            <DetailRow label="Work Mode" value={job.remote ? "Remote" : "On-site"} />
            <DetailRow label="Job Type" value={job.jobType} />
          </aside>
        </div>
      </main>
    </>
  )
}

export default JobDetailsPage