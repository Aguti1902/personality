'use client'

import Link from 'next/link'
import { FaInstagram, FaTwitter } from 'react-icons/fa'
import { useTranslations } from '@/hooks/useTranslations'

export default function Footer() {
  const { t, lang } = useTranslations()

  if (!t) return null

  return (
    <footer className="bg-[#0f1923] text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <img
              src="/images/Logopersonality.png"
              alt="Personality Insight"
              className="h-7 w-auto mb-5 brightness-0 invert"
            />
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center hover:border-[#FF852A] hover:text-[#FF852A] transition-all"
              >
                <FaTwitter size={13} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center hover:border-[#FF852A] hover:text-[#FF852A] transition-all"
              >
                <FaInstagram size={13} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-white text-xs font-semibold mb-5 uppercase tracking-widest">
              {t.footer.links}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href={`/${lang}`} className="hover:text-white transition-colors">
                  {t.footer.home}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/test`} className="hover:text-white transition-colors">
                  {t.footer.startTest}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contacto`} className="hover:text-white transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/login`} className="hover:text-white transition-colors">
                  {t.footer.login || 'Iniciar Sesión'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/cancelar-suscripcion`}
                  className="text-red-400/60 hover:text-red-400 transition-colors"
                >
                  {t.footer.cancelPlan}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white text-xs font-semibold mb-5 uppercase tracking-widest">
              {t.footer.legal}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href={`/${lang}/terminos`} className="hover:text-white transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/privacidad`} className="hover:text-white transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/reembolso`} className="hover:text-white transition-colors">
                  {t.footer.refund}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/60 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Personality Insight. {t.footer.allRightsReserved}.</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF852A]" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
