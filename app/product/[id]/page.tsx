"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { SalesPageTemplate } from "@/components/sales-page-template"
import { ShoppingCart } from "lucide-react"

// This is a temporary mock function to get product data
// In a real application, you would fetch this data from your API
const getProductData = (id: string) => {
  const mockProducts = [
    {
      id: "1",
      name: "eBook: Solana Basics",
      category: "eBooks",
      description: "Learn the basics of Solana",
      youtubeLink: "https://youtube.com/watch?v=example1",
      images: [],
      pricingOptions: [{ amount: "10", duration: "30", packageName: "1 Month Access" }],
      creator: "John Doe",
      active: true,
      posts: [{ id: "post1" }],
    },
    {
      id: "2",
      name: "Video Course: Advanced Solana for Rust Developers",
      category: "Video Courses",
      description: `Developers looking to get into Solana development who already know Rust have a great head start. Rust is an officially supported language for writing onchain programs for the Solana Blockchain. However, several key differences in the language's usage could otherwise be confusing.

This guide will walk through several of those differences, specifically the setup details, restrictions, macro changes, and compute limits. Additionally, this guide will cover the development environments and frameworks needed to start with Solana.

By the end of this guide, Rust developers will understand the differences they need to know to start their Solana journeys.`,
      youtubeLink: "https://www.youtube.com/watch?v=UrxX14k6fCI",
      images: [
        "https://source.unsplash.com/random/800x600?porsche+cayenne",
        "https://source.unsplash.com/random/800x600?porsche+cayenne+interior",
        "https://source.unsplash.com/random/800x600?porsche+cayenne+driving",
      ],
      pricingOptions: [
        { amount: "20", duration: "30", packageName: "1 Month Access" },
        { amount: "40", duration: "60", packageName: "2 Month Access" },
        { amount: "60", duration: "90", packageName: "3 Month Access" },
      ],
      creator: "Jane Smith",
      commissionLevels: [
        { level: 1, percentage: 10 },
        { level: 2, percentage: 10 },
        { level: 3, percentage: 10 },
        { level: 4, percentage: 10 },
        { level: 5, percentage: 10 },
      ],
      active: true,
      posts: [{ id: "post1" }],
    },
    {
      id: "3",
      name: "NFT Collection: Solana Gems",
      category: "Images",
      description: "Exclusive Solana-themed NFT collection",
      youtubeLink: "https://youtube.com/watch?v=example3",
      images: [],
      pricingOptions: [{ amount: "20", duration: "0", packageName: "Lifetime Access" }],
      creator: "Peter Jones",
      active: true,
      posts: [{ id: "post1" }],
    },
  ]

  const product = mockProducts.find((product) => product.id === id)

  // Only return the product if it's active and has at least one post
  if (product) {
    const hasPosts = product.posts && Array.isArray(product.posts) && product.posts.length > 0
    if (!product.active || !hasPosts) {
      return null // Return null for inactive products or those without posts
    }
  }

  return product
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const pricingRef = useRef<HTMLDivElement>(null)

  // Load product data
  useEffect(() => {
    if (params.id) {
      const productData = getProductData(params.id as string)
      setProduct(productData)
    }
  }, [params.id])

  // Handle scroll for floating button
  useEffect(() => {
    const handleScroll = () => {
      const pricingSection = document.querySelector(".pricing-section")

      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        // Hide button when 30% into the pricing section
        if (pricingSection) {
          const pricingSectionRect = pricingSection.getBoundingClientRect()
          const pricingSectionTop = pricingSectionRect.top
          const pricingSectionHeight = pricingSectionRect.height

          // Calculate 30% into the pricing section
          const thirtyPercentIntoSection = pricingSectionTop + pricingSectionHeight * 0.3

          // If the top of the viewport is past 30% into the section, hide the button
          if (thirtyPercentIntoSection < 0) {
            setShowFloatingButton(false)
          } else {
            setShowFloatingButton(true)
          }
        } else {
          setShowFloatingButton(true)
        }
      } else {
        setShowFloatingButton(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to pricing function
  const scrollToPricing = () => {
    const pricingSection = document.querySelector(".pricing-section")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // If no product is found, show error message
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Product Not Available</h2>
          <p className="text-red-700 dark:text-red-300">
            This product is either not found, inactive, or doesn't have any content yet.
          </p>
        </div>
      </div>
    )
  }

  const mediaItems = [
    {
      type: "video" as const,
      src: product.youtubeLink,
      preview: `https://img.youtube.com/vi/${product.youtubeLink.split("v=")[1]}/0.jpg`,
    },
    ...product.images.map((img: string) => ({ type: "image" as const, src: img, preview: img })),
  ]

  return (
    <>
      {/* Floating Buy Now button - only visible on mobile */}
      {showFloatingButton && (
        <button
          onClick={scrollToPricing}
          className="md:hidden fixed top-1/2 -translate-y-1/2 right-6 z-50 bg-purple-600 bg-opacity-60 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transform transition-transform hover:scale-105 flex items-center justify-center"
          aria-label="Buy Now"
        >
          <ShoppingCart className="h-6 w-6" />
        </button>
      )}

      <SalesPageTemplate
        name={product.name}
        category={product.category}
        description={product.description}
        pricingOptions={product.pricingOptions}
        mediaItems={mediaItems}
        username={product.creator}
        commissionLevels={product.commissionLevels}
      />
    </>
  )
}
