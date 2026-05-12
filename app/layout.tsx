import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AppProvider } from '@/contexts/AppContext'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GreenBrain',
  description: 'AI 탄소 인식 챌린지 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AppProvider>
      </body>
    </html>
  )
}
