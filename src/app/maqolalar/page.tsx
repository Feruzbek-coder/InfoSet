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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Barchasi')

  useEffect(() => {
    // Load articles from data file
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(() => {
        // Fallback data if API fails
        setArticles([
          {
            id: 1,
            title: "Kompyuter sekin ishlayotganida qanday tezlashtirish mumkin",
            content: "Kompyuter sekin ishlashining asosiy sabablari va ularni hal qilish usullari haqida batafsil ma'lumot.",
            category: "Tezlashtirish",
            author: "Admin",
            date: "2024-01-15",
            image: "/images/slow-computer.jpg"
          }
        ])
      })
  }, [])

  const categories = ['Barchasi', 'Tezlashtirish', 'Xavfsizlik', 'Hardware', 'Software']

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Barchasi' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Title and Search */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Maqolalar</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="sm:w-80">
              <input
                type="text"
                placeholder="Maqolalarni qidirish..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Two Column Layout: Service Info + Latest Articles */}
        <div className="mb-8">
          {/* Latest Articles */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📰 So'nggi maqolalar</h3>
            <div className="space-y-5">
              {filteredArticles.slice(0, 3).map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 overflow-hidden">
                  {/* Rasm - agar markdown formatda bo'lsa */}
                  {article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/) && (
                    <div className="w-full h-48 bg-gray-50">
                      <img
                        src={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2]}
                        alt={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[1] || 'Article image'}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 mt-3 mb-3 leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-base text-gray-700 mb-3 leading-relaxed line-clamp-2">
                      {article.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').substring(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="text-gray-600 font-medium">{article.date}</span>
                      <Link
                        href={`/maqolalar/${article.id}`}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Batafsil →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Remaining Articles Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Barcha maqolalar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(3).map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {article.title}
                </h3>
                <p className="text-gray-800 text-base mb-4 leading-relaxed">
                  {article.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Muallif: {article.author}</span>
                  <Link
                    href={`/maqolalar/${article.id}`}
                    className="text-blue-600 hover:text-blue-800 text-base font-semibold"
                  >
                    Batafsil →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.slice(3).length === 0 && filteredArticles.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Faqat so'nggi 3 ta maqola mavjud.</p>
          </div>
        )}
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Hech qanday maqola topilmadi.</p>
          </div>
        )}
      </main>
    </div>
  )
}