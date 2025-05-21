"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

interface CartItem {
  id: string
  name: string
  thumbnail: string
  sellerUsername: string
  affiliateUsername?: string
  price: number
  discountEndTime?: Date
  addedToCartDate?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isLoggedIn, userId } = useAuth()

  // Calculate total price of all items in cart
  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  useEffect(() => {
    if (isLoggedIn && userId) {
      // Load cart items from localStorage on initial render
      const savedCartItems = localStorage.getItem(`cartItems_${userId}`)
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems))
      }

      // Automatically open cart if there are items
      if (JSON.parse(savedCartItems || "[]").length > 0) {
        setIsCartOpen(true)
      }
    } else {
      // Clear cart items when user is not logged in
      setCartItems([])
      setIsCartOpen(false)
    }
  }, [isLoggedIn, userId])

  useEffect(() => {
    if (isLoggedIn && userId) {
      // Save cart items to localStorage whenever they change
      localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems))
    }
  }, [cartItems, isLoggedIn, userId])

  const addToCart = (item: CartItem) => {
    const itemWithDate = {
      ...item,
      addedToCartDate: new Date().toISOString(),
    }
    setCartItems((prevItems) => [...prevItems, itemWithDate])
  }

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        setCartItems,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
