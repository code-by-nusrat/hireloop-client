'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    Banknote,
    Bookmark,
    Briefcase,
    Building2,
    CreditCard,
    FileText,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    type LucideIcon,
} from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteLogo } from "@/components/layout/site-header"
import { useSession, signOut } from "@/lib/auth-client"

type DashboardRole = 'seeker' | 'recruiter' | 'admin'

interface MenuItem {
    id: string
    name: string
    icon: LucideIcon
    url: string
}

const menuItemsByRole: Record<DashboardRole, MenuItem[]> = {
    seeker: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, url: '/dashboard/seeker' },
        { id: 'jobs', name: 'Jobs', icon: Briefcase, url: '/dashboard/seeker/jobs' },
        { id: 'saved', name: 'Saved Jobs', icon: Bookmark, url: '/dashboard/seeker/saved' },
        { id: 'applications', name: 'Applications', icon: FileText, url: '/dashboard/seeker/applications' },
        { id: 'billing', name: 'Billing', icon: CreditCard, url: '/dashboard/seeker/billing' },
        { id: 'settings', name: 'Settings', icon: Settings, url: '/dashboard/seeker/settings' },
    ],
    recruiter: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, url: '/dashboard/recruiter' },
        { id: 'jobs', name: 'Manage Jobs', icon: Briefcase, url: '/dashboard/recruiter/jobs' },
        { id: 'applications', name: 'Applications', icon: FileText, url: '/dashboard/recruiter/applications' },
        { id: 'settings', name: 'Settings', icon: Settings, url: '/dashboard/recruiter/settings' },
    ],
    admin: [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, url: '/dashboard/admin' },
        { id: 'users', name: 'Users', icon: Users, url: '/dashboard/admin/users' },
        { id: 'companies', name: 'Companies', icon: Building2, url: '/dashboard/admin/companies' },
        { id: 'jobs', name: 'Jobs', icon: Briefcase, url: '/dashboard/admin/jobs' },
        { id: 'payments', name: 'Payments', icon: Banknote, url: '/dashboard/admin/payments' },
        { id: 'settings', name: 'Settings', icon: Settings, url: '/dashboard/admin/settings' },
    ],
}

function initialsOf(name: string) {
    return (
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]!.toUpperCase())
            .join('') || 'HL'
    )
}

function UserCard({
    name,
    subtitle,
    image,
    badge,
}: {
    name: string
    subtitle: string
    image?: string | null
    badge?: string
}) {
    return (
        <div className="mx-3 flex items-center gap-3 rounded-xl border bg-card/60 p-3">
            <Avatar className="size-9">
                {image ? <AvatarImage src={image} alt={name} /> : null}
                <AvatarFallback className="text-xs">{initialsOf(name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground">{subtitle}</span>
                {badge ? (
                    <Badge className="w-fit bg-primary/15 text-primary hover:bg-primary/15">
                        {badge}
                    </Badge>
                ) : null}
            </div>
        </div>
    )
}

export function DashboardSidebar() {
    const { data: session, isPending } = useSession()
    const role = ((session?.user as { role?: string } | undefined)?.role ||
        'seeker') as DashboardRole
    const pathname = usePathname()
    const router = useRouter()

    const items = menuItemsByRole[role] ?? menuItemsByRole.seeker
    const rootUrl = items[0].url

    // Dashboard (root item) only matches exactly; other items also match sub-routes
    const isActive = (url: string) =>
        url === rootUrl
            ? pathname === url
            : pathname === url || pathname.startsWith(url + '/')

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    return (
        <Sidebar>
            <SidebarHeader className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 px-4 pt-4">
                    <SiteLogo />
                    {role === 'admin' && (
                        <span className="text-xs text-muted-foreground">Admin Console</span>
                    )}
                </div>

                {/* Seeker & Recruiter: user card under the logo. Admin shows it in the footer. */}
                {role !== 'admin' && !isPending && (
                    role === 'seeker' ? (
                        <UserCard
                            name={session?.user?.name || 'Seeker Portal'}
                            subtitle="Professional Tier"
                            image={session?.user?.image}
                        />
                    ) : (
                        <UserCard
                            name={session?.user?.name || 'Recruiter Portal'}
                            subtitle="Recruiter"
                            image={session?.user?.image}
                            badge="Premium account"
                        />
                    )
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {!isPending &&
                            items.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        isActive={isActive(item.url)}
                                        render={<Link href={item.url} />}
                                    >
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="flex flex-col gap-2 p-2">
                {role === 'seeker' && (
                    <Button
                        nativeButton={false}
                        render={<Link href="/dashboard/seeker/settings" />}
                        className="w-full justify-center rounded-lg bg-foreground text-background hover:bg-foreground/90"
                    >
                        Post Resume
                    </Button>
                )}

                {role === 'admin' && !isPending && (
                    <UserCard
                        name={session?.user?.name || 'Admin'}
                        subtitle="Super Admin"
                        image={session?.user?.image}
                    />
                )}

                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}
                            tooltip="Logout"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}