"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { DonorDonationForm } from "@/components/donor-donation-form"
import { VolunteerDonationList } from "@/components/volunteer-donation-list"
import { StatsDashboard } from "@/components/stats-dashboard"
import { NGODonationList } from "@/components/ngo-donation-list"
import { getUser, type UserRole } from "@/lib/auth"

export function UnifiedDashboard() {
  const router = useRouter()
  const user = getUser()
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    // Set default section based on role
    if (user.role === "donor") {
      setActiveSection("create-donation")
    } else if (user.role === "volunteer") {
      setActiveSection("donations")
    } else if (user.role === "ngo") {
      setActiveSection("dashboard")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const renderContent = () => {
    if (user.role === "donor") {
      switch (activeSection) {
        case "create-donation":
          return <DonorDonationForm />
        default:
          return <DonorDonationForm />
      }
    } else if (user.role === "volunteer") {
      switch (activeSection) {
        case "donations":
          return <VolunteerDonationList />
        default:
          return <VolunteerDonationList />
      }
    } else if (user.role === "ngo") {
      switch (activeSection) {
        case "dashboard":
          return <StatsDashboard />
        case "donations":
          return <NGODonationList />
        default:
          return <StatsDashboard />
      }
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          role={user.role}
          userName={user.name}
        />
      </div>

      {/* Mobile header */}
      <MobileHeader
        activeSection={activeSection}
        onNavigate={setActiveSection}
        role={user.role}
      />

      {/* Main content */}
      <main className="pt-14 lg:ml-64 lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-muted-foreground">
                System Active
              </span>
            </div>
          </div>

          {/* Active section */}
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
