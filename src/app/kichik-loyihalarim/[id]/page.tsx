import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import CodePreview from './CodePreview'

function getProjects() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'mini-projects.json')
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projects = getProjects()
  const project = projects.find((p: any) => p.id === parseInt(params.id))

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loyiha topilmadi</h1>
          <Link href="/kichik-loyihalarim" className="text-pink-600 hover:underline">
            Orqaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <svg className="w-6 sm:w-8 h-6 sm:h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                InfoSet.uz
              </h1>
            </Link>
            <nav className="flex space-x-3 sm:space-x-8">
              <Link href="/" className="text-xs sm:text-base text-gray-600 hover:text-pink-700 font-medium transition">Bosh sahifa</Link>
              <Link href="/kichik-loyihalarim" className="text-xs sm:text-base text-gray-600 hover:text-pink-700 font-medium transition">Loyihalar</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <Link 
          href="/kichik-loyihalarim"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 sm:mb-8 font-medium text-sm sm:text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Barcha loyihalarga qaytish
        </Link>

        <article className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 md:p-12 border border-pink-100">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
            <span className="px-3 sm:px-4 py-1 sm:py-2 bg-pink-100 text-pink-700 rounded-full text-xs sm:text-sm font-semibold">
              {project.category}
            </span>
            <span className="text-gray-500">{project.date}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {project.title}
          </h1>

          <div className="prose prose-base sm:prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              {project.content}
            </div>
          </div>

          {/* Kod ko'rish va ishga tushirish qismi */}
          {project.codeHtml && (
            <div className="mt-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
                Loyiha Kodi
              </h2>
              <CodePreview 
                htmlCode={project.codeHtml || ''} 
                cssCode={project.codeCss || ''} 
                jsCode={project.codeJs || ''} 
              />
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Muallif: <span className="font-semibold text-gray-900">{project.author}</span></p>
          </div>
        </article>
      </main>
    </div>
  )
}
