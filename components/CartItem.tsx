"use client"

import type React from "react"
import Image from "next/image"
import { formatCurrency } from "@/utils/currency"
import { Checkbox } from "@/components/ui/checkbox"

interface CartItemProps {
  id: string
  name: string
  thumbnail: string
  sellerUsername: string
  affiliateUsername?: string
  price: number
  discountEndTime?: Date
  onRemove: (id: string) => void
  isSelected: boolean
  onSelect: (id: string, isSelected: boolean) => void
  packageName: string
  accessDuration: string
  priceOptionName?: string // Add this new prop
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  thumbnail,
  sellerUsername,
  affiliateUsername,
  price,
  discountEndTime,
  onRemove,
  isSelected,
  onSelect,
  packageName,
  accessDuration,
  priceOptionName, // Use the new prop
}) => {
  const handleCheckboxChange = (checked: boolean) => {
    onSelect(id, checked)
  }

  const calculateDays = (duration: string): number => {
    if (!duration) return 0

    const lowerDuration = duration.toLowerCase()

    if (lowerDuration.includes("lifetime")) return 36500 // ~100 years
    if (lowerDuration.includes("year") || lowerDuration.includes("yr")) {
      const years = Number.parseInt(lowerDuration.match(/\d+/)?.[0] || "1")
      return years * 365
    }
    if (lowerDuration.includes("month") || lowerDuration.includes("mo")) {
      const months = Number.parseInt(lowerDuration.match(/\d+/)?.[0] || "1")
      return months * 30
    }
    if (lowerDuration.includes("week") || lowerDuration.includes("wk")) {
      const weeks = Number.parseInt(lowerDuration.match(/\d+/)?.[0] || "1")
      return weeks * 7
    }
    if (lowerDuration.includes("day")) {
      return Number.parseInt(lowerDuration.match(/\d+/)?.[0] || "1")
    }

    // Default to 30 days if format is unrecognized
    return 30
  }

  // Display the actual price option name or fall back to packageName
  const displayPriceOption = priceOptionName || packageName || "Standard"

  return (
    <div className="py-2 border-b last:border-b-0">
      <div className="flex items-center space-x-4 mb-2">
        <Checkbox checked={isSelected} onCheckedChange={handleCheckboxChange} />
        <div className="flex-shrink-0">
          <Image src={thumbnail || "/placeholder.svg"} alt={name} width={50} height={50} className="rounded-md" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-sm">{name}</h3>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Price Option:</span> {displayPriceOption}
          </p>
          <p className="text-xs text-gray-600">
            Access Period:{" "}
            {accessDuration
              ? accessDuration.toLowerCase().includes("lifetime")
                ? "Lifetime Access"
                : `${accessDuration} (${calculateDays(accessDuration)} days)`
              : "Not specified"}
          </p>
          <p className="text-xs text-gray-500">Seller: {sellerUsername}</p>
          <p className="text-xs text-gray-500">Affiliate: {affiliateUsername || "None"}</p>
        </div>
      </div>
      <div className="flex justify-end items-center w-full mt-2">
        <div className="text-sm">
          <span className="font-bold">{formatCurrency(price).split(" (")[0]}</span>
          <span className="text-gray-500 ml-1">({formatCurrency(price).split(" (")[1]}</span>
        </div>
      </div>
      <div className="w-full mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"></div>
    </div>
  )
}
