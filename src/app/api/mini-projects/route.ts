import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'mini-projects.json')

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const newProject = await request.json()
    const data = fs.readFileSync(filePath, 'utf8')
    const projects = JSON.parse(data)
    projects.push(newProject)
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProject = await request.json()
    const data = fs.readFileSync(filePath, 'utf8')
    const projects = JSON.parse(data)
    const index = projects.findIndex((p: any) => p.id === updatedProject.id)
    if (index !== -1) {
      projects[index] = updatedProject
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2))
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ success: false }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const data = fs.readFileSync(filePath, 'utf8')
    const projects = JSON.parse(data)
    const filtered = projects.filter((p: any) => p.id !== id)
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
