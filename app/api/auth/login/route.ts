import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const USERNAME = "akilhan"
const PASSWORD = "Oqillion1305+"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (username === USERNAME && password === PASSWORD) {
      const cookieStore = await cookies()
      // Set auth cookie (expires in 7 days)
      cookieStore.set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 })
  }
}

