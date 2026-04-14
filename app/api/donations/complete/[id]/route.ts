import { NextResponse } from "next/server"
import { donations, users } from "@/lib/store"

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const donation = donations.find((d) => d.id === Number(id))

  if (donation) {
    donation.status = "delivered"
    const user = users.find((u) => u.id === donation.volunteer)
    if (user) user.points += 50
  }

  return NextResponse.json(donation || { error: "Not found" })
}
