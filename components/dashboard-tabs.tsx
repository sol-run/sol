"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerDashboard } from "@/components/seller-dashboard"
import { AffiliateDashboard } from "@/components/affiliate-dashboard"
import { PurchasedProducts } from "@/components/purchased-products"
import { FloatingCart } from "@/components/FloatingCart"
import { CartProvider } from "@/context/CartContext"

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<"seller" | "affiliate" | "purchased">("seller")

  return (
    <CartProvider>
      <Tabs defaultValue="seller" onValueChange={setActiveTab} className="w-full relative">
        <TabsList className="w-full grid grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="seller"
            className="text-lg transition-all duration-300 ease-in-out
                     shadow-[0_0_10px_rgba(168,85,247,0.2)] dark:shadow-[0_0_10px_rgba(168,85,247,0.4)]
                     data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] dark:data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.7)]
                     data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                     data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400
                     data-[state=active]:font-bold"
          >
            Seller
          </TabsTrigger>
          <TabsTrigger
            value="affiliate"
            className="text-lg transition-all duration-300 ease-in-out
                     shadow-[0_0_10px_rgba(168,85,247,0.2)] dark:shadow-[0_0_10px_rgba(168,85,247,0.4)]
                     data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] dark:data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.7)]
                     data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                     data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400
                     data-[state=active]:font-bold"
          >
            Affiliate
          </TabsTrigger>
          <TabsTrigger
            value="purchased"
            className="text-lg transition-all duration-300 ease-in-out
                     shadow-[0_0_10px_rgba(168,85,247,0.2)] dark:shadow-[0_0_10px_rgba(168,85,247,0.4)]
                     data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.5)] dark:data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.7)]
                     data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                     data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400
                     data-[state=active]:font-bold"
          >
            Purchases
          </TabsTrigger>
        </TabsList>
        <TabsContent value="seller" className="w-full">
          <SellerDashboard />
        </TabsContent>
        <TabsContent value="affiliate" className="w-full">
          <AffiliateDashboard />
        </TabsContent>
        <TabsContent value="purchased" className="w-full">
          <PurchasedProducts />
        </TabsContent>
        <FloatingCart />
      </Tabs>
    </CartProvider>
  )
}
