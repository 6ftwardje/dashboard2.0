import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cryptoriez Dashboard',
  description: 'Leerpad voor cryptocurrency trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-dark-900 text-white font-sf-pro">
        {children}
      </body>
    </html>
  )
}
