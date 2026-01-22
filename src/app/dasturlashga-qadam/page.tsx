'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import HomeHeader from '../components/HomeHeader'

export default function LearningArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/learning-articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-teal-50">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Kompyuter savodxonligi va dasturlash</h2>
          <p className="text-xl text-gray-600">Boshlang&apos;ichdan professional darajagacha o&apos;rganing</p>
          
          {/* Qo'shimcha ma'lumot */}
          <div className="mt-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-2">
                  <svg className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <div className="text-base">
                    <span className="font-semibold text-gray-900">Kompyuter savodxonligi:</span>
                    <span className="text-gray-600"> Kompyuter bilan ishlash asoslari va raqamli ko&apos;nikmalar</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  <div className="text-base">
                    <span className="font-semibold text-gray-900">Dasturlash asoslari:</span>
                    <span className="text-gray-600"> Python tilida dasturlashni boshlang va amaliy o&apos;rganing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kod yozishni sinab ko'rish tugmasi */}
        <div className="mb-12">
          <Link href="/dasturlashga-qadam/kod-sinash">
            <button className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 transform hover:scale-[1.02]">
              <div className="flex items-center justify-center gap-4 mb-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
                <span className="text-2xl font-bold">Kod yozishni sinab ko&apos;rish</span>
              </div>
              <p className="text-emerald-100 text-base">
                Python kodlarini bevosita brauzerda yozib, natijasini ko&apos;ring. 
                O&apos;zgaruvchilar, operatorlar, if/else, for/while va boshqa asosiy tushunchalarni amalda mashq qiling.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm bg-white/20 backdrop-blur px-4 py-2 rounded-full inline-flex mx-auto">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="font-semibold">Premium funksiya</span>
              </div>
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Yuklanmoqda...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <p className="text-gray-500 text-lg font-medium">Hozircha darsliklar yo&apos;q</p>
            <p className="text-gray-400 mt-2">Admin paneldan darsliklar qo&apos;shing</p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Darsliklar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/dasturlashga-qadam/${article.id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-emerald-100 hover:scale-105 overflow-hidden"
                >
                  {/* Rasm - agar markdown formatda bo'lsa */}
                  {article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/) && (
                    <div className="w-full h-48 overflow-hidden bg-emerald-50">
                      <img
                        src={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2]}
                        alt={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[1] || 'Article image'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').trim().substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span className="text-emerald-600 font-semibold">O&apos;qish →</span>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
