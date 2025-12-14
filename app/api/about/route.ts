import { NextRequest, NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import { join } from "path"

const dataPath = join(process.cwd(), "data", "about.json")

export async function GET() {
  try {
    const fileContents = await readFile(dataPath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    await writeFile(dataPath, JSON.stringify(body, null, 2), "utf8")
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
  }
}

