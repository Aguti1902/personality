export interface PersonalityQuestion {
  id: number
  text: string
  dimension: 'O' | 'C' | 'E' | 'A' | 'N'
  reverse: boolean
}

// 120 preguntas Big Five — 24 por dimensión, intercaladas por dimensión (E,A,C,N,O)
export const personalityQuestions: PersonalityQuestion[] = [
  // ── Paso 1 ─────────────────────────────────────────────────────────
  { id: 1,   text: 'Soy el alma de la fiesta',                                dimension: 'E', reverse: false },
  { id: 2,   text: 'Me intereso por los demás',                               dimension: 'A', reverse: false },
  { id: 3,   text: 'Siempre estoy preparado/a',                               dimension: 'C', reverse: false },
  { id: 4,   text: 'Me estreso fácilmente',                                   dimension: 'N', reverse: false },
  // ── Paso 2 ─────────────────────────────────────────────────────────
  { id: 5,   text: 'Tengo una imaginación vívida',                            dimension: 'O', reverse: false },
  { id: 6,   text: 'No hablo mucho',                                          dimension: 'E', reverse: true  },
  { id: 7,   text: 'No me interesan los problemas de otras personas',         dimension: 'A', reverse: true  },
  { id: 8,   text: 'Dejo mis cosas desordenadas',                             dimension: 'C', reverse: true  },
  // ── Paso 3 ─────────────────────────────────────────────────────────
  { id: 9,   text: 'Rara vez me siento triste',                               dimension: 'N', reverse: true  },
  { id: 10,  text: 'No me interesan las ideas abstractas',                    dimension: 'O', reverse: true  },
  { id: 11,  text: 'Me siento cómodo/a con otras personas',                   dimension: 'E', reverse: false },
  { id: 12,  text: 'Hago sentir cómodos a los demás',                         dimension: 'A', reverse: false },
  // ── Paso 4 ─────────────────────────────────────────────────────────
  { id: 13,  text: 'Presto atención a los detalles',                          dimension: 'C', reverse: false },
  { id: 14,  text: 'Me preocupo por las cosas',                               dimension: 'N', reverse: false },
  { id: 15,  text: 'Tengo un vocabulario rico',                               dimension: 'O', reverse: false },
  { id: 16,  text: 'Inicio conversaciones',                                   dimension: 'E', reverse: false },
  // ── Paso 5 ─────────────────────────────────────────────────────────
  { id: 17,  text: 'Tengo un corazón blando',                                 dimension: 'A', reverse: false },
  { id: 18,  text: 'Hago las tareas de inmediato',                            dimension: 'C', reverse: false },
  { id: 19,  text: 'Rara vez me molesto',                                     dimension: 'N', reverse: true  },
  { id: 20,  text: 'Estoy lleno/a de ideas',                                  dimension: 'O', reverse: false },
  // ── Paso 6 ─────────────────────────────────────────────────────────
  { id: 21,  text: 'Tengo poco que decir',                                    dimension: 'E', reverse: true  },
  { id: 22,  text: 'Me tomo tiempo para los demás',                           dimension: 'A', reverse: false },
  { id: 23,  text: 'Me gusta el orden',                                       dimension: 'C', reverse: false },
  { id: 24,  text: 'Mis emociones cambian fácilmente',                        dimension: 'N', reverse: false },
  // ── Paso 7 ─────────────────────────────────────────────────────────
  { id: 25,  text: 'Paso tiempo reflexionando sobre las cosas',               dimension: 'O', reverse: false },
  { id: 26,  text: 'Hablo con muchas personas diferentes en las fiestas',     dimension: 'E', reverse: false },
  { id: 27,  text: 'Siento las emociones de otros',                           dimension: 'A', reverse: false },
  { id: 28,  text: 'Evito mis responsabilidades',                             dimension: 'C', reverse: true  },
  // ── Paso 8 ─────────────────────────────────────────────────────────
  { id: 29,  text: 'Soy relajado/a la mayor parte del tiempo',                dimension: 'N', reverse: true  },
  { id: 30,  text: 'Me gusta la variedad',                                    dimension: 'O', reverse: false },
  { id: 31,  text: 'Me mantengo en segundo plano',                            dimension: 'E', reverse: true  },
  { id: 32,  text: 'Confío en las personas',                                  dimension: 'A', reverse: false },
  // ── Paso 9 ─────────────────────────────────────────────────────────
  { id: 33,  text: 'Sigo un horario',                                         dimension: 'C', reverse: false },
  { id: 34,  text: 'Me enojo fácilmente',                                     dimension: 'N', reverse: false },
  { id: 35,  text: 'Disfruto de las obras de arte',                           dimension: 'O', reverse: false },
  { id: 36,  text: 'No me gusta llamar la atención',                          dimension: 'E', reverse: true  },
  // ── Paso 10 ────────────────────────────────────────────────────────
  { id: 37,  text: 'Estoy dispuesto/a a comprometerme',                       dimension: 'A', reverse: false },
  { id: 38,  text: 'Termino lo que empiezo',                                  dimension: 'C', reverse: false },
  { id: 39,  text: 'Rara vez me siento preocupado/a',                         dimension: 'N', reverse: true  },
  { id: 40,  text: 'Tengo curiosidad por muchas cosas',                       dimension: 'O', reverse: false },
  // ── Paso 11 ────────────────────────────────────────────────────────
  { id: 41,  text: 'Me siento energizado/a cuando estoy con gente',           dimension: 'E', reverse: false },
  { id: 42,  text: 'Perdono fácilmente',                                      dimension: 'A', reverse: false },
  { id: 43,  text: 'Me esfuerzo por la excelencia',                           dimension: 'C', reverse: false },
  { id: 44,  text: 'Me angustio ante los problemas',                          dimension: 'N', reverse: false },
  // ── Paso 12 ────────────────────────────────────────────────────────
  { id: 45,  text: 'Busco experiencias nuevas',                               dimension: 'O', reverse: false },
  { id: 46,  text: 'Prefiero estar solo/a que en grupo',                      dimension: 'E', reverse: true  },
  { id: 47,  text: 'Guardo rencor',                                           dimension: 'A', reverse: true  },
  { id: 48,  text: 'Tengo dificultad para mantenerme organizado/a',           dimension: 'C', reverse: true  },
  // ── Paso 13 ────────────────────────────────────────────────────────
  { id: 49,  text: 'Me recupero rápido de los contratiempos',                 dimension: 'N', reverse: true  },
  { id: 50,  text: 'Prefiero lo convencional a lo novedoso',                  dimension: 'O', reverse: true  },
  { id: 51,  text: 'Soy extrovertido/a y sociable',                           dimension: 'E', reverse: false },
  { id: 52,  text: 'Trato de ser amable con todos',                           dimension: 'A', reverse: false },
  // ── Paso 14 ────────────────────────────────────────────────────────
  { id: 53,  text: 'Cumplo mis compromisos',                                  dimension: 'C', reverse: false },
  { id: 54,  text: 'Soy muy sensible emocionalmente',                         dimension: 'N', reverse: false },
  { id: 55,  text: 'Uso mi imaginación con frecuencia',                       dimension: 'O', reverse: false },
  { id: 56,  text: 'Tomo la iniciativa en situaciones sociales',              dimension: 'E', reverse: false },
  // ── Paso 15 ────────────────────────────────────────────────────────
  { id: 57,  text: 'Me comporto de manera desconsiderada',                    dimension: 'A', reverse: true  },
  { id: 58,  text: 'Procrastino frecuentemente',                              dimension: 'C', reverse: true  },
  { id: 59,  text: 'Mantengo la calma bajo presión',                          dimension: 'N', reverse: true  },
  { id: 60,  text: 'Me fascinan las culturas diferentes a la mía',            dimension: 'O', reverse: false },
  // ── Paso 16 ────────────────────────────────────────────────────────
  { id: 61,  text: 'Me resulta difícil hablar en público',                    dimension: 'E', reverse: true  },
  { id: 62,  text: 'Hago que la gente se sienta a gusto',                     dimension: 'A', reverse: false },
  { id: 63,  text: 'Soy metódico/a en mi trabajo',                            dimension: 'C', reverse: false },
  { id: 64,  text: 'Raramente me siento deprimido/a',                         dimension: 'N', reverse: true  },
  // ── Paso 17 ────────────────────────────────────────────────────────
  { id: 65,  text: 'Disfruto explorar ideas complejas',                       dimension: 'O', reverse: false },
  { id: 66,  text: 'Disfruto de las reuniones sociales',                      dimension: 'E', reverse: false },
  { id: 67,  text: 'Ayudo a quienes lo necesitan',                            dimension: 'A', reverse: false },
  { id: 68,  text: 'Dejo las tareas a medias',                                dimension: 'C', reverse: true  },
  // ── Paso 18 ────────────────────────────────────────────────────────
  { id: 69,  text: 'Me pongo nervioso/a fácilmente',                          dimension: 'N', reverse: false },
  { id: 70,  text: 'Rara vez tengo pensamientos profundos',                   dimension: 'O', reverse: true  },
  { id: 71,  text: 'Encuentro las conversaciones sociales agotadoras',        dimension: 'E', reverse: true  },
  { id: 72,  text: 'No me preocupan los sentimientos de los demás',           dimension: 'A', reverse: true  },
  // ── Paso 19 ────────────────────────────────────────────────────────
  { id: 73,  text: 'Planifico con antelación',                                dimension: 'C', reverse: false },
  { id: 74,  text: 'Me siento inseguro/a con frecuencia',                     dimension: 'N', reverse: false },
  { id: 75,  text: 'Me gusta reflexionar sobre el significado de las cosas',  dimension: 'O', reverse: false },
  { id: 76,  text: 'Me expreso con facilidad',                                dimension: 'E', reverse: false },
  // ── Paso 20 ────────────────────────────────────────────────────────
  { id: 77,  text: 'Muestro empatía hacia los que sufren',                    dimension: 'A', reverse: false },
  { id: 78,  text: 'Trabajo duro para lograr mis metas',                      dimension: 'C', reverse: false },
  { id: 79,  text: 'Rara vez me siento ansioso/a',                            dimension: 'N', reverse: true  },
  { id: 80,  text: 'Me cuesta pensar de manera creativa',                     dimension: 'O', reverse: true  },
  // ── Paso 21 ────────────────────────────────────────────────────────
  { id: 81,  text: 'Prefiero trabajar en silencio',                           dimension: 'E', reverse: true  },
  { id: 82,  text: 'Creo que la gente tiene buenas intenciones',              dimension: 'A', reverse: false },
  { id: 83,  text: 'Actúo sin pensar primero',                                dimension: 'C', reverse: true  },
  { id: 84,  text: 'Reacciono de manera exagerada a los problemas',           dimension: 'N', reverse: false },
  // ── Paso 22 ────────────────────────────────────────────────────────
  { id: 85,  text: 'Disfruto de la música de diferentes culturas',            dimension: 'O', reverse: false },
  { id: 86,  text: 'Me gusta conocer gente nueva',                            dimension: 'E', reverse: false },
  { id: 87,  text: 'Soy difícil de llevar',                                   dimension: 'A', reverse: true  },
  { id: 88,  text: 'Soy eficiente en mi trabajo diario',                      dimension: 'C', reverse: false },
  // ── Paso 23 ────────────────────────────────────────────────────────
  { id: 89,  text: 'Me siento emocionalmente estable',                        dimension: 'N', reverse: true  },
  { id: 90,  text: 'Prefiero lo familiar a lo desconocido',                   dimension: 'O', reverse: true  },
  { id: 91,  text: 'Me siento incómodo/a en grupos grandes',                  dimension: 'E', reverse: true  },
  { id: 92,  text: 'Intento reconciliar los conflictos',                      dimension: 'A', reverse: false },
  // ── Paso 24 ────────────────────────────────────────────────────────
  { id: 93,  text: 'Priorizo mis tareas adecuadamente',                       dimension: 'C', reverse: false },
  { id: 94,  text: 'El estrés me afecta mucho',                               dimension: 'N', reverse: false },
  { id: 95,  text: 'Tengo un sentido estético desarrollado',                  dimension: 'O', reverse: false },
  { id: 96,  text: 'Soy animado/a en las conversaciones',                     dimension: 'E', reverse: false },
  // ── Paso 25 ────────────────────────────────────────────────────────
  { id: 97,  text: 'No simpatizo con los problemas ajenos',                   dimension: 'A', reverse: true  },
  { id: 98,  text: 'Pierdo el hilo de lo que estaba haciendo',                dimension: 'C', reverse: true  },
  { id: 99,  text: 'Soy difícil de perturbar',                                dimension: 'N', reverse: true  },
  { id: 100, text: 'Me resultan interesantes las ideas filosóficas',          dimension: 'O', reverse: false },
  // ── Paso 26 ────────────────────────────────────────────────────────
  { id: 101, text: 'Rara vez busco emociones fuertes',                        dimension: 'E', reverse: true  },
  { id: 102, text: 'Uso a los demás para mis propios fines',                  dimension: 'A', reverse: true  },
  { id: 103, text: 'Tiendo a posponer decisiones importantes',                dimension: 'C', reverse: true  },
  { id: 104, text: 'Mantengo el equilibrio emocional',                        dimension: 'N', reverse: true  },
  // ── Paso 27 ────────────────────────────────────────────────────────
  { id: 105, text: 'Me atrae explorar nuevas formas de hacer las cosas',      dimension: 'O', reverse: false },
  { id: 106, text: 'Me encanta la vida social activa',                        dimension: 'E', reverse: false },
  { id: 107, text: 'Escucho atentamente los problemas de los demás',          dimension: 'A', reverse: false },
  { id: 108, text: 'Me esfuerzo por cumplir los plazos',                      dimension: 'C', reverse: false },
  // ── Paso 28 ────────────────────────────────────────────────────────
  { id: 109, text: 'Me preocupo más de lo necesario',                         dimension: 'N', reverse: false },
  { id: 110, text: 'Raramente noto el aspecto emocional de las pinturas',     dimension: 'O', reverse: true  },
  { id: 111, text: 'Prefiero un círculo de amigos pequeño y cercano',         dimension: 'E', reverse: true  },
  { id: 112, text: 'Pienso en los demás antes de actuar',                     dimension: 'A', reverse: false },
  // ── Paso 29 ────────────────────────────────────────────────────────
  { id: 113, text: 'Mantengo mis áreas de trabajo ordenadas',                 dimension: 'C', reverse: false },
  { id: 114, text: 'A veces me siento desbordado/a por las emociones',        dimension: 'N', reverse: false },
  { id: 115, text: 'Disfruto debatiendo sobre ideas abstractas',              dimension: 'O', reverse: false },
  { id: 116, text: 'Me gusta ser el centro de atención',                      dimension: 'E', reverse: false },
  // ── Paso 30 ────────────────────────────────────────────────────────
  { id: 117, text: 'Me importa el bienestar de los animales y la naturaleza', dimension: 'A', reverse: false },
  { id: 118, text: 'Reviso mi trabajo para asegurarme de que sea correcto',   dimension: 'C', reverse: false },
  { id: 119, text: 'Rara vez me siento furioso/a',                            dimension: 'N', reverse: true  },
  { id: 120, text: 'Me gusta imaginar mundos alternativos y posibilidades',   dimension: 'O', reverse: false },
]

export interface PersonalityResult {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export function calculatePersonalityScores(answers: { [key: number]: number }): PersonalityResult {
  const scores = {
    O: [] as number[],
    C: [] as number[],
    E: [] as number[],
    A: [] as number[],
    N: [] as number[]
  }

  personalityQuestions.forEach(question => {
    const answer = answers[question.id]
    if (answer !== undefined) {
      const score = question.reverse ? (6 - answer) : answer
      scores[question.dimension].push(score)
    }
  })

  const calculateAverage = (arr: number[]) => {
    if (arr.length === 0) return 50
    const sum = arr.reduce((a, b) => a + b, 0)
    const avg = sum / arr.length
    return Math.round(((avg - 1) / 4) * 100)
  }

  return {
    openness: calculateAverage(scores.O),
    conscientiousness: calculateAverage(scores.C),
    extraversion: calculateAverage(scores.E),
    agreeableness: calculateAverage(scores.A),
    neuroticism: calculateAverage(scores.N)
  }
}

export function getPersonalityInterpretation(dimension: string, score: number): string {
  const interpretations: { [key: string]: { low: string, medium: string, high: string } } = {
    openness: {
      low: 'Prefieres lo práctico y familiar. Valoras la tradición y las rutinas establecidas.',
      medium: 'Equilibras la apertura a nuevas experiencias con preferencias establecidas.',
      high: 'Eres creativo/a, imaginativo/a y buscas nuevas experiencias. Te gusta explorar ideas abstractas.'
    },
    conscientiousness: {
      low: 'Eres más espontáneo/a y flexible. Prefieres adaptarte sobre planificar.',
      medium: 'Balanceas la organización con la espontaneidad según la situación.',
      high: 'Eres organizado/a, responsable y orientado/a a objetivos. Valoras la disciplina y el orden.'
    },
    extraversion: {
      low: 'Prefieres ambientes tranquilos y actividades introspectivas. Recargas energía en soledad.',
      medium: 'Disfrutas tanto de momentos sociales como de tiempo a solas.',
      high: 'Eres sociable, enérgico/a y disfrutas estar rodeado/a de gente. Te sientes vivo/a en situaciones sociales.'
    },
    agreeableness: {
      low: 'Eres más competitivo/a y directo/a. Priorizas la verdad sobre la armonía.',
      medium: 'Equilibras la cooperación con la asertividad según el contexto.',
      high: 'Eres empático/a, cooperativo/a y valoras las relaciones armoniosas. Te importa el bienestar de los demás.'
    },
    neuroticism: {
      low: 'Eres emocionalmente estable, calmado/a y manejas bien el estrés.',
      medium: 'Experimentas emociones normales sin extremos marcados.',
      high: 'Eres más sensible emocionalmente y tiendes a experimentar emociones intensas. Puedes beneficiarte de técnicas de manejo del estrés.'
    }
  }

  const levels = interpretations[dimension.toLowerCase()]
  if (!levels) return ''

  if (score < 40) return levels.low
  if (score < 60) return levels.medium
  return levels.high
}
