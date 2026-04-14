import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "leaflet/dist/leaflet.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "Social Mentor - Donation & Volunteer Platform",
  description:
    "Connect donors, volunteers, and NGOs. Track donations, measure impact, and make a difference.",
}

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(220 18% 10%)",
              border: "1px solid hsl(220 16% 16%)",
              color: "hsl(210 20% 95%)",
            },
          }}
        />
      </body>
    </html>
  )
}
