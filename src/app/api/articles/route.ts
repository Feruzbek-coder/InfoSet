import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const articlesPath = path.join(process.cwd(), 'src/data/articles.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(articlesPath, 'utf8')
    const articles = JSON.parse(fileContents)
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error reading articles:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newArticle = await request.json()
    
    const fileContents = fs.readFileSync(articlesPath, 'utf8')
    const articles = JSON.parse(fileContents)
    
    articles.unshift(newArticle)
    
    fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2))
    
    return NextResponse.json(newArticle)
  } catch (error) {
    console.error('Error adding article:', error)
    return NextResponse.json({ error: 'Failed to add article' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle = await request.json()
    
    const fileContents = fs.readFileSync(articlesPath, 'utf8')
    const articles = JSON.parse(fileContents)
    
    const index = articles.findIndex((a: any) => a.id === updatedArticle.id)
    if (index !== -1) {
      articles[index] = updatedArticle
      fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2))
      return NextResponse.json(updatedArticle)
    }
    
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    const fileContents = fs.readFileSync(articlesPath, 'utf8')
    const articles = JSON.parse(fileContents)
    
    const filteredArticles = articles.filter((a: any) => a.id !== id)
    
    fs.writeFileSync(articlesPath, JSON.stringify(filteredArticles, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}