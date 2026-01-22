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
  fileUrl?: string
}

export default function OqituvchilarPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Darslik',
    author: 'Admin',
    image: '',
    fileUrl: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/teachers-articles')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Maqolalarni yuklashda xato:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return null

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        return data.fileUrl
      } else {
        alert('Fayl yuklashda xatolik!')
        return null
      }
    } catch (error) {
      console.error('Fayl yuklashda xato:', error)
      alert('Fayl yuklashda xatolik!')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    let uploadedFileUrl = formData.fileUrl

    // Upload file if selected
    if (selectedFile) {
      const fileUrl = await handleFileUpload()
      if (fileUrl) {
        uploadedFileUrl = fileUrl
      }
    }

    const articleData = {
      ...formData,
      fileUrl: uploadedFileUrl,
      date: new Date().toISOString().split('T')[0],
      id: editingId || Date.now()
    }

    try {
      const response = await fetch('/api/teachers-articles', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
      })

      if (response.ok) {
        await loadArticles()
        resetForm()
        alert(editingId ? 'Material muvaffaqiyatli tahrirlandi!' : 'Material muvaffaqiyatli qo\'shildi!')
      } else {
        alert('Xatolik yuz berdi!')
      }
    } catch (error) {
      console.error('Materialni saqlashda xato:', error)
      alert('Xatolik yuz berdi!')
    }
  }

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      author: article.author,
      image: article.image,
      fileUrl: article.fileUrl || ''
    })
    setEditingId(article.id)
    setIsAddingNew(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Bu materialni o\'chirishni xohlaysizmi?')) {
      try {
        const response = await fetch('/api/teachers-articles', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        })

        if (response.ok) {
          await loadArticles()
          alert('Material muvaffaqiyatli o\'chirildi!')
        } else {
          alert('Xatolik yuz berdi!')
        }
      } catch (error) {
        console.error('Materialni o\'chirishda xato:', error)
        alert('Xatolik yuz berdi!')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Darslik',
      author: 'Admin',
      image: '',
      fileUrl: ''
    })
    setSelectedFile(null)
    setIsAddingNew(false)
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">O'qituvchilar uchun materiallar</h1>
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
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                Yangi Material Qo'shish
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form - Only for Admin */}
        {isAdmin && isAddingNew && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Materialni Tahrirlash' : 'Yangi Material Qo\'shish'}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Darslik">Darslik</option>
                    <option value="Video dars">Video dars</option>
                    <option value="Test">Test</option>
                    <option value="Topshiriq">Topshiriq</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fayl yuklash
                </label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Tanlangan fayl: {selectedFile.name}
                  </p>
                )}
                {formData.fileUrl && !selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Mavjud fayl: <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="underline">{formData.fileUrl}</a>
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yoki fayl havolasini kiriting
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  value={formData.fileUrl}
                  placeholder="https://example.com/file.pdf"
                  onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matn
                </label>
                <textarea
                  rows={6}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={uploading}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading}
                >
                  {uploading ? 'Yuklanmoqda...' : (editingId ? 'Yangilash' : 'Qo\'shish')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Mavjud Materiallar</h3>
          </div>
          <div className="divide-y">
            {articles.map((article) => (
              <div key={article.id} className="p-6 flex justify-between items-start hover:bg-gray-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-xl text-gray-900">{article.title}</h4>
                    <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <p className="text-gray-800 text-base mb-3 leading-relaxed">
                    {article.content.substring(0, 150)}...
                  </p>
                  {article.fileUrl && (
                    <a 
                      href={article.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline font-semibold text-sm mb-2 inline-block"
                    >
                      📎 Faylni yuklash
                    </a>
                  )}
                  <p className="text-base text-gray-700 font-medium mb-3">
                    {article.date} | {article.author}
                  </p>
                  <Link
                    href={`/oqituvchilar/${article.id}`}
                    className="text-orange-600 hover:text-orange-800 text-base font-semibold hover:underline"
                  >
                    To'liq o'qish →
                  </Link>
                </div>
                {isAdmin && (
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-orange-600 hover:text-orange-800 text-base font-semibold hover:underline"
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
            <p className="text-gray-700 text-base font-medium">Hech qanday material mavjud emas.</p>
          </div>
        )}
      </main>
    </div>
  )
}
