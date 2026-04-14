"use client"

import useSWR from "swr"
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUser } from "@/lib/auth"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Volunteer {
  id: number
  name: string
  points: number
}

interface Stats {
  topVolunteers: Volunteer[]
}

export function VolunteerLeaderboard() {
  const user = getUser()
  const { data: stats, isLoading } = useSWR<Stats>("/api/stats", fetcher, {
    refreshInterval: 3000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Volunteer Leaderboard
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Top volunteers ranked by points
          </p>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
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

  const topVolunteers = stats?.topVolunteers || []
  const currentUserRank =
    topVolunteers.findIndex((v) => v.id === user?.id) + 1 || null
  const currentUserPoints =
    topVolunteers.find((v) => v.id === user?.id)?.points || 0

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-400" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <Star className="h-5 w-5 text-muted-foreground" />
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-amber-400/20 to-amber-600/20 border-amber-400/30"
    if (rank === 2)
      return "bg-gradient-to-r from-slate-400/20 to-slate-600/20 border-slate-400/30"
    if (rank === 3)
      return "bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-amber-600/30"
    return "bg-secondary border-border"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Volunteer Leaderboard
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Top volunteers ranked by points earned
        </p>
      </div>

      {/* Current User Stats */}
      {user && (
        <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 p-7 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Your Ranking
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-3xl font-extrabold text-foreground bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {currentUserRank ? `#${currentUserRank}` : "Unranked"}
                </span>
                {currentUserRank && currentUserRank <= 3 && (
                  <div className="animate-bounce">{getRankIcon(currentUserRank)}</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Your Points
              </p>
              <div className="mt-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="text-3xl font-extrabold text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  {currentUserPoints}
                </span>
                <span className="text-sm text-muted-foreground font-medium">pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {topVolunteers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Trophy className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-sm text-muted-foreground">
            No volunteers yet. Start accepting tasks to earn points!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topVolunteers.map((volunteer, idx) => {
            const rank = idx + 1
            const isCurrentUser = user?.id === volunteer.id
            return (
              <div
                key={volunteer.id}
                className={cn(
                  "rounded-3xl border-2 p-7 transition-all duration-300 relative overflow-hidden group",
                  getRankBadge(rank),
                  isCurrentUser && "ring-2 ring-primary/60 shadow-2xl shadow-primary/20",
                  "hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01]"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/50">
                      {rank <= 3 ? (
                        getRankIcon(rank)
                      ) : (
                        <span className="text-lg font-bold text-foreground">
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-base font-semibold",
                            isCurrentUser
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          {volunteer.name}
                        </span>
                        {isCurrentUser && (
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                            You
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Volunteer #{volunteer.id}
                      </p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-400">
                        {volunteer.points}
                      </span>
                      <span className="text-sm text-muted-foreground">pts</span>
                    </div>
                    {rank === 1 && (
                      <p className="mt-1 text-xs font-medium text-amber-400">
                        🏆 Top Volunteer
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Points Info */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          How to Earn Points
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-emerald-400">+10 pts</span>
            <span>for accepting a donation task</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-emerald-400">+50 pts</span>
            <span>for completing a delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-red-400">-10 pts</span>
            <span>for rejecting an accepted task</span>
          </div>
        </div>
      </div>
    </div>
  )
}
