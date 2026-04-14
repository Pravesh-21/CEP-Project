import { NextResponse } from "next/server"
import { donations } from "@/lib/store"

export async function GET() {
  try {
    return NextResponse.json(donations, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const body = await request.json()

  let aiSuggestion = ""

  // Gemini AI Suggestion
  try {
    const geminiKey = process.env.GEMINI_API_KEY
    if (geminiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Given this donation description: "${body.desc}", suggest the best way to distribute this donation to maximize social impact. Keep it brief (2-3 sentences).`,
                  },
                ],
              },
            ],
          }),
        }
      )
      if (geminiRes.ok) {
        const data = await geminiRes.json()
        aiSuggestion =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
      }
    }
  } catch {
    // Silently ignore AI errors
  }

  const donation = {
    id: Date.now(),
    title: body.title as string,
    desc: body.desc as string,
    donor: body.donor as string,
    status: "pending" as const,
    volunteer: null,
    aiSuggestion,
    createdAt: new Date().toISOString(),
    location: body.location as { lat: number; lng: number } | undefined,
  }

  donations.push(donation)
  return NextResponse.json(donation)
}
