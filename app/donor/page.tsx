"use client"

import { RouteGuard } from "@/components/route-guard"
import { DonorDashboard } from "@/components/donor-dashboard"

export default function DonorPage() {
  return (
    <RouteGuard requiredRole="donor">
      <DonorDashboard />
    </RouteGuard>
  )
}
