"use client"

import type React from "react"
import { CartProvider } from "@/context/CartContext"
import { FloatingCart } from "@/components/FloatingCart"
import { useAuth } from "@/hooks/useAuth" // We'll create this hook later
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [hasError, setHasError] = useState(false)
  const { isLoggedIn } = useAuth() // Call useAuth unconditionally

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error)
      setHasError(true)
      toast({
        title: "Something went wrong",
        description: "An error occurred while rendering the page. Please try refreshing.",
        variant: "destructive",
      })
    }

    window.addEventListener("error", handleError as EventListener)
    return () => window.removeEventListener("error", handleError as EventListener)
  }, [toast])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Application Error</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We encountered an error while rendering this page. This could be due to a temporary issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        {children}
        {isLoggedIn && <FloatingCart />}
      </div>
    </CartProvider>
  )
}
