import { NextResponse } from "next/server"
import { donations, users } from "@/lib/store"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const donation = donations.find((d) => d.id === Number(id))

  if (!donation) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 })
  }

  if (donation.status === "assigned" && donation.volunteer === body.volunteer) {
    donation.status = "pending"
    donation.volunteer = null
    
    // Deduct points for rejecting (remove the 10 points they got for accepting)
    const volunteer = users.find((u) => u.id === body.volunteer)
    if (volunteer) {
      volunteer.points = Math.max(0, (volunteer.points || 0) - 10)
    }
  }

  return NextResponse.json(donation)
}
