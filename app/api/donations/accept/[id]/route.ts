import { NextResponse } from "next/server"
import { donations, users } from "@/lib/store"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const donation = donations.find((d) => d.id === Number(id))

  if (donation && donation.status === "pending") {
    donation.status = "assigned"
    donation.volunteer = body.volunteer
    
    // Give points to volunteer for accepting task
    const volunteer = users.find((u) => u.id === body.volunteer)
    if (volunteer) {
      volunteer.points = (volunteer.points || 0) + 10
    }
  }

  return NextResponse.json(donation || { error: "Not found" })
}
