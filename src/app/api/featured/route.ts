import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import fs from 'fs'
import path from 'path'

const featuredPath = path.join(process.cwd(), 'src/data/featured.json')

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
      const result = await pool.query('SELECT * FROM featured LIMIT 1')
      if (result.rows.length > 0) {
        return NextResponse.json({ articleId: result.rows[0].article_id, source: result.rows[0].source })
      }
      return NextResponse.json({ articleId: null, source: 'maqolalar' })
    } else {
      const fileContents = fs.readFileSync(featuredPath, 'utf8')
      const featured = JSON.parse(fileContents)
      return NextResponse.json(featured)
    }
  } catch (error) {
    console.error('Error reading featured:', error)
    return NextResponse.json({ articleId: null, source: 'maqolalar' })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      // Avval eski featured'ni o'chirish
      await pool.query('DELETE FROM featured')
      // Yangi featured qo'shish
      await pool.query(
        'INSERT INTO featured (article_id, source) VALUES ($1, $2)',
        [data.articleId, data.source]
      )
      return NextResponse.json({ success: true })
    } else {
      fs.writeFileSync(featuredPath, JSON.stringify(data, null, 2))
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error updating featured:', error)
    return NextResponse.json({ error: 'Failed to update featured' }, { status: 500 })
  }
}
