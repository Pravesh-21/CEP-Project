"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Gift,
  ListChecks,
  Heart,
  LogOut,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearUser, type UserRole } from "@/lib/auth"

interface AppSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
  role: UserRole
  userName?: string
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
    { id: "donations", label: "Received Donations", icon: ListChecks },
    { id: "dashboard", label: "Impact Dashboard", icon: LayoutDashboard },
  ],
}

export function AppSidebar({ activeSection, onNavigate, role, userName }: AppSidebarProps) {
  const router = useRouter()
  const navItems = roleNavItems[role] || []

  function handleLogout() {
    clearUser()
    router.push("/")
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border/60 bg-card/90 backdrop-blur-md shadow-2xl shadow-primary/5">
      <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-card/50 to-card/30 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-lg shadow-primary/20">
          <Heart className="h-5 w-5 text-primary-foreground drop-shadow-sm" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Social Mentor
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </p>
        </div>
      </div>

      {userName && (
        <div className="border-b border-border/60 bg-gradient-to-r from-secondary/30 to-transparent px-6 py-3.5">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/20">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="text-foreground font-semibold truncate">{userName}</span>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden group",
              activeSection === item.id
                ? "bg-gradient-to-r from-primary/25 via-primary/15 to-primary/10 text-foreground border-2 border-primary/30 shadow-lg shadow-primary/10 scale-[1.02]"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-2 hover:border hover:border-primary/20"
            )}
          >
            {activeSection === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/60 rounded-r-full" />
            )}
            <item.icon className={cn(
              "h-4 w-4 transition-all duration-300 relative z-10",
              activeSection === item.id ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-110"
            )} />
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-border/60 bg-gradient-to-t from-card/50 to-transparent p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all duration-300 font-medium"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
