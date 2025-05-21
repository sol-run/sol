"use client"

import type React from "react"

interface SalesPageTemplateProps {
  name: string
  category: string
  description: string
  pricingOptions: { amount: string; duration: string; packageName: string }[]
  mediaItems?: Array<{ type: "image" | "video"; src: string; preview: string }>
  username?: string
  commissionLevels?: Array<{ level: number; percentage: number }>
  affiliateUsername?: string
  activeSection?: string
  product?: {
    affiliateResourceFiles?: Array<{ name: string; description: string; url: string }>
    affiliateResourceLinks?: Array<{ title: string; url: string }>
    productFiles?: Array<{ description: string; content?: string; timestamp: Date; files: File[] }>
  }
}

const SalesPageTemplate: React.FC<SalesPageTemplateProps> = ({
  name,
  category,
  description,
  pricingOptions,
  mediaItems,
  username,
  commissionLevels,
  affiliateUsername,
  activeSection,
  product,
}) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Category: {category}</p>
      <p>Description: {description}</p>
      <p>Pricing Options: {JSON.stringify(pricingOptions)}</p>
      <p>Media Items: {JSON.stringify(mediaItems)}</p>
      <p>Username: {username}</p>
      <p>Commission Levels: {JSON.stringify(commissionLevels)}</p>
      <p>Affiliate Username: {affiliateUsername}</p>
      <p>Active Section: {activeSection}</p>
      <p>Product: {JSON.stringify(product)}</p>
    </div>
  )
}

export { SalesPageTemplate }
