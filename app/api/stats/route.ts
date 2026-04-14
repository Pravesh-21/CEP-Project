import { NextResponse } from "next/server"
import { donations, users } from "@/lib/store"

export async function GET() {
  return NextResponse.json({
    totalDonations: donations.length,
    completed: donations.filter((d) => d.status === "delivered").length,
    pending: donations.filter((d) => d.status === "pending").length,
    assigned: donations.filter((d) => d.status === "assigned").length,
    volunteers: users.filter((u) => u.role === "volunteer").length,
    donors: users.filter((u) => u.role === "donor").length,
    ngos: users.filter((u) => u.role === "ngo").length,
    totalUsers: users.length,
    topVolunteers: users
      .filter((u) => u.role === "volunteer")
      .sort((a, b) => b.points - a.points)
      .slice(0, 5),
  })
}
