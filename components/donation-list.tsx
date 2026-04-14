"use client"

import useSWR from "swr"
import { toast } from "sonner"
import {
  Clock,
  UserCheck,
  CheckCircle2,
  Package,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

export function DonationList() {
  const {
    data: donations,
    isLoading,
    mutate,
  } = useSWR<Donation[]>("/api/donations", fetcher, {
    refreshInterval: 3000,
  })

  async function handleAccept(id: number) {
    try {
      await fetch(`/api/donations/accept/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer: Date.now() }),
      })
      toast.success("Donation accepted!")
      mutate()
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            All Donations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage all donation items
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
          All Donations
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage all donation items
        </p>
      </div>

      {!donations || donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-sm text-muted-foreground">
            No donations yet. Create one to get started.
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
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
              >
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
                  </div>

                  <div className="flex gap-2">
                    {donation.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(donation.id)}
                        className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                      >
                        Accept
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                    {donation.status === "assigned" && (
                      <Button
                        size="sm"
                        onClick={() => handleComplete(donation.id)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Complete
                      </Button>
                    )}
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
