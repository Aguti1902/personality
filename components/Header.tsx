'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa'
import LanguageSelector from './LanguageSelector'
import { useTranslations } from '@/hooks/useTranslations'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t, lang } = useTranslations()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    setIsLoggedIn(!!token)

    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown')) setIsProfileMenuOpen(false)
    }
    if (isProfileMenuOpen) document.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setIsLoggedIn(false)
    router.push(`/${lang}`)
  }

  if (!t) return null

  const navLinks = [
    { label: t.nav.home || 'Home', href: `/${lang}` },
    { label: t.nav.about || 'About', href: `/${lang}#como-funciona` },
    { label: t.nav.pricing || 'Pricing', href: `/${lang}#precios` },
    { label: t.nav.faq || 'FAQs', href: `/${lang}#faq` },
    { label: t.nav.contact || 'Contact us', href: `/${lang}/contacto` },
  ]

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-sm' : 'border-b border-gray-100'}`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center flex-shrink-0">
            <img src="/images/Logopersonality.png" alt="Personality Insight" className="h-9 w-auto" />
          </Link>

          {/* Nav links - desktop */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-[#FF852A] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side - desktop */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />

            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="w-7 h-7 bg-[#FF852A] rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-xs" />
                  </div>
                  <span>{t.nav.profile || 'Mi Perfil'}</span>
                  <FaChevronDown className="text-xs text-gray-400" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                    <Link href={`/${lang}/cuenta`} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition" onClick={() => setIsProfileMenuOpen(false)}>
                      {t.nav.myAccount || 'Mi Cuenta'}
                    </Link>
                    <Link href={`/${lang}/tests`} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition" onClick={() => setIsProfileMenuOpen(false)}>
                      {t.nav.myTests || 'Mis Tests'}
                    </Link>
                    <div className="h-px bg-gray-100 my-1 mx-4" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition flex items-center gap-2">
                      <FaSignOutAlt className="text-xs" />
                      {t.nav.logout || 'Cerrar Sesión'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={`/${lang}/login`} className="text-sm text-gray-600 hover:text-[#113240] font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all">
                  {t.nav.signIn || 'Sign in'}
                </Link>
                <Link href={`/${lang}/test`} className="bg-[#FF852A] hover:bg-[#e8731a] text-white font-bold py-2.5 px-5 rounded-lg transition-all duration-200 text-sm whitespace-nowrap shadow-md shadow-[#FF852A]/20">
                  {t.nav.startTest}
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-gray-500 hover:text-gray-700 p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-1 border-t border-gray-100 pt-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block py-2.5 px-2 text-sm text-gray-600 hover:text-[#FF852A] rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3 space-y-2">
              <div className="pb-2"><LanguageSelector /></div>
              {isLoggedIn ? (
                <>
                  <Link href={`/${lang}/cuenta`} className="block py-2.5 px-2 text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>{t.nav.myAccount || 'Mi Cuenta'}</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="w-full text-left py-2.5 px-2 text-sm text-red-400 flex items-center gap-2">
                    <FaSignOutAlt size={12} />{t.nav.logout || 'Cerrar Sesión'}
                  </button>
                </>
              ) : (
                <>
                  <Link href={`/${lang}/login`} className="block text-sm text-gray-600 py-2.5 px-2" onClick={() => setIsMenuOpen(false)}>{t.nav.signIn || 'Sign in'}</Link>
                  <Link href={`/${lang}/test`} className="block bg-[#FF852A] hover:bg-[#e8731a] text-white font-bold py-3 px-5 rounded-lg text-sm text-center" onClick={() => setIsMenuOpen(false)}>{t.nav.startTest}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
