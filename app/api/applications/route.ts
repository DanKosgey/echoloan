import { type NextRequest, NextResponse } from "next/server"

// In-memory storage - replace with database
const applications: Array<Record<string, unknown>> = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const application = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    applications.push(application)
    console.log("[v0] New application with EcoCash:", data.ecocashPhone)

    return NextResponse.json({ success: true, id: application.id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(applications)
}
