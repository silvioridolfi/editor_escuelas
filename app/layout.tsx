import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Encode_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const encodeSans = Encode_Sans({
  subsets: ["latin"],
  variable: "--font-encode-sans",
})

export const metadata: Metadata = {
  title: "Dashboard de Escuelas - Provincia de Buenos Aires",
  description: "Sistema de gestión de establecimientos educativos",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`${encodeSans.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
