"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Shield, Copy, RefreshCw, Code, FileText } from "lucide-react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import TipTapImage from "@tiptap/extension-image"
import Alignment from "@tiptap/extension-text-align"
import TipTapUnderline from "@tiptap/extension-underline"
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageIcon, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function PlatformSettings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Sol.Run",
    siteDescription: "Digital Products Marketplace on Solana",
    maintenanceMode: false,
    siteLogo: "",
    siteFavicon: "",
  })

  const [userSettings, setUserSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
  })

  // Add these new properties to the paymentSettings state (around line 80)
  const [paymentSettings, setPaymentSettings] = useState({
    // Platform Sales Fees
    salesFeeWallet: "",
    salesFeePercentage: "10",

    // Platform Withdrawal Fees
    withdrawalFeeWallet: "",
    withdrawalFeePercentage: "1",

    // Emailing Fees
    emailingFeeWallet: "",
    emailingFeeUsd: "0.01",

    // Members Withdrawal Settings
    minWithdrawalAmount: "0.1",
    maxWithdrawalAmount: "10",
    withdrawalTimerHours: "24",
  })

  // Add a new state for SOL price (around line 80, after other state declarations)
  const [solPrice, setSolPrice] = useState(150) // Default SOL price in USD

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    senderEmail: "",
    senderName: "",
    testRecipient: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    enable2FA: false,
    requireAdminVerification: true,
    secretKey: "",
    qrCodeUrl: "",
  })

  const [socialSettings, setSocialSettings] = useState({
    twitterUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    discordUrl: "",
    youtubeUrl: "",
    telegramUrl: "",
  })

  const [sendingTestEmail, setSendingTestEmail] = useState(false)
  const [generating2FA, setGenerating2FA] = useState(false)

  const [imageUploadOpen, setImageUploadOpen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState(100) // percentage of original size

  // Add these new state variables after the other useState declarations
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(true)
  const [htmlDialogOpen, setHtmlDialogOpen] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
  const [imageFloatingToolbar, setImageFloatingToolbar] = useState({
    show: false,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    aspectRatio: 1,
    locked: true,
  })

  // Add this ref after the other state declarations (around line 80)
  const isInitialEditorSetup = useRef(true)
  const isInitialTermsEditorSetup = useRef(true)

  // Add a new state for header scroller settings after the other state declarations (around line 80)
  const [headerScrollerSettings, setHeaderScrollerSettings] = useState({
    showReferredBy: true,
    showTotalUsers: true,
    showUnitsSold: true,
    showTotalEarned: true,
    showSolPrice: true,
    isScrolling: true, // Add this new property to control scrolling behavior
  })

  const [footerContent, setFooterContent] = useState(
    `<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sol.Run_0a-4299JT5ovA1RSYHLxRGg3IDaZiXz49.png" alt="Sol.Run Logo"><p style="text-align: center"><em>Empowering digital creators on the Solana Blockchain</em></p><p style="text-align: center"><strong>Copyright © 2025 - </strong><a target="_blank" rel="noopener noreferrer nofollow" href="http://Sol.Run"><strong>Sol.Run</strong></a><strong> | All Rights Reserved | </strong><a target="_blank" rel="noopener noreferrer nofollow" class="hover:text-purple-400" href="terms"><strong>Terms of Service</strong></a></p>`,
  )

  // Add state for terms page content
  const [termsContent, setTermsContent] = useState(
    `<h1 class="text-3xl font-bold mb-6">Terms and Conditions</h1>
<p class="mb-4">Effective Date: Saturday 08th February 2025</p>
<p class="mb-4">
  Welcome to Sol.Run! By accessing or using our platform, you agree to comply with and be bound by these Terms and
  Conditions. If you do not agree, please do not use our services.
</p>

<h2 class="text-2xl font-bold mt-6 mb-4">1. Definitions</h2>
<ul class="list-disc pl-6 mb-4">
  <li>"Platform" refers to Sol.Run, the digital products marketplace operating on the Solana blockchain.</li>
  <li>"User" refers to anyone who registers or uses the platform, including sellers, buyers, and affiliates.</li>
  <li>"Seller" refers to a user who lists digital products for sale.</li>
  <li>"Affiliate" refers to a user who promotes products in exchange for commissions.</li>
  <li>"Customer" refers to a user who purchases digital products.</li>
  <li>"Commission" refers to earnings from the platform's affiliate program.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">2. Account Registration & Access</h2>
<ul class="list-disc pl-6 mb-4">
  <li>Users must provide accurate information when signing up.</li>
  <li>Users must be at least 18 years old or have legal guardian permission.</li>
  <li>Sellers, Affiliates, and Customers will have access to different sections of the User Dashboard.</li>
  <li>The platform automatically generates a Solana Wallet Address for transactions and commissions.</li>
  <li>Admin Area (/manage) is restricted to authorized personnel only.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">3. Selling on Sol.Run</h2>
<ul class="list-disc pl-6 mb-4">
  <li>Sellers may list digital products such as eBooks, software, videos, audiobooks, and images.</li>
  <li>Sellers are responsible for ensuring their products do not infringe copyright or violate laws.</li>
  <li>Sellers can set up affiliate programs (single-tier or multi-tier, up to 10 levels).</li>
  <li>Platform approval is required before a product goes live.</li>
  <li>The platform deducts a 10% transaction fee per successful order.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">4. Buying Digital Products</h2>
<ul class="list-disc pl-6 mb-4">
  <li>All purchases are final; refunds are not available due to the nature of digital products.</li>
  <li>Customers receive instant access to download links upon payment confirmation.</li>
  <li>The duration of access depends on the seller's settings (e.g., limited-time or lifetime).</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">5. Affiliate Program</h2>
<ul class="list-disc pl-6 mb-4">
  <li>Affiliates earn commissions by sharing referral links.</li>
  <li>Commissions are paid automatically via Solana upon a successful sale.</li>
  <li>Multi-level affiliate structures (up to 10 levels) depend on the seller's program.</li>
  <li>Fraudulent activity (e.g., self-referrals, fake traffic) will result in account suspension.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">6. Payments & Withdrawals</h2>
<ul class="list-disc pl-6 mb-4">
  <li>Payments are processed via Solana blockchain for speed and transparency.</li>
  <li>Sellers and affiliates can withdraw their earnings from the User Dashboard.</li>
  <li>Withdrawals may be subject to verification for security purposes.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">7. Restricted Content & Activities</h2>
<p class="mb-4">Users may not:</p>
<ul class="list-disc pl-6 mb-4">
  <li>Sell illegal, copyrighted, or misleading products.</li>
  <li>Use automated scripts, bots, or fraudulent methods to generate commissions.</li>
  <li>Attempt to hack, disrupt, or abuse the platform in any way.</li>
</ul>
<p class="mb-4">Violations may result in account termination and legal action.</p>

<h2 class="text-2xl font-bold mt-6 mb-4">8. Platform Fees & Revenue Sharing</h2>
<ul class="list-disc pl-6 mb-4">
  <li>Sol.Run charges a 10% transaction fee per successful order.</li>
  <li>This fee covers platform maintenance, Solana gas fees, and security measures.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">9. Disclaimers & Liability</h2>
<ul class="list-disc pl-6 mb-4">
  <li>
    Sol.Run operates as a marketplace and is not responsible for the quality or legality of products listed by
    sellers.
  </li>
  <li>Users assume full responsibility for their transactions and compliance with local laws.</li>
  <li>The platform is provided "as-is" without warranties of any kind.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">10. Privacy Policy</h2>
<ul class="list-disc pl-6 mb-4">
  <li>User data is stored securely and is not shared with third parties except as required by law.</li>
  <li>Blockchain transactions are public, but personal data remains confidential.</li>
</ul>

<h2 class="text-2xl font-bold mt-6 mb-4">11. Modifications & Updates</h2>
<p class="mb-4">
  These terms may be updated at any time. Continued use of the platform implies acceptance of the latest version.
</p>

<h2 class="text-2xl font-bold mt-6 mb-4">12. Contact & Support</h2>
<p class="mb-4">For questions, contact support@sol.run or visit our Help Center.</p>`,
  )

  // Modify the useEditor hook's onUpdate callback to prevent state updates during initial render
  const footerEditor = useEditor({
    extensions: [
      StarterKit,
      TipTapUnderline,
      TipTapImage.configure({
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Alignment.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
    ],
    content: footerContent,
    onUpdate: ({ editor }) => {
      // Only update state if it's not the initial setup
      if (!isInitialEditorSetup.current) {
        setFooterContent(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none focus:outline-none min-h-[200px] dark:text-gray-50",
      },
    },
  })

  // Add a new editor for terms content
  const termsEditor = useEditor({
    extensions: [
      StarterKit,
      TipTapUnderline,
      TipTapImage.configure({
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Alignment.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
    ],
    content: termsContent,
    onUpdate: ({ editor }) => {
      // Only update state if it's not the initial setup
      if (!isInitialTermsEditorSetup.current) {
        setTermsContent(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none focus:outline-none min-h-[400px] dark:text-gray-50",
      },
    },
  })

  // Add this useEffect to mark the initial setup as complete after the first render
  useEffect(() => {
    // Set the ref to false after the first render
    if (isInitialEditorSetup.current && footerEditor) {
      isInitialEditorSetup.current = false
    }

    // Set the terms editor ref to false after the first render
    if (isInitialTermsEditorSetup.current && termsEditor) {
      isInitialTermsEditorSetup.current = false
    }
  }, [footerEditor, termsEditor])

  // Check if we should open a specific tab on load
  useEffect(() => {
    const savedTab = localStorage.getItem("platformSettingsTab")
    if (savedTab) {
      setActiveTab(savedTab)
      localStorage.removeItem("platformSettingsTab")
    }
  }, [])

  // Add this useEffect to fetch the SOL price (after other useEffect hooks)
  useEffect(() => {
    // In a real implementation, you would fetch the current SOL price from an API
    // For now, we'll use a mock price
    const fetchSolPrice = async () => {
      try {
        // Mock API call - in production, replace with actual API call
        // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        // const data = await response.json()
        // setSolPrice(data.solana.usd)

        // Using mock price for demonstration
        setSolPrice(150)
      } catch (error) {
        console.error("Error fetching SOL price:", error)
      }
    }

    fetchSolPrice()

    // Set up a refresh interval (every 5 minutes)
    const interval = setInterval(fetchSolPrice, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Add this useEffect hook after the other useEffect hooks
  useEffect(() => {
    // Function to handle image selection in the editor
    const handleImageSelection = () => {
      if (!footerEditor) return

      // Check if an image is selected
      const { state } = footerEditor.view
      const { selection } = state

      // Find if the selection contains an image node
      let foundImage = false
      let imageNode = null
      let imagePos = -1

      state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
        if (node.type.name === "image") {
          foundImage = true
          imageNode = node
          imagePos = pos
          return false // stop traversal
        }
        return true
      })

      // If we found an image in the selection
      if (foundImage && imageNode) {
        // Find all images in the editor
        const editorRoot = document.querySelector(".ProseMirror")
        if (!editorRoot) return

        // Get all images in the editor
        const images = editorRoot.querySelectorAll("img")
        let selectedImage: HTMLImageElement | null = null

        // Find the selected image by checking which one is within the selection
        images.forEach((img) => {
          const imgElement = img as HTMLImageElement
          // Check if this image is selected (has a selection class or is the only image)
          if (
            imgElement.classList.contains("ProseMirror-selectednode") ||
            (images.length === 1 && selection.empty === false)
          ) {
            selectedImage = imgElement
          }
        })

        if (selectedImage) {
          setSelectedImage(selectedImage)

          // Calculate position for floating toolbar
          const rect = selectedImage.getBoundingClientRect()
          const editorRect = editorRoot.getBoundingClientRect()

          // Get dimensions from the node attributes or from the DOM element
          const width = imageNode.attrs.width || selectedImage.width || 200
          const height = imageNode.attrs.height || selectedImage.height || 150
          const aspectRatio = width / height

          // Position the toolbar near the image but ensure it's visible
          setImageFloatingToolbar({
            show: true,
            top: rect.top - editorRect.top + rect.height + 10, // Position below the image
            left: rect.left - editorRect.left,
            width: width,
            height: height,
            aspectRatio: aspectRatio,
            locked: true,
          })

          // Add a visible selection indicator to the image
          selectedImage.style.outline = "2px solid #3b82f6"
          selectedImage.style.outlineOffset = "2px"
        }
      } else {
        // If no image is selected, hide the toolbar and remove selection styling
        if (selectedImage) {
          selectedImage.style.outline = ""
          selectedImage.style.outlineOffset = ""
        }
        setSelectedImage(null)
        setImageFloatingToolbar((prev) => ({ ...prev, show: false }))
      }
    }

    // Register event handlers
    if (footerEditor) {
      footerEditor.on("selectionUpdate", handleImageSelection)
      footerEditor.on("update", handleImageSelection)

      // Also run once on mount to check for any already selected images
      setTimeout(handleImageSelection, 100)

      return () => {
        footerEditor.off("selectionUpdate", handleImageSelection)
        footerEditor.off("update", handleImageSelection)
      }
    }
  }, [footerEditor, selectedImage])

  // Add this function for handling width changes with aspect ratio lock
  const handleWidthChange = (value: number) => {
    if (!footerEditor || !selectedImage) return

    setImageFloatingToolbar((prev) => {
      const newWidth = value
      const newHeight = prev.locked ? Math.round(value / prev.aspectRatio) : prev.height

      // Update the selected image in the DOM for immediate visual feedback
      selectedImage.width = newWidth
      selectedImage.height = newHeight
      selectedImage.style.width = `${newWidth}px`
      selectedImage.style.height = `${newHeight}px`

      // Update the image in the editor
      footerEditor.commands.command(({ tr, dispatch }) => {
        let updated = false

        tr.doc.descendants((node, pos) => {
          if (node.type.name === "image" && !updated) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              width: newWidth,
              height: newHeight,
            })
            updated = true

            if (dispatch) dispatch(tr)
            return false
          }
          return true
        })

        return updated
      })

      return { ...prev, width: newWidth, height: newHeight }
    })
  }

  // Add this function for handling height changes with aspect ratio lock
  const handleHeightChange = (value: number) => {
    if (!footerEditor || !selectedImage) return

    setImageFloatingToolbar((prev) => {
      const newHeight = value
      const newWidth = prev.locked ? Math.round(value * prev.aspectRatio) : prev.width

      // Update the selected image in the DOM for immediate visual feedback
      selectedImage.width = newWidth
      selectedImage.height = newHeight
      selectedImage.style.width = `${newWidth}px`
      selectedImage.style.height = `${newHeight}px`

      // Update the image in the editor
      footerEditor.commands.command(({ tr, dispatch }) => {
        let updated = false

        tr.doc.descendants((node, pos) => {
          if (node.type.name === "image" && !updated) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              width: newWidth,
              height: newHeight,
            })
            updated = true

            if (dispatch) dispatch(tr)
            return false
          }
          return true
        })

        return updated
      })

      return { ...prev, width: newWidth, height: newHeight }
    })
  }

  // Add this function to toggle aspect ratio lock
  const toggleAspectRatioLock = () => {
    setImageFloatingToolbar((prev) => ({
      ...prev,
      locked: !prev.locked,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setImageUploadOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const insertImage = () => {
    if (uploadedImage && footerEditor) {
      // Calculate size based on percentage
      const imgElement = new window.Image()
      imgElement.onload = () => {
        const width = Math.round(imgElement.width * (imageSize / 100))
        footerEditor
          .chain()
          .focus()
          .setImage({
            src: uploadedImage,
            alt: "Footer image",
            width,
          })
          .run()
        setImageUploadOpen(false)
        setUploadedImage(null)
        setImageSize(100)
      }
      imgElement.src = uploadedImage
    }
  }

  const handleSendTestEmail = async () => {
    if (!emailSettings.testRecipient) {
      toast({
        title: "Test recipient required",
        description: "Please enter an email address to send the test to.",
        variant: "destructive",
      })
      return
    }

    setSendingTestEmail(true)
    try {
      // Here you would call your API to send a test email
      const response = await fetch("/api/admin/send-test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emailSettings,
          recipient: emailSettings.testRecipient,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send test email")
      }

      toast({
        title: "Test email sent",
        description: `A test email has been sent to ${emailSettings.testRecipient}. Please check your inbox.`,
      })
    } catch (error) {
      console.error("Error sending test email:", error)
      toast({
        title: "Error sending test email",
        description: error.message || "There was an error sending the test email. Please check your SMTP settings.",
        variant: "destructive",
      })
    } finally {
      setSendingTestEmail(false)
    }
  }

  const handleGenerate2FASecret = async () => {
    setGenerating2FA(true)
    try {
      // Here you would call your API to generate a new 2FA secret and QR code
      const response = await fetch("/api/admin/generate-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate 2FA secret")
      }

      const data = await response.json()
      setSecuritySettings({
        ...securitySettings,
        secretKey: data.secretKey,
        qrCodeUrl: data.qrCodeUrl,
      })

      toast({
        title: "2FA secret generated",
        description: "A new 2FA secret has been generated. Scan the QR code with your authenticator app.",
      })
    } catch (error) {
      console.error("Error generating 2FA secret:", error)
      toast({
        title: "Error generating 2FA secret",
        description: error.message || "There was an error generating the 2FA secret.",
        variant: "destructive",
      })
    } finally {
      setGenerating2FA(false)
    }
  }

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(securitySettings.secretKey)
    toast({
      title: "Secret key copied",
      description: "The 2FA secret key has been copied to your clipboard.",
    })
  }

  const handleSaveSettings = async () => {
    // Here you would typically send the settings to your backend API
    console.log("Saving settings:", {
      generalSettings,
      userSettings,
      paymentSettings,
      emailSettings,
      securitySettings,
      socialSettings,
      headerScrollerSettings,
      footerContent,
      termsContent,
    })
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generalSettings,
          userSettings,
          paymentSettings,
          emailSettings,
          securitySettings,
          socialSettings,
          headerScrollerSettings,
          footerContent,
          termsContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save settings")
      }

      toast({
        title: "Settings saved",
        description: "Your platform settings have been updated successfully.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleApplyLink = () => {
    if (footerEditor && linkUrl) {
      footerEditor
        .chain()
        .focus()
        .setLink({
          href: linkUrl,
          target: linkOpenInNewTab ? "_blank" : null,
        })
        .run()

      setLinkDialogOpen(false)
      setLinkUrl("")
    }
  }

  const handleEditHtml = () => {
    if (footerEditor) {
      setHtmlContent(footerEditor.getHTML())
      setHtmlDialogOpen(true)
    }
  }

  const handleApplyHtml = () => {
    if (footerEditor && htmlContent) {
      try {
        footerEditor.commands.setContent(htmlContent)
        setHtmlDialogOpen(false)
        toast({
          title: "HTML updated",
          description: "The HTML content has been updated successfully.",
        })
      } catch (error) {
        console.error("Error updating HTML:", error)
        toast({
          title: "Error updating HTML",
          description: "There was an error updating the HTML content. Please check your HTML syntax.",
          variant: "destructive",
        })
      }
    }
  }

  // Function to view the terms page in a new tab
  const handleViewTermsPage = () => {
    window.open("/terms", "_blank")
  }

  // Add this function to calculate SOL amount from USD (after other functions)
  const calculateSolFromUsd = (usdAmount: string): string => {
    const usd = Number.parseFloat(usdAmount)
    if (isNaN(usd) || usd <= 0 || solPrice <= 0) return "0"

    const solAmount = usd / solPrice
    return solAmount.toFixed(8) // 8 decimal places for SOL
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="header-footer">Header / Footer</TabsTrigger>
            <TabsTrigger value="terms">Terms Page</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  type="text"
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                <Label htmlFor="siteLogo">Site Logo</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    id="siteLogo"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          setGeneralSettings({ ...generalSettings, siteLogo: event.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {generalSettings.siteLogo && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={generalSettings.siteLogo || "/placeholder.svg"}
                          alt="Site Logo Preview"
                          className="h-12 w-auto object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGeneralSettings({ ...generalSettings, siteLogo: "" })}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Recommended size: 200x50 pixels</p>
                </div>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                <Label htmlFor="siteFavicon">Site Favicon</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    id="siteFavicon"
                    accept="image/x-icon,image/png,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          setGeneralSettings({ ...generalSettings, siteFavicon: event.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {generalSettings.siteFavicon && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={generalSettings.siteFavicon || "/placeholder.svg"}
                          alt="Site Favicon Preview"
                          className="h-8 w-auto object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGeneralSettings({ ...generalSettings, siteFavicon: "" })}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Recommended size: 32x32 or 16x16 pixels (.ico, .png, or .svg)</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="user">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowRegistration"
                  checked={userSettings.allowRegistration}
                  onCheckedChange={(checked) => setUserSettings({ ...userSettings, allowRegistration: checked })}
                />
                <Label htmlFor="allowRegistration">Allow User Registration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireEmailVerification"
                  checked={userSettings.requireEmailVerification}
                  onCheckedChange={(checked) => setUserSettings({ ...userSettings, requireEmailVerification: checked })}
                />
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-2">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Note: All registered users automatically get access to all three roles (seller, affiliate, and
                  customer) when they join.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="payment">
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This platform exclusively uses the Solana blockchain for all transactions.
                </p>
              </div>

              {/* Platform Sales Fees */}
              <div>
                <h3 className="text-lg font-medium mb-4">Platform Sales Fees</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="salesFeeWallet">Wallet Address (for receiving sales fees)</Label>
                    <Input
                      type="text"
                      id="salesFeeWallet"
                      placeholder="Solana wallet address"
                      value={paymentSettings.salesFeeWallet}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, salesFeeWallet: e.target.value })}
                    />
                    <p className="text-sm text-gray-500">
                      Enter the Solana wallet address where platform sales fees will be sent
                    </p>
                  </div>

                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="salesFeePercentage">Sales Percentage Fee (%)</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        id="salesFeePercentage"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.salesFeePercentage}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, salesFeePercentage: e.target.value })}
                        className="max-w-[100px]"
                      />
                      <span className="ml-2">%</span>
                    </div>
                    <p className="text-sm text-gray-500">Percentage of each sale that goes to the platform</p>
                  </div>
                </div>
              </div>

              {/* Platform Withdrawal Fees */}
              <div>
                <h3 className="text-lg font-medium mb-4">Platform Withdrawal Fees</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="withdrawalFeeWallet">Wallet Address (for receiving withdrawal fees)</Label>
                    <Input
                      type="text"
                      id="withdrawalFeeWallet"
                      placeholder="Solana wallet address"
                      value={paymentSettings.withdrawalFeeWallet}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, withdrawalFeeWallet: e.target.value })}
                    />
                    <p className="text-sm text-gray-500">
                      Enter the Solana wallet address where platform withdrawal fees will be sent
                    </p>
                  </div>

                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="withdrawalFeePercentage">Withdrawal Percentage Fee (%)</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        id="withdrawalFeePercentage"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.withdrawalFeePercentage}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, withdrawalFeePercentage: e.target.value })
                        }
                        className="max-w-[100px]"
                      />
                      <span className="ml-2">%</span>
                    </div>
                    <p className="text-sm text-gray-500">Percentage of each withdrawal that goes to the platform</p>
                  </div>
                </div>
              </div>

              {/* Emailing Fees Wallet */}
              <div>
                <h3 className="text-lg font-medium mb-4">Emailing Fees</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="emailingFeeWallet">Wallet Address (for receiving emailing fees)</Label>
                    <Input
                      type="text"
                      id="emailingFeeWallet"
                      placeholder="Solana wallet address"
                      value={paymentSettings.emailingFeeWallet}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, emailingFeeWallet: e.target.value })}
                    />
                    <p className="text-sm text-gray-500">
                      Enter the Solana wallet address where email notification fees will be sent
                    </p>
                  </div>

                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="emailingFeeUsd">Cost per Email (USD)</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        id="emailingFeeUsd"
                        min="0.001"
                        step="0.001"
                        value={paymentSettings.emailingFeeUsd}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, emailingFeeUsd: e.target.value })}
                        className="max-w-[120px]"
                      />
                      <span className="ml-2">USD</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">
                        ≈ {calculateSolFromUsd(paymentSettings.emailingFeeUsd)} SOL per email
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      This is the fee charged to users for each email notification sent to their clients
                    </p>
                  </div>
                </div>
              </div>

              {/* Members Withdrawal Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Members Withdrawal Settings</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="minWithdrawalAmount">Minimum Withdrawal Amount (SOL)</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        id="minWithdrawalAmount"
                        min="0.001"
                        step="0.001"
                        value={paymentSettings.minWithdrawalAmount}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, minWithdrawalAmount: e.target.value })
                        }
                        className="max-w-[120px]"
                      />
                      <span className="ml-2">SOL</span>
                    </div>
                    <p className="text-sm text-gray-500">Smallest amount a user can withdraw</p>
                  </div>

                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="maxWithdrawalAmount">Maximum Withdrawal Amount (SOL)</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        id="maxWithdrawalAmount"
                        min="0.001"
                        step="0.001"
                        value={paymentSettings.maxWithdrawalAmount}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, maxWithdrawalAmount: e.target.value })
                        }
                        className="max-w-[120px]"
                      />
                      <span className="ml-2">SOL</span>
                    </div>
                    <p className="text-sm text-gray-500">Largest amount a user can withdraw at once</p>
                  </div>

                  <div className="grid w-full max-w-md items-center gap-1.5">
                    <Label htmlFor="withdrawalTimerHours">Maximum Withdrawal Timer Reset Period (hours)</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        id="withdrawalTimerHours"
                        min="1"
                        step="1"
                        value={paymentSettings.withdrawalTimerHours}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, withdrawalTimerHours: e.target.value })
                        }
                        className="max-w-[120px]"
                      />
                      <span className="ml-2">hours</span>
                    </div>
                    <p className="text-sm text-gray-500">Cooldown period between maximum withdrawals</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="email">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Configure your email settings below. After configuring, you can send a test email to verify your
                  settings.
                </p>
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  type="text"
                  id="smtpHost"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  type="text"
                  id="smtpPort"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="smtpUser">SMTP User</Label>
                <Input
                  type="text"
                  id="smtpUser"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  type="password"
                  id="smtpPassword"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  type="email"
                  id="senderEmail"
                  value={emailSettings.senderEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  type="text"
                  id="senderName"
                  value={emailSettings.senderName}
                  onChange={(e) => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
                />
              </div>

              <Separator className="my-4" />

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Test Email Configuration</h3>
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="testRecipient">Test Recipient Email</Label>
                  <Input
                    type="email"
                    id="testRecipient"
                    placeholder="Enter email to receive test"
                    value={emailSettings.testRecipient}
                    onChange={(e) => setEmailSettings({ ...emailSettings, testRecipient: e.target.value })}
                  />
                  <Button
                    onClick={handleSendTestEmail}
                    disabled={
                      sendingTestEmail ||
                      !emailSettings.testRecipient ||
                      !emailSettings.smtpHost ||
                      !emailSettings.senderEmail
                    }
                    className="mt-2"
                  >
                    {sendingTestEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">
                    This will send a test email using your current configuration. Make sure to fill in all the SMTP
                    settings above.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Configure two-factor authentication (2FA) to add an extra layer of security to your admin login.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Google Authenticator Setup</h3>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable2FA"
                      checked={securitySettings.enable2FA}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, enable2FA: checked })}
                    />
                    <Label htmlFor="enable2FA">Enable Two-Factor Authentication</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireAdminVerification"
                      checked={securitySettings.requireAdminVerification}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, requireAdminVerification: checked })
                      }
                    />
                    <Label htmlFor="requireAdminVerification">Require 2FA for Admin Access</Label>
                  </div>

                  <div className="mt-4">
                    <Button onClick={handleGenerate2FASecret} disabled={generating2FA} className="flex items-center">
                      {generating2FA ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Generate New 2FA Secret
                        </>
                      )}
                    </Button>
                  </div>

                  {securitySettings.secretKey && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Setup Instructions</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Install Google Authenticator on your mobile device</li>
                        <li>Scan the QR code below or enter the secret key manually</li>
                        <li>Enter the 6-digit code from the app when logging in</li>
                      </ol>

                      <div className="mt-4">
                        <Label htmlFor="secretKey">Secret Key</Label>
                        <div className="flex items-center mt-1">
                          <Input id="secretKey" value={securitySettings.secretKey} readOnly className="font-mono" />
                          <Button variant="outline" size="icon" className="ml-2" onClick={handleCopySecretKey}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Keep this key secret and store it in a safe place as a backup.
                        </p>
                      </div>

                      {securitySettings.qrCodeUrl && (
                        <div className="mt-4">
                          <Label>QR Code</Label>
                          <div className="mt-2 bg-white p-4 inline-block rounded-md">
                            <img
                              src={securitySettings.qrCodeUrl || "/placeholder.svg"}
                              alt="2FA QR Code"
                              className="w-48 h-48"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Scan this QR code with your Google Authenticator app.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mt-4">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Important Security Note
                        </h4>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                          After enabling 2FA, you will need to use your authenticator app to generate a verification
                          code each time you log in. Make sure to save your recovery codes or secret key in a secure
                          location in case you lose access to your authenticator app.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="header-footer">
            <div className="space-y-4">
              <Tabs defaultValue="header" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="header">Header</TabsTrigger>
                  <TabsTrigger value="footer">Footer</TabsTrigger>
                  <TabsTrigger value="socials">Socials</TabsTrigger>
                </TabsList>

                {/* Header Settings */}
                <TabsContent value="header" className="space-y-4 pt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Configure your site header settings here.
                    </p>
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="headerLogo">Header Logo (if different from site logo)</Label>
                    <div className="flex flex-col gap-2">
                      <Input type="file" id="headerLogo" accept="image/*" />
                      <p className="text-sm text-gray-500">Recommended size: 180x45 pixels</p>
                    </div>
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="headerTagline">Header Tagline</Label>
                    <Input
                      type="text"
                      id="headerTagline"
                      placeholder="Enter a short tagline to display in the header"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="stickyHeader" defaultChecked={true} />
                    <Label htmlFor="stickyHeader">Sticky Header</Label>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Header Scroller Settings</h3>
                    <Separator className="mb-4" />

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose which items to display in the header scroller:
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
                        "Referred By: #### | Total Users: #### | Units Sold: #### | Total Earned: #.#### SOL (#.## USD)
                        | 1 SOL = #.## USD"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showReferredBy"
                          checked={headerScrollerSettings.showReferredBy}
                          onCheckedChange={(checked) =>
                            setHeaderScrollerSettings({ ...headerScrollerSettings, showReferredBy: checked })
                          }
                        />
                        <Label htmlFor="showReferredBy">Show "Referred By"</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showTotalUsers"
                          checked={headerScrollerSettings.showTotalUsers}
                          onCheckedChange={(checked) =>
                            setHeaderScrollerSettings({ ...headerScrollerSettings, showTotalUsers: checked })
                          }
                        />
                        <Label htmlFor="showTotalUsers">Show "Total Users"</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showUnitsSold"
                          checked={headerScrollerSettings.showUnitsSold}
                          onCheckedChange={(checked) =>
                            setHeaderScrollerSettings({ ...headerScrollerSettings, showUnitsSold: checked })
                          }
                        />
                        <Label htmlFor="showUnitsSold">Show "Units Sold"</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showTotalEarned"
                          checked={headerScrollerSettings.showTotalEarned}
                          onCheckedChange={(checked) =>
                            setHeaderScrollerSettings({ ...headerScrollerSettings, showTotalEarned: checked })
                          }
                        />
                        <Label htmlFor="showTotalEarned">Show "Total Earned"</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showSolPrice"
                          checked={headerScrollerSettings.showSolPrice}
                          onCheckedChange={(checked) =>
                            setHeaderScrollerSettings({ ...headerScrollerSettings, showSolPrice: checked })
                          }
                        />
                        <Label htmlFor="showSolPrice">Show "SOL Price"</Label>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isScrolling"
                          checked={headerScrollerSettings.isScrolling}
                          onCheckedChange={(checked) =>
                            setHeaderScrollerSettings({ ...headerScrollerSettings, isScrolling: checked })
                          }
                        />
                        <Label htmlFor="isScrolling">Enable Scrolling Animation</Label>
                        <span className="text-xs text-gray-500 ml-2">
                          {headerScrollerSettings.isScrolling ? "(Moving)" : "(Stationary, Center-Aligned)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Footer Settings */}
                <TabsContent value="footer" className="space-y-4 pt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Configure your site footer content here. This rich text editor allows you to fully customize your
                      footer's appearance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-content">Footer Content</Label>
                    {/* Add this function to toggle aspect ratio lock */}
                    <div className="rich-text-editor border rounded-md overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm max-h-[400px] overflow-y-auto compact-line-spacing relative">
                      {/* Toolbar */}
                      <div className="menu-bar flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("bold") ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().toggleBold().run()}
                            className="h-8 w-8 p-0"
                            title="Bold"
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("italic") ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().toggleItalic().run()}
                            className="h-8 w-8 p-0"
                            title="Italic"
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("underline") ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().toggleUnderline().run()}
                            className="h-8 w-8 p-0"
                            title="Underline"
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            className="h-8 w-8 p-0"
                            title="Heading 2"
                          >
                            <Heading2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().toggleHeading({ level: 3 }).run()}
                            className="h-8 w-8 p-0"
                            title="Heading 3"
                          >
                            <Heading3 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().setTextAlign("left").run()}
                            className="h-8 w-8 p-0"
                            title="Align Left"
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().setTextAlign("center").run()}
                            className="h-8 w-8 p-0"
                            title="Align Center"
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().setTextAlign("right").run()}
                            className="h-8 w-8 p-0"
                            title="Align Right"
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("bulletList") ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().toggleBulletList().run()}
                            className="h-8 w-8 p-0"
                            title="Bullet List"
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("orderedList") ? "secondary" : "ghost"}
                            onClick={() => footerEditor?.chain().focus().toggleOrderedList().run()}
                            className="h-8 w-8 p-0"
                            title="Numbered List"
                          >
                            <ListOrdered className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={footerEditor?.isActive("link") ? "secondary" : "ghost"}
                            onClick={() => {
                              if (footerEditor?.isActive("link")) {
                                footerEditor?.chain().focus().unsetLink().run()
                              } else {
                                // Check if there's a selection before opening dialog
                                if (footerEditor && !footerEditor.state.selection.empty) {
                                  // Get current link if exists
                                  const currentLink = footerEditor.getAttributes("link")
                                  setLinkUrl(currentLink.href || "")
                                  setLinkOpenInNewTab(currentLink.target === "_blank")
                                  setLinkDialogOpen(true)
                                } else {
                                  toast({
                                    title: "No selection",
                                    description: "Please select text or an image first.",
                                    variant: "destructive",
                                  })
                                }
                              }
                            }}
                            className="h-8 w-8 p-0"
                            title={footerEditor?.isActive("link") ? "Remove Link" : "Insert Link"}
                          >
                            <Link2 className="h-4 w-4" />
                          </Button>

                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              title="Insert Image"
                              onClick={() => document.getElementById("image-upload")?.click()}
                            >
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleEditHtml}
                            className="h-8 w-8 p-0"
                            title="Edit HTML"
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Editor Content */}
                      <div className="bg-white dark:bg-black min-h-[200px] relative">
                        <EditorContent
                          editor={footerEditor}
                          className="prose-sm prose-img:max-w-full prose-img:mx-auto dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-100 dark:prose-li:text-gray-100 dark:prose-strong:text-white dark:prose-em:text-gray-100 p-4"
                        />

                        {/* Floating Image Toolbar */}
                        {imageFloatingToolbar.show && (
                          <div
                            className="absolute bg-white dark:bg-gray-800 border border-blue-500 rounded-md shadow-lg p-3 z-50 flex flex-col gap-2"
                            style={{
                              top: `${imageFloatingToolbar.top}px`,
                              left: `${imageFloatingToolbar.left}px`,
                              minWidth: "200px",
                            }}
                          >
                            <div className="text-sm font-medium mb-1 text-blue-600 dark:text-blue-400">
                              Image Size Controls
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs w-8">Width:</span>
                              <Input
                                type="number"
                                min="10"
                                value={imageFloatingToolbar.width}
                                onChange={(e) => handleWidthChange(Number.parseInt(e.target.value) || 10)}
                                className="h-7 text-xs"
                              />
                              <span className="text-xs">px</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs w-8">Height:</span>
                              <Input
                                type="number"
                                min="10"
                                value={imageFloatingToolbar.height}
                                onChange={(e) => handleHeightChange(Number.parseInt(e.target.value) || 10)}
                                className="h-7 text-xs"
                              />
                              <span className="text-xs">px</span>
                            </div>

                            <Button
                              size="sm"
                              variant={imageFloatingToolbar.locked ? "default" : "outline"}
                              className="text-xs h-7 mt-1"
                              onClick={toggleAspectRatioLock}
                            >
                              {imageFloatingToolbar.locked ? "🔒 Aspect Ratio Locked" : "🔓 Aspect Ratio Unlocked"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mt-2">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <span className="font-medium">Tip:</span> You can use the rich text editor to create multiple
                      columns for your footer by using different heading levels and paragraphs.
                    </p>
                  </div>
                </TabsContent>

                {/* Socials Settings */}
                <TabsContent value="socials" className="space-y-4 pt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Configure your social media links here. These will appear in the footer only.
                    </p>
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="twitterUrl">Twitter URL</Label>
                    <Input
                      type="url"
                      id="twitterUrl"
                      value={socialSettings.twitterUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, twitterUrl: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input
                      type="url"
                      id="facebookUrl"
                      value={socialSettings.facebookUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, facebookUrl: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      type="url"
                      id="instagramUrl"
                      value={socialSettings.instagramUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, instagramUrl: e.target.value })}
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="discordUrl">Discord URL</Label>
                    <Input
                      type="url"
                      id="discordUrl"
                      value={socialSettings.discordUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, discordUrl: e.target.value })}
                    />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <Input
                      type="url"
                      id="youtubeUrl"
                      placeholder="https://youtube.com/c/yourchannel"
                      value={socialSettings.youtubeUrl || ""}
                      onChange={(e) => setSocialSettings({ ...socialSettings, youtubeUrl: e.target.value })}
                    />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="telegramUrl">Telegram URL</Label>
                    <Input
                      type="url"
                      id="telegramUrl"
                      placeholder="https://t.me/yourchannel"
                      value={socialSettings.telegramUrl || ""}
                      onChange={(e) => setSocialSettings({ ...socialSettings, telegramUrl: e.target.value })}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Terms Page Content */}
          <TabsContent value="terms">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md flex-1 mr-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Edit your site's Terms and Conditions page content. This rich text editor allows you to fully
                    customize your terms page.
                  </p>
                </div>
                <Button onClick={handleViewTermsPage} variant="outline" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Terms Page
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms-content">Terms Page Content</Label>
                <div className="rich-text-editor border rounded-md overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm max-h-[600px] overflow-y-auto compact-line-spacing relative">
                  {/* Toolbar */}
                  <div className="menu-bar flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("bold") ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().toggleBold().run()}
                        className="h-8 w-8 p-0"
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("italic") ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().toggleItalic().run()}
                        className="h-8 w-8 p-0"
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("underline") ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().toggleUnderline().run()}
                        className="h-8 w-8 p-0"
                        title="Underline"
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="h-8 w-8 p-0"
                        title="Heading 2"
                      >
                        <Heading2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().toggleHeading({ level: 3 }).run()}
                        className="h-8 w-8 p-0"
                        title="Heading 3"
                      >
                        <Heading3 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().setTextAlign("left").run()}
                        className="h-8 w-8 p-0"
                        title="Align Left"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().setTextAlign("center").run()}
                        className="h-8 w-8 p-0"
                        title="Align Center"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().setTextAlign("right").run()}
                        className="h-8 w-8 p-0"
                        title="Align Right"
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("bulletList") ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().toggleBulletList().run()}
                        className="h-8 w-8 p-0"
                        title="Bullet List"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("orderedList") ? "secondary" : "ghost"}
                        onClick={() => termsEditor?.chain().focus().toggleOrderedList().run()}
                        className="h-8 w-8 p-0"
                        title="Numbered List"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant={termsEditor?.isActive("link") ? "secondary" : "ghost"}
                        onClick={() => {
                          if (termsEditor?.isActive("link")) {
                            termsEditor?.chain().focus().unsetLink().run()
                          } else {
                            // Check if there's a selection before opening dialog
                            if (termsEditor && !termsEditor.state.selection.empty) {
                              // Get current link if exists
                              const currentLink = termsEditor.getAttributes("link")
                              setLinkUrl(currentLink.href || "")
                              setLinkOpenInNewTab(currentLink.target === "_blank")
                              setLinkDialogOpen(true)
                            } else {
                              toast({
                                title: "No selection",
                                description: "Please select text first.",
                                variant: "destructive",
                              })
                            }
                          }
                        }}
                        className="h-8 w-8 p-0"
                        title={termsEditor?.isActive("link") ? "Remove Link" : "Insert Link"}
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="bg-white dark:bg-black min-h-[400px] relative">
                    <EditorContent
                      editor={termsEditor}
                      className="prose prose-sm max-w-none focus:outline-none min-h-[400px] dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-100 dark:prose-li:text-gray-100 dark:prose-strong:text-white dark:prose-em:text-gray-100 p-4"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mt-2">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <span className="font-medium">Important:</span> Make sure your terms and conditions comply with
                  relevant laws and regulations. Consider consulting with a legal professional to ensure your terms are
                  legally sound.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </CardContent>
      {/* Image Upload Dialog */}
      <Dialog open={imageUploadOpen} onOpenChange={setImageUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => {
                setImageUploadOpen(false)
                setUploadedImage(null)
                setImageSize(100)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-4">
            {uploadedImage && (
              <div className="flex flex-col items-center gap-4">
                <div className="border rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800 p-2">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Preview"
                    style={{ width: `${imageSize}%` }}
                    className="max-w-full max-h-[300px] object-contain mx-auto"
                  />
                </div>

                <div className="w-full space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Size: {imageSize}%</span>
                    <Button variant="outline" size="sm" onClick={() => setImageSize(100)}>
                      Reset
                    </Button>
                  </div>
                  <Slider
                    value={[imageSize]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(value) => setImageSize(value[0])}
                  />
                </div>

                <div className="flex justify-end w-full gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImageUploadOpen(false)
                      setUploadedImage(null)
                      setImageSize(100)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={insertImage}>Insert Image</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setLinkDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="open-in-new-tab" checked={linkOpenInNewTab} onCheckedChange={setLinkOpenInNewTab} />
              <Label htmlFor="open-in-new-tab">Open in new tab</Label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyLink} disabled={!linkUrl}>
                Apply Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* HTML Edit Dialog */}
      <Dialog open={htmlDialogOpen} onOpenChange={setHtmlDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit HTML</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setHtmlDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="html-content">HTML Content</Label>
              <Textarea
                id="html-content"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="font-mono text-sm h-[400px] overflow-y-auto"
              />
              <p className="text-xs text-gray-500">
                Edit the HTML directly. Be careful with syntax as incorrect HTML may break the editor.
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setHtmlDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyHtml} disabled={!htmlContent}>
                Apply HTML
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
;<style jsx global>{`
/* Compact line spacing for editor content */
.compact-line-spacing .ProseMirror p {
  margin: 0.5em 0;
}

.compact-line-spacing .ProseMirror h1,
.compact-line-spacing .ProseMirror h2,
.compact-line-spacing .ProseMirror h3,
.compact-line-spacing .ProseMirror h4,
.compact-line-spacing .ProseMirror h5,
.compact-line-spacing .ProseMirror h6 {
  margin: 0.7em 0 0.3em 0;
}

.compact-line-spacing .ProseMirror ul,
.compact-line-spacing .ProseMirror ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.compact-line-spacing .ProseMirror li p {
  margin: 0.2em 0;
}
`}</style>
