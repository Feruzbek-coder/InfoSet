import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'teachers-articles.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8')
    const articles = JSON.parse(fileContents)
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error reading teachers articles:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const article = await request.json()
    const fileContents = await fs.readFile(dataFilePath, 'utf8')
    const articles = JSON.parse(fileContents)
    
    articles.unshift(article)
    
    await fs.writeFile(dataFilePath, JSON.stringify(articles, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding teachers article:', error)
    return NextResponse.json({ error: 'Failed to add article' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle = await request.json()
    const fileContents = await fs.readFile(dataFilePath, 'utf8')
    const articles = JSON.parse(fileContents)
    
    const index = articles.findIndex((a: any) => a.id === updatedArticle.id)
    if (index !== -1) {
      articles[index] = updatedArticle
      await fs.writeFile(dataFilePath, JSON.stringify(articles, null, 2))
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  } catch (error) {
    console.error('Error updating teachers article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const fileContents = await fs.readFile(dataFilePath, 'utf8')
    const articles = JSON.parse(fileContents)
    
    const filteredArticles = articles.filter((a: any) => a.id !== id)
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredArticles, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting teachers article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
