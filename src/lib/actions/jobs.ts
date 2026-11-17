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
export type Job = Values & { _id: string }
export const getJobs = async (query = ""): Promise<Job[]> => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load jobs")
  return res.json()
}
//delete job
export const deleteJob = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE"    
  })
  if (!res.ok) throw new Error("Failed to delete job")
  return res.json()
}

// Get single job by ID
export const getJobById = async (id: string): Promise<Job | null> => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    cache: "no-store",
  })

  if (res.status === 404) return null

  if (!res.ok) {
    throw new Error("Failed to load job")
  }

  return res.json()
}


export async function applyToJob(data){
   const response =await fetch (`${BASE_URL}/applications`,{
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
     body:JSON.stringify(data)
   }) 
   return response.json()
}