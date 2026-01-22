'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Listen for storage changes
    const handleStorage = () => {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    setShowUserMenu(false)
    router.push('/')
  }

  // Don't show header on admin page
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="text-xl font-bold text-gray-900">TexnoSet</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/kompyuter-dasturlash/computer-literacy" 
              className="text-gray-700 hover:text-emerald-600 transition font-medium"
            >
              Kompyuterda ishlash
            </Link>
            <Link 
              href="/kompyuter-dasturlash" 
              className="text-gray-700 hover:text-emerald-600 transition font-medium"
            >
              Dasturlash
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="font-medium">{user.name}</span>
                  {user.isPremium && (
                    <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                    <Link
                      href="/dasturlashga-qadam/kod-sinash"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Kod sinash
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/dasturlashga-qadam/kod-sinash"
                  className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium transition"
                >
                  Kirish
                </Link>
                <Link
                  href="/dasturlashga-qadam/kod-sinash"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-lime-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-lime-700 transition shadow-md"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
