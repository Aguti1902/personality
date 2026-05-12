'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

interface MinimalHeaderProps {
  email?: string | null
}

export default function MinimalHeader({ email }: MinimalHeaderProps) {
  const params = useParams()
  const lang = params.lang as string || 'es'

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link href={`/${lang}`} className="flex items-center">
            <img
              src="/images/Logopersonality.png"
              alt="Personality Insight"
              className="h-7 w-auto"
            />
          </Link>

          {email && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 text-xs text-gray-500">
              <span>{email}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
