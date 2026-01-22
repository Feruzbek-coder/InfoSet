import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'pinned.json')

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
    const { articleId, source } = await request.json()
    const data = fs.readFileSync(filePath, 'utf8')
    const pinned = JSON.parse(data)
    
    // Agar allaqachon pinned bo'lsa, olib tashlash
    const existingIndex = pinned.findIndex((p: any) => p.articleId === articleId && p.source === source)
    
    if (existingIndex !== -1) {
      pinned.splice(existingIndex, 1)
    } else {
      // Yangi pin qo'shish
      pinned.push({ articleId, source, pinnedAt: new Date().toISOString() })
    }
    
    fs.writeFileSync(filePath, JSON.stringify(pinned, null, 2))
    return NextResponse.json({ success: true, pinned })
  } catch (error) {
    console.error('Pin error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { articleId, source } = await request.json()
    const data = fs.readFileSync(filePath, 'utf8')
    const pinned = JSON.parse(data)
    
    const filtered = pinned.filter((p: any) => !(p.articleId === articleId && p.source === source))
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
