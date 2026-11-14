'use client'
import type { ComponentType } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"

type Role = "seeker" | "recruiter" | "admin"

interface MenuItem {
    id: string
    name: string
    url: string
    icon: ComponentType<{ className?: string }>
}

interface SessionUser {
    role?: Role
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
    seeker: [],
    recruiter: [],
    admin: [],
}

export function DashboardSidebar() {
    const { data: session, isPending } = useSession()
    const role: Role = (session?.user as SessionUser | undefined)?.role ?? "seeker"

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {
                        // menuItemsByRole[role].map((item: MenuItem) => (
                        //     <SidebarMenuItem key={item.id}>
                        //         <SidebarMenuButton render={<a href={item.url} />}>
                        //             <item.icon />
                        //             <span>{item.name}</span>
                        //         </SidebarMenuButton>
                        //     </SidebarMenuItem>
                        // ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}