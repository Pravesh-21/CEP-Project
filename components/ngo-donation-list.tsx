"use client"

import useSWR from "swr"
import {
  Clock,
  UserCheck,
  CheckCircle2,
  Package,
  MapPin,
  RefreshCw,
  User,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`)
  }
  return res.json()
}

interface Donation {
  id: number
  title: string
  desc: string
  donor: string
  status: "pending" | "assigned" | "delivered"
  volunteer: number | null
  aiSuggestion?: string
  createdAt: string
  location?: { lat: number; lng: number }
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  assigned: {
    label: "Assigned",
    icon: UserCheck,
    className: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
}

export function NGODonationList() {
  const {
    data: donations,
    isLoading,
    error,
    mutate,
  } = useSWR<Donation[]>("/api/donations", fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Received Donations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View all donations received through the platform
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-500/30 bg-red-500/5 p-8">
          <Package className="h-12 w-12 text-red-400/40" />
          <p className="mt-4 text-sm font-medium text-red-400">
            Error loading donations
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {error.message || "Failed to fetch donations. Please try again."}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Received Donations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View all donations received through the platform
          </p>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse rounded-xl border border-border bg-card p-5"
            >
              <div className="h-5 w-48 rounded bg-secondary" />
              <div className="mt-3 h-4 w-full rounded bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Filter to show only delivered donations (completed by volunteers)
  const deliveredDonations = donations?.filter((d) => d.status === "delivered") || []
  const allDonations = donations || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Received Donations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View all donations received and completed through the platform
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutate()}
          disabled={isLoading}
          className="border-border text-foreground hover:bg-secondary"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="group rounded-2xl border-2 border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Received</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {allDonations.length}
              </p>
            </div>
            <Package className="h-10 w-10 text-emerald-400/50 relative z-10" />
          </div>
        </div>
        <div className="group rounded-2xl border-2 border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Completed</p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                {deliveredDonations.length}
              </p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-emerald-400/50 relative z-10" />
          </div>
        </div>
        <div className="group rounded-2xl border-2 border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">
                {allDonations.filter((d) => d.status !== "delivered").length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-amber-400/50 relative z-10" />
          </div>
        </div>
      </div>

      {!allDonations || allDonations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-sm text-muted-foreground">
            No donations received yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allDonations.map((donation) => {
            const status = statusConfig[donation.status]
            const StatusIcon = status.icon
            return (
              <div
                key={donation.id}
                className="group rounded-3xl border-2 border-border/60 bg-card/60 backdrop-blur-md p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Task ID and Status */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-foreground">
                          {donation.id}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                            status.className
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {donation.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {donation.desc}
                      </p>
                    </div>

                    {/* Donor and Date Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/70">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>Donor: {donation.donor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Created:{" "}
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    {donation.location && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 p-2.5">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">
                          Location: {donation.location.lat.toFixed(4)},{" "}
                          {donation.location.lng.toFixed(4)}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${donation.location.lat},${donation.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-xs text-primary hover:underline"
                        >
                          View on Map →
                        </a>
                      </div>
                    )}

                    {/* AI Suggestion */}
                    {donation.aiSuggestion && (
                      <div className="mt-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                        <p className="text-xs font-medium text-emerald-400 mb-1">
                          AI Suggestion:
                        </p>
                        <p className="text-xs leading-relaxed text-foreground/80">
                          {donation.aiSuggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
