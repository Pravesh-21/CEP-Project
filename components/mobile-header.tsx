"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Heart,
  Menu,
  X,
  LayoutDashboard,
  Gift,
  ListChecks,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearUser, type UserRole } from "@/lib/auth"

interface MobileHeaderProps {
  activeSection: string
  onNavigate: (section: string) => void
  role: UserRole
}

const roleNavItems: Record<UserRole, Array<{ id: string; label: string; icon: any }>> = {
  donor: [
    { id: "create-donation", label: "New Donation", icon: Gift },
  ],
  volunteer: [
    { id: "donations", label: "Available Donations", icon: ListChecks },
    { id: "leaderboard", label: "Leaderboard", icon: LayoutDashboard },
  ],
  ngo: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "donations", label: "Received Donations", icon: ListChecks },
  ],
}

export function MobileHeader({
  activeSection,
  onNavigate,
  role,
}: MobileHeaderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const navItems = roleNavItems[role] || []

  function handleLogout() {
    clearUser()
    router.push("/")
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Social Mentor
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-foreground hover:bg-secondary"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false)
            }}
            role="button"
            tabIndex={0}
            aria-label="Close navigation"
          />
          <nav className="fixed left-0 right-0 top-14 z-50 border-b border-border bg-card p-3 lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </>
      )}
    </>
  )
}
