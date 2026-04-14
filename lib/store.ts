// In-memory store (mirrors the Express "fake database" for hackathon demo)

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: "donor" | "volunteer" | "ngo"
  points: number
  location?: { lat: number; lng: number }
}

export interface Donation {
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

// Global mutable state (persists across requests in dev, resets on redeploy)
const globalStore = globalThis as unknown as {
  __users: User[]
  __donations: Donation[]
}

if (!globalStore.__users) {
  globalStore.__users = []
}
if (!globalStore.__donations) {
  globalStore.__donations = []
}

export const users = globalStore.__users
export const donations = globalStore.__donations
