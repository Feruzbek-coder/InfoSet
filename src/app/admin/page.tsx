'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  id: number
  title: string
  content: string
  category: string
  author: string
  date: string
  image: string
  source?: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'learning' | 'articles' | 'projects' | 'users'>('learning')
  const [articles, setArticles] = useState<Article[]>([])
  const [projects, setProjects] = useState<Article[]>([])
  const [learningArticles, setLearningArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [featuredArticleId, setFeaturedArticleId] = useState<number | null>(null)
  const [pinnedArticles, setPinnedArticles] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Tezlashtirish',
    author: 'Admin',
    image: ''
  })

  useEffect(() => {
    loadArticles()
    loadProjects()
    loadLearningArticles()
    loadFeatured()
    loadUsers()
    loadPinned()
    localStorage.setItem('adminMode', 'true')
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAddingNew && (formData.title || formData.content)) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isAddingNew, formData])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/mini-projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Loyihalarni yuklashda xato:', error)
    }
  }

  const loadLearningArticles = async () => {
    try {
      const response = await fetch('/api/learning-articles')
      const data = await response.json()
      setLearningArticles(data)
    } catch (error) {
      console.error('Dasturlash maqolalarini yuklashda xato:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Foydalanuvchilarni yuklashda xato:', error)
    }
  }

  const togglePremium = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isPremium: !currentStatus })
      })
      
      if (response.ok) {
        loadUsers()
      }
    } catch (error) {
      console.error('Xatolik:', error)
    }
  }

  const loadArticles = async () => {
    try {
      // Barcha manbalardan maqolalarni yuklash
      const articlesRes = await fetch('/api/articles')
      const articles = await articlesRes.json()
      
      const programmingRes = await fetch('/api/programming-articles')
      const programmingArticles = await programmingRes.json()
      
      const teachersRes = await fetch('/api/teachers-articles')
      const teachersArticles = await teachersRes.json()
      
      // Barcha maqolalarni birlashtirish va manba qo'shish
      const allArticles = [
        ...articles.map((a: any) => ({ ...a, source: 'maqolalar' })),
        ...programmingArticles.map((a: any) => ({ ...a, source: 'kompyuter-dasturlash' })),
        ...teachersArticles.map((a: any) => ({ ...a, source: 'oqituvchilar' }))
      ]
      
      // Sana bo'yicha tartiblash (eng yangisi birinchi)
      const sortedArticles = allArticles.sort((a: any, b: any) => {
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
        if (dateCompare !== 0) return dateCompare
        return b.id - a.id
      })
      
      setArticles(sortedArticles)
    } catch (error) {
      console.error('Maqolalarni yuklashda xato:', error)
    }
  }

  const loadFeatured = async () => {
    try {
      const response = await fetch('/api/featured')
      const data = await response.json()
      setFeaturedArticleId(data.articleId)
    } catch (error) {
      console.error('Featured maqolani yuklashda xato:', error)
    }
  }

  const loadPinned = async () => {
    try {
      const response = await fetch('/api/pinned')
      const data = await response.json()
      setPinnedArticles(data)
    } catch (error) {
      console.error('Pinned maqolalarni yuklashda xato:', error)
    }
  }

  const togglePinArticle = async (articleId: number, source: string) => {
    try {
      const response = await fetch('/api/pinned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, source })
      })
      const result = await response.json()
      if (result.success) {
        setPinnedArticles(result.pinned)
        alert(isPinned(articleId, source) ? 'Maqola pindan olib tashlandi!' : 'Maqola pinlandi!')
      }
    } catch (error) {
      console.error('Pin xatosi:', error)
      alert('Xatolik yuz berdi!')
    }
  }

  const isPinned = (articleId: number, source: string) => {
    return pinnedArticles.some((p: any) => p.articleId === articleId && p.source === source)
  }

  const setFeaturedArticle = async (articleId: number, source: string = 'maqolalar') => {
    try {
      await fetch('/api/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, source })
      })
      setFeaturedArticleId(articleId)
      alert('Tanlangan maqola o\'rnatildi!')
    } catch (error) {
      console.error('Featured maqolani o\'rnatishda xato:', error)
      alert('Xatolik yuz berdi!')
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    const articleData: any = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    }
    
    // Faqat tahrirlashda id qo'shish
    if (editingId) {
      articleData.id = editingId
    }

    try {
      // Qaysi API endpoint ishlatishni aniqlash
      let apiUrl = '/api/articles'
      if (activeTab === 'learning') {
        apiUrl = '/api/learning-articles'
      } else if (activeTab === 'projects') {
        apiUrl = '/api/mini-projects'
      }

      const response = await fetch(apiUrl, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        if (activeTab === 'learning') {
          await loadLearningArticles()
        } else if (activeTab === 'projects') {
          await loadProjects()
        } else {
          await loadArticles()
        }
        resetForm()
        alert(editingId ? 'Muvaffaqiyatli tahrirlandi!' : 'Muvaffaqiyatli qo\'shildi!')
      } else {
        const errorMsg = result.error || 'Xatolik yuz berdi!'
        console.error('API error:', errorMsg)
        alert(errorMsg)
      }
    } catch (error) {
      console.error('Saqlashda xato:', error)
      alert('Xatolik yuz berdi! Railway platformasida file system read-only. Iltimos, database ishlatish kerak.')
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

  const handleDelete = async (id: number, source?: string) => {
    if (confirm('Buni o\'chirishni xohlaysizmi?')) {
      try {
        // Manbaga qarab to'g'ri API endpointni tanlash
        let apiUrl = '/api/articles'
        if (source === 'kompyuter-dasturlash') {
          apiUrl = '/api/programming-articles'
        } else if (source === 'oqituvchilar') {
          apiUrl = '/api/teachers-articles'
        } else if (activeTab === 'learning') {
          apiUrl = '/api/learning-articles'
        } else if (activeTab === 'projects') {
          apiUrl = '/api/mini-projects'
        }
        
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        })

        if (response.ok) {
          if (activeTab === 'learning') {
            await loadLearningArticles()
          } else if (activeTab === 'projects') {
            await loadProjects()
          } else {
            await loadArticles()
          }
          alert('Muvaffaqiyatli o\'chirildi!')
        } else {
          alert('Xatolik yuz berdi!')
        }
      } catch (error) {
        console.error('O\'chirishda xato:', error)
        alert('Xatolik yuz berdi!')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Tezlashtirish',
      author: 'Admin',
      image: ''
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Iltimos, faqat rasm faylini tanlang!')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        const imageMarkdown = `\n![${data.fileName}](${data.fileUrl})\n`
        setFormData(prev => ({
          ...prev,
          content: prev.content + imageMarkdown
        }))
        alert('Rasm muvaffaqiyatli yuklandi!')
      } else {
        alert('Rasm yuklashda xatolik!')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Xatolik yuz berdi!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
              </svg>
              <span className="text-2xl font-bold text-gray-900">InfoSet.uz</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">Bosh sahifa</Link>
              <Link href="/maqolalar" className="text-gray-500 hover:text-gray-900">Maqolalar</Link>
              <span className="text-blue-600 font-medium">Admin Panel</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Yangi {activeTab === 'articles' ? 'Maqola' : activeTab === 'learning' ? 'Dars' : 'Loyiha'} Qo'shish
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('learning')
                setIsAddingNew(false)
                setEditingId(null)
              }}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'learning'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dasturlashga qadam
            </button>
            <button
              onClick={() => {
                setActiveTab('articles')
                setIsAddingNew(false)
                setEditingId(null)
              }}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'articles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Maqolalar
            </button>
            <button
              onClick={() => {
                setActiveTab('projects')
                setIsAddingNew(false)
                setEditingId(null)
              }}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'projects'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kichik Loyihalarim
            </button>
            <button
              onClick={() => {
                setActiveTab('users')
                setIsAddingNew(false)
                setEditingId(null)
              }}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Foydalanuvchilar
            </button>
          </nav>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Foydalanuvchilar boshqaruvi
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ism</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ro'yxatdan o'tgan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registeredDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isPremium ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            Premium ✨
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-700">
                            Oddiy
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => togglePremium(user.id, user.isPremium)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            user.isPremium
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                          }`}
                        >
                          {user.isPremium ? 'Oddiyga o\'zgartirish' : 'Premium qilish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Hozircha foydalanuvchilar yo'q</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'articles' && (<>
        {isAddingNew && (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Tezlashtirish">Tezlashtirish</option>
                    <option value="Xavfsizlik">Xavfsizlik</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matn
                </label>
                <div className="mb-2">
                  <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-500">Rasm matn ichiga qo'shiladi</span>
                </div>
                <textarea
                  rows={10}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Matnni kiriting. Rasm qo'shish uchun yuqoridagi 'Rasm yuklash' tugmasini bosing."
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingId ? 'Yangilash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        )}

        {articles.length === 0 && !isAddingNew ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-700 text-base font-medium">Hech qanday maqola mavjud emas.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Mavjud Maqolalar</h3>
            </div>
            <div className="divide-y">
              {articles.map((article) => (
                <div key={`${article.source}-${article.id}`} className="p-6 flex justify-between items-start hover:bg-gray-50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-xl text-gray-900">{article.title}</h4>
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      {article.source && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                          {article.source === 'maqolalar' ? 'Maqolalar' : 
                           article.source === 'kompyuter-dasturlash' ? 'Dasturlash' : 
                           'O\'qituvchilar'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 text-base mb-3 leading-relaxed">
                      {article.content.substring(0, 150)}...
                    </p>
                    <p className="text-base text-gray-700 font-medium">
                      {article.date} | {article.author}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-blue-600 hover:text-blue-800 text-base font-semibold hover:underline"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(article.id, article.source)}
                        className="text-red-600 hover:text-red-800 text-base font-semibold hover:underline"
                      >
                        O'chirish
                      </button>
                    </div>
                    <button
                      onClick={() => setFeaturedArticle(article.id, article.source || 'maqolalar')}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                        featuredArticleId === article.id
                          ? 'bg-yellow-500 text-white cursor-default'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                      disabled={featuredArticleId === article.id}
                    >
                      {featuredArticleId === article.id ? (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Tanlangan
                        </span>
                      ) : (
                        'Tanlangan qilish'
                      )}
                    </button>
                    <button
                      onClick={() => togglePinArticle(article.id, article.source || 'maqolalar')}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                        isPinned(article.id, article.source || 'maqolalar')
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {isPinned(article.id, article.source || 'maqolalar') ? (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                          </svg>
                          Pinlangan
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                          </svg>
                          Pinlash
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>)}

        {/* Learning Articles Tab Content */}
        {activeTab === 'learning' && (<>
        {isAddingNew && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Darsni Tahrirlash' : 'Yangi Dars Qo\'shish'}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Boshlang'ich">Boshlang'ich</option>
                    <option value="O'rta">O'rta</option>
                    <option value="Ilg'or">Ilg'or</option>
                    <option value="Loyihalar">Loyihalar</option>
                    <option value="Dasturlashga qadam">Dasturlashga qadam</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matn
                </label>
                <div className="mb-2">
                  <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                  <span className="ml-3 text-sm text-gray-500">Rasm matn ichiga qo'shiladi</span>
                </div>
                <textarea
                  rows={10}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 font-mono text-sm text-gray-900"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Matnni kiriting. Rasm qo'shish uchun yuqoridagi 'Rasm yuklash' tugmasini bosing."
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  {editingId ? 'Yangilash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        )}

        {learningArticles.length === 0 && !isAddingNew ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-700 text-base font-medium">Hech qanday dars mavjud emas.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Mavjud Darslar</h3>
            </div>
            <div className="divide-y">
              {learningArticles.map((article) => (
                <div key={article.id} className="p-6 flex justify-between items-start hover:bg-gray-50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-xl text-gray-900">{article.title}</h4>
                      <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <p className="text-gray-800 text-base mb-3 leading-relaxed">
                      {article.content.substring(0, 150)}...
                    </p>
                    <p className="text-base text-gray-700 font-medium">
                      {article.date} | {article.author}
                    </p>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-emerald-600 hover:text-emerald-800 text-base font-semibold hover:underline"
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
                </div>
              ))}
            </div>
          </div>
        )}
        </>)}

        {/* Projects Tab Content */}
        {activeTab === 'projects' && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-700 text-base font-medium">"Kichik loyihalarim" boshqaruvi hali ishlanmoqda...</p>
            <p className="text-gray-500 text-sm mt-2">Tez orada loyihalarni boshqarish imkoniyati qo'shiladi</p>
          </div>
        )}
      </main>
    </div>
  )
}
