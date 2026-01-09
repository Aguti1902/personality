'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { personalityQuestions, calculatePersonalityScores } from '@/lib/personality-questions'
import Header from '@/components/Header'
import MinimalHeader from '@/components/MinimalHeader'
import { FaUser, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useTranslations } from '@/hooks/useTranslations'

export default function TestPage() {
  const router = useRouter()
  const { t, loading, lang } = useTranslations()
  const [userName, setUserName] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [startTime, setStartTime] = useState<number>(0)
  const [showFinishModal, setShowFinishModal] = useState(false)

  useEffect(() => {
    const savedUserName = localStorage.getItem('userName')
    if (savedUserName) {
      setUserName(savedUserName)
    }
  }, [])

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName.trim()) {
      localStorage.setItem('userName', userName)
      setStartTime(Date.now())
      setHasStarted(true)
    }
  }

  const handleAnswerSelect = (value: number) => {
    const newAnswers = { ...answers }
    newAnswers[personalityQuestions[currentQuestion].id] = value
    setAnswers(newAnswers)

    // Avanzar automáticamente después de un breve delay
    setTimeout(() => {
      if (currentQuestion < personalityQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Última pregunta - mostrar modal de finalización
        setShowFinishModal(true)
      }
    }, 300)
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleFinishTest = async () => {
    // Calcular puntuaciones de personalidad
    const personalityScores = calculatePersonalityScores(answers)
    
    // Guardar resultados en localStorage
    localStorage.setItem('personalityScores', JSON.stringify(personalityScores))
    localStorage.setItem('personalityAnswers', JSON.stringify(answers))
    localStorage.setItem('userName', userName)
    
    // Asegurarse de que NO sea test premium (usuarios nuevos deben pasar por checkout)
    localStorage.removeItem('isPremiumTest')
    
    const testResults = {
      answers,
      personalityScores,
      completedAt: new Date().toISOString(),
      userName
    }
    localStorage.setItem('testResults', JSON.stringify(testResults))

    // Si el usuario está autenticado, guardar en el backend
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const response = await fetch('/api/save-test-result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            personalityScores,
            answers,
            testType: 'personality'
          })
        })

        if (response.ok) {
          console.log('✅ Resultado de test guardado en backend')
        }
      } catch (error) {
        console.error('❌ Error guardando resultado en backend:', error)
      }
    }
    
    // Redirigir a análisis
    router.push(`/${lang}/analizando`)
  }

  const question = personalityQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100
  
  // Opciones de escala Likert - Diseño minimalista
  const likertOptions = [
    { value: 1, label: t?.test?.stronglyDisagree || 'Strongly Disagree', color: 'from-rose-100 to-rose-50', borderColor: 'border-rose-200', hoverColor: 'hover:border-rose-400', selectedColor: 'ring-rose-500' },
    { value: 2, label: t?.test?.disagree || 'Disagree', color: 'from-amber-100 to-amber-50', borderColor: 'border-amber-200', hoverColor: 'hover:border-amber-400', selectedColor: 'ring-amber-500' },
    { value: 3, label: t?.test?.neutral || 'Neutral', color: 'from-slate-100 to-slate-50', borderColor: 'border-slate-200', hoverColor: 'hover:border-slate-400', selectedColor: 'ring-slate-500' },
    { value: 4, label: t?.test?.agree || 'Agree', color: 'from-emerald-100 to-emerald-50', borderColor: 'border-emerald-200', hoverColor: 'hover:border-emerald-400', selectedColor: 'ring-emerald-500' },
    { value: 5, label: t?.test?.stronglyAgree || 'Strongly Agree', color: 'from-teal-100 to-teal-50', borderColor: 'border-teal-200', hoverColor: 'hover:border-teal-400', selectedColor: 'ring-teal-500' }
  ]

  if (loading || !t) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FF852A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t ? t.test.loading : 'Loading...'}</p>
          </div>
        </div>
      </>
    )
  }

  // Pantalla de bienvenida
  if (!hasStarted) {
    return (
      <>
        <Header />
        
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-8">
          <div className="container-custom max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center animate-fadeIn">
              <div className="w-20 h-20 bg-[#e6f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUser className="text-4xl text-[#FF852A]" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                <span className="text-[#224469]">Personality</span> <span className="text-[#FF852A]">Insight</span> - {t.test.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {t.test.welcomeSubtitle}
              </p>

              <form onSubmit={handleStart} className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={t.test.namePlaceholder}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-6"
                  required
                  autoFocus
                />

                <button type="submit" className="w-full btn-primary text-xl py-4">
                  {t.test.startButton}
                </button>
              </form>

              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                <h3 className="font-bold text-gray-900 mb-3">{t.test.instructionsTitle}</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• {t.test.personalityInstruction1}</li>
                  <li>• {t.test.personalityInstruction2}</li>
                  <li>• {t.test.personalityInstruction3}</li>
                  <li>• {t.test.personalityInstruction4}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Pantalla del test con escala Likert - DISEÑO PREMIUM MEJORADO
  return (
    <>
      <MinimalHeader email="" />
      
      <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] via-white to-[#f0fdf9]">
        {/* Header con progreso - MEJORADO */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="container-custom max-w-5xl py-5 px-4 md:px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`group ${currentQuestion === 0 ? 'invisible' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#FF852A] flex items-center justify-center transition-all">
                    <FaArrowLeft className="text-gray-600 group-hover:text-white text-lg transition-colors" />
                  </div>
                </button>
                <div>
                  <span className="text-xs font-medium text-gray-500 block">
                    Pregunta {currentQuestion + 1} de {personalityQuestions.length}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {Math.round(progress)}% completado
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF852A]/10 text-[#FF852A] rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-[#FF852A] rounded-full animate-pulse"></span>
                  En progreso
                </span>
              </div>
            </div>
            
            {/* Barra de progreso MEJORADA */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-[#FF852A] via-[#cc6a22] to-[#994f19]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Contenido principal - DISEÑO PREMIUM */}
        <div className="container-custom max-w-4xl py-8 md:py-16 px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn border border-gray-100">
            {/* Header de la tarjeta */}
            <div className="bg-gradient-to-r from-[#FF852A]/5 to-[#224469]/5 px-6 md:px-12 py-6 border-b border-gray-100">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 text-center">
                {t.test.likertQuestion}
              </h2>
            </div>

            {/* Pregunta - ESTILO PREMIUM */}
            <div className="px-6 md:px-12 py-10 md:py-14">
              <div className="text-center mb-12 md:mb-16">
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-[#FF852A] to-[#cc6a22] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                    Big Five
                  </span>
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl text-gray-900 font-bold leading-tight max-w-3xl mx-auto">
                  {question.text}
                </p>
              </div>

              {/* Opciones de escala Likert - DISEÑO PREMIUM */}
              <div className="space-y-8">
                {/* Labels superiores */}
                <div className="hidden md:grid grid-cols-5 gap-3 px-2">
                  {likertOptions.map((option) => (
                    <div key={option.value} className="text-center">
                      <span className="text-sm font-bold text-gray-700 block leading-tight">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Círculos de opciones - DISEÑO MINIMALISTA */}
                <div className="flex justify-between items-center gap-3 md:gap-6 px-2">
                  {likertOptions.map((option) => (
                    <div key={option.value} className="flex-1 flex flex-col items-center group">
                      <button
                        onClick={() => handleAnswerSelect(option.value)}
                        className={`relative w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br ${option.color} rounded-full 
                          border-3 ${option.borderColor} ${option.hoverColor}
                          transition-all duration-300 
                          ${answers[question.id] === option.value 
                            ? `scale-110 ring-4 ${option.selectedColor} ring-offset-2 shadow-2xl border-transparent` 
                            : 'hover:scale-105 shadow-lg hover:shadow-xl'
                          }
                          flex items-center justify-center cursor-pointer overflow-hidden`}
                      >
                        {/* Efecto de brillo sutil */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                        
                        {/* Check o número */}
                        {answers[question.id] === option.value ? (
                          <div className="relative z-10 flex items-center justify-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-7 h-7 md:w-10 md:h-10 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <span className="relative z-10 text-xl md:text-2xl font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                            {option.value}
                          </span>
                        )}
                      </button>
                      
                      {/* Labels móviles */}
                      <span className="md:hidden text-xs text-center text-gray-700 mt-3 font-semibold leading-tight max-w-[65px]">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info adicional */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-center gap-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">
                    {t.test.selectOption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de finalización - MEJORADO */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-12 animate-fadeIn text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF852A] to-[#cc6a22] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.test.congratulations}!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              {t.test.testCompleted}
            </p>

            <button
              onClick={handleFinishTest}
              className="w-full bg-gradient-to-r from-[#FF852A] to-[#cc6a22] hover:from-[#cc6a22] hover:to-[#994f19] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t.test.getResults}
            </button>

            <p className="mt-4 text-sm text-gray-500">
              {t.test.editAnswers}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
