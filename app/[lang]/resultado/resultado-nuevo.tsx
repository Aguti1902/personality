'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MinimalHeader from '@/components/MinimalHeader'
import { PersonalityReportData } from '@/lib/openai-config'
import { FaCheckCircle, FaHeart, FaBriefcase, FaSeedling, FaUsers, FaDownload } from 'react-icons/fa'
import { useTranslations } from '@/hooks/useTranslations'

export default function ResultadoNuevoPage() {
  const router = useRouter()
  const { t, loading: tLoading, lang } = useTranslations()
  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState<PersonalityReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [personalityType, setPersonalityType] = useState<string>('')
  const [personalityScores, setPersonalityScores] = useState<any>(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Verificar pago
        const paymentCompleted = localStorage.getItem('paymentCompleted')
        if (!paymentCompleted) {
          router.push(`/${lang}/test`)
          return
        }

        // Cargar datos
        const type = localStorage.getItem('personalityType') || ''
        const scoresStr = localStorage.getItem('personalityScores')
        const answersStr = localStorage.getItem('personalityAnswers')
        const name = localStorage.getItem('userName') || 'Usuario'
        const email = localStorage.getItem('userEmail') || ''

        setPersonalityType(type)
        setUserName(name)
        setUserEmail(email)

        let scores = null
        let answers = null

        if (scoresStr) {
          scores = JSON.parse(scoresStr)
          setPersonalityScores(scores)
        }

        if (answersStr) {
          answers = JSON.parse(answersStr)
        }

        // Verificar si ya tenemos un reporte guardado
        const cachedReportStr = localStorage.getItem('personalityReport')
        if (cachedReportStr) {
          const cachedReport = JSON.parse(cachedReportStr)
          setReport(cachedReport)
          setIsLoading(false)
          return
        }

        // Generar nuevo reporte con OpenAI
        console.log('🤖 Generando reporte con OpenAI...')
        const response = await fetch('/api/generate-personality-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalityType: type,
            scores,
            answers
          })
        })

        if (!response.ok) {
          throw new Error('Error al generar el reporte')
        }

        const data = await response.json()
        setReport(data.report)
        
        // Guardar en cache
        localStorage.setItem('personalityReport', JSON.stringify(data.report))
        
        setIsLoading(false)
      } catch (error: any) {
        console.error('Error:', error)
        setError(error.message)
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [router, lang])

  if (isLoading || tLoading || !t) {
    return (
      <>
        <MinimalHeader email={userEmail} />
        <div className="min-h-screen bg-gradient-to-br from-[#48916f] to-[#3a7259] flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Generando tu informe personalizado...</h2>
            <p className="text-lg opacity-90">Esto puede tardar 10-15 segundos</p>
            <p className="text-sm opacity-75 mt-4">🤖 Analizando tus respuestas con IA</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !report) {
    return (
      <>
        <MinimalHeader email={userEmail} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'No se pudo cargar el reporte'}</p>
            <button
              onClick={() => router.push(`/${lang}/test`)}
              className="bg-[#48916f] hover:bg-[#3a7259] text-white px-6 py-3 rounded-lg font-semibold"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <MinimalHeader email={userEmail} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#48916f] to-[#3a7259] text-white py-16 px-4">
          <div className="container-custom max-w-6xl text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <span className="text-6xl">🧠</span>
              </div>
            </div>
            <p className="text-lg opacity-90 mb-4">Tipo de Personalidad:</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6">{personalityType}</h1>
            <p className="text-xl opacity-95 max-w-3xl mx-auto">
              Informe completo de personalidad generado especialmente para ti
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom max-w-6xl py-12 px-4">
          
          {/* Introduction Section */}
          <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">👋</span>
                Introducción a tu Tipo
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {report.introduction.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Core Characteristics */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.coreCharacteristics.map((char, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#48916f] to-[#3a7259] rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-white text-xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{char.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{char.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Motivations and Fears */}
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Motivations */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Motivaciones Principales
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {report.motivations.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Fears */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-3xl">⚠️</span>
                  Miedos y Preocupaciones
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {report.fears.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* In Relationships */}
          <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FaHeart className="text-red-500" />
                En las Relaciones
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 bg-red-50 inline-block px-4 py-2 rounded-lg">
                    Enfoque en las Relaciones
                  </h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.inRelationships.approach.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 bg-purple-50 inline-block px-4 py-2 rounded-lg">
                    Fortalezas y Desafíos
                  </h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.inRelationships.strengthsAndChallenges.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">💡 Consejos para Relaciones Saludables</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.inRelationships.tips.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* At Work */}
          <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FaBriefcase className="text-blue-600" />
                En el Trabajo
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 bg-blue-50 inline-block px-4 py-2 rounded-lg">
                    Entornos Laborales Ideales
                  </h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.atWork.idealEnvironments.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 bg-amber-50 inline-block px-4 py-2 rounded-lg">
                    Desafíos en el Trabajo
                  </h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.atWork.challenges.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">📈 Estrategias para el Crecimiento Profesional</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.atWork.strategies.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Growth Path */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FaSeedling className="text-green-600" />
                Camino de Crecimiento Personal
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Reconociendo el Perfeccionismo</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.growthPath.managingPerfectionism.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">💚 Aceptando la Imperfección</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.growthPath.acceptingImperfection.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🧘 Estrategias para el Bienestar</h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {report.growthPath.strategies.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Stress and Relaxation */}
          <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="text-4xl">🧘‍♀️</span>
                Manejo del Estrés y Relajación
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 bg-red-50 inline-block px-4 py-2 rounded-lg">
                    Cómo se Manifiesta el Estrés
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    <p>{report.stressAndRelaxation.howStressManifests}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 bg-blue-50 inline-block px-4 py-2 rounded-lg">
                    Mecanismos de Afrontamiento Saludables
                  </h3>
                  <div className="text-gray-700 leading-relaxed">
                    <p>{report.stressAndRelaxation.copingMechanisms}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">💪 Estrategias de Bienestar</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {report.stressAndRelaxation.strategies.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactions with Other Types */}
          {report.interactionsWithOtherTypes && report.interactionsWithOtherTypes.length > 0 && (
            <section className="mb-12">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <FaUsers className="text-purple-600" />
                  Interacciones con Otros Tipos
                </h2>
                
                <div className="space-y-6">
                  {report.interactionsWithOtherTypes.map((interaction, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border-l-4 border-[#48916f] hover:shadow-lg transition-shadow duration-300">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Con Tipo {interaction.type}: {interaction.typeName}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{interaction.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Download Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-[#48916f] to-[#3a7259] rounded-3xl shadow-2xl p-8 text-center text-white">
              <FaDownload className="text-5xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">¿Quieres guardar tu informe?</h2>
              <p className="text-lg opacity-90 mb-6">Descarga este análisis completo en PDF para tenerlo siempre contigo</p>
              <button
                onClick={() => {/* Implementar descarga PDF */}}
                className="bg-white text-[#48916f] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Descargar Informe en PDF
              </button>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}

