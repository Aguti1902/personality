import OpenAI from 'openai'

// Configuración de OpenAI
// La API key se carga desde .env.local
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface PersonalityReportData {
  introduction: string
  coreCharacteristics: Array<{
    title: string
    description: string
  }>
  motivations: string
  fears: string
  inRelationships: {
    approach: string
    strengthsAndChallenges: string
    tips: string
  }
  atWork: {
    idealEnvironments: string
    challenges: string
    strategies: string
  }
  growthPath: {
    managingPerfectionism: string
    acceptingImperfection: string
    strategies: string
  }
  stressAndRelaxation: {
    howStressManifests: string
    copingMechanisms: string
    strategies: string
  }
  interactionsWithOtherTypes: Array<{
    type: string
    typeName: string
    description: string
  }>
}

export async function generatePersonalityReport(
  personalityType: string,
  scores: any,
  answers: any
): Promise<PersonalityReportData> {
  try {
    const prompt = `
Eres un experto psicólogo especializado en el modelo Big Five de personalidad. 

El usuario ha completado un test de personalidad y obtuvo los siguientes resultados:
- Tipo dominante: ${personalityType}
- Puntuaciones:
  * Apertura (Openness): ${scores.openness}/100
  * Responsabilidad (Conscientiousness): ${scores.conscientiousness}/100
  * Extraversión (Extraversion): ${scores.extraversion}/100
  * Amabilidad (Agreeableness): ${scores.agreeableness}/100
  * Estabilidad Emocional (Neuroticism invertido): ${100 - scores.neuroticism}/100

Por favor, genera un informe completo y profesional en ESPAÑOL con la siguiente estructura en formato JSON:

{
  "introduction": "Introducción detallada al tipo de personalidad (2-3 párrafos)",
  "coreCharacteristics": [
    {
      "title": "Característica 1",
      "description": "Descripción detallada"
    }
    // ... 8 características en total
  ],
  "motivations": "Descripción de las motivaciones principales (2 párrafos)",
  "fears": "Descripción de los miedos centrales (2 párrafos)",
  "inRelationships": {
    "approach": "Cómo abordan las relaciones (1-2 párrafos)",
    "strengthsAndChallenges": "Fortalezas y desafíos en relaciones (1-2 párrafos)",
    "tips": "Consejos para relaciones saludables (1-2 párrafos)"
  },
  "atWork": {
    "idealEnvironments": "Entornos laborales ideales (1-2 párrafos)",
    "challenges": "Desafíos en el trabajo (1-2 párrafos)",
    "strategies": "Estrategias para el crecimiento profesional (1-2 párrafos)"
  },
  "growthPath": {
    "managingPerfectionism": "Cómo reconocer y manejar el perfeccionismo (1-2 párrafos)",
    "acceptingImperfection": "Aprender a aceptar la imperfección (1-2 párrafos)",
    "strategies": "Estrategias para el bienestar emocional y mental (1-2 párrafos)"
  },
  "stressAndRelaxation": {
    "howStressManifests": "Cómo se manifiesta el estrés (1 párrafo)",
    "copingMechanisms": "Mecanismos de afrontamiento saludables (1 párrafo)",
    "strategies": "Estrategias para el bienestar emocional y mental (1-2 párrafos)"
  },
  "interactionsWithOtherTypes": [
    {
      "type": "2",
      "typeName": "El Ayudador",
      "description": "Descripción de la interacción"
    }
    // ... para los 9 tipos de personalidad (si aplica)
  ]
}

El contenido debe ser:
- Profesional y empático
- Basado en las puntuaciones específicas del usuario
- Personalizado según sus resultados
- Constructivo y orientado al crecimiento
- En español formal pero accesible
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto psicólogo especializado en personalidad y evaluación psicológica. Proporcionas análisis detallados, empáticos y profesionales.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No se recibió contenido de OpenAI')
    }

    const reportData = JSON.parse(content)
    return reportData
  } catch (error) {
    console.error('Error generando reporte con OpenAI:', error)
    throw error
  }
}

