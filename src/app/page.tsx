import HomeHeader from './components/HomeHeader'
import InfoBar from './components/InfoBar'
import Footer from './components/Footer'
import pool from '@/lib/db'
import { promises as fs } from 'fs'
import path from 'path'

// Database mavjudligini tekshirish
async function isDatabaseAvailable() {
  if (!process.env.DATABASE_URL) return false
  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  }
}

// API'dan ma'lumot olish
async function fetchFromAPI(endpoint: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}${endpoint}`, { cache: 'no-store' })
    return await res.json()
  } catch {
    return []
  }
}

export default async function Home() {
  const useDb = await isDatabaseAvailable()
  
  let articles: any[] = []
  let programmingArticles: any[] = []
  let teachersArticles: any[] = []
  let featured: any = { articleId: null, source: 'maqolalar' }
  let pinnedArticles: any[] = []
  
  if (useDb) {
    // PostgreSQL'dan o'qish
    try {
      const articlesResult = await pool.query('SELECT * FROM articles ORDER BY id DESC')
      articles = articlesResult.rows
      
      // Featured
      const featuredResult = await pool.query('SELECT article_id, source FROM featured LIMIT 1')
      if (featuredResult.rows.length > 0) {
        featured = { articleId: featuredResult.rows[0].article_id, source: featuredResult.rows[0].source }
      }
      
      // Pinned
      const pinnedResult = await pool.query('SELECT article_id as "articleId", source FROM pinned ORDER BY pinned_at DESC')
      pinnedArticles = pinnedResult.rows
    } catch (error) {
      console.error('Database error:', error)
    }
    
    // Programming va Teachers hali JSON'dan (keyinroq database'ga o'tkazamiz)
    try {
      const dataDir = path.join(process.cwd(), 'src', 'data')
      const programmingData = await fs.readFile(path.join(dataDir, 'programming-articles.json'), 'utf-8')
      programmingArticles = JSON.parse(programmingData)
      const teachersData = await fs.readFile(path.join(dataDir, 'teachers-articles.json'), 'utf-8')
      teachersArticles = JSON.parse(teachersData)
    } catch {}
  } else {
    // JSON fayllardan o'qish (local development)
    const dataDir = path.join(process.cwd(), 'src', 'data')
    
    try {
      const articlesData = await fs.readFile(path.join(dataDir, 'articles.json'), 'utf-8')
      articles = JSON.parse(articlesData)
      
      const programmingData = await fs.readFile(path.join(dataDir, 'programming-articles.json'), 'utf-8')
      programmingArticles = JSON.parse(programmingData)
      
      const teachersData = await fs.readFile(path.join(dataDir, 'teachers-articles.json'), 'utf-8')
      teachersArticles = JSON.parse(teachersData)
      
      const featuredData = await fs.readFile(path.join(dataDir, 'featured.json'), 'utf-8')
      featured = JSON.parse(featuredData)
      
      const pinnedData = await fs.readFile(path.join(dataDir, 'pinned.json'), 'utf-8')
      pinnedArticles = JSON.parse(pinnedData)
    } catch {}
  }
  
  // Barcha maqolalarni birlashtirish va bo'lim qo'shish
  const allArticles = [
    ...articles.map((a: any) => ({ ...a, source: 'maqolalar', sourceUrl: '/maqolalar' })),
    ...programmingArticles
      .filter((a: any) => a.title !== "Kompyuter savodxonligi")
      .map((a: any) => ({ ...a, source: 'kompyuter-dasturlash', sourceUrl: '/kompyuter-dasturlash' })),
    ...teachersArticles.map((a: any) => ({ ...a, source: 'oqituvchilar', sourceUrl: '/oqituvchilar' }))
  ];
  
  // Pinned maqolalarni topish
  const pinnedArticlesList = pinnedArticles.map((p: any) => {
    const article = allArticles.find((a: any) => a.id === p.articleId && a.source === p.source);
    return article ? { ...article, isPinned: true } : null;
  }).filter(Boolean);
  
  // Pinned bo'lmagan maqolalarni sana va ID bo'yicha tartiblash
  const nonPinnedArticles = allArticles.filter((a: any) => 
    !pinnedArticles.some((p: any) => p.articleId === a.id && p.source === a.source)
  );
  
  const sortedArticles = nonPinnedArticles.sort((a: any, b: any) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return b.id - a.id;
  });
  
  // Pinned maqolalar birinchi, keyin so'nggilari
  const latestArticles = [...pinnedArticlesList, ...sortedArticles].slice(0, 6);

  let featuredArticle = null;
  if (featured.articleId) {
    featuredArticle = allArticles.find((a: any) => 
      a.id === featured.articleId && a.source === featured.source
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <HomeHeader />
      
      {/* Info Bar - Yuqorida */}
      <InfoBar />

      {/* Hero Section */}
      <main className="flex-1 py-12">
        <div className="text-center max-w-2xl mx-auto px-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-sm">
            "InfoSet" Kompyuterlar va Dasturlash olami
          </h2>
        </div>

        {/* Content Layout - O'rtada: Oxirgi Maqola, O'ng: Featured */}
        <div className="max-w-[1800px] mx-auto px-4 relative">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
            {/* O'rtada - Oxirgi Maqola */}
            <div className="w-full lg:col-span-7 lg:col-start-3">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Oxirgi Maqolalar</h3>
              {latestArticles.slice(0, 1).map((article: any) => (
                <div key={article.id} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all relative">
                  {/* Pinned belgisi */}
                  {article.isPinned && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                      </svg>
                      Muhim
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">{article.date}</span>
                  </div>
                  
                  {/* Rasm - agar markdown formatda bo'lsa */}
                  {article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/) && (
                    <div className="mb-4 bg-gray-50">
                      <img
                        src={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2]}
                        alt={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[1] || 'Article image'}
                        className="w-full h-80 object-contain rounded-lg"
                      />
                    </div>
                  )}
                  
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">{article.title}</h4>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {article.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').trim()}
                  </p>
                  <a
                    href={`${article.sourceUrl}/${article.id}`}
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                  >
                    Davomi
                  </a>
                </div>
              ))}
            </div>

            {/* O'ng chet - Featured Maqola */}
            <div className="w-full lg:col-span-3 lg:col-start-10 order-first lg:order-none">
              {featuredArticle ? (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 border-2 border-yellow-300 hover:shadow-2xl transition-all sticky top-4">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-yellow-700 font-bold text-sm uppercase tracking-wide">Tanlangan</span>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold inline-block w-fit">
                      {featuredArticle.category}
                    </span>
                    <span className="text-gray-600 text-sm font-medium">{featuredArticle.date}</span>
                  </div>
                  
                  {/* Rasm - agar markdown formatda bo'lsa */}
                  {featuredArticle.content.match(/!\[([^\]]*)\]\(([^)]+)\)/) && (
                    <div className="mb-4">
                      <img
                        src={featuredArticle.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2]}
                        alt={featuredArticle.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[1] || 'Featured image'}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{featuredArticle.title}</h4>
                  <div className="text-gray-700 text-base mb-6 leading-relaxed">
                    {/* Rasmni olib tashlangan matn */}
                    {featuredArticle.content
                      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '')
                      .trim()
                      .substring(0, 200)}...
                  </div>
                  <a
                    href={`${featuredArticle.sourceUrl}/${featuredArticle.id}`}
                    className="inline-block w-full text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-bold text-base"
                  >
                    Batafsil o'qish
                  </a>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-2xl shadow-xl p-8 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[600px] sticky top-4">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <p className="font-semibold text-base">Tanlangan maqola yo'q</p>
                    <p className="text-sm mt-2">Admin paneldan maqola tanlang</p>
                  </div>
                </div>
              )}
            </div>

            {/* Qolgan oxirgi maqolalar - grid ichida, birinchi maqola kengligi */}
            <div className="w-full lg:col-span-7 lg:col-start-3 mt-8">
              <div className="space-y-8">
                {latestArticles.slice(1, 5).map((article: any) => (
                  <div key={article.id} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">{article.date}</span>
                    </div>
                    
                    {/* Rasm - agar markdown formatda bo'lsa */}
                    {article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/) && (
                      <div className="mb-4 bg-gray-50">
                        <img
                          src={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[2]}
                          alt={article.content.match(/!\[([^\]]*)\]\(([^)]+)\)/)?.[1] || 'Article image'}
                          className="w-full h-80 object-contain rounded-lg"
                        />
                      </div>
                    )}
                    
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">{article.title}</h4>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {article.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').trim()}
                    </p>
                    <a
                      href={`${article.sourceUrl}/${article.id}`}
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                    >
                      Davomi
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}