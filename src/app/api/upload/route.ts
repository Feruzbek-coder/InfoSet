import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`

    // Database mavjud bo'lsa, PostgreSQL'ga saqlash
    const useDb = await isDatabaseAvailable()
    
    if (useDb) {
      try {
        await ensureTableExists()
        
        const base64 = buffer.toString('base64')
        const result = await pool.query(
          'INSERT INTO images (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id',
          [fileName, file.type, base64]
        )
        
        const imageId = result.rows[0].id
        const fileUrl = `/api/images?id=${imageId}`
        
        return NextResponse.json({ 
          success: true, 
          fileUrl,
          fileName: file.name
        })
      } catch (dbError) {
        console.error('Database upload error:', dbError)
        // Database xatolik bo'lsa, local'ga saqlashga harakat qilish
      }
    }

    // Local'ga saqlash (development uchun)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      fileUrl,
      fileName: file.name
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
