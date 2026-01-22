import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const likesPath = path.join(process.cwd(), 'src/data/likes.json')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const articleId = searchParams.get('articleId')
  try {
    const fileContents = fs.readFileSync(likesPath, 'utf8')
    let likes = JSON.parse(fileContents)
    if (articleId) {
      likes = likes.filter((l: any) => l.articleId === Number(articleId))
    }
    return NextResponse.json(likes)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { articleId } = await request.json()
    const fileContents = fs.readFileSync(likesPath, 'utf8')
    const likes = JSON.parse(fileContents)
    // Like ni faqat bittalab qo'shamiz (IP yoki localStorage bilan cheklash mumkin)
    likes.push({ articleId, date: new Date().toISOString() })
    fs.writeFileSync(likesPath, JSON.stringify(likes, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add like' }, { status: 500 })
  }
}