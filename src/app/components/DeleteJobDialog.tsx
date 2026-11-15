'use client'

import { Trash2, Trash2Icon } from "lucide-react"
import { useRouter } from 'next/navigation'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"


// The dialog only needs these three things from the job
type DeleteJobDialogProps = {
    job: { _id: string; title: string; company: string }
    // Called after the job is deleted, so the page can remove the row
    onDeleted: (id: string) => void
}

export function DeleteJobDialog({ job, onDeleted }: DeleteJobDialogProps) {
const router =useRouter()
    async function handleDelete() {
        try {
            await deleteJob(job._id)
            onDeleted(job._id)
            toast.add({
                title: "Job deleted",
                description: "This job has been deleted permanently."
            })
        } catch (error) {
            console.error(error)
            alert("Failed to delete the job")
        }
        router.refresh()
    }

    return (
        <AlertDialog>
            {/* The small trash icon button shown in the table row */}
            <AlertDialogTrigger
                render={
                    <Button size="icon" variant="outline" aria-label="Delete job">
                        <Trash2 />
                    </Button>
                }
            />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete job post?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete &quot;{job.title}&quot; at {job.company}.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
