'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Comment {
  id: number
  articleId: number
  author: string
  text: string
  date: string
}

export default function ServiceBannerPage() {
  const articleId = 999999 // Special ID for service banner
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [author, setAuthor] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?articleId=${articleId}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Fikrlarni yuklashda xato:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !author.trim()) return
    
    setCommentLoading(true)
    const newComment: Comment = {
      id: Date.now(),
      articleId,
      author,
      text: commentText,
      date: new Date().toISOString()
    }

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      })
      setCommentText('')
      setAuthor('')
      await loadComments()
    } catch (error) {
      console.error('Fikr qo\'shishda xato:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
              <span className="text-2xl font-bold text-gray-900">InfoSet.uz</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">Bosh sahifa</Link>
              <Link href="/maqolalar" className="text-blue-600 font-medium">Maqolalar</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Service Banner Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/maqolalar"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Orqaga qaytish
        </Link>

        <article className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <span>💻</span>
            <span>Onlayn kompyuter xizmatlari — uyingizdan chiqmasdan hal qiling!</span>
          </h1>
          
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-800 mb-3">Kompyuteringizda muammo bormi?</p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Biz yordam beramiz! Endi texnik yordam, dastur o'rnatish, printerlar bilan bog'liq muammolarni hal qilish va boshqa barcha xizmatlarni onlayn tarzda olishingiz mumkin.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🧩</span>
              <span>Xizmatlarimiz:</span>
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-lg text-gray-700">
                <span className="text-green-600 font-bold mt-1">✅</span>
                <span>Dasturlar (Office, antivirus, dizayn dasturlari va boshqalar) o'rnatish</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-gray-700">
                <span className="text-green-600 font-bold mt-1">✅</span>
                <span>Kompyuter bilan sodir bo'lgan muammolarni bartaraf etish</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-gray-700">
                <span className="text-green-600 font-bold mt-1">✅</span>
                <span>Printerlarni kompyuterga ulash va printer muammolarini hal etish</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-gray-700">
                <span className="text-green-600 font-bold mt-1">✅</span>
                <span>Masofadan texnik yordam (TeamViewer, AnyDesk orqali)</span>
              </li>
            </ul>
          </div>

          <div className="mb-6 p-5 bg-blue-100 rounded-xl">
            <p className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <span>🚀</span>
              <span>Tezkor, ishonchli va qulay xizmat — mutaxassislarimiz siz bilan onlayn!</span>
            </p>
          </div>

          <div className="border-t-2 border-blue-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📲</span>
              <span>Xizmat buyurtma qilish uchun bizga yozing:</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://t.me/Uz_Admin_05"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md"
              >
                <span>👉</span>
                <span>Telegram orqali bog'lanish</span>
              </a>
              <a
                href="https://t.me/InfoSet_Kompyuter_va_dasturlash"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md"
              >
                <span>🔗</span>
                <span>Kanalga a'zo bo'lish</span>
              </a>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div id="comments" className="mt-8 bg-white rounded-xl shadow-lg p-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Fikrlar ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleComment} className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ismingiz
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ismingizni kiriting"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fikringiz
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Fikringizni yozing..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={commentLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {commentLoading ? 'Yuklanmoqda...' : 'Fikr qoldirish'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Hali fikrlar yo'q. Birinchi bo'lib fikr qoldiring!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.date).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
