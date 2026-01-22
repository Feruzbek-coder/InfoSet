import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json')

// Default foydalanuvchilar ro'yxati
const defaultUsers = [
  {
    "id": 1,
    "username": "Feruzbek2201",
    "password": "Admin123",
    "name": "Feruzbek",
    "isPremium": true,
    "isAdmin": true,
    "registeredDate": "2026-01-04"
  }
]

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    let users = defaultUsers
    
    // JSON faylni o'qishga harakat qilish
    try {
      if (fs.existsSync(usersFilePath)) {
        const fileContent = fs.readFileSync(usersFilePath, 'utf-8')
        const parsedUsers = JSON.parse(fileContent)
        if (parsedUsers && parsedUsers.length > 0) {
          users = parsedUsers
        }
      }
    } catch (fileError) {
      console.log('JSON fayl o\'qib bo\'lmadi, default foydalanuvchilar ishlatiladi')
    }
    
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
