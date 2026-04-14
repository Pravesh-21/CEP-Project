"use client"

import { RouteGuard } from "@/components/route-guard"
import { UnifiedDashboard } from "@/components/unified-dashboard"

export default function DashboardPage() {
  return (
    <RouteGuard>
      <UnifiedDashboard />
    </RouteGuard>
  )
}
