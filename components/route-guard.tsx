"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, type UserRole } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const user = getUser()
    
    if (!user) {
      setIsAuthorized(false)
      setIsChecking(false)
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      // Role mismatch - redirect to login
      router.push("/")
      setIsChecking(false)
      return
    }

    setIsAuthorized(true)
    setIsChecking(false)
  }, [router, requiredRole])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return <LoginForm />
  }

  return <>{children}</>
}
