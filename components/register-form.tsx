"use client"

import { useState } from "react"
import { toast } from "sonner"
import { UserPlus, User, Building2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const roles = [
  {
    value: "donor" as const,
    label: "Donor",
    description: "Contribute items & resources",
    icon: Heart,
  },
  {
    value: "volunteer" as const,
    label: "Volunteer",
    description: "Help deliver donations",
    icon: User,
  },
  {
    value: "ngo" as const,
    label: "NGO",
    description: "Organize and distribute",
    icon: Building2,
  },
]

export function RegisterForm() {
  const [name, setName] = useState("")
  const [role, setRole] = useState<"donor" | "volunteer" | "ngo">("donor")
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!name.trim()) {
      toast.error("Please enter your name")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role }),
      })
      const user = await res.json()
      toast.success(`Welcome, ${user.name}! Registered as ${user.role}.`)
      setName("")
    } catch {
      toast.error("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Join the Platform
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Register as a donor, volunteer, or NGO to start making an impact
        </p>
      </div>

      <div className="max-w-lg space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="register-name" className="text-sm text-foreground">
            Full Name
          </Label>
          <Input
            id="register-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm text-foreground">Select Your Role</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
                  role === r.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"
                )}
              >
                <r.icon
                  className={cn(
                    "h-6 w-6",
                    role === r.value
                      ? "text-emerald-400"
                      : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">{r.label}</span>
                <span className="text-xs text-muted-foreground">
                  {r.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
    </div>
  )
}
