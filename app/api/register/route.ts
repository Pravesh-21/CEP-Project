import { NextResponse } from "next/server"
import { users } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Registration API - Received request body:", {
      name: body.name,
      email: body.email,
      role: body.role,
      hasPassword: !!body.password,
    })

    // Validate required fields
    if (!body.name || !body.email || !body.password || !body.role) {
      const missingFields = []
      if (!body.name) missingFields.push("name")
      if (!body.email) missingFields.push("email")
      if (!body.password) missingFields.push("password")
      if (!body.role) missingFields.push("role")
      
      console.error("Missing required fields:", missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      )
    }

    // Validate email format - must contain @
    if (!body.email.includes("@")) {
      console.error("Invalid email format (missing @):", body.email)
      return NextResponse.json(
        { error: "Please enter a valid email address (must contain @)" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ["donor", "volunteer", "ngo"]
    if (!validRoles.includes(body.role)) {
      console.error("Invalid role:", body.role)
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email.toLowerCase() === body.email.toLowerCase())
    if (existingUser) {
      console.error("User already exists:", body.email)
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create user object
    const user = {
      id: Date.now(),
      name: body.name.trim(),
      email: (body.email as string).toLowerCase().trim(),
      password: body.password, // In production, hash this
      role: body.role as "donor" | "volunteer" | "ngo",
      points: 0,
      location: body.location,
    }

    console.log("Creating user:", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    users.push(user)
    console.log("User created successfully. Total users:", users.length)

    return NextResponse.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      points: user.points 
    }, { status: 201 })
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const body = await request.json()

  // Validate email format - must contain @
  if (!body.email || !body.email.includes("@")) {
    return NextResponse.json(
      { error: "Please enter a valid email address (must contain @)" },
      { status: 400 }
    )
  }

  // Login - find user by email and password
  const user = users.find(
    (u) => u.email.toLowerCase() === body.email.toLowerCase() && u.password === body.password
  )

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  }

  // If role is specified, verify it matches
  if (body.role && user.role !== body.role) {
    return NextResponse.json(
      { error: `This account is registered as ${user.role}, not ${body.role}. Please select the correct role.` },
      { status: 403 }
    )
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    points: user.points,
  })
}
