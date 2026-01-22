'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import HomeHeader from '../components/HomeHeader'

interface Article {
  id: number
  title: string
  content: string
  category: string
  author: string
  date: string
  image: string
}

export default function KompyuterDasturlashPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Dasturlash',
    author: 'Admin',
    image: ''
  })

  useEffect(() => {
    loadArticles()
    // Admin mode is always enabled for you
    setIsAdmin(true)
  }, [])

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/programming-articles')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Maqolalarni yuklashda xato:', error)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    const articleData = {
      ...formData,
      date: new Date().toISOString().split('T')[0],
      id: editingId || Date.now()
    }

    try {
      const response = await fetch('/api/programming-articles', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
      })

      if (response.ok) {
        await loadArticles()
        resetForm()
        alert(editingId ? 'Maqola muvaffaqiyatli tahrirlandi!' : 'Maqola muvaffaqiyatli qo\'shildi!')
      } else {
        alert('Xatolik yuz berdi!')
      }
    } catch (error) {
      console.error('Maqolani saqlashda xato:', error)
      alert('Xatolik yuz berdi!')
    }
  }

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      author: article.author,
      image: article.image
    })
    setEditingId(article.id)
    setIsAddingNew(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu maqolani o\'chirishni xohlaysizmi?')) {
      try {
        const response = await fetch('/api/programming-articles', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        })

        if (response.ok) {
          await loadArticles()
          alert('Maqola muvaffaqiyatli o\'chirildi!')
        } else {
          alert('Xatolik yuz berdi!')
        }
      } catch (error) {
        console.error('Maqolani o\'chirishda xato:', error)
        alert('Xatolik yuz berdi!')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Dasturlash',
      author: 'Admin',
      image: ''
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kompyuterda ishlash va Dasturlash guruhi</h1>
          <div className="flex gap-3">
            {/* Test Mode Toggle Button */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isAdmin 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              title="Admin/Foydalanuvchi rejimini almashtirish"
            >
              {isAdmin ? '👤 Admin rejimi' : '👥 Foydalanuvchi rejimi'}
            </button>
            {isAdmin && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Yangi Maqola Qo'shish
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form - Only for Admin */}
        {isAdmin && isAddingNew && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Maqolani Tahrirlash' : 'Yangi Maqola Qo\'shish'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sarlavha
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Dasturlash">Dasturlash</option>
                    <option value="AI">AI</option>
                    <option value="Kompyuter">Kompyuter</option>
                    <option value="Ofis dasturlari">Ofis dasturlari</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matn
                </label>
                <textarea
                  rows={6}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingId ? 'Yangilash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Two Column Layout: Featured Banner + Latest Articles */}
        {articles.find(a => a.title === "Kompyuter savodxonligi") && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article Banner - Left Side (2 columns) */}
            <Link href="/kompyuter-dasturlash/computer-literacy" className="lg:col-span-2 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <h2 className="text-3xl font-bold text-green-900 mb-4 flex items-center gap-3">
              <span>💻</span>
              <span>Kompyuter Savodxonligi Kursi — Arzon narxda!</span>
            </h2>
            
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-2">🔵 Kompyuter sohasida ishonchli bilimga ega bo'ling!</p>
              <p className="text-base text-gray-700 leading-relaxed">
                Kompyuterdan foydalanasizmi? Ishda, o'qishda yoki kundalik hayotda kompyuter sizga yordam berishini xohlaysizmi?
                Unda siz uchun eng arzon va eng qulay kursni tayyorladik! 👇
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🚀</span>
                <span>Kursda nimalar o'rgatiladi?</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-gray-900 mb-2">🖥 1. Kompyuter qurilmalari (kompyuter qismlari)</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Processor, RAM, SSD/HDD nima?</span>
                    </li>
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Monitor, klaviatura, sichqoncha turlari</span>
                    </li>
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Kompyuter yig'ilishi va ishlash prinsipi</span>
                    </li>
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Viruslar va xavfsizlik haqida ma'lumot</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-2">💻 2. Kompyuterda ishlash ko'nikmalari</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Windows bilan ishlash</span>
                    </li>
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Papka va fayllarni boshqarish</span>
                    </li>
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Internetdan xavfsiz foydalanish</span>
                    </li>
                    <li className="flex items-start gap-3 text-base text-gray-700">
                      <span className="text-green-600 font-bold mt-1">✅</span>
                      <span>Office dasturlarida ishlash (Word, Excel)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-green-100 rounded-xl">
              <p className="text-2xl font-bold text-green-900 flex items-center gap-2">
                <span>💰</span>
                <span>Narx: 120 000 so'm!</span>
              </p>
              <p className="text-base text-gray-700 mt-2">
                👉 Darslar o'quvchilarga yengil va tushunarli usulda tushuntiriladi.
              </p>
            </div>

            <div className="border-t-2 border-green-200 pt-5">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📲</span>
                <span>Ko'proq ma'lumot va ro'yxatdan o'tish uchun:</span>
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://t.me/Uz_Admin_05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md"
                >
                  <span>👉</span>
                  <span>Telegram orqali bog'lanish</span>
                </a>
                <a
                  href="https://t.me/InfoSet_Kompyuter_va_dasturlash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md"
                >
                  <span>🔗</span>
                  <span>Kanalga a'zo bo'lish</span>
                </a>
              </div>
            </div>
            
            {/* Comment Button */}
            <div className="mt-5 pt-5 border-t-2 border-green-200">
              <Link
                href="/kompyuter-dasturlash/computer-literacy#comments"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span>Fikr bildirish</span>
              </Link>
            </div>
          </Link>

          {/* Latest 3 Articles - Right Side (1 column) */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📰 So'nggi maqolalar</h3>
            <div className="space-y-5">
              {articles.filter(a => a.title !== "Kompyuter savodxonligi").slice(0, 3).map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 p-6">
                  <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mt-3 mb-3 leading-tight">
                    {article.title}
                  </h4>
                  <p className="text-base text-gray-700 mb-3 leading-relaxed">
                    {article.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600 font-medium">{article.date}</span>
                    <Link
                      href={`/kompyuter-dasturlash/${article.id}`}
                      className="text-green-600 hover:text-green-800 font-bold"
                    >
                      Batafsil →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* All Remaining Articles List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Barcha maqolalar</h2>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Boshqa Maqolalar</h3>
          </div>
          <div className="divide-y">
            {articles.filter(a => a.title !== "Kompyuter savodxonligi").slice(3).map((article) => (
              <div key={article.id} className="p-6 flex justify-between items-start hover:bg-gray-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-xl text-gray-900">{article.title}</h4>
                    <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <p className="text-gray-800 text-base mb-3 leading-relaxed">
                    {article.content.substring(0, 150)}...
                  </p>
                  <p className="text-base text-gray-700 font-medium mb-3">
                    {article.date} | {article.author}
                  </p>
                  <Link
                    href={`/kompyuter-dasturlash/${article.id}`}
                    className="text-green-600 hover:text-green-800 text-base font-semibold hover:underline"
                  >
                    To'liq o'qish →
                  </Link>
                </div>
                {isAdmin && (
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-green-600 hover:text-green-800 text-base font-semibold hover:underline"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-800 text-base font-semibold hover:underline"
                    >
                      O'chirish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-700 text-base font-medium">Hech qanday maqola mavjud emas.</p>
          </div>
        )}
      </main>
    </div>
  )
}
