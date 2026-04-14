"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { getUser } from "@/lib/auth"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect if already logged in
    const user = getUser()
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  return <LoginForm />
}
