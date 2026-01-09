import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalityReport } from '@/lib/openai-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personalityType, scores, answers } = body

    console.log('📊 Generando reporte para:', personalityType)
    console.log('📈 Puntuaciones:', scores)

    if (!personalityType || !scores) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Generar el reporte con OpenAI
    const report = await generatePersonalityReport(personalityType, scores, answers)

    console.log('✅ Reporte generado exitosamente')

    return NextResponse.json({
      success: true,
      report
    })
  } catch (error: any) {
    console.error('❌ Error generando reporte:', error)
    
    return NextResponse.json(
      { 
        error: 'Error al generar el reporte',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

