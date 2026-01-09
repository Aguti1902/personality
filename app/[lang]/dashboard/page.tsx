'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaBrain, FaTrophy, FaFire, FaCheckCircle, FaBook, FaAward, FaUser, FaEnvelope, FaCrown, FaCalendar, FaChartLine, FaStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa'
import { useTranslations } from '@/hooks/useTranslations'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import SubscriptionModal from '@/components/SubscriptionModal'

export default function DashboardPage() {
  const router = useRouter()
  const { lang } = useParams()
  const { t, loading: translationsLoading } = useTranslations()
  const [userData, setUserData] = useState({
    email: '',
    userName: '',
    hasSubscription: false
  })
  const [dailyStreak, setDailyStreak] = useState(0)
  const [progress, setProgress] = useState({
    completedTests: 0,
    finishedCourses: 0,
    completedChallenges: 0
  })
  const [personalityStats, setPersonalityStats] = useState({
    totalTests: 0,
    dominantTrait: '',
    averageOpenness: 0,
    averageConscientiousness: 0,
    averageExtraversion: 0,
    averageAgreeableness: 0,
    averageNeuroticism: 0,
    lastTestDate: null as string | null
  })
  const [personalityHistory, setPersonalityHistory] = useState<any[]>([])
  const [selectedTriviaAnswer, setSelectedTriviaAnswer] = useState<number | null>(null)
  const [showTriviaResult, setShowTriviaResult] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState('')

  // Did you know fact
  const didYouKnow = {
    title: t?.dashboard?.assertiveness || "Asertividad",
    content: t?.dashboard?.assertivenessText || "¿Sabías que ser asertivo puede ayudarte a comunicar tus necesidades y límites de manera efectiva? La asertividad se trata de expresarte...",
    image: "/images/assertiveness.jpg"
  }

  // Daily trivia
  const dailyTrivia = {
    question: t?.dashboard?.triviaQuestion || "¿Qué es un aspecto crítico de la inteligencia emocional?",
    options: [
      t?.dashboard?.triviaOption1 || "Autoconciencia",
      t?.dashboard?.triviaOption2 || "Ignorancia",
      t?.dashboard?.triviaOption3 || "Egoísmo",
      t?.dashboard?.triviaOption4 || "Negligencia"
    ],
    correctAnswer: 0
  }

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('auth_token')
      const userData_new = localStorage.getItem('user_data')

      if (token && userData_new) {
        try {
          const parsedUser = JSON.parse(userData_new)
          setUserData({
            email: parsedUser.email,
            userName: parsedUser.userName,
            hasSubscription: parsedUser.subscriptionStatus === 'active' || parsedUser.subscriptionStatus === 'trial'
          })

          // Load progress from localStorage
          const storedProgress = localStorage.getItem('userProgress')
          if (storedProgress) {
            setProgress(JSON.parse(storedProgress))
          }

          // Load daily streak
          const storedStreak = localStorage.getItem('dailyStreak')
          if (storedStreak) {
            setDailyStreak(parseInt(storedStreak))
          }

          // Load personality stats
          const personalityScores = localStorage.getItem('personalityScores')
          if (personalityScores) {
            const scores = JSON.parse(personalityScores)
            const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
            const dominant = traits.reduce((max, trait) => scores[trait] > scores[max] ? trait : max, traits[0])
            
            setPersonalityStats({
              totalTests: progress.completedTests || 1,
              dominantTrait: dominant.charAt(0).toUpperCase() + dominant.slice(1),
              averageOpenness: scores.openness || 0,
              averageConscientiousness: scores.conscientiousness || 0,
              averageExtraversion: scores.extraversion || 0,
              averageAgreeableness: scores.agreeableness || 0,
              averageNeuroticism: scores.neuroticism || 0,
              lastTestDate: new Date().toISOString()
            })
          }
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      } else {
        // Fallback to old system
        const email = localStorage.getItem('userEmail')
        const userName = localStorage.getItem('userName')
        
        if (!email) {
          router.push(`/${lang}/login`)
          return
        }

        setUserData({
          email: email || '',
          userName: userName || 'Usuario',
          hasSubscription: true
        })
      }

      setIsLoading(false)
    }

    loadUserData()
  }, [router, lang, progress.completedTests])

  const handleTriviaAnswer = (index: number) => {
    setSelectedTriviaAnswer(index)
    setShowTriviaResult(true)
  }

  const handleCancelSubscription = () => {
    setShowSubscriptionModal(true)
    setSubscriptionSuccess(false)
    setSubscriptionError('')
  }

  const handleConfirmCancel = async () => {
    setSubscriptionLoading(true)
    setSubscriptionError('')

    try {
      const token = localStorage.getItem('auth_token')
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: userData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscriptionSuccess(true)
        setUserData(prev => ({ ...prev, hasSubscription: false }))
      } else {
        setSubscriptionError(data.error || 'Error al cancelar la suscripción')
      }
    } catch (error) {
      setSubscriptionError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setSubscriptionLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowSubscriptionModal(false)
    setSubscriptionSuccess(false)
    setSubscriptionError('')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 8) {
      setPasswordMessage('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setPasswordLoading(true)
    setPasswordMessage('')

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordMessage('✅ Contraseña cambiada exitosamente')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => {
          setShowChangePassword(false)
          setPasswordMessage('')
        }, 2000)
      } else {
        setPasswordMessage(data.error || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      setPasswordMessage('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Get current day of week (0 = Monday, 6 = Sunday)
  const getCurrentDayIndex = () => {
    const day = new Date().getDay()
    return day === 0 ? 6 : day - 1
  }

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const currentDayIndex = getCurrentDayIndex()

  // Personality Radar Data
  const radarData = [
    { trait: 'Apertura', value: personalityStats.averageOpenness },
    { trait: 'Responsabilidad', value: personalityStats.averageConscientiousness },
    { trait: 'Extraversión', value: personalityStats.averageExtraversion },
    { trait: 'Amabilidad', value: personalityStats.averageAgreeableness },
    { trait: 'Neuroticismo', value: 100 - personalityStats.averageNeuroticism } // Invertido para mejor visualización
  ]

  if (isLoading || translationsLoading || !t) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t ? t.dashboard.loading : 'Cargando...'}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container-custom max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {t.dashboard.welcome}, {userData.userName}!
            </h1>
            <p className="text-gray-600">{t.account?.welcomeBack || 'Bienvenido de nuevo a tu panel de personalidad'}</p>
          </div>

          {/* Stats Overview - Big Five Traits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Openness */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Apertura</span>
                <FaStar className="text-2xl text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round(personalityStats.averageOpenness)}%
              </div>
              <p className="text-xs text-gray-600">Creatividad e Imaginación</p>
            </div>

            {/* Conscientiousness */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Responsabilidad</span>
                <FaTrophy className="text-2xl text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round(personalityStats.averageConscientiousness)}%
              </div>
              <p className="text-xs text-gray-600">Organización y Disciplina</p>
            </div>

            {/* Extraversion */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Extraversión</span>
                <FaUser className="text-2xl text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round(personalityStats.averageExtraversion)}%
              </div>
              <p className="text-xs text-gray-600">Sociabilidad y Energía</p>
            </div>

            {/* Agreeableness */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Amabilidad</span>
                <FaAward className="text-2xl text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round(personalityStats.averageAgreeableness)}%
              </div>
              <p className="text-xs text-gray-600">Cooperación y Empatía</p>
            </div>

            {/* Neuroticism (Estabilidad Emocional) */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-pink-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-pink-600 uppercase tracking-wide">Estabilidad</span>
                <FaBrain className="text-2xl text-pink-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round(100 - personalityStats.averageNeuroticism)}%
              </div>
              <p className="text-xs text-gray-600">Control Emocional</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personality Radar Chart */}
              {personalityStats.totalTests > 0 && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FaChartLine className="text-3xl text-secondary-500" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Tu Perfil de Personalidad</h2>
                      <p className="text-gray-600">Basado en el modelo Big Five (OCEAN)</p>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="trait" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar 
                        name="Puntuación" 
                        dataKey="value" 
                        stroke="#FF852A" 
                        fill="#FF852A" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 p-4 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong className="text-primary-600">Tu rasgo dominante:</strong> {personalityStats.dominantTrait} - 
                      Esto indica que tiendes a ser {personalityStats.dominantTrait === 'Openness' && 'creativo y curioso'}
                      {personalityStats.dominantTrait === 'Conscientiousness' && 'organizado y disciplinado'}
                      {personalityStats.dominantTrait === 'Extraversion' && 'sociable y energético'}
                      {personalityStats.dominantTrait === 'Agreeableness' && 'cooperativo y empático'}
                      {personalityStats.dominantTrait === 'Neuroticism' && 'emocionalmente estable'}
                    </p>
                  </div>
                </div>
              )}

              {/* Did you know? */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    {t.dashboard.didYouKnow || "Did you know?"}
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {didYouKnow.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {didYouKnow.content}
                      </p>
                      <button className="text-secondary-500 font-semibold hover:underline">
                        {t.dashboard.readMore || "Read more"}
                      </button>
                    </div>
                    
                    <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-secondary-100 to-primary-100 rounded-xl flex items-center justify-center">
                      <FaBrain className="text-6xl text-secondary-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Trivia */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  {t.dashboard.dailyTrivia || "Daily trivia"}
                </h2>
                
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {dailyTrivia.question}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {dailyTrivia.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleTriviaAnswer(index)}
                      disabled={showTriviaResult}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        showTriviaResult
                          ? index === dailyTrivia.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : selectedTriviaAnswer === index
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                          : selectedTriviaAnswer === index
                          ? 'border-secondary-500 bg-secondary-50'
                          : 'border-gray-200 hover:border-secondary-500 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          showTriviaResult && index === dailyTrivia.correctAnswer
                            ? 'border-green-500 bg-green-500'
                            : selectedTriviaAnswer === index
                            ? 'border-secondary-500 bg-secondary-500'
                            : 'border-gray-300'
                        }`}>
                          {(showTriviaResult && index === dailyTrivia.correctAnswer) || 
                           (selectedTriviaAnswer === index && showTriviaResult) ? (
                            <FaCheckCircle className="text-white text-sm" />
                          ) : null}
                        </div>
                        <span className="font-medium text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {showTriviaResult && (
                  <div className={`p-4 rounded-xl ${
                    selectedTriviaAnswer === dailyTrivia.correctAnswer
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="font-semibold">
                      {selectedTriviaAnswer === dailyTrivia.correctAnswer
                        ? '¡Correcto! 🎉'
                        : 'Incorrecto. La respuesta correcta es: ' + dailyTrivia.options[dailyTrivia.correctAnswer]}
                    </p>
                  </div>
                )}
              </div>

              {/* Available Tests Section */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t?.account?.availableTests || 'Tests Disponibles'}</h2>
                <p className="text-gray-600 mb-6">{t?.account?.availableTestsSubtitle || 'Realiza diferentes evaluaciones para conocerte mejor'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personality Test */}
                  <Link
                    href={`/${lang}/test`}
                    className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition border-2 border-transparent hover:border-pink-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                        👤
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Test de Personalidad</h3>
                        <p className="text-sm text-gray-600">Big Five (OCEAN)</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">Descubre tu perfil de personalidad completo</p>
                  </Link>

                  {/* ADHD Test */}
                  <Link
                    href={`/${lang}/tests/adhd`}
                    className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition border-2 border-transparent hover:border-blue-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                        A
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{t?.tests?.adhd?.title || 'Test TDAH'}</h3>
                        <p className="text-sm text-gray-600">DSM-5</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{t?.tests?.adhd?.description || 'Evalúa síntomas de TDAH'}</p>
                  </Link>

                  {/* Anxiety Test */}
                  <Link
                    href={`/${lang}/tests/anxiety`}
                    className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:shadow-lg transition border-2 border-transparent hover:border-yellow-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl">
                        😰
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{t?.tests?.anxiety?.title || 'Test Ansiedad'}</h3>
                        <p className="text-sm text-gray-600">GAD-7</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{t?.tests?.anxiety?.description || 'Mide niveles de ansiedad'}</p>
                  </Link>

                  {/* EQ Test */}
                  <Link
                    href={`/${lang}/tests/eq`}
                    className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition border-2 border-transparent hover:border-green-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
                        💚
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{t?.tests?.eq?.title || 'Inteligencia Emocional'}</h3>
                        <p className="text-sm text-gray-600">EQ Test</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{t?.tests?.eq?.description || 'Mide tu capacidad emocional'}</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* User Info Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{userData.userName}</h3>
                    <p className="text-sm text-gray-600">{t.account?.premiumUser || 'Usuario Premium'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-xl text-secondary-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">{t.account?.email || 'Email'}</p>
                      <p className="font-medium text-gray-900 text-sm truncate">{userData.email}</p>
                    </div>
                  </div>

                  {personalityStats.lastTestDate && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaCalendar className="text-xl text-secondary-500" />
                      <div>
                        <p className="text-xs text-gray-500">{t.account?.lastTest || 'Último Test'}</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {new Date(personalityStats.lastTestDate).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/${lang}/test`)}
                  className="w-full mt-6 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <FaBrain />
                  {t.account?.takeNewTest || 'Hacer Nuevo Test'}
                </button>
              </div>

              {/* Daily Streak */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  {t.dashboard.dailyStreak || "Daily streak"}
                </h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                    <FaFire className="text-4xl" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-900">{dailyStreak}</div>
                    <div className="text-sm text-gray-600">
                      {t.dashboard.daysInRow || "Days in a row"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold ${
                        index === currentDayIndex
                          ? 'bg-secondary-500 text-white ring-2 ring-secondary-500 ring-offset-2'
                          : index < currentDayIndex && dailyStreak > 0
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Progress */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-gray-700 mb-6">
                  {t.dashboard.yourProgress || "Your progress"}
                </h2>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <FaCheckCircle className="text-green-600 text-xl" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {t.dashboard.completedTests || "Tests completados"}
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                      {progress.completedTests}
                    </span>
                  </div>

                  <div className="h-px bg-gray-200"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FaBook className="text-blue-600 text-xl" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {t.dashboard.finishedCourses || "Cursos finalizados"}
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                      {progress.finishedCourses}
                    </span>
                  </div>

                  <div className="h-px bg-gray-200"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FaAward className="text-purple-600 text-xl" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {t.dashboard.completedChallenges || "Desafíos completados"}
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-gray-900">
                      {progress.completedChallenges}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <FaCrown className="text-3xl text-yellow-300" />
                  <div>
                    <h3 className="text-lg font-bold">{t.account?.premium || 'Premium'}</h3>
                    <p className="text-sm opacity-90">{t.account?.active || 'Activo'}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    {t.account?.unlimitedTests || 'Tests ilimitados'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    {t.account?.detailedStats || 'Estadísticas detalladas'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    {t.account?.progressTracking || 'Seguimiento de progreso'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    {t.account?.prioritySupport || 'Soporte prioritario'}
                  </li>
                </ul>

                <button
                  onClick={handleCancelSubscription}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition text-sm"
                >
                  {t.account?.manageSubscription || 'Gestionar Suscripción'}
                </button>
              </div>

              {/* Change Password Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{t.account?.security || 'Seguridad'}</h3>
                </div>
                
                {!showChangePassword ? (
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-4 rounded-lg font-semibold transition"
                  >
                    {t.account?.changePassword || 'Cambiar Contraseña'}
                  </button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.account?.currentPassword || 'Contraseña Actual'}
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.account?.newPassword || 'Nueva Contraseña'}
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.account?.confirmPassword || 'Confirmar Contraseña'}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                      />
                    </div>

                    {passwordMessage && (
                      <div className={`text-sm p-3 rounded-lg ${
                        passwordMessage.includes('✅') 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {passwordMessage}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="flex-1 bg-secondary-500 text-white py-2 px-4 rounded-lg hover:bg-secondary-600 disabled:opacity-50 font-semibold transition"
                      >
                        {passwordLoading ? 'Guardando...' : (t.account?.savePassword || 'Guardar')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false)
                          setCurrentPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                          setPasswordMessage('')
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold transition"
                      >
                        {t.account?.cancelChange || 'Cancelar'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        loading={subscriptionLoading}
        success={subscriptionSuccess}
        error={subscriptionError}
      />

      <Footer />
    </>
  )
}
