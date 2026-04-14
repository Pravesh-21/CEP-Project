import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ text: string }> }
) {
  const { text } = await params
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
  return NextResponse.json({ qr: url })
}
