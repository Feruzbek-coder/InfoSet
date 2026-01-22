import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const featuredPath = path.join(process.cwd(), 'src/data/featured.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(featuredPath, 'utf8')
    const featured = JSON.parse(fileContents)
    return NextResponse.json(featured)
  } catch (error) {
    console.error('Error reading featured:', error)
    return NextResponse.json({ articleId: null, source: 'maqolalar' })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    fs.writeFileSync(featuredPath, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating featured:', error)
    return NextResponse.json({ error: 'Failed to update featured' }, { status: 500 })
  }
}
