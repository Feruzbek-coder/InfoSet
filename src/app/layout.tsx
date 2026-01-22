import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

const FloatingButtons = dynamic(() => import('./components/FloatingButtons'), {
  ssr: false
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InfoSet',
  description: 'Ta\'lim, dasturlash va IT bo\'yicha maqolalar',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <FloatingButtons />
        {children}
        <footer className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-t mt-16 py-8 shadow-inner">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <div className="flex items-center gap-2 text-gray-700 text-base">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm4.707 8.293l-5.657 5.657a1 1 0 01-1.414 0l-2.121-2.121a1 1 0 111.414-1.415l1.414 1.415 4.95-4.95a1 1 0 111.414 1.414z"/></svg>
              <span className="font-medium">Telegram kanal:</span>
              <a href="https://t.me/InfoSet_Kompyuter_va_dasturlash" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-semibold">@InfoSet_Kompyuter_va_dasturlash</a>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-base">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.66-5.33-4-8-4z"/></svg>
              <span className="font-medium">Admin:</span>
              <a href="https://t.me/Uz_Admin_05" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline font-semibold">@Uz_Admin_05</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}