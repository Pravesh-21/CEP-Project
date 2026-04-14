"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { StatsDashboard } from "@/components/stats-dashboard"
import { NGODonationList } from "@/components/ngo-donation-list"
import { getUser } from "@/lib/auth"

export function NGODashboard() {
  const [activeSection, setActiveSection] = useState("donations")
  const user = getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          role="ngo"
          userName={user?.name}
        />
      </div>

      {/* Mobile header */}
      <MobileHeader
        activeSection={activeSection}
        onNavigate={setActiveSection}
        role="ngo"
      />

      {/* Main content */}
      <main className="pt-14 lg:ml-64 lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2 bg-gradient-to-r from-foreground via-primary/90 to-foreground bg-clip-text text-transparent">
                NGO Dashboard
              </h1>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Monitor donations and impact
              </p>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-xs font-semibold text-emerald-400">
                System Active
              </span>
            </div>
          </div>

          {/* Active section */}
          {activeSection === "dashboard" && <StatsDashboard />}
          {activeSection === "donations" && <NGODonationList />}
        </div>
      </main>
    </div>
  )
}
