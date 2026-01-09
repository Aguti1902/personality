import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
   title: 'Personality Insight - Discover Your Personality | Big Five Test',
  description: 'Discover your true personality with Personality Insight\'s scientifically validated Big Five (OCEAN) assessment. Get detailed, personalized results in minutes.',
  keywords: 'personality test, big five test, OCEAN personality, personality assessment, trait analysis, personality insights, psychological evaluation',
  icons: {
    icon: '/images/Isotipopersonality.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/Isotipopersonality.png" type="image/png" />
        
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GT-NGM8ZF3V"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GT-NGM8ZF3V');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
