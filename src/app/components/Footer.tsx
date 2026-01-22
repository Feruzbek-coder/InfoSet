'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Info Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a 
              href="https://t.me/InfoSet_Kompyuter_va_dasturlash" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-200 hover:text-white transition font-medium"
            >
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Telegram kanal:</span>
              <span className="text-blue-300 font-semibold">@InfoSet_Kompyuter_va_dasturlash</span>
            </a>
            
            <span className="hidden sm:block text-gray-500">|</span>
            
            <a 
              href="https://t.me/Uz_Admin_05" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-200 hover:text-white transition font-medium"
            >
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Admin:</span>
              <span className="text-purple-300 font-semibold">@Uz_Admin_05</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo va tavsif */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
                <span className="text-xl font-bold">InfoSet.uz</span>
              </div>
              <p className="text-gray-400 text-sm">
                Kompyuter va dasturlash olamiga sayohat. O'zbek tilida eng sifatli ta'lim resurslari.
              </p>
            </div>
            
            {/* Tezkor havolalar */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Tezkor havolalar</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition">Bosh sahifa</a></li>
                <li><a href="/dasturlashga-qadam" className="hover:text-white transition">Dasturlashga qadam</a></li>
                <li><a href="/maqolalar" className="hover:text-white transition">Maqolalar</a></li>
                <li><a href="/kompyuter-dasturlash" className="hover:text-white transition">Kompyuter va Dasturlash</a></li>
              </ul>
            </div>
            
            {/* Bog'lanish */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Bog'lanish</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <a href="https://t.me/InfoSet_Kompyuter_va_dasturlash" target="_blank" className="hover:text-white transition">Telegram kanal</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <a href="https://t.me/Uz_Admin_05" target="_blank" className="hover:text-white transition">Admin bilan bog'lanish</a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} InfoSet.uz — Barcha huquqlar himoyalangan</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
