import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import HomeHeader from '../../components/HomeHeader'

export default async function LearningArticleDetailPage({ params }: { params: { id: string } }) {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'learning-articles.json')
  const fileContent = await fs.readFile(dataPath, 'utf-8')
  const articles = JSON.parse(fileContent)
  const article = articles.find((a: any) => a.id === parseInt(params.id))

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Darslik topilmadi</h1>
          <Link href="/dasturlashga-qadam" className="text-emerald-600 hover:underline">
            Orqaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-teal-50">
      <HomeHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/dasturlashga-qadam"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Barcha darsliklarga qaytish
        </Link>

        <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              {article.category}
            </span>
            <span className="text-gray-500">{article.date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700">
            {article.content.split(/(!\[[^\]]*\]\([^)]+\))/).map((part: string, index: number) => {
              // Rasm markdown formatini ajratib olish
              const imgMatch = part.match(/!\[([^\]]*)\]\(([^)]+)\)/);
              
              if (imgMatch) {
                const altText = imgMatch[1];
                const imageSrc = imgMatch[2];
                return (
                  <div key={index} className="my-6">
                    <img
                      src={imageSrc}
                      alt={altText || 'Article image'}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                );
              }
              
              // Oddiy matn
              return (
                <div key={index} className="whitespace-pre-wrap">
                  {part}
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Muallif: <span className="font-semibold text-gray-900">{article.author}</span></p>
          </div>
        </article>
      </main>
    </div>
  )
}
