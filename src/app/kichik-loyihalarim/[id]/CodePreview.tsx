'use client'

import { useState } from 'react'

interface CodePreviewProps {
  htmlCode: string
  cssCode: string
  jsCode: string
}

export default function CodePreview({ htmlCode, cssCode, jsCode }: CodePreviewProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css' | 'js'>('html')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Mobile uchun responsive CSS qo'shamiz
  const responsiveCss = `
    @media (max-width: 500px) {
      .game-board {
        grid-template-columns: repeat(4, 60px) !important;
        grid-gap: 8px !important;
      }
      .card {
        width: 60px !important;
        height: 60px !important;
        font-size: 30px !important;
      }
      .card-back, .card-front {
        font-size: 24px !important;
      }
      .game-container {
        padding: 15px !important;
      }
      .info {
        font-size: 20px !important;
      }
      .stats {
        font-size: 16px !important;
      }
      .reset-btn {
        padding: 10px 20px !important;
        font-size: 14px !important;
      }
    }
  `

  const generatePreviewHtml = () => {
    return `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    ${cssCode}
    ${responsiveCss}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    try {
      ${jsCode}
    } catch(e) {
      console.error('JavaScript xatolik:', e);
    }
  </script>
</body>
</html>`
  }

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    alert(`${type} kodi nusxalandi!`)
  }

  const codeTabs = [
    { id: 'html', label: 'HTML', icon: '🌐', color: 'text-green-400' },
    { id: 'css', label: 'CSS', icon: '🎨', color: 'text-blue-400' },
    { id: 'js', label: 'JS', icon: '⚡', color: 'text-yellow-400' },
  ]

  const getActiveCode = () => {
    switch(activeCodeTab) {
      case 'html': return htmlCode || 'HTML kod mavjud emas'
      case 'css': return cssCode || 'CSS kod mavjud emas'
      case 'js': return jsCode || 'JavaScript kod mavjud emas'
    }
  }

  const getActiveColor = () => {
    return codeTabs.find(t => t.id === activeCodeTab)?.color || 'text-white'
  }

  return (
    <div className="space-y-6">
      {/* NATIJA QISMI - O'YIN */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">▶️</span>
            <span className="text-white font-semibold">Natija</span>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
            title={isFullscreen ? 'Kichraytirish' : 'Kattalashtirish'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            )}
          </button>
        </div>
        <div className={isFullscreen ? 'fixed inset-4 z-50 bg-gray-900 rounded-2xl overflow-hidden' : ''}>
          {isFullscreen && (
            <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
              <span className="text-white font-semibold">▶️ Natija</span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
          <iframe
            srcDoc={generatePreviewHtml()}
            className={`w-full bg-white ${isFullscreen ? 'h-[calc(100%-60px)]' : 'h-[400px] sm:h-[450px]'}`}
            title="Kod natijasi"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>

      {/* KODLAR QISMI - PASTDA ALOHIDA */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
          <div className="flex gap-2">
            {codeTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                  activeCodeTab === tab.id 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => copyCode(getActiveCode(), activeCodeTab.toUpperCase())}
            className="px-3 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center gap-1"
          >
            <span>📋</span>
            <span className="hidden sm:inline">Nusxalash</span>
          </button>
        </div>
        <div className="h-[300px] sm:h-[350px] overflow-auto">
          <pre className="p-4 text-sm leading-relaxed">
            <code className={getActiveColor()}>{getActiveCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
