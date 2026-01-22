import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Debug API - ma'lumotlar bazasini tekshirish uchun
export async function GET() {
  try {
    // Featured
    const featuredResult = await pool.query('SELECT * FROM featured')
    
    // Pinned
    const pinnedResult = await pool.query('SELECT * FROM pinned')
    
    // Articles
    const articlesResult = await pool.query('SELECT id, title FROM articles LIMIT 10')
    
    // Learning articles
    const learningResult = await pool.query('SELECT id, title FROM learning_articles LIMIT 10')
    
    return NextResponse.json({
      featured: featuredResult.rows,
      pinned: pinnedResult.rows,
      articles: articlesResult.rows,
      learning_articles: learningResult.rows
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
