'use client'

import { useState } from 'react'

interface CodePreviewProps {
  htmlCode: string
  cssCode: string
  jsCode: string
}

export default function CodePreview({ htmlCode, cssCode, jsCode }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const tabs = [
    { id: 'preview', label: 'Natija', icon: '▶️' },
    { id: 'html', label: 'HTML', icon: '🌐' },
    { id: 'css', label: 'CSS', icon: '🎨' },
    { id: 'js', label: 'JavaScript', icon: '⚡' },
  ]

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800 px-3 sm:px-4 py-3 border-b border-gray-700 gap-3">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-pink-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="text-sm sm:text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id.toUpperCase()}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      {/* Content */}
      <div className={`${isFullscreen ? 'h-[calc(100%-80px)] sm:h-[calc(100%-60px)]' : 'h-[500px] sm:h-96'}`}>
        {activeTab === 'preview' && (
          <iframe
            srcDoc={generatePreviewHtml()}
            className="w-full h-full bg-white"
            title="Kod natijasi"
            sandbox="allow-scripts allow-modals"
          />
        )}

        {activeTab === 'html' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-end p-2 bg-gray-800">
              <button
                onClick={() => copyCode(htmlCode, 'HTML')}
                className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                📋 Nusxalash
              </button>
            </div>
            <pre className="flex-1 p-4 overflow-auto text-sm">
              <code className="text-green-400">{htmlCode || 'HTML kod mavjud emas'}</code>
            </pre>
          </div>
        )}

        {activeTab === 'css' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-end p-2 bg-gray-800">
              <button
                onClick={() => copyCode(cssCode, 'CSS')}
                className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                📋 Nusxalash
              </button>
            </div>
            <pre className="flex-1 p-4 overflow-auto text-sm">
              <code className="text-blue-400">{cssCode || 'CSS kod mavjud emas'}</code>
            </pre>
          </div>
        )}

        {activeTab === 'js' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-end p-2 bg-gray-800">
              <button
                onClick={() => copyCode(jsCode, 'JavaScript')}
                className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                📋 Nusxalash
              </button>
            </div>
            <pre className="flex-1 p-4 overflow-auto text-sm">
              <code className="text-yellow-400">{jsCode || 'JavaScript kod mavjud emas'}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
