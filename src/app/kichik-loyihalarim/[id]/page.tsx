import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`http://localhost:3000/api/mini-projects?t=${Date.now()}`, { 
    cache: 'no-store'
  })
  const projects = await res.json()
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
              <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                InfoSet.uz
              </h1>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-pink-700 font-medium transition">Bosh sahifa</Link>
              <Link href="/kichik-loyihalarim" className="text-gray-600 hover:text-pink-700 font-medium transition">Loyihalar</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/kichik-loyihalarim"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-8 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Barcha loyihalarga qaytish
        </Link>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-pink-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
              {project.category}
            </span>
            <span className="text-gray-500">{project.date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {project.title}
          </h1>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Muallif: <span className="font-semibold text-gray-900">{project.author}</span></p>
          </div>
        </article>
      </main>
    </div>
  )
}
