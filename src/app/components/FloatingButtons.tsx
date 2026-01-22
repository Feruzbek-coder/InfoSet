'use client'

import { useEffect, useState } from 'react'

export default function FloatingButtons() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Floating Mini Projects Button */}
      <a
        href="/kichik-loyihalarim"
        className="fixed left-4 top-[25%] -translate-y-1/2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 z-50 w-64 block"
      >
        <span className="flex items-center gap-3 mb-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <span className="font-bold text-lg">Kichik loyihalarim</span>
        </span>
        <span className="text-sm text-pink-100 leading-relaxed font-semibold block">
          Mini dasturlar va loyihalar
        </span>
      </a>
    </>
  )
}
