import "@/styles/globals.css"
import { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { FileSystemProvider } from "@/components/file-provider"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const fontSpace = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "bg-grayscale-000 font-sans antialiased",
            fontSpace.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <FileSystemProvider>{children}</FileSystemProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
