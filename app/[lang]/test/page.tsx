'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { personalityQuestions, calculatePersonalityScores } from '@/lib/personality-questions'
import { useTranslations } from '@/hooks/useTranslations'

type Phase = 'welcome' | 'loading' | 'test'

const QUESTIONS_PER_STEP = 4
const TOTAL_STEPS = personalityQuestions.length / QUESTIONS_PER_STEP // 30

/* ── Survey Illustration ──────────────────────────────── */
function SurveyIllustration() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-[#FFF3E6]" />
      <div className="relative z-10 w-28 h-32 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col p-3.5 gap-2.5">
        <div className="w-10 h-1.5 bg-orange-200 rounded-full mx-auto" />
        {[false, true, false, false].map((selected, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'border-[#FF852A]' : 'border-gray-300'}`}>
              {selected && <div className="w-2 h-2 rounded-full bg-[#FF852A]" />}
            </div>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full" />
          </div>
        ))}
        <div className="mt-auto w-full h-5 bg-[#113240] rounded-lg flex items-center justify-center">
          <div className="w-8 h-1.5 bg-white/60 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/* ── Sun Spinner ──────────────────────────────────────── */
function SunSpinner() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64"
      className="mx-auto mb-8 animate-spin" style={{ animationDuration: '2s' }}>
      <circle cx="32" cy="32" r="9" fill="#FF852A" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180
        return (
          <line key={i}
            x1={32 + 15 * Math.cos(angle)} y1={32 + 15 * Math.sin(angle)}
            x2={32 + 27 * Math.cos(angle)} y2={32 + 27 * Math.sin(angle)}
            stroke="#FF852A" strokeWidth="4.5" strokeLinecap="round"
            opacity={0.35 + (i / 8) * 0.65}
          />
        )
      })}
    </svg>
  )
}

/* ── Likert color palette ─────────────────────────────── */
const LC = [
  { bg: '#FFE4E6', sel: '#FCA5A5', border: '#FECDD3', selBorder: '#F87171' }, // rose
  { bg: '#FFF7ED', sel: '#FDBA74', border: '#FED7AA', selBorder: '#FB923C' }, // orange
  { bg: '#F3F4F6', sel: '#D1D5DB', border: '#E5E7EB', selBorder: '#9CA3AF' }, // gray
  { bg: '#ECFDF5', sel: '#6EE7B7', border: '#A7F3D0', selBorder: '#34D399' }, // emerald
  { bg: '#F0FDFA', sel: '#5EEAD4', border: '#99F6E4', selBorder: '#2DD4BF' }, // teal
]

/* ── Main ─────────────────────────────────────────────── */
export default function TestPage() {
  const router = useRouter()
  const { t, loading, lang } = useTranslations()

  const [phase, setPhase] = useState<Phase>('welcome')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [loadingProgress, setLoadingProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    setPhase('loading')
    setLoadingProgress(0)
    let p = 0
    intervalRef.current = setInterval(() => {
      p += 1.8
      setLoadingProgress(Math.min(p, 100))
      if (p >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setTimeout(() => setPhase('test'), 300)
      }
    }, 30)
  }

  const stepQuestions = personalityQuestions.slice(
    currentStep * QUESTIONS_PER_STEP,
    (currentStep + 1) * QUESTIONS_PER_STEP
  )
  const stepAnswered = stepQuestions.every(q => answers[q.id] !== undefined)
  const progressPct = Math.round((currentStep / TOTAL_STEPS) * 100)

  const handleAnswer = (qId: number, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }))
  }

  const handleContinue = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const personalityScores = calculatePersonalityScores(answers)
      localStorage.setItem('personalityScores', JSON.stringify(personalityScores))
      localStorage.setItem('personalityAnswers', JSON.stringify(answers))
      localStorage.removeItem('isPremiumTest')
      localStorage.setItem('testResults', JSON.stringify({
        answers, personalityScores, completedAt: new Date().toISOString(),
      }))
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          await fetch('/api/save-test-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ personalityScores, answers, testType: 'personality' }),
          })
        } catch {}
      }
      router.push(`/${lang}/analizando`)
    }
  }

  const likertLabels = [
    t?.test?.stronglyDisagree || 'Strongly Disagree',
    t?.test?.disagree || 'Disagree',
    t?.test?.neutral || 'Neutral',
    t?.test?.agree || 'Agree',
    t?.test?.stronglyAgree || 'Strongly Agree',
  ]

  /* ── Translation loading ──────────────────────────── */
  if (loading || !t) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#FF852A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  /* ── WELCOME ──────────────────────────────────────── */
  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header full-width */}
        <header className="bg-white border-b border-gray-100 py-3 px-6">
          <div className="max-w-5xl mx-auto">
            <Link href={`/${lang}`}>
              <img src="/images/Logopersonality.png" alt="Personality Insight" className="h-10 w-auto" />
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center py-12 px-6">
          <div className="w-full max-w-sm">
            <SurveyIllustration />
            <h1 className="text-[1.65rem] font-extrabold text-[#113240] text-center mb-6 leading-tight">
              {(t.test.instructionsTitle || 'Test guidelines').replace('ℹ️ ', '').replace(':', '')}
            </h1>
            <div className="space-y-3.5 mb-9">
              {[t.test.personalityInstruction1, t.test.personalityInstruction2].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleStart}>
              <button type="submit"
                className="w-full bg-[#113240] hover:bg-[#0d2730] text-white font-bold py-4 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg">
                {t.test.startButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  /* ── LOADING ──────────────────────────────────────── */
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <SunSpinner />
        <div className="w-72 mb-5">
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-75"
              style={{ width: `${loadingProgress}%`, backgroundColor: '#22C55E' }} />
          </div>
        </div>
        <p className="text-[0.95rem] font-medium text-gray-700 text-center">
          {t.test.preparingTest || 'Your test is being prepared...'}
        </p>
      </div>
    )
  }

  /* ── TEST ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F6F6F6]">

      {/* Sticky header: logo + progress */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
          <Link href={`/${lang}`} className="flex-shrink-0">
            <img src="/images/Logopersonality.png" alt="Personality Insight" className="h-9 w-auto" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-400">{progressPct} %</span>
              <span className="text-xs text-gray-400">
                {t.test.question || 'Step'} {currentStep + 1} / {TOTAL_STEPS}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, backgroundColor: '#22C55E' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Instruction + Likert legend (centered) */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-5 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-5">
            {t.test.likertQuestion}
          </p>
          {/* Centered circles */}
          <div className="flex items-start justify-center gap-8 sm:gap-16 md:gap-20">
            {LC.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5" style={{ minWidth: 48 }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2"
                  style={{ backgroundColor: c.bg, borderColor: c.border }} />
                <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium leading-tight text-center max-w-[50px]">
                  {likertLabels[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        {stepQuestions.map((q) => {
          const selected = answers[q.id]
          return (
            <div key={q.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 text-center transition-all hover:border-gray-200">
              <p className="text-sm sm:text-[0.95rem] text-gray-800 font-medium leading-relaxed mb-5">
                {q.text}
              </p>
              <div className="flex items-center justify-center gap-8 sm:gap-16 md:gap-20">
                {LC.map((c, i) => {
                  const val = i + 1
                  const isSel = selected === val
                  return (
                    <button key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        border: `2px solid ${isSel ? c.selBorder : c.border}`,
                        backgroundColor: isSel ? c.sel : c.bg,
                        transform: isSel ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      {isSel && (
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"
                          style={{ color: i >= 3 ? '#059669' : i === 2 ? '#6B7280' : '#9A3412' }}>
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 mt-2">
        {!stepAnswered && (
          <p className="text-center text-xs text-gray-400 mb-3">
            {t.test.selectOption || 'All questions must be answered before you continue.'}
          </p>
        )}
        <button
          onClick={handleContinue}
          disabled={!stepAnswered}
          className={`w-full font-bold py-4 rounded-xl text-sm transition-all ${
            stepAnswered
              ? 'bg-[#113240] hover:bg-[#0d2730] text-white shadow-md hover:shadow-lg cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentStep < TOTAL_STEPS - 1
            ? (t.test.next || 'Continue')
            : (t.test.getResults || 'See Results')}
        </button>
      </div>
    </div>
  )
}
