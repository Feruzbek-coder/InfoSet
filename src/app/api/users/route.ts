import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json')

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8')
    const users = JSON.parse(fileContent)
    
    // Agar username berilgan bo'lsa, faqat shu foydalanuvchini qaytarish
    if (username) {
      const user = users.find((u: any) => u.username === username)
      if (user) {
        return NextResponse.json({
          id: user.id,
          username: user.username,
          name: user.name,
          isPremium: user.isPremium,
          isAdmin: user.isAdmin || false,
          registeredDate: user.registeredDate
        })
      }
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }
    
    // Parollarni olib tashlash (xavfsizlik uchun)
    const safeUsers = users.map((user: any) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin || false,
      registeredDate: user.registeredDate
    }))
    
    return NextResponse.json(safeUsers)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, name } = await request.json()
    
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8')
    const users = JSON.parse(fileContent)
    
    // Username mavjudligini tekshirish
    if (users.some((u: any) => u.username === username)) {
      return NextResponse.json({ error: 'Bu username band' }, { status: 400 })
    }
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1,
      username,
      password,
      name,
      isPremium: false,
      registeredDate: new Date().toISOString().split('T')[0]
    }
    
    users.push(newUser)
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    
    return NextResponse.json({ success: true, id: newUser.id })
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isPremium } = await request.json()
    
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8')
    const users = JSON.parse(fileContent)
    
    const userIndex = users.findIndex((u: any) => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }
    
    users[userIndex].isPremium = isPremium
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')
    
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8')
    let users = JSON.parse(fileContent)
    
    users = users.filter((u: any) => u.id !== id)
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}
