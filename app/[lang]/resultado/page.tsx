'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MinimalHeader from '@/components/MinimalHeader'
import { PersonalityReportData } from '@/lib/openai-config'
import { FaCheckCircle, FaHeart, FaBriefcase, FaSeedling, FaUsers, FaDownload } from 'react-icons/fa'
import { useTranslations } from '@/hooks/useTranslations'
import jsPDF from 'jspdf'

// Función para generar el PDF completo del informe
const generatePDF = async (
  report: PersonalityReportData,
  personalityType: string,
  userName: string,
  personalityScores: any
) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let currentY = 20

  // Colores corporativos
  const primaryColor = [34, 68, 105] // #224469
  const secondaryColor = [255, 133, 42] // #FF852A
  const textColor = [31, 41, 55] // gray-900
  const lightGray = [156, 163, 175] // gray-400

  // Cargar el logo y convertirlo a blanco
  let logoData: string | null = null
  try {
    const logoResponse = await fetch('/images/Logopersonality.png')
    const logoBlob = await logoResponse.blob()
    
    // Convertir el logo a blanco usando canvas
    logoData = await new Promise<string>((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          // Dibujar la imagen
          ctx.drawImage(img, 0, 0)
          
          // Obtener los datos de píxeles
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          // Convertir todos los píxeles no transparentes a blanco
          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3]
            if (alpha > 0) {
              data[i] = 255     // R
              data[i + 1] = 255 // G
              data[i + 2] = 255 // B
              // Mantener el alpha original
            }
          }
          
          // Volver a colocar los datos modificados
          ctx.putImageData(imageData, 0, 0)
          
          // Convertir a base64
          resolve(canvas.toDataURL('image/png'))
        }
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        img.src = reader.result as string
      }
      reader.readAsDataURL(logoBlob)
    })
  } catch (error) {
    console.error('Error cargando logo:', error)
  }

  // Función auxiliar para agregar nueva página si es necesario
  const checkAndAddPage = (spaceNeeded: number = 30) => {
    if (currentY + spaceNeeded > pageHeight - margin) {
      doc.addPage()
      currentY = margin
      return true
    }
    return false
  }

  // Función para dividir texto en líneas
  const splitText = (text: string, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize)
    return doc.splitTextToSize(text, maxWidth)
  }

  // ============================================
  // PORTADA
  // ============================================
  // Fondo de cabecera con degradado simulado
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 90, 'F')
  
  // Borde naranja
  doc.setFillColor(...secondaryColor)
  doc.rect(0, 85, pageWidth, 5, 'F')

  // Logo (si se cargó correctamente)
  if (logoData) {
    const logoWidth = 50
    const logoHeight = 15
    const logoX = (pageWidth - logoWidth) / 2
    doc.addImage(logoData, 'PNG', logoX, 15, logoWidth, logoHeight)
    currentY = 40
  } else {
    // Fallback: texto si no hay logo
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('Personality Insight', pageWidth / 2, 25, { align: 'center' })
    currentY = 35
  }

  // Subtítulo
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text('Informe Completo de Personalidad', pageWidth / 2, currentY, { align: 'center' })

  // Tipo de Personalidad
  doc.setFontSize(36)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text(personalityType, pageWidth / 2, currentY + 25, { align: 'center' })

  // Información del usuario
  currentY = 100
  doc.setFontSize(12)
  doc.setTextColor(...textColor)
  doc.setFont('helvetica', 'normal')
  doc.text(`Preparado para: ${userName}`, pageWidth / 2, currentY, { align: 'center' })
  
  currentY += 10
  doc.setFontSize(10)
  doc.setTextColor(...lightGray)
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, currentY, { align: 'center' })

  // Puntuaciones Big Five
  if (personalityScores) {
    currentY += 25
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('Tus Puntuaciones Big Five (OCEAN)', margin, currentY)
    
    currentY += 10
    const dimensions = [
      { name: 'Apertura (Openness)', score: personalityScores.openness, color: [59, 130, 246] },
      { name: 'Responsabilidad (Conscientiousness)', score: personalityScores.conscientiousness, color: [34, 197, 94] },
      { name: 'Extraversión (Extraversion)', score: personalityScores.extraversion, color: [249, 115, 22] },
      { name: 'Amabilidad (Agreeableness)', score: personalityScores.agreeableness, color: [168, 85, 247] },
      { name: 'Neuroticismo (Neuroticism)', score: personalityScores.neuroticism, color: [239, 68, 68] }
    ]

    dimensions.forEach((dim) => {
      currentY += 12
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...textColor)
      doc.text(dim.name, margin, currentY)
      
      // Barra de progreso
      const barWidth = 80
      const barX = pageWidth - margin - barWidth
      doc.setFillColor(240, 240, 240)
      doc.rect(barX, currentY - 5, barWidth, 6, 'F')
      doc.setFillColor(...dim.color)
      doc.rect(barX, currentY - 5, (dim.score / 100) * barWidth, 6, 'F')
      
      // Porcentaje
      doc.setFont('helvetica', 'bold')
      doc.text(`${dim.score}%`, pageWidth - margin, currentY, { align: 'right' })
    })
  }

  // ============================================
  // NUEVA PÁGINA: INTRODUCCIÓN
  // ============================================
  doc.addPage()
  currentY = margin

  // Título de sección
  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Introducción a tu Tipo', margin + 5, currentY)

  currentY += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  
  const introParagraphs = report.introduction.split('\n\n')
  introParagraphs.forEach((paragraph) => {
    const lines = splitText(paragraph, maxWidth)
    lines.forEach((line: string) => {
      checkAndAddPage()
      doc.text(line, margin, currentY)
      currentY += 6
    })
    currentY += 4
  })

  // ============================================
  // CARACTERÍSTICAS PRINCIPALES
  // ============================================
  checkAndAddPage(40)
  currentY += 10

  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Características Principales', margin + 5, currentY)

  currentY += 15

  report.coreCharacteristics.forEach((char, idx) => {
    checkAndAddPage(30)
    
    // Número de característica
    doc.setFillColor(...secondaryColor)
    doc.circle(margin + 5, currentY - 2, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`${idx + 1}`, margin + 5, currentY + 1, { align: 'center' })
    
    // Título
    doc.setFontSize(12)
    doc.setTextColor(...primaryColor)
    doc.text(char.title, margin + 15, currentY)
    
    currentY += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...textColor)
    const charLines = splitText(char.description, maxWidth - 5)
    charLines.forEach((line: string) => {
      checkAndAddPage()
      doc.text(line, margin + 5, currentY)
      currentY += 6
    })
    
    currentY += 8
  })

  // ============================================
  // MOTIVACIONES
  // ============================================
  checkAndAddPage(40)
  currentY += 5

  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Motivaciones Principales', margin + 5, currentY)

  currentY += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  
  const motivationParagraphs = report.motivations.split('\n\n')
  motivationParagraphs.forEach((paragraph) => {
    const lines = splitText(paragraph, maxWidth)
    lines.forEach((line: string) => {
      checkAndAddPage()
      doc.text(line, margin, currentY)
      currentY += 6
    })
    currentY += 4
  })

  // ============================================
  // MIEDOS Y PREOCUPACIONES
  // ============================================
  checkAndAddPage(40)
  currentY += 5

  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Miedos y Preocupaciones', margin + 5, currentY)

  currentY += 15
  doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  
  const fearParagraphs = report.fears.split('\n\n')
  fearParagraphs.forEach((paragraph) => {
    const lines = splitText(paragraph, maxWidth)
    lines.forEach((line: string) => {
      checkAndAddPage()
      doc.text(line, margin, currentY)
      currentY += 6
    })
    currentY += 4
  })

  // ============================================
  // EN LAS RELACIONES
  // ============================================
  checkAndAddPage(40)
  currentY += 10

  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('En las Relaciones', margin + 5, currentY)
    
  // Enfoque
  currentY += 15
    doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Enfoque en las Relaciones', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const approachLines = splitText(report.inRelationships.approach, maxWidth)
  approachLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Fortalezas y Desafíos
  currentY += 10
  checkAndAddPage(30)
  doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Fortalezas y Desafíos', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const strengthsLines = splitText(report.inRelationships.strengthsAndChallenges, maxWidth)
  strengthsLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Consejos
  currentY += 10
  checkAndAddPage(30)
  doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Consejos para Relaciones Saludables', margin, currentY)
    
  currentY += 8
  doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const tipsLines = splitText(report.inRelationships.tips, maxWidth)
  tipsLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // ============================================
  // EN EL TRABAJO
  // ============================================
  checkAndAddPage(40)
  currentY += 10

  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('En el Trabajo', margin + 5, currentY)

  // Entornos Ideales
  currentY += 15
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Entornos Laborales Ideales', margin, currentY)
  
  currentY += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const idealEnvLines = splitText(report.atWork.idealEnvironments, maxWidth)
  idealEnvLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Desafíos
  currentY += 10
  checkAndAddPage(30)
  doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Desafíos en el Trabajo', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const challengesLines = splitText(report.atWork.challenges, maxWidth)
  challengesLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Estrategias
  currentY += 10
  checkAndAddPage(30)
    doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Estrategias para el Crecimiento Profesional', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const strategiesLines = splitText(report.atWork.strategies, maxWidth)
  strategiesLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // ============================================
  // CAMINO DE CRECIMIENTO PERSONAL
  // ============================================
  checkAndAddPage(40)
  currentY += 10

  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Camino de Crecimiento Personal', margin + 5, currentY)

  // Reconociendo el Perfeccionismo
  currentY += 15
  doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Reconociendo Patrones', margin, currentY)
    
  currentY += 8
  doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const perfectionismLines = splitText(report.growthPath.managingPerfectionism, maxWidth)
  perfectionismLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Aceptando la Imperfección
  currentY += 10
  checkAndAddPage(30)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Aceptando la Imperfección', margin, currentY)
  
  currentY += 8
    doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const imperfectionLines = splitText(report.growthPath.acceptingImperfection, maxWidth)
  imperfectionLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Estrategias de Bienestar
  currentY += 10
  checkAndAddPage(30)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Estrategias para el Bienestar', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const wellbeingLines = splitText(report.growthPath.strategies, maxWidth)
  wellbeingLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // ============================================
  // MANEJO DEL ESTRÉS
  // ============================================
  checkAndAddPage(40)
  currentY += 10

  doc.setFillColor(...secondaryColor)
  doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Manejo del Estrés y Relajación', margin + 5, currentY)

  // Cómo se Manifiesta
  currentY += 15
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Cómo se Manifiesta el Estrés', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const manifestLines = splitText(report.stressAndRelaxation.howStressManifests, maxWidth)
  manifestLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Mecanismos de Afrontamiento
  currentY += 10
  checkAndAddPage(30)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Mecanismos de Afrontamiento Saludables', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const copingLines = splitText(report.stressAndRelaxation.copingMechanisms, maxWidth)
  copingLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // Estrategias de Bienestar
  currentY += 10
  checkAndAddPage(30)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...secondaryColor)
  doc.text('Estrategias de Bienestar', margin, currentY)
  
  currentY += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)
  const stressStrategiesLines = splitText(report.stressAndRelaxation.strategies, maxWidth)
  stressStrategiesLines.forEach((line: string) => {
    checkAndAddPage()
    doc.text(line, margin, currentY)
    currentY += 6
  })

  // ============================================
  // INTERACCIONES CON OTROS TIPOS
  // ============================================
  if (report.interactionsWithOtherTypes && report.interactionsWithOtherTypes.length > 0) {
    checkAndAddPage(40)
    currentY += 10

    doc.setFillColor(...secondaryColor)
    doc.rect(margin - 5, currentY - 8, 5, 12, 'F')
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('Interacciones con Otros Tipos', margin + 5, currentY)

    currentY += 15

    report.interactionsWithOtherTypes.forEach((interaction) => {
      checkAndAddPage(25)
      
      doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
      doc.setTextColor(...secondaryColor)
      doc.text(`Con Tipo ${interaction.type}: ${interaction.typeName}`, margin, currentY)
    
      currentY += 8
      doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
      doc.setTextColor(...textColor)
      const interactionLines = splitText(interaction.description, maxWidth)
      interactionLines.forEach((line: string) => {
        checkAndAddPage()
        doc.text(line, margin, currentY)
        currentY += 6
      })
      
      currentY += 8
    })
  }

  // ============================================
  // PIE DE PÁGINA FINAL
  // ============================================
  doc.addPage()
  currentY = pageHeight / 2 - 50

  doc.setFillColor(...primaryColor)
  doc.rect(0, currentY - 20, pageWidth, 100, 'F')

  // Logo en la página final
  if (logoData) {
    const logoWidth = 60
    const logoHeight = 18
    const logoX = (pageWidth - logoWidth) / 2
    doc.addImage(logoData, 'PNG', logoX, currentY - 5, logoWidth, logoHeight)
    currentY += 25
  } else {
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(32)
    doc.setFont('helvetica', 'bold')
    doc.text('Personality Insight', pageWidth / 2, currentY, { align: 'center' })
    currentY += 15
  }

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'normal')
  doc.text('Gracias por confiar en nosotros', pageWidth / 2, currentY, { align: 'center' })

  currentY += 15
  doc.setFontSize(12)
  doc.text('Este informe ha sido generado específicamente para ti', pageWidth / 2, currentY, { align: 'center' })
  
  currentY += 10
  doc.setFontSize(10)
  doc.text('usando tecnología de inteligencia artificial avanzada', pageWidth / 2, currentY, { align: 'center' })
  
  currentY += 15
    doc.setFontSize(9)
  doc.setTextColor(200, 200, 200)
  doc.text(`© ${new Date().getFullYear()} Personality Insight. Todos los derechos reservados.`, pageWidth / 2, currentY, { align: 'center' })

  // Numerar páginas
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...lightGray)
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
    doc.text('Personality Insight', margin, pageHeight - 10)
  }

  // Guardar PDF
  const fileName = `Informe_Personalidad_${personalityType.replace(/\s+/g, '_')}_${userName.replace(/\s+/g, '_')}.pdf`
  doc.save(fileName)
}

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

  if (tLoading || !t) {
  return (
    <>
      <MinimalHeader email={userEmail} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-[#FF852A] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando...</h2>
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
            <div className="text-6xl mb-4">{isLoading ? '🤖' : '❌'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLoading ? 'Generando tu informe...' : 'Error'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isLoading ? 'Analizando tus respuestas con IA. Esto puede tardar 10-15 segundos...' : error || 'No se pudo cargar el reporte'}
            </p>
            {!isLoading && (
              <button
                onClick={() => router.push(`/${lang}/test`)}
                className="bg-[#224469] hover:bg-[#FF852A] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Volver al inicio
              </button>
            )}
            {isLoading && (
              <div className="w-16 h-16 border-4 border-[#FF852A] border-t-transparent rounded-full animate-spin mx-auto"></div>
            )}
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
        <div className="bg-white border-b-4 border-[#FF852A] py-16 px-4">
          <div className="container-custom max-w-6xl text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-gradient-to-br from-[#224469]/10 to-[#FF852A]/10 rounded-full">
                <span className="text-6xl">🧠</span>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-4">Tipo de Personalidad:</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#224469] to-[#FF852A] bg-clip-text text-transparent">{personalityType}</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
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
                      <div className="w-12 h-12 bg-gradient-to-br from-[#224469] to-[#FF852A] rounded-full flex items-center justify-center">
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
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border-l-4 border-[#FF852A] hover:shadow-lg transition-shadow duration-300">
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
            <div className="bg-gradient-to-r from-[#224469] to-[#FF852A] rounded-3xl shadow-2xl p-8 text-center text-white">
              <FaDownload className="text-5xl mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">¿Quieres guardar tu informe?</h2>
              <p className="text-lg opacity-90 mb-6">Descarga este análisis completo en PDF para tenerlo siempre contigo</p>
                <button
                onClick={async () => {
                  if (report && personalityType && userName && personalityScores) {
                    await generatePDF(report, personalityType, userName, personalityScores)
                  }
                }}
                className="bg-white text-[#224469] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-3 mx-auto"
              >
                <FaDownload />
                Descargar Informe en PDF
                </button>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}

