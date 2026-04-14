// Authentication utilities for role-based access

export type UserRole = "donor" | "volunteer" | "ngo"

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  points?: number
}

const AUTH_KEY = "social_mentor_user"

export function setUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  }
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    return null
  }
}

export function clearUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function getUserRole(): UserRole | null {
  const user = getUser()
  return user?.role || null
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function requireRole(role: UserRole): boolean {
  const user = getUser()
  return user?.role === role
}
