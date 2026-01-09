'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MinimalHeader from '@/components/MinimalHeader'
import { personalityQuestions, calculatePersonalityScores } from '@/lib/personality-questions'
import { FaLock, FaChartLine, FaCertificate, FaShare, FaCheckCircle, FaUser } from 'react-icons/fa'
import { useTranslations } from '@/hooks/useTranslations'

export default function ResultadoEstimadoPage() {
  const router = useRouter()
  const { t, loading, lang } = useTranslations()
  const [personalityType, setPersonalityType] = useState<string>('')
  const [dominantTrait, setDominantTrait] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [reportsCount, setReportsCount] = useState(124000)

  useEffect(() => {
    const testResultsStr = localStorage.getItem('testResults')
    if (!testResultsStr) {
      router.push('/test')
      return
    }

    const testResults = JSON.parse(testResultsStr)
    const answers = testResults.answers
    const name = testResults.userName || localStorage.getItem('userName') || 'Usuario'

    // Calcular puntuaciones de personalidad
    const scores = calculatePersonalityScores(answers)
    
    // Determinar el rasgo dominante
    const traits = [
      { name: 'Abierto', value: scores.openness, key: 'O' },
      { name: 'Responsable', value: scores.conscientiousness, key: 'C' },
      { name: 'Extrovertido', value: scores.extraversion, key: 'E' },
      { name: 'Amable', value: scores.agreeableness, key: 'A' },
      { name: 'Estable', value: scores.neuroticism < 50 ? 100 - scores.neuroticism : 0, key: 'S' }
    ]
    
    const dominant = traits.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    )
    
    setDominantTrait(dominant.name)
    setPersonalityType(dominant.name)
    setUserName(name)
    setIsLoading(false)

    // Guardar datos para el pago
    localStorage.setItem('personalityScores', JSON.stringify(scores))
    localStorage.setItem('personalityType', dominant.name)

    // Animar contador de reportes
    const targetCount = 124563
    const duration = 2000 // 2 segundos
    const steps = 60
    const increment = (targetCount - 124000) / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setReportsCount(Math.floor(124000 + increment * currentStep))
      } else {
        setReportsCount(targetCount)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [router])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleCheckout = async () => {
    console.log('🚀 Iniciando checkout...', { email, personalityType, userName })
    
    // Validar email
    if (!email) {
      setEmailError(t.estimatedResult.emailRequired || 'Por favor, introduce tu correo electrónico')
      return
    }
    
    if (!validateEmail(email)) {
      setEmailError(t.estimatedResult.emailInvalid || 'Por favor, introduce un correo electrónico válido')
      return
    }

    // Validar términos
    if (!agreedToTerms) {
      alert(t.estimatedResult.termsRequired || 'Por favor, acepta los términos y condiciones para continuar')
      return
    }

    // Guardar email en localStorage
    localStorage.setItem('userEmail', email)
    console.log('✅ Email guardado:', email)
    console.log('✅ Personality Type:', localStorage.getItem('personalityType'))
    console.log('✅ Personality Scores:', localStorage.getItem('personalityScores'))
    
    // Redirigir a checkout
    console.log('🔄 Redirigiendo a checkout...')
    router.push(`/${lang}/checkout`)
  }

  if (isLoading || loading || !t) {
    return (
      <>
        <MinimalHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t ? t.test.loading : 'Loading...'}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <MinimalHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12">
        <div className="container-custom max-w-6xl">
          
          {/* Hero Section - Inspirado en la referencia */}
          <div className="bg-gradient-to-br from-[#FFF5E6] to-[#FFE8CC] rounded-3xl shadow-2xl p-8 md:p-12 mb-8 animate-fadeIn border-2 border-[#FF852A]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* Columna Izquierda - Contenido */}
              <div>
                <div className="inline-block px-4 py-2 bg-white/80 rounded-full mb-6 shadow-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="font-semibold text-gray-700">
                      Diego {t.estimatedResult.heroRecentOrder} <span className="text-[#224469]">Loyalist</span>
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.estimatedResult.heroTitle}
                </h1>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{t.estimatedResult.heroFeature1Title}</h3>
                      <p className="text-gray-600">{t.estimatedResult.heroFeature1Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{t.estimatedResult.heroFeature2Title}</h3>
                      <p className="text-gray-600">{t.estimatedResult.heroFeature2Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{t.estimatedResult.heroFeature3Title}</h3>
                      <p className="text-gray-600">{t.estimatedResult.heroFeature3Desc}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-lg">ℹ️</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{t.estimatedResult.heroInfoTitle}</p>
                      <p className="text-xs text-gray-600">{t.estimatedResult.heroInfoDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Visualización de Informe */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
                  
                  {/* Avatar de usuario en la esquina */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center shadow-lg">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                    </div>
                  </div>

                  {/* Gráfico de personalidad circular con SVG */}
                  <div className="relative w-full aspect-square mb-6" style={{ maxHeight: '320px' }}>
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {/* Círculo central grande */}
                      <circle cx="200" cy="200" r="140" fill="#E8EAF6" opacity="0.3"/>
                      <circle cx="200" cy="200" r="100" fill="#E8EAF6" opacity="0.5"/>
                      
                      {/* Líneas conectoras desde el centro */}
                      <line x1="200" y1="200" x2="200" y2="50" stroke="#E0E0E0" strokeWidth="2"/>
                      <line x1="200" y1="200" x2="330" y2="100" stroke="#E0E0E0" strokeWidth="2"/>
                      <line x1="200" y1="200" x2="350" y2="250" stroke="#E0E0E0" strokeWidth="2"/>
                      <line x1="200" y1="200" x2="200" y2="350" stroke="#E0E0E0" strokeWidth="2"/>
                      <line x1="200" y1="200" x2="70" y2="150" stroke="#E0E0E0" strokeWidth="2"/>
                      
                      {/* Dimensiones de personalidad - Círculos con letras */}
                      {/* O - Openness (arriba) */}
                      <circle cx="200" cy="50" r="28" fill="#66BB6A" className="drop-shadow-lg"/>
                      <text x="200" y="60" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">O</text>
                      
                      {/* C - Conscientiousness (derecha arriba) */}
                      <circle cx="330" cy="100" r="28" fill="#42A5F5" className="drop-shadow-lg"/>
                      <text x="330" y="110" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">C</text>
                      
                      {/* E - Extraversion (derecha abajo) */}
                      <circle cx="350" cy="250" r="28" fill="#EF5350" className="drop-shadow-lg"/>
                      <text x="350" y="260" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">E</text>
                      
                      {/* A - Agreeableness (abajo) */}
                      <circle cx="200" cy="350" r="28" fill="#AB47BC" className="drop-shadow-lg"/>
                      <text x="200" y="360" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">A</text>
                      
                      {/* N - Neuroticism (izquierda) */}
                      <circle cx="70" cy="150" r="28" fill="#EC407A" className="drop-shadow-lg"/>
                      <text x="70" y="160" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">N</text>
                    </svg>
                  </div>

                  {/* Barras de progreso mejoradas */}
                  <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-bold text-gray-700 mb-3">Total score</div>
                    {[
                      { label: '7', color: '#42A5F5', width: '78%', percent: '78%' },
                      { label: '8', color: '#66BB6A', width: '62%', percent: '62%' },
                      { label: '6', color: '#AB47BC', width: '49%', percent: '49%' },
                      { label: '2', color: '#FF7043', width: '42%', percent: '42%' },
                      { label: '3', color: '#EF5350', width: '35%', percent: '35%' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-600 w-4">{item.label}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: item.width, 
                              backgroundColor: item.color,
                              boxShadow: `0 0 8px ${item.color}40`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-500 w-12 text-right">{item.percent}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Icono de bloqueo flotante */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FF852A] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <FaLock className="text-2xl text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Contador de Reportes */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.estimatedResult.counterTitle}</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              {String(reportsCount).split('').map((digit, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg px-4 py-3 text-3xl md:text-4xl font-bold text-[#224469] shadow-md border border-gray-200 transform hover:scale-110 transition-transform">
                  {digit}
                </div>
              ))}
            </div>
            <p className="text-gray-600 font-medium text-lg">{t.estimatedResult.counterReports}</p>
          </div>

          {/* Animated Result Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
                <FaLock className="text-4xl text-[#FF852A]" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {userName}, {t.estimatedResult.title}
              </h1>
              <p className="text-xl text-gray-600">
                {t.estimatedResult.subtitle}
              </p>
            </div>

            {/* Blurred Result Preview */}
            <div className="relative mb-8">
              <div className="blur-sm pointer-events-none">
                <div className="bg-gradient-to-r from-[#FF852A] to-[#cc6a22] rounded-xl p-8 text-white text-center">
                  <div className="text-5xl font-bold mb-4">{personalityType}</div>
                  <div className="text-xl opacity-90">Tu rasgo dominante: {dominantTrait}</div>
                  <div className="text-lg mt-2">{t.estimatedResult.estimatedIQ}</div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-6 text-center max-w-md">
                  <FaLock className="text-3xl text-[#FF852A] mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {t.estimatedResult.unlockTitle}
                  </h3>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {t.estimatedResult.unlockSubtitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.estimatedResult.feature1}</h4>
                    <p className="text-sm text-gray-600">{t.estimatedResult.feature2}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaChartLine className="text-green-500 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.estimatedResult.feature3}</h4>
                    <p className="text-sm text-gray-600">{t.estimatedResult.feature2}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCertificate className="text-green-500 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.estimatedResult.feature4}</h4>
                    <p className="text-sm text-gray-600">{t.estimatedResult.feature2}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaShare className="text-green-500 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.estimatedResult.feature5}</h4>
                    <p className="text-sm text-gray-600">{t.result.shareTitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Section - Redesigned */}
            <div className="bg-gradient-to-br from-[#e6f5f5] to-white rounded-2xl p-8 mb-8 border-2 border-[#FF852A]">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {t.estimatedResult.mainTitle} <span className="text-[#FF852A]">{t.estimatedResult.mainTitleHighlight}</span>
                </h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  {t.estimatedResult.mainSubtitle}
                </p>
              </div>

              <div className="max-w-lg mx-auto">
                {/* Email Input */}
                <div className="mb-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError('')
                    }}
                    placeholder={t.estimatedResult.emailPlaceholder || "Email"}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
                      emailError 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-[#FF852A] focus:border-[#FF852A]'
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-2 text-left">⚠️ {emailError}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#FF852A] border-gray-300 rounded focus:ring-[#FF852A] cursor-pointer"
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {t.estimatedResult.acceptTerms}{' '}
                      <a 
                        href={`/${lang}/terminos`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#FF852A] underline hover:text-[#cc6a22]"
                      >
                        {t.estimatedResult.termsLink}
                      </a>
                      {' '}{t.estimatedResult.and}{' '}
                      <a 
                        href={`/${lang}/privacidad`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#FF852A] underline hover:text-[#cc6a22]"
                      >
                        {t.estimatedResult.privacyLink}
                      </a>
                      .
                    </span>
                  </label>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!email || !agreedToTerms}
                  className={`w-full text-xl font-bold py-4 px-8 rounded-xl transition-all duration-200 ${
                    email && agreedToTerms
                      ? 'bg-[#224469] hover:bg-[#14283f] text-white shadow-lg hover:shadow-xl cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {t.estimatedResult.unlockButton}
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-4">
                  🔒 {t.estimatedResult.securePayment}
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold text-gray-900">{t.estimatedResult.trust1Title}</h4>
              <p className="text-sm text-gray-600">{t.estimatedResult.trust1Desc}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-900">{t.estimatedResult.trust2Title}</h4>
              <p className="text-sm text-gray-600">{t.estimatedResult.trust2Desc}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl mb-2">✓</div>
              <h4 className="font-semibold text-gray-900">{t.estimatedResult.trust3Title}</h4>
              <p className="text-sm text-gray-600">{t.estimatedResult.trust3Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

