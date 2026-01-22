import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json')

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8')
    const users = JSON.parse(fileContent)
    
    const user = users.find((u: any) => u.username === username && u.password === password)
    
    if (!user) {
      return NextResponse.json({ error: 'Login yoki parol xato' }, { status: 401 })
    }
    
    // Parolni olib tashlash
    const { password: _, ...safeUser } = user
    
    return NextResponse.json({ 
      success: true, 
      user: safeUser
    })
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}
