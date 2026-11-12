"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HireLoop home"
      className={cn(
        "flex shrink-0 items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <Image
        src="/images/logo.png"
        alt="HireLoop"
        width={116}
        height={24}
        priority
        className="h-7 w-auto"
      />
    </Link>
  )
}

function NavLinks({
  pathname,
  className,
  itemClassName,
  onNavigate,
}: {
  pathname: string
  className?: string
  itemClassName?: string
  onNavigate?: () => void
}) {
  return (
    <nav aria-label="Main" className={cn("flex items-center gap-1", className)}>
      {navLinks.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
              active && "text-primary",
              itemClassName
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      {/* Desktop / tablet layout — matches the Figma navbar */}
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center md:flex">
          <NavLinks pathname={pathname} />

          {/* vertical divider between links and auth actions */}
          <div aria-hidden className="mx-6 h-6 w-px bg-border" />

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link href="/login" />}
              className="px-2 text-sm font-medium text-primary hover:bg-transparent hover:text-primary/80"
            >
              Sign In
            </Button>
            <Button
              nativeButton={false}
              size="lg"
              render={<Link href="/sign-up" />}
              className="rounded-full px-6"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>

          <SheetContent side="right" className="w-80 gap-0">
            <SheetHeader className="border-b">
              <Logo />
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col overflow-y-auto">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMobileMenuOpen(false)}
                className="flex-col items-stretch gap-1 p-4"
              />

              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href="/sign-in" />}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-primary hover:bg-transparent hover:text-primary/80"
                >
                  Sign In
                </Button>
                <Button
                  nativeButton={false}
                  size="lg"
                  render={<Link href="/sign-up" />}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-full"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { Logo as SiteLogo }
