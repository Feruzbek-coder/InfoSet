'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Question {
  question: string
  options: string[]
  correct_answer: number
}

const QUESTIONS_PER_ROUND = 15
const TOTAL_ROUNDS = 4
const TIME_PER_QUESTION = 10 // seconds
const BREAK_TIME = 60 // seconds
const CORRECT_POINTS = 3
const WRONG_POINTS = -1

export default function VocabularyTestPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [currentRoundQuestions, setCurrentRoundQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [showRoundResult, setShowRoundResult] = useState(false)
  const [showFinalResult, setShowFinalResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [breakTimeLeft, setBreakTimeLeft] = useState(BREAK_TIME)
  const [isBreak, setIsBreak] = useState(false)
  const [roundScores, setRoundScores] = useState<number[]>([])

  useEffect(() => {
    loadAllQuestions()
  }, [])

  // Timer for questions
  useEffect(() => {
    if (!loading && !showRoundResult && !showFinalResult && !isBreak && currentRoundQuestions.length > 0) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
        return () => clearTimeout(timer)
      } else {
        // Time's up - wrong answer
        handleTimeUp()
      }
    }
  }, [timeLeft, loading, showRoundResult, showFinalResult, isBreak, currentRoundQuestions])

  // Timer for break
  useEffect(() => {
    if (isBreak && breakTimeLeft > 0) {
      const timer = setTimeout(() => setBreakTimeLeft(breakTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isBreak && breakTimeLeft === 0) {
      startNextRound()
    }
  }, [isBreak, breakTimeLeft])

  const loadAllQuestions = async () => {
    try {
      setLoading(true)
      const [response1, response2] = await Promise.all([
        fetch('/api/questions?level=1'),
        fetch('/api/questions?level=2')
      ])
      const data1 = await response1.json()
      const data2 = await response2.json()
      const combined = [...data1.questions, ...data2.questions]
      setAllQuestions(combined)
      startNewRound(combined, 1)
      setLoading(false)
    } catch (error) {
      console.error('Savollarni yuklashda xatolik:', error)
      setLoading(false)
    }
  }

  const getRandomQuestions = (questions: Question[], count: number): Question[] => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const startNewRound = (questions: Question[], round: number) => {
    const randomQuestions = getRandomQuestions(questions, QUESTIONS_PER_ROUND)
    setCurrentRoundQuestions(randomQuestions)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setTimeLeft(TIME_PER_QUESTION)
    setCurrentRound(round)
  }

  const handleTimeUp = () => {
    setScore(score + WRONG_POINTS)
    moveToNextQuestion()
  }

  const moveToNextQuestion = () => {
    if (currentQuestion < QUESTIONS_PER_ROUND - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(TIME_PER_QUESTION)
    } else {
      finishRound()
    }
  }

  const finishRound = () => {
    setRoundScores([...roundScores, score])
    if (currentRound < TOTAL_ROUNDS) {
      setShowRoundResult(true)
    } else {
      setShowFinalResult(true)
    }
  }

  const startBreak = () => {
    setShowRoundResult(false)
    setIsBreak(true)
    setBreakTimeLeft(BREAK_TIME)
  }

  const startNextRound = () => {
    setIsBreak(false)
    startNewRound(allQuestions, currentRound + 1)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setCurrentRound(1)
    setShowRoundResult(false)
    setShowFinalResult(false)
    setTimeLeft(TIME_PER_QUESTION)
    setIsBreak(false)
    setRoundScores([])
    startNewRound(allQuestions, 1)
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Already answered
    
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === currentRoundQuestions[currentQuestion].correct_answer
    
    if (isCorrect) {
      setScore(score + CORRECT_POINTS)
    } else {
      setScore(score + WRONG_POINTS)
    }
    
    // Move to next question after 1 second
    setTimeout(() => {
      moveToNextQuestion()
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Savollar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700">Savollar topilmadi.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  // Break screen between rounds
  if (isBreak) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                <span className="text-2xl font-bold text-gray-900">TexnoSet.uz</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">☕</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dam olish vaqti</h2>
            <p className="text-xl text-gray-700 mb-6">
              {currentRound}-raund tugadi. Keyingi raund {breakTimeLeft} soniyadan so'ng boshlanadi.
            </p>
            <div className="text-5xl font-bold text-blue-600 mb-4">{breakTimeLeft}</div>
            <div className="text-lg text-gray-600">
              Joriy ball: <span className="font-bold text-purple-600">{score}</span>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Round result screen
  if (showRoundResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                <span className="text-2xl font-bold text-gray-900">TexnoSet.uz</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentRound}-raund tugadi!</h2>
            <p className="text-2xl text-gray-700 mb-6">
              Joriy ball: <span className="font-bold text-blue-600">{score}</span>
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Raund {currentRound}/{TOTAL_ROUNDS}
            </p>
            <button
              onClick={startBreak}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition text-lg"
            >
              Keyingi raundga o'tish
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Final result screen
  if (showFinalResult) {
    const totalScore = roundScores.reduce((a, b) => a + b, 0) + score
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                <span className="text-2xl font-bold text-gray-900">TexnoSet.uz</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              {totalScore >= 120 ? (
                <div className="text-6xl mb-4">🏆</div>
              ) : totalScore >= 80 ? (
                <div className="text-6xl mb-4">🎉</div>
              ) : totalScore >= 40 ? (
                <div className="text-6xl mb-4">👍</div>
              ) : (
                <div className="text-6xl mb-4">📚</div>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Barcha testlar tugadi!</h2>
            <p className="text-3xl font-bold text-purple-600 mb-6">
              Umumiy ball: {totalScore}
            </p>
            <div className="mb-6 text-left max-w-md mx-auto">
              <h3 className="font-bold text-xl mb-3 text-center">Raund natijalari:</h3>
              {[...roundScores, score].map((roundScore, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">Raund {index + 1}:</span>
                  <span className="font-bold text-blue-600">{roundScore} ball</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
              >
                Qayta boshlash
              </button>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition inline-block"
              >
                Bosh sahifaga
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const question = currentRoundQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
              <span className="text-2xl font-bold text-gray-900">TexnoSet.uz</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">English Vocabulary Quiz</h1>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-600">
                Raund {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className="text-sm text-gray-500">
                Savol {currentQuestion + 1}/{QUESTIONS_PER_ROUND}
              </div>
            </div>
          </div>

          <div className="mb-8">
            {/* Timer Display */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium text-gray-600">
                Ball: <span className="text-blue-600 font-bold text-xl">{score}</span>
              </div>
              <div className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                ⏱️ {timeLeft}s
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / QUESTIONS_PER_ROUND) * 100}%` }}
              ></div>
            </div>

            {/* Question */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {question.options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.correct_answer
                const showResult = selectedAnswer !== null
                
                let buttonClass = 'w-full p-4 rounded-lg text-left font-semibold text-lg transition-all '
                
                if (showResult) {
                  if (isSelected && isCorrect) {
                    buttonClass += 'bg-green-500 text-white shadow-lg'
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'bg-red-500 text-white shadow-lg'
                  } else if (isCorrect) {
                    buttonClass += 'bg-green-200 text-gray-800'
                  } else {
                    buttonClass += 'bg-gray-100 text-gray-500'
                  }
                } else {
                  buttonClass += 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-102 cursor-pointer'
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    <span className="mr-3 opacity-70">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
