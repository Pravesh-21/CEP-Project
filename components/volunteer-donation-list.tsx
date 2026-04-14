"use client"

import useSWR from "swr"
import { toast } from "sonner"
import {
  Clock,
  UserCheck,
  CheckCircle2,
  Package,
  ArrowRight,
  MapPin,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUser } from "@/lib/auth"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

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

export function VolunteerDonationList() {
  const {
    data: donations,
    isLoading,
    mutate,
  } = useSWR<Donation[]>("/api/donations", fetcher, {
    refreshInterval: 3000,
  })

  async function handleAccept(id: number) {
    const user = getUser()
    if (!user) {
      toast.error("Please login to accept donations")
      return
    }

    try {
      const res = await fetch(`/api/donations/accept/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer: user.id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Donation accepted! +10 points")
        mutate()
      } else {
        toast.error(data.error || "Failed to accept donation")
      }
    } catch {
      toast.error("Failed to accept donation")
    }
  }

  async function handleComplete(id: number) {
    try {
      await fetch(`/api/donations/complete/${id}`, {
        method: "PUT",
      })
      toast.success("Delivery completed! +50 points")
      mutate()
    } catch {
      toast.error("Failed to complete donation")
    }
  }

  async function handleReject(id: number) {
    const user = getUser()
    if (!user) {
      toast.error("Please login to reject donations")
      return
    }

    try {
      const res = await fetch(`/api/donations/reject/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer: user.id }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Request rejected. Donation is now available for others.")
        mutate()
      } else {
        toast.error(data.error || "Failed to reject donation")
      }
    } catch {
      toast.error("Failed to reject donation")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Available Donations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Accept and deliver donations to help those in need
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Available Donations
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Accept and deliver donations to help those in need
        </p>
      </div>

      {!donations || donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-sm text-muted-foreground">
            No donations available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((donation) => {
            const status = statusConfig[donation.status]
            const StatusIcon = status.icon
            return (
              <div
                key={donation.id}
                className="group rounded-3xl border-2 border-border/60 bg-card/60 backdrop-blur-md p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-foreground">
                        {donation.title}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          status.className
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {donation.desc}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Donor: {donation.donor} | Created:{" "}
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                    {donation.location && (
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-3 w-3 text-emerald-400" />
                        <p className="text-xs text-emerald-400 font-medium">
                          Location: {donation.location.lat.toFixed(4)},{" "}
                          {donation.location.lng.toFixed(4)}
                        </p>
                        <a
                          href={`https://www.google.com/maps?q=${donation.location.lat},${donation.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          (View on Map)
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {donation.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(donation.id)}
                        className="border-2 border-sky-500/40 text-sky-400 hover:bg-gradient-to-r hover:from-sky-500/20 hover:to-sky-500/10 hover:text-sky-300 hover:border-sky-500/60 shadow-lg hover:shadow-xl hover:shadow-sky-500/20 transition-all duration-300 font-semibold rounded-xl hover:scale-105 active:scale-95"
                      >
                        Accept Task
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                    {donation.status === "assigned" && (() => {
                      const user = getUser()
                      const isMyTask = user && donation.volunteer === user.id
                      return isMyTask ? (
                        <>
                        <Button
                          size="sm"
                          onClick={() => handleComplete(donation.id)}
                          className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground hover:from-primary/95 hover:via-primary hover:to-primary/95 shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 font-semibold rounded-xl hover:scale-105 active:scale-95"
                        >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Mark Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(donation.id)}
                            className="border-2 border-red-500/40 text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-500/10 hover:text-red-300 hover:border-red-500/60 shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 font-semibold rounded-xl hover:scale-105 active:scale-95"
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      ) : null
                    })()}
                  </div>
                </div>

                {donation.aiSuggestion && (
                  <div className="mt-3 rounded-lg bg-emerald-500/5 p-3 text-xs leading-relaxed text-foreground/70">
                    <span className="font-medium text-emerald-400">
                      AI Suggestion:
                    </span>{" "}
                    {donation.aiSuggestion}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
