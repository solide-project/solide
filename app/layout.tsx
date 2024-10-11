import { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { GoogleAnalytics } from '@next/third-parties/google'
import { SolideProviders } from "@/components/providers"
import { cn } from "@/lib/utils"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Solide | Solidity IDE",
    template: `%s - Solide`,
  },
  description: "Lightweight Solide IDE",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

const fontSpace = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-grayscale-000 font-sans antialiased",
          fontSpace.variable
        )}
      >
        <SolideProviders>{children}</SolideProviders>
      </body>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS || ""} />
    </html>
  )
}
