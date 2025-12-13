import type React from "react"
import type { Metadata } from "next"
import { Crimson_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Personal Notebook",
  description: "A space for writing, notes, and reflections",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${crimsonPro.variable} font-serif`}>
        <header className="border-b border-foreground/10 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <Navigation />
        </header>
        <main className="max-w-[640px] mx-auto px-6 py-12 min-h-[calc(100vh-80px)]">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
