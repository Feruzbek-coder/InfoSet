import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import fs from 'fs'
import path from 'path'

const articlesPath = path.join(process.cwd(), 'src/data/articles.json')

// Database mavjudligini tekshirish
async function isDatabaseAvailable() {
  if (!process.env.DATABASE_URL) return false
  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  }
}

export async function GET() {
  try {
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      const result = await pool.query('SELECT * FROM articles ORDER BY id DESC')
      return NextResponse.json(result.rows)
    } else {
      const fileContents = fs.readFileSync(articlesPath, 'utf8')
      const articles = JSON.parse(fileContents)
      return NextResponse.json(articles)
    }
  } catch (error) {
    console.error('Error reading articles:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newArticle = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      const result = await pool.query(
        'INSERT INTO articles (title, content, category, author, date, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [newArticle.title, newArticle.content, newArticle.category, newArticle.author, newArticle.date, newArticle.image || '']
      )
      return NextResponse.json({ success: true, data: result.rows[0] })
    } else {
      const fileContents = fs.readFileSync(articlesPath, 'utf8')
      const articles = JSON.parse(fileContents)
      articles.unshift(newArticle)
      fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2))
      return NextResponse.json({ success: true, data: newArticle })
    }
  } catch (error) {
    console.error('Error adding article:', error)
    return NextResponse.json({ success: false, error: 'Failed to add article' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      const result = await pool.query(
        'UPDATE articles SET title = $1, content = $2, category = $3, author = $4, date = $5, image = $6 WHERE id = $7 RETURNING *',
        [updatedArticle.title, updatedArticle.content, updatedArticle.category, updatedArticle.author, updatedArticle.date, updatedArticle.image || '', updatedArticle.id]
      )
      if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: result.rows[0] })
    } else {
      const fileContents = fs.readFileSync(articlesPath, 'utf8')
      const articles = JSON.parse(fileContents)
      const index = articles.findIndex((a: any) => a.id === updatedArticle.id)
      if (index !== -1) {
        articles[index] = updatedArticle
        fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2))
        return NextResponse.json({ success: true, data: updatedArticle })
      }
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id])
      if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    } else {
      const fileContents = fs.readFileSync(articlesPath, 'utf8')
      const articles = JSON.parse(fileContents)
      const filtered = articles.filter((a: any) => a.id !== id)
      fs.writeFileSync(articlesPath, JSON.stringify(filtered, null, 2))
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 })
  }
}