"use client"

import { RouteGuard } from "@/components/route-guard"
import { VolunteerDashboard } from "@/components/volunteer-dashboard"

export default function VolunteerPage() {
  return (
    <RouteGuard requiredRole="volunteer">
      <VolunteerDashboard />
    </RouteGuard>
  )
}
