"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-gray-800 text-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-6">
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className="mb-6">
            <Link href="/">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sol.Run_0a-4299JT5ovA1RSYHLxRGg3IDaZiXz49.png"
                alt="Sol.Run Logo"
                width={120}
                height={30}
                className="mx-auto"
              />
            </Link>
            <p className="mt-2 text-xs text-purple-400">Empowering digital entrepreneurs on the Solana Blockchain</p>
          </div>
          <p className="text-sm">
            <strong>
              Copyright © {currentYear} -{" "}
              <Link href="/" className="hover:text-purple-400">
                Sol.Run
              </Link>{" "}
              | All Rights Reserved |{" "}
              <Link href="/terms" className="hover:text-purple-400">
                Terms of Service
              </Link>
            </strong>
          </p>
        </div>
      </div>
    </footer>
  )
}
