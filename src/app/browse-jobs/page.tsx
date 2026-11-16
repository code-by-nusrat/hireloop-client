
import { getJobs } from '@/lib/actions/jobs';
import React from 'react';

const BrowseJobPage = async({searchParams }:{searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
    const search = await searchParams
    const urlSearch =new URLSearchParams(search as Record<string,string>)
    const query =urlSearch.toString()
    const jobs =await getJobs(query)
    console.log(query)
    return (
        <div>
            <h1>Browse Jobs</h1>
            <ul>
                {jobs.map((job)=>(
                    <li key={job._id}>{job.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default BrowseJobPage;