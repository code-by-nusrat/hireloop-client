import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/app/components/DashboardSidebar"
import { ToastContainer } from "react-toastify"
import { Toaster } from "@/components/ui/toast"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
        <Toaster></Toaster>
        <ToastContainer></ToastContainer>
      </SidebarInset>
    </SidebarProvider>
  )
}