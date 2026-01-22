'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import HomeHeader from '../../components/HomeHeader'

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

interface Comment {
  id: number
  articleId: number
  parentId?: number
  author: string
  text: string
  date: string
}

export default function TeacherArticleDetailPage() {
  const params = useParams()
  const articleId = Number(params.id)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [author, setAuthor] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    loadArticle()
    loadComments()
  }, [params.id])

  const loadArticle = async () => {
    try {
      const response = await fetch('/api/teachers-articles')
      const data = await response.json()
      const foundArticle = data.find((a: Article) => a.id === articleId)
      setArticle(foundArticle || null)
    } catch (error) {
      console.error('Maqolani yuklashda xato:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                <span className="text-2xl font-bold text-gray-900">InfoSet.uz</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Material topilmadi</h1>
            <Link
              href="/oqituvchilar"
              className="text-orange-600 hover:text-orange-800 font-semibold"
            >
              ← Orqaga qaytish
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/oqituvchilar"
          className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Orqaga qaytish
        </Link>

        <article className="bg-white rounded-xl shadow-lg p-8">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-2 rounded-full">
                {article.category}
              </span>
              <span className="text-gray-600 font-medium">{article.date}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Muallif: {article.author}
            </p>
          </div>

          {/* File Download Button */}
          {article.fileUrl && (
            <div className="mb-8 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Material fayli mavjud</p>
                    <p className="text-sm text-gray-600">Faylni yuklab olish uchun tugmani bosing</p>
                  </div>
                </div>
                <a
                  href={article.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Yuklab olish
                </a>
              </div>
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
              {article.content.split(/!\[([^\]]*)\]\(([^)]+)\)/).map((part, index) => {
                // Har 3-chi element rasm URL
                if (index % 3 === 2) {
                  const altText = article.content.split(/!\[([^\]]*)\]\(([^)]+)\)/)[index - 1];
                  return (
                    <img
                      key={index}
                      src={part}
                      alt={altText || 'Material image'}
                      className="w-full rounded-lg shadow-md my-4"
                    />
                  );
                }
                // Har 3-chi element alt text (skip qilamiz)
                if (index % 3 === 1) {
                  return null;
                }
                // Oddiy matn
                return <span key={index}>{part}</span>;
              })}
            </div>
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link
                href="/oqituvchilar"
                className="text-orange-600 hover:text-orange-800 font-semibold flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Barcha materiallar
              </Link>
              <div className="text-sm text-gray-500">
                #{article.id}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Fikringizni yozing..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={commentLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
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
                <div key={comment.id} className="border-l-4 border-orange-500 bg-gray-50 p-4 rounded-r-lg">
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
