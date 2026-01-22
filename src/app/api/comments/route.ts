import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const commentsPath = path.join(process.cwd(), 'src/data/comments.json')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const articleId = searchParams.get('articleId')
  try {
    const fileContents = fs.readFileSync(commentsPath, 'utf8')
    let comments = JSON.parse(fileContents)
    if (articleId) {
      comments = comments.filter((c: any) => c.articleId === Number(articleId))
    }
    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newComment = await request.json()
    const fileContents = fs.readFileSync(commentsPath, 'utf8')
    const comments = JSON.parse(fileContents)
    comments.push(newComment)
    fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2))
    return NextResponse.json(newComment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}