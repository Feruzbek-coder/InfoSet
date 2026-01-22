import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'learning-articles.json')

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
    const newArticle = await request.json()
    const data = fs.readFileSync(filePath, 'utf8')
    const articles = JSON.parse(data)
    articles.push(newArticle)
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle = await request.json()
    const data = fs.readFileSync(filePath, 'utf8')
    const articles = JSON.parse(data)
    const index = articles.findIndex((a: any) => a.id === updatedArticle.id)
    if (index !== -1) {
      articles[index] = updatedArticle
      fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))
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
    const articles = JSON.parse(data)
    const filtered = articles.filter((a: any) => a.id !== id)
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
