import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    message: "Nearby volunteers simulated",
    requestJSON: {
      lat: body.lat,
      lng: body.lng,
      radius: 5000,
    },
  })
}
