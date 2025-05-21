"use client"

import { useState, useEffect } from "react"

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in (you would typically check with your backend here)
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const storedUserId = localStorage.getItem("userId")
    setIsLoggedIn(loggedIn)
    setUserId(storedUserId)
  }, [])

  const login = (id: string) => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userId", id)
    setIsLoggedIn(true)
    setUserId(id)
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userId")
    setIsLoggedIn(false)
    setUserId(null)
  }

  return { isLoggedIn, userId, login, logout }
}
