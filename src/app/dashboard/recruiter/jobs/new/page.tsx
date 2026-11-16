'use client'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css" // remove this line if you use react-toastify v11 or newer
import { useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  CalendarDays,
  Euro,
  Globe,
  MapPin,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { createJob } from "@/lib/actions/jobs"
import { redirect, useRouter } from "next/navigation"

/* ------------------------------------------------------------------ */
/* 1. Options for dropdowns and buttons                                */
/* ------------------------------------------------------------------ */

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]
const CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Sales",
  "Product",
  "Finance",
  "Operations",
  "Customer Support",
]
const FREQUENCIES = ["per hour", "per day", "per week", "per month", "per year"]

/* ------------------------------------------------------------------ */
/* 2. The shape of our form data                                       */
/* ------------------------------------------------------------------ */

export type Values = {
  title: string
  company: string
  category: string
  jobType: string
  remote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string
  qualifications: string
}

// Errors: for each field name, an optional error message
type Errors = Partial<Record<keyof Values, string>>

const initialValues: Values = {
  title: "",
  company: "",
  category: "",
  jobType: "Full-time",
  remote: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  frequency: "per hour",
  responsibilities: "",
  qualifications: "",
}

/* ------------------------------------------------------------------ */
/* 3. Validation: checks every field and returns the error messages    */
/*    To change a rule or a message, edit it here.                     */
/* ------------------------------------------------------------------ */

// Today's date in your local time, as "YYYY-MM-DD"
function getToday() {
  return new Date().toLocaleDateString("en-CA")
}

function validate(values: Values): Errors {
  const errors: Errors = {}

  // Job title
  const title = values.title.trim()
  if (title.length < 3) errors.title = "Job title must be at least 3 characters"
  else if (title.length > 100) errors.title = "Job title must be 100 characters or less"

  // Company name
  const company = values.company.trim()
  if (company.length < 2) errors.company = "Company name must be at least 2 characters"
  else if (company.length > 100) errors.company = "Company name must be 100 characters or less"

  // Category
  if (!values.category) errors.category = "Please choose a job category"

  // Location (not needed if the job is remote)
  if (!values.remote && values.location.trim().length < 2) {
    errors.location = "Enter a location, or turn on Remote Work"
  }

  // Deadline
  if (!values.deadline) errors.deadline = "Please choose an application deadline"
  else if (values.deadline < getToday()) errors.deadline = "Deadline can't be in the past"

  // Salary
  const min = Number(values.minSalary)
  const max = Number(values.maxSalary)

  if (values.minSalary === "") errors.minSalary = "Enter a minimum salary"
  else if (isNaN(min) || min <= 0) errors.minSalary = "Enter a number greater than 0"

  if (values.maxSalary === "") errors.maxSalary = "Enter a maximum salary"
  else if (isNaN(max) || max <= 0) errors.maxSalary = "Enter a number greater than 0"
  else if (!errors.minSalary && max < min) errors.maxSalary = "Max can't be lower than min"

  // Responsibilities
  const responsibilities = values.responsibilities.trim()
  if (responsibilities.length < 30) errors.responsibilities = "Please write at least 30 characters"
  else if (responsibilities.length > 2000) errors.responsibilities = "Keep this under 2000 characters"

  // Qualifications
  const qualifications = values.qualifications.trim()
  if (qualifications.length < 30) errors.qualifications = "Please write at least 30 characters"
  else if (qualifications.length > 2000) errors.qualifications = "Keep this under 2000 characters"

  return errors
}

/* ------------------------------------------------------------------ */
/* 4. Small layout helpers                                             */
/* ------------------------------------------------------------------ */

const fieldClass = "h-10 bg-card/60"

// A titled block like "1. Basic Information"
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="flex items-center gap-2.5 text-base font-semibold text-foreground sm:text-lg">
        <span className="h-4 w-1 rounded-full bg-primary" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  )
}

// A label + input + error message
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

// Puts a small icon on the left side of an input
function IconWrap({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. The page                                                         */
/* ------------------------------------------------------------------ */

export default function NewJobPage() {
  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [posted, setPosted] = useState(false)     // true after the job is saved
  const [disabled, setDisabled] = useState(false) // true after the second click
  const router =useRouter()
  // Called whenever the user changes any field
  function updateField<K extends keyof Values>(name: K, value: Values[K]) {
    const next = { ...values, [name]: value }
    setValues(next)

    // Re-check the fields that are currently showing an error,
    // so the error disappears as soon as the user fixes it
    const fresh = validate(next)
    setErrors((prev) => {
      const updated: Errors = {}
      for (const key of Object.keys(prev) as (keyof Values)[]) {
        if (prev[key]) updated[key] = fresh[key]
      }
      return updated
    })
  }

  // Called when the user leaves a field: show that field's error (if any)
  function checkField(name: keyof Values) {
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }))
  }

  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()

  //   // Check everything
  //   const newErrors = validate(values)
  //   setErrors(newErrors)

  //   // If there is any error, stop and jump to the first broken field
  //   const firstError = Object.keys(newErrors)[0]
  //   if (firstError) {
  //     document.getElementById(firstError)?.focus()
  //     return
  //   }

  //   // Everything is valid
  //   setSubmitting(true)
  //   const job = {
  //     ...values,
  //     title: values.title.trim(),
  //     company: values.company.trim(),
  //     location: values.location.trim(),
  //     responsibilities: values.responsibilities.trim(),
  //     qualifications: values.qualifications.trim(),

  //   }

  //   // TODO: send `job` to your API / server action
  //   try {
  //     const result = await createJob(job)
  //     console.log(result)
  //     // e.g. router.push("/dashboard/recruiter/jobs")
  //   } catch (error) {
  //     console.error(error)
  //     // show an error message to the user
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }

  // Adds a red border when a field has an error
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Second click: show the message and lock the button
    if (posted) {
      toast.info("Already posted")
      setDisabled(true)
      return
    }

    // Check everything
    const newErrors = validate(values)
    setErrors(newErrors)

    const firstError = Object.keys(newErrors)[0]
    if (firstError) {
      document.getElementById(firstError)?.focus()
      return
    }

    setSubmitting(true)
    const job = {
      ...values,
      title: values.title.trim(),
      company: values.company.trim(),
      location: values.location.trim(),
      responsibilities: values.responsibilities.trim(),
      qualifications: values.qualifications.trim(),
    }

    try {
      await createJob(job)
      setPosted(true)
      toast.success("Job published successfully")
      router.push('/dashboard/recruiter/jobs')
    } catch (error) {
      console.error(error)
      toast.error("Failed to publish the job")
    } finally {
      setSubmitting(false)
    }
  }


  const invalid = (name: keyof Values) =>
    errors[name] ? "border-destructive focus-visible:ring-destructive/30" : ""

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-8">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link href="/dashboard/recruiter/jobs" className="hover:text-foreground">
              Manage Jobs
            </Link>
            <span className="mx-1.5">&gt;</span>
            <span>Create New Listing</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Post a New Job
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>

        <Button type="submit" disabled={submitting} className="w-full rounded-lg sm:w-auto">
          {submitting ? "Publishing..." : "Publish Job"}
          <Send />
        </Button>
      </div>

      {/* ---------- 1. Basic information ---------- */}
      <Section title="1. Basic Information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Job Title *" htmlFor="title" error={errors.title}>
            <Input
              id="title"
              placeholder="e.g. Frontend Developer"
              value={values.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => checkField("title")}
              aria-invalid={!!errors.title}
              className={cn(fieldClass, invalid("title"))}
            />
          </Field>

          {/* empty cell so the next row starts on a new line (desktop only) */}
          <div className="hidden md:block" aria-hidden />

          <Field label="Company Name *" htmlFor="company" error={errors.company}>
            <IconWrap icon={Briefcase}>
              <Input
                id="company"
                placeholder="Your company"
                value={values.company}
                onChange={(e) => updateField("company", e.target.value)}
                onBlur={() => checkField("company")}
                aria-invalid={!!errors.company}
                className={cn(fieldClass, "pl-9", invalid("company"))}
              />
            </IconWrap>
          </Field>

          <Field label="Job Category *" htmlFor="category" error={errors.category}>
            <Select
              value={values.category}
              onValueChange={(v) => updateField("category", v ?? "")}
            >
              <SelectTrigger
                id="category"
                aria-invalid={!!errors.category}
                className={cn(fieldClass, "w-full", invalid("category"))}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Job type: one joined set of buttons */}
        <div className="space-y-2">
          <Label>Job Type *</Label>
          <div
            role="radiogroup"
            aria-label="Job type"
            className="grid grid-cols-2 overflow-hidden rounded-lg border bg-card/60 sm:grid-cols-4"
          >
            {JOB_TYPES.map((type) => {
              const selected = values.jobType === type
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => updateField("jobType", type)}
                  className={cn(
                    "h-10 border-r px-3 text-sm font-medium outline-none transition-colors last:border-r-0 focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected
                      ? "bg-primary/15 text-foreground ring-1 ring-inset ring-primary/60"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>
      </Section>

      {/* ---------- 2. Location, compensation & timeline ---------- */}
      <Section title="2. Location, Compensation & Timeline">
        {/* Remote switch */}
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-card/60 p-3 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Globe className="size-4" />
            </div>
            <div className="min-w-0">
              <Label htmlFor="remote" className="text-sm font-medium">
                Remote Work Allowed
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable worldwide or distributed candidate applications
              </p>
            </div>
          </div>
          <Switch
            id="remote"
            checked={values.remote}
            onCheckedChange={(checked) => updateField("remote", checked)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label={values.remote ? "Job Location (optional)" : "Job Location *"}
            htmlFor="location"
            error={errors.location}
          >
            <IconWrap icon={MapPin}>
              <Input
                id="location"
                placeholder="e.g. New York, USA"
                value={values.location}
                onChange={(e) => updateField("location", e.target.value)}
                onBlur={() => checkField("location")}
                aria-invalid={!!errors.location}
                className={cn(fieldClass, "pl-9", invalid("location"))}
              />
            </IconWrap>
          </Field>

          <Field label="Application Deadline *" htmlFor="deadline" error={errors.deadline}>
            <IconWrap icon={CalendarDays}>
              <Input
                id="deadline"
                type="date"
                min={getToday()}
                value={values.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
                onBlur={() => checkField("deadline")}
                aria-invalid={!!errors.deadline}
                className={cn(fieldClass, "pl-9", invalid("deadline"))}
              />
            </IconWrap>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Min Salary / Rate *" htmlFor="minSalary" error={errors.minSalary}>
            <IconWrap icon={Euro}>
              <Input
                id="minSalary"
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="25"
                value={values.minSalary}
                onChange={(e) => updateField("minSalary", e.target.value)}
                onBlur={() => checkField("minSalary")}
                aria-invalid={!!errors.minSalary}
                className={cn(fieldClass, "pl-9", invalid("minSalary"))}
              />
            </IconWrap>
          </Field>

          <Field label="Max Salary / Rate *" htmlFor="maxSalary" error={errors.maxSalary}>
            <IconWrap icon={Euro}>
              <Input
                id="maxSalary"
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="40"
                value={values.maxSalary}
                onChange={(e) => updateField("maxSalary", e.target.value)}
                onBlur={() => checkField("maxSalary")}
                aria-invalid={!!errors.maxSalary}
                className={cn(fieldClass, "pl-9", invalid("maxSalary"))}
              />
            </IconWrap>
          </Field>

          <Field label="Frequency *" htmlFor="frequency">
            <Select
              value={values.frequency}
              onValueChange={(v) => updateField("frequency", v ?? "per hour")}
            >
              <SelectTrigger id="frequency" className={cn(fieldClass, "w-full")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      {/* ---------- 3. Responsibilities & requirements ---------- */}
      <Section title="3. Responsibilities & Requirements">
        <Field
          label="Key Responsibilities *"
          htmlFor="responsibilities"
          error={errors.responsibilities}
        >
          <Textarea
            id="responsibilities"
            rows={5}
            placeholder="Describe what this person will do day to day..."
            value={values.responsibilities}
            onChange={(e) => updateField("responsibilities", e.target.value)}
            onBlur={() => checkField("responsibilities")}
            aria-invalid={!!errors.responsibilities}
            className={cn("bg-card/60", invalid("responsibilities"))}
          />
          <p className="text-xs text-muted-foreground">
            {values.responsibilities.trim().length} / 2000 (at least 30)
          </p>
        </Field>

        <Field
          label="Qualifications & Requirements *"
          htmlFor="qualifications"
          error={errors.qualifications}
        >
          <Textarea
            id="qualifications"
            rows={5}
            placeholder="List the skills, experience and education needed..."
            value={values.qualifications}
            onChange={(e) => updateField("qualifications", e.target.value)}
            onBlur={() => checkField("qualifications")}
            aria-invalid={!!errors.qualifications}
            className={cn("bg-card/60", invalid("qualifications"))}
          />
          <p className="text-xs text-muted-foreground">
            {values.qualifications.trim().length} / 2000 (at least 30)
          </p>
        </Field>
      </Section>

      {/* ---------- Bottom buttons ---------- */}
      <div className="flex flex-col-reverse gap-2 pb-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          nativeButton={false}
          render={<Link href="/dashboard/recruiter/jobs" />}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        {/* <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Publishing..." : "Publish Job"}
          <Send />
        </Button> */}
        <Button type="submit" disabled={submitting || disabled} className="...">
          {submitting ? "Publishing..." : "Publish Job"}
          <Send />
        </Button>
      </div>
    </form>
  )
}