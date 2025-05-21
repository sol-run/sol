"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProductForm } from "@/components/create-product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { SalesPageTemplate } from "@/components/sales-page-template"
import { toast } from "@/components/ui/use-toast"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("product-details")
  const [salesPageActiveSection, setSalesPageActiveSection] = useState("details")
  const [formData, setFormData] = useState({
    id: "",
    category: "",
    name: "",
    description: "",
    mediaItems: [],
    pricingOptions: [{ amount: "", duration: "", packageName: "" }],
    commissionLevels: [{ level: 1, percentage: "" }],
    productFiles: [],
  })
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
  const [isLoading, setIsLoading] = useState(true)

  // Load product data on initial render
  useEffect(() => {
    const loadProductData = () => {
      setIsLoading(true)
      try {
        // Try to get product data from sessionStorage first
        const storedProduct = sessionStorage.getItem("editingProduct")
        console.log("Retrieved from sessionStorage:", storedProduct ? "Data found" : "No data found")

        if (storedProduct) {
          try {
            const parsedProduct = JSON.parse(storedProduct)
            console.log("Product data parsed successfully:", parsedProduct.id)

            // Format the product data for the form
            const formattedProduct = {
              id: parsedProduct.id,
              category: parsedProduct.category || "",
              name: parsedProduct.name || "",
              description: parsedProduct.description || "",
              mediaItems: parsedProduct.mediaItems || [],
              pricingOptions: parsedProduct.pricingOptions || [{ amount: "", duration: "", packageName: "" }],
              commissionLevels: parsedProduct.commissionLevels || [{ level: 1, percentage: "" }],
              productFiles:
                parsedProduct.posts?.map((post) => ({
                  description: post.title || "",
                  content: post.content || "",
                  timestamp: new Date(),
                  files: post.files || [],
                })) || [],
            }

            setFormData(formattedProduct)

            // Also update preview data
            setPreviewData({
              name: formattedProduct.name || "Product Name",
              category: formattedProduct.category || "Category",
              description: formattedProduct.description || "<p>Product description goes here...</p>",
              pricingOptions: formattedProduct.pricingOptions || [],
              mediaItems: formattedProduct.mediaItems || [],
              commissionLevels: formattedProduct.commissionLevels || [],
              product: {
                affiliateResourceFiles: [],
                affiliateResourceLinks: [],
                productFiles: formattedProduct.productFiles || [],
              },
            })

            setLastSaved(new Date())
            toast({
              title: "Product loaded",
              description: `Editing: ${formattedProduct.name}`,
            })
          } catch (error) {
            console.error("Error parsing product data:", error)
            // Provide fallback data for development/testing
            const fallbackProduct = {
              id: params.id,
              category: "eBooks",
              name: "Sample Product",
              description: "<p>This is a sample product description.</p>",
              mediaItems: [],
              pricingOptions: [{ amount: "10", duration: "30", packageName: "Basic Package" }],
              commissionLevels: [{ level: 1, percentage: "10" }],
              productFiles: [],
            }

            setFormData(fallbackProduct)
            setPreviewData({
              name: fallbackProduct.name,
              category: fallbackProduct.category,
              description: fallbackProduct.description,
              pricingOptions: fallbackProduct.pricingOptions,
              mediaItems: fallbackProduct.mediaItems,
              commissionLevels: fallbackProduct.commissionLevels,
              product: {
                affiliateResourceFiles: [],
                affiliateResourceLinks: [],
                productFiles: fallbackProduct.productFiles,
              },
            })

            toast({
              title: "Using sample data",
              description: "Could not load the actual product data. Using sample data instead.",
              variant: "warning",
            })
          }
        } else {
          // If no data in sessionStorage, use mock data for the product with the given ID
          console.log("No product data found in sessionStorage, using mock data for ID:", params.id)

          // Create mock data for development/testing
          const mockProduct = {
            id: params.id,
            category: "eBooks",
            name: "Sample Product " + params.id,
            description: "<p>This is a sample product description for testing.</p>",
            mediaItems: [],
            pricingOptions: [{ amount: "10", duration: "30", packageName: "Basic Package" }],
            commissionLevels: [{ level: 1, percentage: "10" }],
            productFiles: [],
          }

          setFormData(mockProduct)
          setPreviewData({
            name: mockProduct.name,
            category: mockProduct.category,
            description: mockProduct.description,
            pricingOptions: mockProduct.pricingOptions,
            mediaItems: mockProduct.mediaItems,
            commissionLevels: mockProduct.commissionLevels,
            product: {
              affiliateResourceFiles: [],
              affiliateResourceLinks: [],
              productFiles: mockProduct.productFiles,
            },
          })

          toast({
            title: "Using sample data",
            description: "No product data found. Using sample data for development.",
            variant: "warning",
          })
        }
      } catch (error) {
        console.error("Error loading product data:", error)
        toast({
          title: "Error loading product",
          description: "There was a problem loading the product data. Using default values.",
          variant: "destructive",
        })

        // Provide default data even in case of error
        const defaultProduct = {
          id: params.id,
          category: "eBooks",
          name: "Default Product",
          description: "<p>Default product description</p>",
          mediaItems: [],
          pricingOptions: [{ amount: "10", duration: "30", packageName: "Default Package" }],
          commissionLevels: [{ level: 1, percentage: "10" }],
          productFiles: [],
        }

        setFormData(defaultProduct)
        setPreviewData({
          name: defaultProduct.name,
          category: defaultProduct.category,
          description: defaultProduct.description,
          pricingOptions: defaultProduct.pricingOptions,
          mediaItems: defaultProduct.mediaItems,
          commissionLevels: defaultProduct.commissionLevels,
          product: {
            affiliateResourceFiles: [],
            affiliateResourceLinks: [],
            productFiles: defaultProduct.productFiles,
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProductData()
  }, [params.id, router])

  const handleUpdateProduct = async (productData) => {
    setIsSubmitting(true)
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would update the product in your database
      console.log("Product updated:", productData)

      // Show success message
      toast({
        title: "Product updated",
        description: "Your product has been updated successfully!",
      })

      // Clear the stored product data
      sessionStorage.removeItem("editingProduct")

      // Navigate back to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your product. Please try again.",
        variant: "destructive",
      })
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
        handleUpdateProduct({ ...formData, ...newFormData })
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
          productFiles: updated.productFiles || [],
        },
      })

      return updated
    })

    setHasUnsavedChanges(true)
  }

  const refreshPreview = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const autosaveFormData = () => {
    if (!hasUnsavedChanges) return

    setIsSaving(true)

    // Simulate saving to sessionStorage or API
    try {
      sessionStorage.setItem("product_edit_autosave", JSON.stringify(formData))
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
  }, [formData, hasUnsavedChanges])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-lg">Loading product data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-full sm:max-w-7xl">
      <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Product: {formData.name}</h1>
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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6 sm:space-y-8">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <TabsTrigger value="product-details">Product Details</TabsTrigger>
          <TabsTrigger value="pricing-options">Pricing</TabsTrigger>
          <TabsTrigger value="affiliate-settings">Affiliate</TabsTrigger>
          <TabsTrigger value="downloads">Content</TabsTrigger>
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
            onSaveContinue={handleUpdateProduct}
            initialData={formData}
            activeStep="downloads"
            isLastStep={true}
            onFieldChange={handleFieldChange}
          />
        </TabsContent>
      </Tabs>

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
            <p className="text-lg font-semibold">Updating product...</p>
          </div>
        </div>
      )}
    </div>
  )
}
