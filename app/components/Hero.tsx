"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"

const phrases = [
  "Automated + Instant Solana Payments",
  "Start Your Affiliate or MLM Program",
  "Unlock Unlimited Earning Potential",
  "Sell eBooks + Videos + Images + More!",
]

const blinkAnimation = `
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-blink {
  animation: blink 0.7s infinite;
}
`

const starsAnimation = `
  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .star {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    animation: twinkle 2s infinite;
  }
`

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [typingStarted, setTypingStarted] = useState(false)

  useEffect(() => {
    const typingInterval = setInterval(
      () => {
        if (!typingStarted) {
          setTypingStarted(true)
        }
        if (!isDeleting && charIndex < phrases[phraseIndex].length) {
          setCurrentText((prev) => prev + phrases[phraseIndex][charIndex])
          setCharIndex(charIndex + 1)
        } else if (isDeleting && charIndex > 0) {
          setCurrentText((prev) => prev.slice(0, -1))
          setCharIndex(charIndex - 1)
        } else if (charIndex === phrases[phraseIndex].length) {
          setIsPaused(true)
          setTimeout(() => {
            setIsPaused(false)
            setIsDeleting(true)
          }, 3000)
        } else if (charIndex === 0 && isDeleting) {
          setIsDeleting(false)
          setPhraseIndex((phraseIndex + 1) % phrases.length)
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearInterval(typingInterval)
  }, [charIndex, isDeleting, phraseIndex, typingStarted])

  // Function to handle smooth scrolling to sections
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()

    // Try to find the section on the current page
    const section = document.getElementById(sectionId)

    if (section) {
      // If found, scroll to it
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      })
    } else {
      // If we're not on the homepage, navigate to homepage with the anchor
      if (window.location.pathname !== "/") {
        window.location.href = `/#${sectionId}`
      } else {
        // We're on the homepage but couldn't find the section
        // Try alternative IDs
        const alternativeIds = {
          features: ["feature", "Features", "FEATURES"],
          workflow: ["how-it-works", "howItWorks", "how_it_works", "Workflow", "WORKFLOW"],
          faqs: ["faq", "FAQ", "frequently-asked-questions"],
        }

        // Try alternative IDs if available
        if (alternativeIds[sectionId as keyof typeof alternativeIds]) {
          for (const altId of alternativeIds[sectionId as keyof typeof alternativeIds]) {
            const altSection = document.getElementById(altId)
            if (altSection) {
              window.scrollTo({
                top: altSection.offsetTop,
                behavior: "smooth",
              })
              return
            }
          }
        }

        // If still not found, just scroll to the approximate position
        // This is a fallback in case the sections exist but don't have IDs
        const approximatePositions = {
          features: 0.3, // About 30% down the page
          workflow: 0.6, // About 60% down the page
          faqs: 0.8, // About 80% down the page
        }

        if (approximatePositions[sectionId as keyof typeof approximatePositions]) {
          const pageHeight = document.body.scrollHeight
          const scrollPosition = pageHeight * approximatePositions[sectionId as keyof typeof approximatePositions]

          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          })
        }
      }
    }
  }

  return (
    <section className="pt-20 pb-10 dark:bg-gray-900 relative overflow-hidden">
      <style jsx>{`${blinkAnimation} ${starsAnimation}`}</style>
      <div className="stars-container absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#1F2937] dark:text-white">
          Your Digital Products Marketplace
        </h1>
        <div className="mb-6">
          <h2 className="text-2xl md:text-4xl font-bold text-[#1F2937] dark:text-white">
            {currentText}
            <span className={`${!typingStarted || isPaused ? "animate-blink" : "opacity-100"}`}>|</span>
          </h2>
        </div>
        <p className="text-xl mb-12 text-gray-600 dark:text-gray-300">
          Sell your digital products, set up affiliate programs, and earn with blockchain efficiency.
        </p>
        <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:space-x-4 justify-center items-center">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, "features")}
            className="bg-white text-purple-600 border border-purple-600 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-purple-50 transition duration-300 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-gray-700 text-center"
          >
            Features
          </a>
          <a
            href="#workflow"
            onClick={(e) => scrollToSection(e, "workflow")}
            className="bg-white text-purple-600 border border-purple-600 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-purple-50 transition duration-300 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-gray-700 text-center"
          >
            How It Works
          </a>
          <Link
            href="/products"
            className="bg-white text-purple-600 border border-purple-600 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-purple-50 transition duration-300 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-gray-700 text-center"
          >
            Marketplace
          </Link>
          <Link
            href="/blog"
            className="bg-white text-purple-600 border border-purple-600 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-purple-50 transition duration-300 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-gray-700 text-center"
          >
            Blog
          </Link>
          <a
            href="#faqs"
            onClick={(e) => scrollToSection(e, "faqs")}
            className="col-span-2 md:col-span-1 mx-auto md:mx-0 w-1/2 md:w-auto bg-white text-purple-600 border border-purple-600 px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-purple-50 transition duration-300 dark:bg-gray-800 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-gray-700 text-center"
          >
            FAQs
          </a>
        </div>
        <p className="mt-8 mb-4 text-base md:text-lg text-gray-500 dark:text-gray-400">
          Powered by Solana Blockchain ⚡
        </p>
      </div>
    </section>
  )
}
