import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Text-Driven 2D Avatar Prototype',
  description: 'Technical research prototype for text-driven interactive avatar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
