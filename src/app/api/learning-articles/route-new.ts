import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import fs from 'fs'
import path from 'path'

// Fallback: JSON file path
const filePath = path.join(process.cwd(), 'src', 'data', 'learning-articles.json')

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
      // PostgreSQL dan o'qish
      const result = await pool.query('SELECT * FROM learning_articles ORDER BY id DESC')
      return NextResponse.json(result.rows)
    } else {
      // JSON fayldan o'qish (local development)
      const data = fs.readFileSync(filePath, 'utf8')
      return NextResponse.json(JSON.parse(data))
    }
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newArticle = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      // PostgreSQL ga yozish
      const result = await pool.query(
        'INSERT INTO learning_articles (title, content, category, author, date, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [newArticle.title, newArticle.content, newArticle.category, newArticle.author, newArticle.date, newArticle.image || '']
      )
      return NextResponse.json({ success: true, data: result.rows[0] })
    } else {
      // JSON faylga yozish (local development)
      const data = fs.readFileSync(filePath, 'utf8')
      const articles = JSON.parse(data)
      articles.push(newArticle)
      fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      // PostgreSQL da yangilash
      const result = await pool.query(
        'UPDATE learning_articles SET title = $1, content = $2, category = $3, author = $4, date = $5, image = $6 WHERE id = $7 RETURNING *',
        [updatedArticle.title, updatedArticle.content, updatedArticle.category, updatedArticle.author, updatedArticle.date, updatedArticle.image || '', updatedArticle.id]
      )
      
      if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, data: result.rows[0] })
    } else {
      // JSON faylda yangilash (local development)
      const data = fs.readFileSync(filePath, 'utf8')
      const articles = JSON.parse(data)
      const index = articles.findIndex((a: any) => a.id === updatedArticle.id)
      
      if (index !== -1) {
        articles[index] = updatedArticle
        fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))
        return NextResponse.json({ success: true })
      }
      
      return NextResponse.json({ success: false }, { status: 404 })
    }
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      // PostgreSQL dan o'chirish
      const result = await pool.query('DELETE FROM learning_articles WHERE id = $1 RETURNING *', [id])
      
      if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true })
    } else {
      // JSON fayldan o'chirish (local development)
      const data = fs.readFileSync(filePath, 'utf8')
      const articles = JSON.parse(data)
      const filtered = articles.filter((a: any) => a.id !== id)
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
