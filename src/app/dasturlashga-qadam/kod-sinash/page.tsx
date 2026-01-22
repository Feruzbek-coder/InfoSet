'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HomeHeader from '../../components/HomeHeader'

export default function KodSinashPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  
  // Python Playground
  const [code, setCode] = useState('# Python kodini bu yerga yozing\nprint("Salom dunyo!")')
  const [output, setOutput] = useState('')
  const [hasError, setHasError] = useState(false)
  const [buttons, setButtons] = useState<Array<{text: string, command?: string}>>([])

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setLoading(false)
    } else {
      setLoading(false)
      setShowLogin(true)
    }
  }, [])

  // Premium status ni tekshirish - har 3 soniyada
  useEffect(() => {
    if (!user) return

    const checkPremiumStatus = async () => {
      try {
        const response = await fetch(`/api/users?username=${user.username}`)
        
        if (response.ok) {
          const updatedUser = await response.json()
          
          // Agar premium status o'zgargan bo'lsa
          if (updatedUser.isPremium !== user.isPremium || updatedUser.isAdmin !== user.isAdmin) {
            const newUserData = { ...user, isPremium: updatedUser.isPremium, isAdmin: updatedUser.isAdmin }
            localStorage.setItem('currentUser', JSON.stringify(newUserData))
            setUser(newUserData)
            window.dispatchEvent(new Event('storage'))
          }
        }
      } catch (error) {
        console.error('Premium status tekshirishda xatolik:', error)
      }
    }

    // Darhol tekshirish
    checkPremiumStatus()
    
    const interval = setInterval(checkPremiumStatus, 3000)
    return () => clearInterval(interval)
  }, [user?.username])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        setUser(data.user)
        setShowLogin(false)
      } else {
        setLoginError(data.error || 'Login xato')
      }
    } catch (error) {
      setLoginError('Xatolik yuz berdi')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')
    
    if (!username || !password || !name) {
      setRegisterError('Barcha maydonlarni to\'ldiring')
      return
    }
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Auto-login after registration
        const loginResponse = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        
        const loginData = await loginResponse.json()
        
        if (loginData.success) {
          localStorage.setItem('currentUser', JSON.stringify(loginData.user))
          setUser(loginData.user)
          setShowRegister(false)
          setShowLogin(false)
        }
      } else {
        setRegisterError(data.error || 'Ro\'yxatdan o\'tishda xatolik')
      }
    } catch (error) {
      setRegisterError('Xatolik yuz berdi')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    router.push('/dasturlashga-qadam')
  }

  // Taqiqlangan kodlar
  const forbiddenKeywords = ['os.', 'sys.', 'subprocess', 'open(', 'file', 'exec', 'eval', '__import__']

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode)
    setOutput('')
    setHasError(false)
  }

  const runCode = () => {
    setOutput('')
    setHasError(false)
    setButtons([])

    for (const keyword of forbiddenKeywords) {
      if (code.includes(keyword)) {
        setOutput("Hozircha bu kodlardan foydalanish imkoni yo'q")
        setHasError(true)
        return
      }
    }

    try {
      let result = ''
      const lines = code.split('\n')
      const variables: {[key: string]: any} = {}
      const createdButtons: Array<{text: string, command?: string}> = []
      let skipUntil = -1
      let tkinterImported = false

      for (let i = 0; i < lines.length; i++) {
        if (i < skipUntil) continue
        
        const line = lines[i].trim()
        const indent = lines[i].search(/\S/)
        
        if (line === '' || line.startsWith('#')) continue

        if (line.includes('from tkinter import') || line.includes('import tkinter')) {
          tkinterImported = true
          result += '✓ Tkinter moduli yuklandi\n'
          continue
        }

        if (tkinterImported && line.includes('Button(')) {
          const buttonMatch = line.match(/(\w+)\s*=\s*Button\((.*?)\)/)
          if (buttonMatch) {
            const buttonVar = buttonMatch[1]
            const params = buttonMatch[2]
            let buttonText = 'Tugma'
            const textMatch = params.match(/text\s*=\s*["'](.+?)["']/)
            if (textMatch) buttonText = textMatch[1]
            variables[buttonVar] = { type: 'button', text: buttonText }
            createdButtons.push({ text: buttonText })
            result += `✓ "${buttonText}" tugmasi yaratildi\n`
          }
          continue
        }

        if (line.includes('.pack()') || line.includes('.grid(')) {
          const varName = line.split('.')[0].trim()
          if (variables[varName] && variables[varName].type === 'button') {
            result += `✓ "${variables[varName].text}" tugmasi ko'rsatildi\n`
          }
          continue
        }

        if (line.includes('=[') && line.includes(']')) {
          const parts = line.split('=')
          const varName = parts[0].trim()
          const listStr = parts[1].trim()
          try {
            variables[varName] = JSON.parse(listStr.replace(/'/g, '"'))
          } catch {
            variables[varName] = []
          }
          continue
        }

        if (line.includes('=') && !line.includes('==') && !line.includes('!=') && 
            !line.includes('<=') && !line.includes('>=') && !line.includes('[')) {
          const parts = line.split('=')
          const varName = parts[0].trim()
          let value = parts[1].trim()
          
          if (value.startsWith('len(') && value.endsWith(')')) {
            const arg = value.slice(4, -1).trim()
            if (variables[arg]) {
              variables[varName] = Array.isArray(variables[arg]) ? variables[arg].length : String(variables[arg]).length
            }
            continue
          }

          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            variables[varName] = value.slice(1, -1)
          } else if (!isNaN(Number(value))) {
            variables[varName] = Number(value)
          } else {
            let evalValue = value
            for (const [vName, vValue] of Object.entries(variables)) {
              if (typeof vValue === 'number') {
                evalValue = evalValue.replace(new RegExp(`\\b${vName}\\b`, 'g'), String(vValue))
              }
            }
            if (/^[\d\s+\-*/%().]+$/.test(evalValue)) {
              try {
                variables[varName] = Function('"use strict"; return (' + evalValue + ')')()
              } catch {
                variables[varName] = evalValue
              }
            } else {
              variables[varName] = value
            }
          }
          continue
        }

        if (line.startsWith('print(') && line.endsWith(')')) {
          let content = line.slice(6, -1).trim()
          
          if (content.includes(',')) {
            const parts = content.split(',').map(p => p.trim())
            let outputLine = ''
            for (let j = 0; j < parts.length; j++) {
              let part = parts[j]
              for (const [varName, varValue] of Object.entries(variables)) {
                if (part === varName) {
                  part = String(varValue)
                  break
                }
              }
              if ((part.startsWith('"') && part.endsWith('"')) || 
                  (part.startsWith("'") && part.endsWith("'"))) {
                outputLine += part.slice(1, -1)
              } else {
                outputLine += part
              }
              if (j < parts.length - 1) outputLine += ' '
            }
            result += outputLine + '\n'
            continue
          }

          for (const [varName, varValue] of Object.entries(variables)) {
            content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue))
          }
          
          if ((content.startsWith('"') && content.endsWith('"')) || 
              (content.startsWith("'") && content.endsWith("'"))) {
            result += content.slice(1, -1) + '\n'
          } else if (/^[\d\s+\-*/%().]+$/.test(content)) {
            try {
              result += Function('"use strict"; return (' + content + ')')() + '\n'
            } catch {
              result += content + '\n'
            }
          } else {
            result += content + '\n'
          }
          continue
        }

        if (line.startsWith('if ') || line.startsWith('elif ')) {
          const isElif = line.startsWith('elif ')
          const condition = line.slice(isElif ? 5 : 3).replace(':', '').trim()
          let evalCondition = condition
          
          for (const [varName, varValue] of Object.entries(variables)) {
            evalCondition = evalCondition.replace(new RegExp(`\\b${varName}\\b`, 'g'), 
              typeof varValue === 'string' ? `"${varValue}"` : String(varValue))
          }
          
          let conditionResult = false
          try {
            conditionResult = Function('"use strict"; return (' + evalCondition + ')')()
          } catch {}
          
          let j = i + 1
          const ifBlock: string[] = []
          while (j < lines.length && lines[j].search(/\S/) > indent) {
            if (!lines[j].trim().startsWith('elif') && !lines[j].trim().startsWith('else')) {
              ifBlock.push(lines[j])
            } else {
              break
            }
            j++
          }
          
          if (conditionResult) {
            for (const blockLine of ifBlock) {
              const trimmed = blockLine.trim()
              if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
                let content = trimmed.slice(6, -1).trim()
                for (const [varName, varValue] of Object.entries(variables)) {
                  content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue))
                }
                if ((content.startsWith('"') && content.endsWith('"')) || 
                    (content.startsWith("'") && content.endsWith("'"))) {
                  result += content.slice(1, -1) + '\n'
                } else {
                  result += content + '\n'
                }
              }
            }
            while (j < lines.length && (lines[j].trim().startsWith('elif') || lines[j].trim().startsWith('else'))) {
              const blockIndent = lines[j].search(/\S/)
              j++
              while (j < lines.length && lines[j].search(/\S/) > blockIndent) {
                j++
              }
            }
          } else {
            if (j < lines.length && (lines[j].trim().startsWith('elif') || lines[j].trim().startsWith('else'))) {
              skipUntil = -1
              continue
            }
          }
          skipUntil = j
          continue
        }

        if (line.startsWith('else:')) {
          let j = i + 1
          const elseBlock: string[] = []
          while (j < lines.length && lines[j].search(/\S/) > indent) {
            elseBlock.push(lines[j])
            j++
          }
          
          for (const blockLine of elseBlock) {
            const trimmed = blockLine.trim()
            if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
              let content = trimmed.slice(6, -1).trim()
              for (const [varName, varValue] of Object.entries(variables)) {
                content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue))
              }
              if ((content.startsWith('"') && content.endsWith('"')) || 
                  (content.startsWith("'") && content.endsWith("'"))) {
                result += content.slice(1, -1) + '\n'
              } else {
                result += content + '\n'
              }
            }
          }
          skipUntil = j
          continue
        }

        if (line.startsWith('for ')) {
          const rangeMatch = line.match(/for\s+(\w+)\s+in\s+range\((.*?)\):?/)
          if (rangeMatch) {
            const loopVar = rangeMatch[1]
            const rangeArgs = rangeMatch[2].split(',').map(a => a.trim())
            
            let start = 0, stop = 0, step = 1
            if (rangeArgs.length === 1) stop = parseInt(rangeArgs[0])
            else if (rangeArgs.length === 2) {
              start = parseInt(rangeArgs[0])
              stop = parseInt(rangeArgs[1])
            } else if (rangeArgs.length === 3) {
              start = parseInt(rangeArgs[0])
              stop = parseInt(rangeArgs[1])
              step = parseInt(rangeArgs[2])
            }
            
            let j = i + 1
            const forBlock: string[] = []
            while (j < lines.length && lines[j].search(/\S/) > indent) {
              forBlock.push(lines[j])
              j++
            }
            
            for (let k = start; step > 0 ? k < stop : k > stop; k += step) {
              if (Math.abs(k) > 1000) break
              variables[loopVar] = k
              
              for (const blockLine of forBlock) {
                const trimmed = blockLine.trim()
                if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
                  let content = trimmed.slice(6, -1).trim()
                  for (const [varName, varValue] of Object.entries(variables)) {
                    content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue))
                  }
                  if ((content.startsWith('"') && content.endsWith('"')) || 
                      (content.startsWith("'") && content.endsWith("'"))) {
                    result += content.slice(1, -1) + '\n'
                  } else if (/^[\d\s+\-*/%().]+$/.test(content)) {
                    try {
                      result += Function('"use strict"; return (' + content + ')')() + '\n'
                    } catch {
                      result += content + '\n'
                    }
                  } else {
                    result += content + '\n'
                  }
                }
              }
            }
            skipUntil = j
            continue
          }
          
          const listMatch = line.match(/for\s+(\w+)\s+in\s+(\w+):?/)
          if (listMatch) {
            const loopVar = listMatch[1]
            const listName = listMatch[2]
            
            if (variables[listName] && Array.isArray(variables[listName])) {
              let j = i + 1
              const forBlock: string[] = []
              while (j < lines.length && lines[j].search(/\S/) > indent) {
                forBlock.push(lines[j])
                j++
              }
              
              for (const item of variables[listName]) {
                variables[loopVar] = item
                for (const blockLine of forBlock) {
                  const trimmed = blockLine.trim()
                  if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
                    let content = trimmed.slice(6, -1).trim()
                    for (const [varName, varValue] of Object.entries(variables)) {
                      content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue))
                    }
                    if ((content.startsWith('"') && content.endsWith('"')) || 
                        (content.startsWith("'") && content.endsWith("'"))) {
                      result += content.slice(1, -1) + '\n'
                    } else {
                      result += content + '\n'
                    }
                  }
                }
              }
              skipUntil = j
            }
          }
          continue
        }

        if (line.startsWith('while ')) {
          const condition = line.slice(6).replace(':', '').trim()
          let j = i + 1
          const whileBlock: string[] = []
          while (j < lines.length && lines[j].search(/\S/) > indent) {
            whileBlock.push(lines[j])
            j++
          }
          
          let iterations = 0
          while (iterations < 100) {
            let evalCondition = condition
            for (const [varName, varValue] of Object.entries(variables)) {
              evalCondition = evalCondition.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue))
            }
            
            let conditionResult = false
            try {
              conditionResult = Function('"use strict"; return (' + evalCondition + ')')()
            } catch { break }
            
            if (!conditionResult) break
            
            for (const blockLine of whileBlock) {
              const trimmed = blockLine.trim()
              if (trimmed.includes('=') && !trimmed.includes('==')) {
                const parts = trimmed.split('=')
                const varName = parts[0].trim()
                let value = parts[1].trim()
                for (const [vName, vValue] of Object.entries(variables)) {
                  if (typeof vValue === 'number') {
                    value = value.replace(new RegExp(`\\b${vName}\\b`, 'g'), String(vValue))
                  }
                }
                if (/^[\d\s+\-*/%().]+$/.test(value)) {
                  try {
                    variables[varName] = Function('"use strict"; return (' + value + ')')()
                  } catch {
                    variables[varName] = value
                  }
                }
              }
              if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
                let content = trimmed.slice(6, -1).trim()
                for (const [varName, varValue] of Object.entries(variables)) {
                  content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue))
                }
                if ((content.startsWith('"') && content.endsWith('"')) || 
                    (content.startsWith("'") && content.endsWith("'"))) {
                  result += content.slice(1, -1) + '\n'
                } else {
                  result += content + '\n'
                }
              }
            }
            iterations++
          }
          skipUntil = j
          continue
        }
      }

      if (result === '') {
        result = "Kod bajarildi (natija yo'q)"
      }

      setOutput(result)
      setButtons(createdButtons)
    } catch (error: any) {
      setOutput('Xatolik: ' + error.message)
      setHasError(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-lime-50 to-teal-50">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (showLogin || showRegister || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          {showRegister ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Ro&apos;yxatdan o&apos;tish</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ism-familiya</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Admin shu username bo&apos;yicha sizni Premium qilib qo&apos;yadi</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parol</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    required
                  />
                </div>
                {registerError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{registerError}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-lime-700 transition"
                >
                  Ro&apos;yxatdan o&apos;tish
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowRegister(false)
                    setShowLogin(true)
                    setRegisterError('')
                    setUsername('')
                    setPassword('')
                    setName('')
                  }}
                  className="text-emerald-600 hover:text-emerald-700 text-sm"
                >
                  Hisobingiz bormi? Kirish
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Kirish</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parol</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    required
                  />
                </div>
                {loginError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{loginError}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-lime-700 transition"
                >
                  Kirish
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowLogin(false)
                    setShowRegister(true)
                    setLoginError('')
                    setUsername('')
                    setPassword('')
                  }}
                  className="text-emerald-600 hover:text-emerald-700 text-sm"
                >
                  Hisobingiz yo&apos;qmi? Ro&apos;yxatdan o&apos;ting
                </button>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2"><strong>Demo hisoblar:</strong></p>
                <p className="text-xs text-gray-600">Username: <span className="font-mono">demo</span> / Parol: <span className="font-mono">demo123</span> (Oddiy)</p>
                <p className="text-xs text-gray-600 mt-1">Username: <span className="font-mono">premium</span> / Parol: <span className="font-mono">premium123</span> (Premium ✨)</p>
              </div>
            </>
          )}
          <Link href="/dasturlashga-qadam" className="block text-center mt-4 text-emerald-600 hover:text-emerald-700">
            ← Orqaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-teal-50">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-lime-600 px-6 py-4">
            <h3 className="text-white text-xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              Python kod sinash maydoni
            </h3>
            <p className="text-emerald-100 text-sm mt-1">Oddiy Python kodlarini yozib sinab ko&apos;ring</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 p-6">
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Python kodi</label>
                <button
                  onClick={runCode}
                  disabled={!user.isPremium}
                  className={`${user.isPremium ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2`}
                >
                  ▶ Ishga tushirish
                </button>
              </div>

              <div className="mb-3 flex gap-2 flex-wrap">
                <button disabled={!user.isPremium} onClick={() => loadExample("# O'zgaruvchilar\nism = \"Ahmadjon\"\nyosh = 25\nprint(\"Salom,\", ism)\nprint(\"Yosh:\", yosh)")} className={`text-xs ${user.isPremium ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} px-3 py-1 rounded-full transition`}>1. O&apos;zgaruvchilar</button>
                <button disabled={!user.isPremium} onClick={() => loadExample("# Matematik\na = 20\nb = 3\nprint(\"Yig'indi:\", a + b)\nprint(\"Ayirma:\", a - b)")} className={`text-xs ${user.isPremium ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} px-3 py-1 rounded-full transition`}>2. Matematik</button>
                <button disabled={!user.isPremium} onClick={() => loadExample("# If-else\nbaho = 50\nif baho >= 60:\n    print(\"O'tdingiz!\")\nelse:\n    print(\"Qayta topshiring\")")} className={`text-xs ${user.isPremium ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} px-3 py-1 rounded-full transition`}>3. If-else</button>
                <button disabled={!user.isPremium} onClick={() => loadExample("# For tsikli\nfor i in range(1, 6):\n    print(\"Son:\", i)")} className={`text-xs ${user.isPremium ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} px-3 py-1 rounded-full transition`}>4. For tsikli</button>
                <button disabled={!user.isPremium} onClick={() => loadExample("# Tkinter tugmalar\nfrom tkinter import Button\n\nbtn1 = Button(text=\"Boshlash\")\nbtn1.pack()\n\nbtn2 = Button(text=\"Chiqish\")\nbtn2.pack()")} className={`text-xs ${user.isPremium ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} px-3 py-1 rounded-full transition`}>5. Tkinter</button>
              </div>

              <textarea
                value={code}
                onChange={(e) => user.isPremium && setCode(e.target.value)}
                disabled={!user.isPremium}
                className={`w-full h-80 p-4 font-mono text-sm border-2 rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                  !user.isPremium ? 'bg-gray-50 cursor-not-allowed opacity-60' : hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
                placeholder="# Python kodini bu yerga yozing"
                spellCheck={false}
              />

              {!user.isPremium && (
                <div className="mt-4 bg-white rounded-xl shadow-2xl p-8 border-2 border-yellow-400">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Funksiya</h3>
                      <p className="text-gray-600 mb-4">
                        Salom, <strong>{user.name}</strong>! Kod yozish funksiyasidan foydalanish uchun Premium obuna kerak.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <strong>Eslatma:</strong> Premium obunani faollashtirish uchun admin bilan bog&apos;laning.
                        </p>
                      </div>
                      <Link href="/dasturlashga-qadam" className="inline-block px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition text-sm">
                        Orqaga
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Natija</label>
              <div className={`w-full h-80 p-4 font-mono text-sm rounded-lg overflow-auto ${
                hasError ? 'bg-gray-900 text-red-400' : 'bg-gray-900 text-green-400'
              }`}>
                {output ? (
                  <div className="whitespace-pre-wrap">{output}</div>
                ) : (
                  <div className="text-gray-500">Natija bu yerda ko&apos;rinadi...</div>
                )}
              </div>

              {buttons.length > 0 && (
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">Tkinter Tugmalari</p>
                  <div className="flex flex-wrap gap-2">
                    {buttons.map((btn, idx) => (
                      <button key={idx} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold">
                        {btn.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
