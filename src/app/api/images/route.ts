import { NextResponse } from 'next/server'
import pool from '@/lib/db'

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

// Jadval yaratish (agar mavjud bo'lmasa)
async function ensureTableExists() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      mimetype VARCHAR(100) NOT NULL,
      data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// Rasmni olish (GET /api/images?id=123)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    const useDb = await isDatabaseAvailable()
    if (!useDb) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const image = result.rows[0]
    const buffer = Buffer.from(image.data, 'base64')
    
    return new Response(buffer, {
      headers: {
        'Content-Type': image.mimetype,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error getting image:', error)
    return NextResponse.json({ error: 'Failed to get image' }, { status: 500 })
  }
}

// Rasmni yuklash (POST)
export async function POST(request: Request) {
  try {
    const useDb = await isDatabaseAvailable()
    if (!useDb) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    await ensureTableExists()

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    
    const result = await pool.query(
      'INSERT INTO images (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id, filename',
      [file.name, file.type, base64]
    )

    const imageId = result.rows[0].id
    // API orqali rasm olish uchun URL
    const fileUrl = `/api/images?id=${imageId}`
    
    return NextResponse.json({ 
      success: true, 
      fileUrl,
      imageId,
      fileName: file.name
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
