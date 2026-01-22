import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level') || '1'
    
    const filePath = path.join(process.cwd(), 'data', `level_${level}.json`)
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading questions:', error)
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }
}
