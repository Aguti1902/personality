'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

/* ─── CSS Illustrations ───────────────────────────────────── */

function IllustrationBrain() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="absolute w-28 h-28 rounded-full border-2 border-[#FF852A]/20 animate-spin-slow" />
      <div className="absolute w-20 h-20 rounded-full border-2 border-dashed border-[#113240]/20 animate-spin-reverse" />
      <div className="relative w-14 h-14 bg-[#FF852A] rounded-full animate-pulse-ring" style={{ boxShadow: '0 0 0 0 rgba(255,133,42,0.4)' }} />
      <div className="absolute w-14 h-14 bg-[#FF852A] rounded-full flex items-center justify-center z-10">
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div key={i} className="absolute w-3 h-3 bg-[#113240] rounded-full animate-blink"
          style={{ transform: `rotate(${deg}deg) translateX(48px)`, animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  )
}

function IllustrationOrbit() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="absolute w-8 h-8 bg-[#113240] rounded-full z-10 flex items-center justify-center">
        <div className="w-3 h-3 bg-[#FF852A] rounded-full animate-pulse" />
      </div>
      <div className="absolute w-24 h-24 rounded-full border border-[#FF852A]/30">
        <div className="w-4 h-4 bg-[#FF852A] rounded-full animate-orbit" style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-8px', marginLeft: '-8px' }} />
      </div>
      <div className="absolute w-16 h-16 rounded-full border border-[#113240]/30">
        <div className="w-3 h-3 bg-[#113240] rounded-full animate-orbit-reverse" style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-6px', marginLeft: '-6px' }} />
      </div>
    </div>
  )
}

function IllustrationBars() {
  const bars = [60, 85, 45, 90, 70]
  return (
    <div className="relative w-28 h-28 flex items-end justify-center gap-2 pb-2">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className="w-4 rounded-t-md transition-all duration-1000"
            style={{
              height: `${(h / 100) * 88}px`,
              backgroundColor: i % 2 === 0 ? '#FF852A' : '#113240',
              animationDelay: `${i * 0.15}s`,
              opacity: 0.7 + i * 0.06
            }}
          />
        </div>
      ))}
    </div>
  )
}

function IllustrationWave() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center overflow-hidden rounded-2xl">
      <div className="flex items-end gap-1.5 h-16">
        {[40, 70, 55, 90, 60, 80, 50, 75, 45, 85].map((h, i) => (
          <div
            key={i}
            className="w-2 rounded-full"
            style={{
              height: `${h}%`,
              backgroundColor: i % 2 === 0 ? '#FF852A' : '#113240',
              animation: `wave 1.${i % 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function IllustrationBlob({ color = '#FF852A' }: { color?: string }) {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div
        className="w-20 h-20 animate-blob opacity-60"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute w-14 h-14 animate-blob opacity-80"
        style={{ backgroundColor: color, animationDelay: '2s', animationDirection: 'reverse' }}
      />
      <div className="absolute w-6 h-6 rounded-full bg-white opacity-90" />
    </div>
  )
}

function IllustrationNetwork() {
  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 112 112" className="w-full h-full">
        <line x1="56" y1="56" x2="20" y2="20" stroke="#FF852A" strokeWidth="1.5" strokeDasharray="3,2" className="animate-pulse" />
        <line x1="56" y1="56" x2="92" y2="20" stroke="#113240" strokeWidth="1.5" strokeDasharray="3,2" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        <line x1="56" y1="56" x2="15" y2="70" stroke="#FF852A" strokeWidth="1.5" strokeDasharray="3,2" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
        <line x1="56" y1="56" x2="97" y2="70" stroke="#113240" strokeWidth="1.5" strokeDasharray="3,2" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
        <line x1="56" y1="56" x2="56" y2="95" stroke="#FF852A" strokeWidth="1.5" strokeDasharray="3,2" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
        <circle cx="56" cy="56" r="10" fill="#113240" />
        <circle cx="20" cy="20" r="7" fill="#FF852A" className="animate-pulse" />
        <circle cx="92" cy="20" r="7" fill="#FF852A" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
        <circle cx="15" cy="70" r="7" fill="#FF852A" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
        <circle cx="97" cy="70" r="7" fill="#FF852A" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
        <circle cx="56" cy="95" r="7" fill="#FF852A" className="animate-pulse" style={{ animationDelay: '1.6s' }} />
        <circle cx="56" cy="56" r="5" fill="white" />
      </svg>
    </div>
  )
}

function IllustrationRadar() {
  const size = 56
  const cx = 56; const cy = 56
  const points = 5
  const data = [78, 85, 62, 91, 55]
  const maxR = 46

  const getPoint = (index: number, r: number) => {
    const angle = (Math.PI * 2 * index) / points - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }
  const dataPath = data.map((v, i) => {
    const p = getPoint(i, (v / 100) * maxR)
    return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
  }).join(' ') + 'Z'

  return (
    <div className="w-28 h-28">
      <svg viewBox="0 0 112 112" className="w-full h-full">
        {[1, 0.6, 0.3].map((scale, i) => (
          <polygon
            key={i}
            points={Array.from({ length: points }, (_, idx) => {
              const p = getPoint(idx, maxR * scale)
              return `${p.x},${p.y}`
            }).join(' ')}
            fill="none"
            stroke="#113240"
            strokeWidth="0.8"
            opacity={0.2 + i * 0.1}
          />
        ))}
        {Array.from({ length: points }, (_, i) => {
          const p = getPoint(i, maxR)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#113240" strokeWidth="0.8" opacity="0.2" />
        })}
        <path d={dataPath} fill="#FF852A" fillOpacity="0.25" stroke="#FF852A" strokeWidth="2" strokeLinejoin="round" className="animate-pulse" style={{ animationDuration: '3s' }} />
        {data.map((v, i) => {
          const p = getPoint(i, (v / 100) * maxR)
          return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FF852A" />
        })}
      </svg>
    </div>
  )
}

/* ─── Counter animation ───────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const duration = 1800
        const step = (timestamp: number) => {
          if (!start) start = timestamp
          const progress = Math.min((timestamp - start) / duration, 1)
          setCount(Math.floor(progress * to))
          if (progress < 1) requestAnimationFrame(step)
          else setCount(to)
        }
        requestAnimationFrame(step)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to])

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>
}

/* ─── Main component ──────────────────────────────────────── */
export default function Home() {
  const { t, loading, lang } = useTranslations()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!t?.testimonials?.reviews?.length) return
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => {
        const total = t.testimonials.reviews.length
        const step = isMobile ? 1 : 3
        const max = isMobile ? total - 1 : Math.max(0, total - 3)
        return prev >= max ? 0 : Math.min(max, prev + step)
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [t?.testimonials?.reviews, isMobile])

  if (loading || !t) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-7 h-7 border-2 border-[#FF852A] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    )
  }

  const currentLang = lang || 'es'

  return (
    <>
      <Header />
      <main>

        {/* ─── HERO ──────────────────────────────────────────── */}
        <section className="bg-[#FBF6F1] py-16 md:py-24 overflow-hidden relative">
          {/* BG decorations */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#FF852A]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-[#113240]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              {/* Left */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-[#FF852A]/10 text-[#FF852A] text-xs font-semibold px-4 py-1.5 rounded-full mb-7 border border-[#FF852A]/20">
                  <span className="w-1.5 h-1.5 bg-[#FF852A] rounded-full animate-pulse" />
                  Big Five · OCEAN Model · Scientifically Validated
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-[#113240] leading-[1.1] tracking-tight mb-5">
                  {t.hero.title}{' '}
                  <span className="text-[#FF852A]">{t.hero.titleHighlight}</span>
                </h1>

                <p className="text-[1.05rem] text-gray-500 mb-9 leading-relaxed max-w-lg">
                  {t.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Link href={`/${currentLang}/test`} className="inline-flex items-center justify-center gap-2 bg-[#FF852A] hover:bg-[#e8731a] text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-base shadow-lg shadow-[#FF852A]/25 hover:shadow-[#FF852A]/40 hover:-translate-y-0.5">
                    {t.hero.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                  <a href={`/${currentLang}#como-funciona`} className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-[#113240] font-semibold py-4 px-8 rounded-xl border border-gray-200 transition-all duration-200 text-base hover:border-gray-300">
                    {t.hero.ctaSecondary}
                  </a>
                </div>

                <p className="text-xs text-gray-400">
                  {t.hero.termsAgree}{' '}
                  <Link href={`/${currentLang}/terminos`} className="underline underline-offset-2 hover:text-gray-600 transition-colors">{t.hero.termsLink}</Link>
                </p>

                <div className="flex flex-wrap gap-5 mt-8 pt-8 border-t border-gray-200">
                  {[t.hero.secure, t.hero.validated, t.hero.instant].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-4 h-4 text-[#FF852A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — phone mockup */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-60 md:w-72">
                  {/* Floating cards */}
                  <div className="absolute -left-12 top-10 bg-white rounded-2xl shadow-xl p-3 animate-float z-20 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#FF852A] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-800">Test completed</p>
                        <p className="text-[9px] text-gray-400">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-10 bottom-20 bg-white rounded-2xl shadow-xl p-3 animate-float-delay z-20 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#113240] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-800">Openness: 78%</p>
                        <p className="text-[9px] text-gray-400">Top trait</p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-[#113240] rounded-[2.8rem] p-3.5 shadow-[0_32px_80px_rgba(17,50,64,0.35)]">
                    <div className="bg-white rounded-[2.2rem] overflow-hidden" style={{ aspectRatio: '9/19' }}>
                      <div className="h-full bg-gradient-to-b from-[#FBF6F1] to-white flex flex-col px-5 pt-8 pb-5">
                        <div className="mb-4">
                          <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest mb-0.5">Your results</p>
                          <p className="text-sm font-extrabold text-[#113240]">Personality Report</p>
                        </div>
                        <div className="flex items-center gap-3 mb-4 bg-[#113240] rounded-2xl p-3">
                          <div className="w-11 h-11 rounded-full border-[3px] border-[#FF852A] flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-black text-white">78%</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white">Openness</p>
                            <p className="text-[8px] text-gray-400">Dominant trait</p>
                          </div>
                        </div>
                        <div className="space-y-2 flex-1">
                          {[
                            { label: 'Openness', pct: 78, c: '#FF852A' },
                            { label: 'Conscientiousness', pct: 85, c: '#113240' },
                            { label: 'Extraversion', pct: 62, c: '#FF852A' },
                            { label: 'Agreeableness', pct: 91, c: '#113240' },
                            { label: 'Neuroticism', pct: 44, c: '#FF852A' },
                          ].map((trait) => (
                            <div key={trait.label}>
                              <div className="flex justify-between mb-0.5">
                                <span className="text-[8px] text-gray-500 font-medium">{trait.label}</span>
                                <span className="text-[8px] font-bold" style={{ color: trait.c }}>{trait.pct}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full">
                                <div className="h-full rounded-full" style={{ width: `${trait.pct}%`, backgroundColor: trait.c }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 bg-[#FF852A] rounded-xl py-2 text-center">
                          <span className="text-[9px] font-bold text-white">View full report →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 w-14 h-3 bg-[#113240] rounded-full z-10" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-16 bg-[#FF852A]/20 rounded-full blur-3xl -z-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MARQUEE TICKER ─────────────────────────────────── */}
        <div className="bg-[#113240] py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-0">
            {Array(3).fill(['Scientifically validated', '100,000+ tests completed', 'Big Five OCEAN model', '9 languages supported', 'Instant results', 'Privacy first', 'Created by experts', 'Free to take']).flat().map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-xs font-semibold text-white/70 px-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF852A] flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── BENEFITS STRIP ─────────────────────────────────── */}
        <section className="bg-white py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-gray-100">

              {/* 1 */}
              <div className="flex items-start gap-4 lg:pr-8">
                <div className="w-12 h-12 rounded-2xl bg-[#FF852A]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#FF852A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#113240] text-sm mb-1">{t.hero.questions}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.hero.questionsDesc}</p>
                </div>
              </div>

              {/* 2 */}
              <div className="flex items-start gap-4 lg:px-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(17,50,64,0.07)' }}>
                  <svg className="w-6 h-6 text-[#113240]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#113240] text-sm mb-1">{t.hero.analysis}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.hero.analysisDesc}</p>
                </div>
              </div>

              {/* 3 */}
              <div className="flex items-start gap-4 lg:px-8">
                <div className="w-12 h-12 rounded-2xl bg-[#FF852A]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#FF852A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#113240] text-sm mb-1">{t.hero.certificate || 'Certificado incluido'}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Comparte tus resultados con tus amigos</p>
                </div>
              </div>

              {/* 4 */}
              <div className="flex items-start gap-4 lg:pl-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(17,50,64,0.07)' }}>
                  <svg className="w-6 h-6 text-[#113240]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#113240] text-sm mb-1">{t.hero.secure || '100% Seguro'}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Privacidad garantizada de todos tus datos</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── ANIMATED STATS ─────────────────────────────────── */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-12">
              Trusted by thousands of users worldwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  to: 100000, suffix: '+', label: 'Tests completed',
                  iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                },
                {
                  to: 30, suffix: '', label: 'Questions',
                  iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                },
                {
                  to: 5, suffix: '', label: 'OCEAN dimensions',
                  iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                },
                {
                  to: 92, suffix: '%', label: 'Report satisfaction',
                  iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
                },
              ].map((s, i) => (
                <div key={i} className="bg-[#F7F8FA] rounded-2xl p-6 text-center hover:shadow-md transition-shadow border border-gray-100 group">
                  <div className="w-12 h-12 bg-[#113240] group-hover:bg-[#FF852A] rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.iconPath} />
                    </svg>
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-[#113240]">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ───────────────────────────────────── */}
        <section id="como-funciona" className="bg-[#F7F8FA] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#113240] mb-3">{t.howItWorks.title}</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">{t.howItWorks.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {[
                { num: '1', title: t.howItWorks.step1, desc: t.howItWorks.step1Desc, illustration: <IllustrationBrain /> },
                { num: '2', title: t.howItWorks.step2, desc: t.howItWorks.step2Desc, illustration: <IllustrationRadar /> },
                { num: '3', title: t.howItWorks.step3, desc: t.howItWorks.step3Desc, illustration: <IllustrationBars /> },
              ].map((step) => (
                <div key={step.num} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-6xl font-black text-[#FF852A]/15 leading-none">{step.num}</div>
                    <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                      {step.illustration}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#113240] mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href={`/${currentLang}/test`} className="inline-flex items-center gap-2 bg-[#FF852A] hover:bg-[#e8731a] text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-base shadow-md shadow-[#FF852A]/20 hover:-translate-y-0.5">
                {t.hero.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── PERSONALITY ARCHETYPES ─────────────────────────── */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#113240] mb-3">Discover your personality type</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">Each person has a unique combination of the five traits. Here are some common profiles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  name: 'The Visionary',
                  trait: 'High Openness',
                  pct: '20%',
                  desc: 'Creative, curious and open to new experiences. Natural innovators who love ideas.',
                  illustration: <IllustrationOrbit />,
                  bg: 'bg-orange-50',
                  accent: 'text-[#FF852A]',
                  border: 'border-orange-100',
                },
                {
                  name: 'The Achiever',
                  trait: 'High Conscientiousness',
                  pct: '25%',
                  desc: 'Organised, disciplined and goal-oriented. They get things done with precision.',
                  illustration: <IllustrationBars />,
                  bg: 'bg-blue-50',
                  accent: 'text-[#113240]',
                  border: 'border-blue-100',
                },
                {
                  name: 'The Connector',
                  trait: 'High Extraversion',
                  pct: '30%',
                  desc: 'Energetic, sociable and enthusiastic. They thrive in groups and love collaboration.',
                  illustration: <IllustrationNetwork />,
                  bg: 'bg-orange-50',
                  accent: 'text-[#FF852A]',
                  border: 'border-orange-100',
                },
                {
                  name: 'The Analyst',
                  trait: 'High Openness + C',
                  pct: '25%',
                  desc: 'Deep thinkers who combine creativity with structure. Natural problem solvers.',
                  illustration: <IllustrationRadar />,
                  bg: 'bg-blue-50',
                  accent: 'text-[#113240]',
                  border: 'border-blue-100',
                },
              ].map((type, i) => (
                <div key={i} className={`${type.bg} ${type.border} border rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group cursor-default`}>
                  <div className="flex justify-center mb-4">{type.illustration}</div>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${type.accent}`}>{type.trait}</div>
                  <h3 className="text-lg font-extrabold text-[#113240] mb-2">{type.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{type.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">~{type.pct} of people</span>
                    <Link href={`/${currentLang}/test`} className={`text-xs font-bold ${type.accent} underline underline-offset-2 hover:opacity-70 transition-opacity`}>
                      Take test →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LIFE APPLICATIONS ──────────────────────────────── */}
        <section className="bg-[#F7F8FA] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#113240] mb-3">Where your results help you</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">Understanding your personality unlocks improvements across every area of life.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: 'Career & Work',
                  desc: 'Discover which roles and environments bring out the best in you based on your traits.',
                  illustration: <IllustrationBars />,
                  color: '#FF852A',
                },
                {
                  title: 'Relationships',
                  desc: 'Understand your communication style and how to connect better with others.',
                  illustration: <IllustrationNetwork />,
                  color: '#113240',
                },
                {
                  title: 'Mental Wellbeing',
                  desc: 'Identify emotional patterns and learn healthy coping strategies for your type.',
                  illustration: <IllustrationWave />,
                  color: '#FF852A',
                },
                {
                  title: 'Leadership',
                  desc: 'Discover your natural leadership style and how to inspire your team.',
                  illustration: <IllustrationOrbit />,
                  color: '#113240',
                },
                {
                  title: 'Personal Growth',
                  desc: 'Set meaningful goals aligned with your personality for lasting change.',
                  illustration: <IllustrationBrain />,
                  color: '#FF852A',
                },
                {
                  title: 'Self-awareness',
                  desc: 'Get a clear and honest picture of your strengths, blind spots, and potential.',
                  illustration: <IllustrationRadar />,
                  color: '#113240',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5 flex gap-5 items-start group">
                  <div className="flex-shrink-0 group-hover:scale-105 transition-transform">
                    {item.illustration}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-[#113240] text-base mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHAT YOU RECEIVE ───────────────────────────────── */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#113240] mb-3">{t.features.title}</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">{t.features.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-3">
              {[
                {
                  title: t.features.validated,
                  desc: t.features.validatedDesc,
                  iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                },
                {
                  title: t.features.analysis,
                  desc: t.features.analysisDesc,
                  iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                },
                {
                  title: t.features.users,
                  desc: t.features.usersDesc,
                  iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                },
                {
                  title: t.features.certificate,
                  desc: t.features.certificateDesc,
                  iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
                },
                {
                  title: t.features.instant,
                  desc: t.features.instantDesc,
                  iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
                },
                {
                  title: t.features.dailyChallenges,
                  desc: t.features.dailyChallengesDesc,
                  iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                },
                {
                  title: t.features.careerMatch,
                  desc: t.features.careerMatchDesc,
                  iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-[#113240] group-hover:bg-[#FF852A] rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.iconPath} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#113240] text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── OCEAN DIMENSIONS ───────────────────────────────── */}
        <section className="bg-[#113240] py-20 md:py-28 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF852A]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">{t.ocean?.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{t.ocean?.subtitle}</p>
                <Link href={`/${currentLang}/test`} className="inline-flex items-center gap-2 bg-[#FF852A] hover:bg-[#e8731a] text-white font-bold py-3.5 px-7 rounded-xl transition-all text-sm shadow-lg shadow-[#FF852A]/25">
                  {t.ocean?.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { letter: 'O', name: t.ocean?.openness, desc: t.ocean?.opennessDesc, pct: 78, odd: true },
                  { letter: 'C', name: t.ocean?.conscientiousness, desc: t.ocean?.conscientiousnessDesc, pct: 65, odd: false },
                  { letter: 'E', name: t.ocean?.extraversion, desc: t.ocean?.extraversionDesc, pct: 72, odd: true },
                  { letter: 'A', name: t.ocean?.agreeableness, desc: t.ocean?.agreeablenessDesc, pct: 85, odd: false },
                  { letter: 'N', name: t.ocean?.neuroticism, desc: t.ocean?.neuroticismDesc, pct: 50, odd: true },
                ].map((dim) => (
                  <div key={dim.letter} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${dim.odd ? 'bg-[#FF852A]' : 'bg-white/20'}`}>
                      {dim.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-bold text-white">{dim.name}</span>
                        <span className="text-xs text-[#FF852A] font-bold ml-2">{t.ocean?.avg} {dim.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full">
                        <div className={`h-full rounded-full ${dim.odd ? 'bg-[#FF852A]' : 'bg-white/50'}`} style={{ width: `${dim.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ───────────────────────────────────── */}
        <section id="testimonios" className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">

            {/* Header row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-14">
              <div>
                <p className="text-xs text-[#FF852A] font-bold uppercase tracking-widest mb-2">Verified reviews</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#113240]">{t.testimonials.title}</h2>
              </div>
              {/* Rating summary */}
              <div className="flex items-center gap-5 bg-[#F7F8FA] border border-gray-100 rounded-2xl px-6 py-4 flex-shrink-0">
                <div>
                  <div className="text-4xl font-black text-[#113240] leading-none">4.9</div>
                  <div className="text-xs text-gray-400 mt-0.5">out of 5</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className="w-5 h-5 text-[#FF852A]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">{t?.testimonials?.reviews?.length || 0}+ reviews</div>
                </div>
              </div>
            </div>

            {/* Desktop: static 3-col grid */}
            <div className="hidden md:grid grid-cols-3 gap-5">
              {t?.testimonials?.reviews?.slice(0, 6).map((review: any, i: number) => {
                const isDark = i === 0
                const isOrange = i === 3
                const cardBg = isDark ? 'bg-[#113240]' : isOrange ? 'bg-[#FF852A]' : 'bg-[#F7F8FA] border border-gray-100'
                const textMain = isDark || isOrange ? 'text-white' : 'text-[#113240]'
                const textSub = isDark || isOrange ? 'text-white/75' : 'text-gray-500'
                const starColor = isDark || isOrange ? 'text-white' : 'text-[#FF852A]'
                const avatarBg = isDark ? 'bg-[#FF852A]' : isOrange ? 'bg-white' : 'bg-[#113240]'
                const avatarText = isOrange ? 'text-[#FF852A]' : 'text-white'

                return (
                  <div key={i} className={`${cardBg} rounded-2xl p-7 flex flex-col hover:scale-[1.01] transition-transform`}>
                    {/* Quote mark */}
                    <svg className={`w-8 h-8 mb-4 opacity-30 ${isDark || isOrange ? 'text-white' : 'text-[#113240]'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className={`w-4 h-4 ${starColor}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    {/* Text */}
                    <p className={`text-sm leading-relaxed flex-1 mb-6 ${textSub}`}>
                      &ldquo;{review.text}&rdquo;
                    </p>
                    {/* Author */}
                    <div className={`flex items-center gap-3 pt-5 border-t ${isDark ? 'border-white/10' : isOrange ? 'border-white/20' : 'border-gray-200'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${avatarBg} ${avatarText}`}>
                        {review.initials}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${textMain}`}>{review.name}</p>
                        <div className={`flex items-center gap-1 text-xs ${isDark || isOrange ? 'text-white/60' : 'text-gray-400'}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Verified user
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile: carousel */}
            <div className="md:hidden overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out gap-4"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {t?.testimonials?.reviews?.map((review: any, i: number) => (
                  <div key={i} className="w-full flex-shrink-0">
                    <div className="bg-[#F7F8FA] border border-gray-100 rounded-2xl p-6 h-full">
                      <div className="flex gap-0.5 mb-3">
                        {[1,2,3,4,5].map((s) => (
                          <svg key={s} className="w-4 h-4 text-[#FF852A]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">&ldquo;{review.text}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#113240] rounded-full flex items-center justify-center text-white text-xs font-bold">{review.initials}</div>
                        <span className="text-sm font-semibold text-[#113240]">{review.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {t?.testimonials?.reviews?.map((_: any, i: number) => (
                  <button key={i} onClick={() => setCurrentTestimonial(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentTestimonial === i ? 'w-8 bg-[#FF852A]' : 'w-2 bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ─── PRICING ────────────────────────────────────────── */}
        <section id="precios" className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#113240] mb-3">{t.pricing.title}</h2>
              <p className="text-gray-400 text-sm">{t.pricing.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="border-2 border-gray-200 rounded-2xl p-8 flex flex-col hover:border-[#FF852A]/30 transition-colors">
                <div className="mb-8">
                  <h3 className="font-bold text-[#113240] text-lg mb-1">{t.pricing?.quincenal?.title}</h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-5xl font-black text-[#113240]">€{t.pricing?.quincenal?.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{t.pricing?.quincenal?.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {t.pricing?.quincenal?.features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-[#FF852A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${lang}/test`} className="block text-center border-2 border-[#113240] text-[#113240] hover:bg-[#113240] hover:text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200">
                  {t.pricing?.button}
                </Link>
              </div>

              <div className="bg-[#113240] rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-[#113240]/20">
                {t.pricing?.mensual?.badge && (
                  <div className="absolute top-5 right-5 bg-[#FF852A] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">{t.pricing.mensual.badge}</div>
                )}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF852A]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="mb-8 relative">
                  <h3 className="font-bold text-white text-lg mb-1">{t.pricing?.mensual?.title}</h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-5xl font-black text-white">€{t.pricing?.mensual?.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{t.pricing?.mensual?.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8 relative">
                  {t.pricing?.mensual?.features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-[#FF852A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${lang}/test`} className="relative block text-center bg-[#FF852A] hover:bg-[#e8731a] text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#FF852A]/30">
                  {t.pricing?.button}
                </Link>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">{t.pricing?.note}</p>
          </div>
        </section>

        {/* ─── FAQ ────────────────────────────────────────────── */}
        <section id="faq" className="bg-[#F7F8FA] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#113240] mb-3">{t.faq.title}</h2>
              <p className="text-gray-400 text-sm">{t.faq.subtitle}</p>
            </div>

            <div className="max-w-2xl mx-auto divide-y divide-gray-200">
              {[
                { q: t.faq.q1, a: t.faq.a1 },
                { q: t.faq.q2, a: t.faq.a2 },
                { q: t.faq.q3, a: t.faq.a3 },
                { q: t.faq.q4, a: t.faq.a4 },
                { q: t.faq.q5, a: t.faq.a5 },
                { q: t.faq.q6, a: t.faq.a6 },
              ].map((item, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full py-5 flex justify-between items-center text-left group">
                    <span className="text-sm font-semibold text-[#113240] pr-6 group-hover:text-[#FF852A] transition-colors">{item.q}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-200 ${openFaq === i ? 'bg-[#FF852A] border-[#FF852A]' : 'border-gray-300 group-hover:border-[#FF852A]'}`}>
                      <svg className={`w-3 h-3 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="pb-5"><p className="text-sm text-gray-500 leading-relaxed">{item.a}</p></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA FINAL ──────────────────────────────────────── */}
        <section className="bg-[#113240] py-20 md:py-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF852A]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/3 rounded-full blur-3xl pointer-events-none" />
          {/* Animated decoration */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
            <IllustrationNetwork />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center relative">
            <div className="inline-flex items-center gap-2 bg-[#FF852A]/15 text-[#FF852A] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-[#FF852A]/20">
              <span className="w-1.5 h-1.5 bg-[#FF852A] rounded-full animate-pulse" />
              Free · 5 minutes · Instant results
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">{t.cta.title}</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto text-base leading-relaxed">{t.cta.subtitle}</p>
            <Link href={`/${currentLang}/test`} className="inline-flex items-center gap-3 bg-[#FF852A] hover:bg-[#e8731a] text-white font-bold py-4 px-10 rounded-xl transition-all duration-200 text-base shadow-2xl shadow-[#FF852A]/30 hover:shadow-[#FF852A]/50 hover:-translate-y-0.5">
              {t.cta.button}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <p className="mt-5 text-xs text-gray-500">{t.cta.details}</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
