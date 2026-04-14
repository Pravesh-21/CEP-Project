"use client"

import useSWR from "swr"
import {
  Gift,
  CheckCircle2,
  Clock,
  Users,
  UserCheck,
  Building2,
  Trophy,
  TrendingUp,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Stats {
  totalDonations: number
  completed: number
  pending: number
  assigned: number
  volunteers: number
  donors: number
  ngos: number
  totalUsers: number
  topVolunteers: { id: number; name: string; points: number }[]
}

export function StatsDashboard() {
  const { data: stats, isLoading } = useSWR<Stats>("/api/stats", fetcher, {
    refreshInterval: 3000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Impact Dashboard
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time overview of platform activity
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse rounded-xl border border-border bg-card p-5"
            >
              <div className="h-4 w-24 rounded bg-secondary" />
              <div className="mt-3 h-8 w-16 rounded bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const cards = [
    {
      label: "Total Donations",
      value: stats?.totalDonations ?? 0,
      icon: Gift,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "Completed",
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      label: "Assigned",
      value: stats?.assigned ?? 0,
      icon: TrendingUp,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
    },
    {
      label: "Volunteers",
      value: stats?.volunteers ?? 0,
      icon: UserCheck,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
    },
    {
      label: "Donors",
      value: stats?.donors ?? 0,
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "NGOs",
      value: stats?.ngos ?? 0,
      icon: Building2,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Impact Dashboard
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time overview of platform activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group rounded-2xl border-2 border-border/60 bg-card/60 backdrop-blur-md p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center justify-between relative z-10">
              <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
              <div className={`rounded-xl p-2.5 ${card.bgColor} border border-current/10 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <p className="mt-3 text-4xl font-extrabold text-foreground relative z-10 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {stats?.topVolunteers && stats.topVolunteers.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-foreground">
              Top Volunteers
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {stats.topVolunteers.map((vol, idx) => (
              <div
                key={vol.id}
                className="flex items-center justify-between rounded-lg bg-secondary p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {vol.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-emerald-400">
                  {vol.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
