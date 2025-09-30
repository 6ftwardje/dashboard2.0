import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ToastProvider'

export const metadata: Metadata = {
  title: 'Cryptoriez Dashboard - Crypto Trading Leerpad',
  description: 'Leer cryptocurrency trading met onze gestructureerde cursus. Van basis tot gevorderde strategieën.',
  keywords: 'cryptocurrency, trading, bitcoin, crypto, leerpad, cursus, educatie',
  authors: [{ name: 'Cryptoriez' }],
  creator: 'Cryptoriez',
  publisher: 'Cryptoriez',
  robots: 'index, follow',
  openGraph: {
    title: 'Cryptoriez Dashboard - Crypto Trading Leerpad',
    description: 'Leer cryptocurrency trading met onze gestructureerde cursus.',
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cryptoriez Dashboard - Crypto Trading Leerpad',
    description: 'Leer cryptocurrency trading met onze gestructureerde cursus.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f97316',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-dark-950 text-white font-sf-pro">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}