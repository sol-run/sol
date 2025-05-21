import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { ThemeProvider } from "next-themes"
import { AppLayout } from "@/components/AppLayout"
import { ScrollToTop } from "@/components/scroll-to-top"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sol.Run - Digital Products Marketplace on Solana",
  description: "Sell and buy digital products with affiliate programs powered by Solana blockchain",
    generator: 'v0.dev'
}

// Add a key to force re-render of the entire application when needed
// This can help with persistent rendering issues
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppLayout>
            <ScrollToTop />
            <Header />
            <div key="main-content" className="min-h-screen">
              {children}
            </div>
            <Footer />
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
