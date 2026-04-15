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
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getUser } from "@/lib/auth"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Donation {
  id: number
  title: string
  desc: string
  donor: string
  status: "pending" | "assigned" | "completed"
  volunteer?: number
  location?: { lat: number; lng: number }
  createdAt: string
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  assigned: {
    label: "Assigned",
    icon: UserCheck,
    className: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
}

export function VolunteerDonationList() {
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { data: donations, isLoading, mutate } = useSWR<Donation[]>("/api/donations", fetcher, {
    refreshInterval: 3000,
  })

  const user = getUser(); // Get user at top level

  async function handleAccept(id: number) {
    if (!user) {
      toast.error("Please login to accept donations")
      return
    }

    setProcessingId(id) // Prevent double clicks
    try {
      const res = await fetch(`/api/donations/accept/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Ensure user.id matches the type your DB expects (String vs Number)
        body: JSON.stringify({ volunteer: user.id }), 
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Donation accepted! +10 points")
        await mutate() // Wait for local data update
      } else {
        toast.error(data.error || "This task might have been taken.")
      }
    } catch (err) {
      toast.error("Network error. Check your connection.")
    } finally {
      setProcessingId(null)
    }
  }

  // ... (handleComplete and handleReject remain the same)

  if (isLoading) {
    return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border bg-card/50" />
          ))}
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header section ... */}
      
      {!donations || donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <Package className="h-12 w-12 text-muted-foreground/20" />
          <p className="mt-4 text-sm text-muted-foreground">No donations available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => {
            const status = statusConfig[donation.status]
            const StatusIcon = status.icon
            const isProcessing = processingId === donation.id

            return (
              <div
                key={donation.id}
                className="group relative overflow-hidden rounded-3xl border-2 border-border/60 bg-card/60 backdrop-blur-md p-7 transition-all hover:border-primary/50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{donation.title}</h3>
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase", status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{donation.desc}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground/60 font-medium">
                        <span>Donor: {donation.donor}</span>
                        <span>•</span>
                        <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                    </div>

                    {donation.location && (
                      <div className="flex items-center gap-2 pt-2">
                        <MapPin className="h-3 w-3 text-emerald-400" />
                        <a
                          href={`https://www.google.com/maps?q=${donation.location.lat},${donation.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:underline font-semibold"
                        >
                          Location: {donation.location.lat.toFixed(4)}, {donation.location.lng.toFixed(4)} (View Map)
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {donation.status === "pending" && (
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handleAccept(donation.id)}
                        className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-6"
                      >
                        {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : "Accept Task"}
                        {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    )}

                    {donation.status === "assigned" && donation.volunteer === user?.id && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                          onClick={() => handleComplete(donation.id)}
                        >
                          Complete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="rounded-xl"
                          onClick={() => handleReject(donation.id)}
                        >
                          Reject
                        </Button>
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
