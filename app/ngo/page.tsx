"use client"

import { RouteGuard } from "@/components/route-guard"
import { NGODashboard } from "@/components/ngo-dashboard"

export default function NGOPage() {
  return (
    <RouteGuard requiredRole="ngo">
      <NGODashboard />
    </RouteGuard>
  )
}
