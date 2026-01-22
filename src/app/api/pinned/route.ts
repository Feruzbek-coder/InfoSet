import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'pinned.json')

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
      const result = await pool.query('SELECT article_id as "articleId", source, pinned_at as "pinnedAt" FROM pinned ORDER BY pinned_at DESC')
      return NextResponse.json(result.rows)
    } else {
      const data = fs.readFileSync(filePath, 'utf8')
      return NextResponse.json(JSON.parse(data))
    }
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const { articleId, source } = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      // Agar allaqachon pinned bo'lsa, o'chirish
      const existing = await pool.query(
        'SELECT * FROM pinned WHERE article_id = $1 AND source = $2',
        [articleId, source]
      )
      
      if (existing.rows.length > 0) {
        await pool.query('DELETE FROM pinned WHERE article_id = $1 AND source = $2', [articleId, source])
      } else {
        await pool.query(
          'INSERT INTO pinned (article_id, source, pinned_at) VALUES ($1, $2, $3)',
          [articleId, source, new Date().toISOString()]
        )
      }
      
      const result = await pool.query('SELECT article_id as "articleId", source, pinned_at as "pinnedAt" FROM pinned ORDER BY pinned_at DESC')
      return NextResponse.json({ success: true, pinned: result.rows })
    } else {
      const data = fs.readFileSync(filePath, 'utf8')
      const pinned = JSON.parse(data)
      
      const existingIndex = pinned.findIndex((p: any) => p.articleId === articleId && p.source === source)
      
      if (existingIndex !== -1) {
        pinned.splice(existingIndex, 1)
      } else {
        pinned.push({ articleId, source, pinnedAt: new Date().toISOString() })
      }
      
      fs.writeFileSync(filePath, JSON.stringify(pinned, null, 2))
      return NextResponse.json({ success: true, pinned })
    }
  } catch (error) {
    console.error('Pin error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { articleId, source } = await request.json()
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      await pool.query('DELETE FROM pinned WHERE article_id = $1 AND source = $2', [articleId, source])
      return NextResponse.json({ success: true })
    } else {
      const data = fs.readFileSync(filePath, 'utf8')
      const pinned = JSON.parse(data)
      const filtered = pinned.filter((p: any) => !(p.articleId === articleId && p.source === source))
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2))
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
