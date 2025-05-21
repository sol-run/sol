"use client"

import { useState, useEffect, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProductForm } from "@/components/create-product-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { SalesPageTemplate } from "@/components/sales-page-template"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

export default function CreateProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("product-details")
  const [salesPageActiveSection, setSalesPageActiveSection] = useState("details")
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    mediaItems: [],
    pricingOptions: [{ amount: "", duration: "", packageName: "" }],
    commissionLevels: [{ level: 1, percentage: "" }],
    productFiles: [],
  })
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [productSlug, setProductSlug] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [previewData, setPreviewData] = useState({
    name: "Product Name",
    category: "Category",
    description: "<p>Product description goes here...</p>",
    pricingOptions: [],
    mediaItems: [],
    commissionLevels: [],
    product: {
      affiliateResourceFiles: [],
      affiliateResourceLinks: [],
      productFiles: [],
    },
  })

  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true)
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a URL slug from the product name
      const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      setProductSlug(slug)

      // Show success dialog
      setIsSuccessDialogOpen(true)
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)

    // Update the sales page preview tab based on the form tab
    switch (newTab) {
      case "product-details":
        setSalesPageActiveSection("details")
        break
      case "pricing-options":
        setSalesPageActiveSection("details")
        break
      case "affiliate-settings":
        setSalesPageActiveSection("affiliate")
        break
      case "downloads":
        setSalesPageActiveSection("downloads")
        break
      default:
        setSalesPageActiveSection("details")
    }
  }

  const handleContinue = (newFormData) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...newFormData }
      return updatedData
    })

    // Force refresh the preview
    setRefreshKey((prev) => prev + 1)

    // Move to next tab
    switch (activeTab) {
      case "product-details":
        setActiveTab("pricing-options")
        break
      case "pricing-options":
        setActiveTab("affiliate-settings")
        break
      case "affiliate-settings":
        setActiveTab("downloads")
        break
      default:
        // If we're on the last tab, submit the form
        handleCreateProduct({ ...formData, ...newFormData })
    }
  }

  const handleFieldChange = (fields: any) => {
    setFormData((prev) => {
      const updated = { ...prev, ...fields }

      // Update the preview data
      setPreviewData({
        name: updated.name || "Product Name",
        category: updated.category || "Category",
        description: updated.description || "<p>Product description goes here...</p>",
        pricingOptions: updated.pricingOptions || [],
        mediaItems: updated.mediaItems || [],
        commissionLevels: updated.commissionLevels || [],
        product: {
          affiliateResourceFiles: updated.product?.affiliateResourceFiles || [],
          affiliateResourceLinks: updated.product?.affiliateResourceLinks || [],
          productFiles: updated.productFiles || [], // Pass product files to preview
        },
      })

      return updated
    })
  }

  const refreshPreview = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const autosaveFormData = () => {
    if (!hasUnsavedChanges) return

    setIsSaving(true)

    // Simulate saving to localStorage or API
    try {
      localStorage.setItem("product_form_autosave", JSON.stringify(formData))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      // Show saving indicator briefly
      setTimeout(() => {
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error("Error autosaving form data:", error)
      setIsSaving(false)
    }
  }

  // Set up autosave interval
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      autosaveFormData()
    }, 30000) // 30 seconds

    return () => clearInterval(autosaveInterval)
  }, [hasUnsavedChanges])

  // Load saved data on initial load
  useEffect(() => {
    const savedData = localStorage.getItem("product_form_autosave")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        setLastSaved(new Date())
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }, [])

  // Mark as having unsaved changes when form data changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [formData])

  // Add this after the existing useEffect hooks
  useEffect(() => {
    // Create a custom event listener for form field changes
    const handleFormFieldChange = (event) => {
      if (event.detail && event.detail.name !== undefined) {
        setFormData((prev) => ({
          ...prev,
          name: event.detail.name,
        }))
      }

      if (event.detail && event.detail.category !== undefined) {
        setFormData((prev) => ({
          ...prev,
          category: event.detail.category,
        }))
      }

      if (event.detail && event.detail.description !== undefined) {
        setFormData((prev) => ({
          ...prev,
          description: event.detail.description,
        }))

        // Force refresh the preview when description changes
        setRefreshKey((prev) => prev + 1)
      }
    }

    window.addEventListener("product-field-change", handleFormFieldChange)

    return () => {
      window.removeEventListener("product-field-change", handleFormFieldChange)
    }
  }, [])

  // Add a fallback UI in case the form fails to load

  // Wrap the main content in a Suspense boundary with a fallback
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-full sm:max-w-7xl">
      <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Product</h1>
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <span className="text-amber-600 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
              Autosaving...
            </span>
          ) : lastSaved ? (
            <span className="text-green-600 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
          {hasUnsavedChanges && (
            <Button size="sm" variant="outline" onClick={autosaveFormData} className="ml-2">
              Save now
            </Button>
          )}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="p-8 border rounded-lg shadow-sm">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>
            <div className="mt-6 h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        }
      >
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6 sm:space-y-8">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="product-details">Product Details</TabsTrigger>
            <TabsTrigger value="pricing-options">Pricing</TabsTrigger>
            <TabsTrigger value="affiliate-settings">Affiliate</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="product-details" className="space-y-6">
            <CreateProductForm
              onSaveContinue={handleContinue}
              initialData={formData}
              activeStep="product-details"
              onFieldChange={handleFieldChange}
            />
          </TabsContent>

          <TabsContent value="pricing-options" className="space-y-6">
            <CreateProductForm
              onSaveContinue={handleContinue}
              initialData={formData}
              activeStep="pricing-options"
              onFieldChange={handleFieldChange}
            />
          </TabsContent>

          <TabsContent value="affiliate-settings" className="space-y-6">
            <CreateProductForm
              onSaveContinue={handleContinue}
              initialData={formData}
              activeStep="affiliate-settings"
              onFieldChange={handleFieldChange}
            />
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <CreateProductForm
              onSaveContinue={handleCreateProduct}
              initialData={formData}
              activeStep="downloads"
              isLastStep={true}
              onFieldChange={handleFieldChange}
            />
          </TabsContent>
        </Tabs>
      </Suspense>

      {/* Sales Page Preview */}
      <div className="mt-6 sm:mt-8 border-t pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">Sales Page Preview</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={refreshPreview} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" /> Refresh Preview
            </Button>
            <div className="text-sm text-gray-500">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full">Live Preview</span>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-2 sm:p-4 bg-white shadow-sm overflow-auto">
          <SalesPageTemplate
            key={refreshKey}
            name={previewData.name || "Your Product Name"}
            category={previewData.category || "Category"}
            description={previewData.description || "<p>Your product description will appear here.</p>"}
            pricingOptions={
              previewData.pricingOptions.filter((option) => option.amount && option.duration && option.packageName)
                .length > 0
                ? previewData.pricingOptions.filter((option) => option.amount && option.duration && option.packageName)
                : [{ amount: "0", duration: "0", packageName: "Sample Package" }]
            }
            mediaItems={previewData.mediaItems}
            commissionLevels={previewData.commissionLevels.filter((level) => level.percentage)}
            username="YourUsername"
            affiliateUsername=""
            activeSection={salesPageActiveSection}
            product={
              previewData.product || {
                affiliateResourceFiles: [],
                affiliateResourceLinks: [],
              }
            }
          />
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p className="text-lg font-semibold">Creating product...</p>
          </div>
        </div>
      )}

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-center justify-center text-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Product Published Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertTitle>Your product is now live!</AlertTitle>
              <AlertDescription>
                Your product has been published and is now available for customers and affiliates.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-sm text-center text-gray-600">
              <p>Your product URL:</p>
              <p className="font-mono mt-1 p-2 bg-gray-100 rounded">{`https://sol.run/product/${productSlug}`}</p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="sm:flex-1"
              onClick={() => {
                setIsSuccessDialogOpen(false)
                router.push("/dashboard")
              }}
            >
              Back to Dashboard
            </Button>
            <Button
              className="sm:flex-1"
              onClick={() => {
                window.open(`/product/${productSlug}`, "_blank")
              }}
            >
              View Product Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
