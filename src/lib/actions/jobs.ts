import type { Values } from "@/app/dashboard/recruiter/jobs/new/page"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
export const createJob = async (data: Values) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
      if (!res.ok) throw new Error("Failed to create job")

    return res.json()
}

//manage jobs
export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load jobs")
  return res.json()
}

export const deleteJob = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE"    
  })
  if (!res.ok) throw new Error("Failed to delete job")
  return res.json()
}