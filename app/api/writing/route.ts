import { NextRequest, NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import { join } from "path"

const dataPath = join(process.cwd(), "data", "writing.json")

export async function GET() {
  try {
    const fileContents = await readFile(dataPath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fileContents = await readFile(dataPath, "utf8")
    const data = JSON.parse(fileContents)
    
    // Add new writing
    data.push(body)
    
    await writeFile(dataPath, JSON.stringify(data, null, 2), "utf8")
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, ...updatedData } = body
    const fileContents = await readFile(dataPath, "utf8")
    const data = JSON.parse(fileContents)
    
    const index = data.findIndex((item: any) => item.slug === slug)
    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    
    data[index] = { ...data[index], ...updatedData }
    
    await writeFile(dataPath, JSON.stringify(data, null, 2), "utf8")
    return NextResponse.json({ success: true, data: data[index] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }
    
    const fileContents = await readFile(dataPath, "utf8")
    const data = JSON.parse(fileContents)
    
    const filtered = data.filter((item: any) => item.slug !== slug)
    
    await writeFile(dataPath, JSON.stringify(filtered, null, 2), "utf8")
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 })
  }
}

