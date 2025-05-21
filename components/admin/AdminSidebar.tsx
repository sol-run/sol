"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  History,
  Mail,
  FileText,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  activeTransactionSubsection: string | null
  setActiveTransactionSubsection: (subsection: string | null) => void
  activeEmailSubsection: string | null
  setActiveEmailSubsection: (subsection: string | null) => void
  activeBlogSubsection?: string | null
  setActiveBlogSubsection?: (subsection: string | null) => void
  isMobile?: boolean
}

export function AdminSidebar({
  activeSection,
  setActiveSection,
  activeTransactionSubsection,
  setActiveTransactionSubsection,
  activeEmailSubsection,
  setActiveEmailSubsection,
  activeBlogSubsection,
  setActiveBlogSubsection,
  isMobile = false,
}: AdminSidebarProps) {
  const [transactionsExpanded, setTransactionsExpanded] = useState(false)
  const [emailExpanded, setEmailExpanded] = useState(false)
  const [blogExpanded, setBlogExpanded] = useState(false)
  const [homepageExpanded, setHomepageExpanded] = useState(false)
  const [activeHomepageSubsection, setActiveHomepageSubsection] = useState<string | null>(null)

  const handleSectionClick = (section: string) => {
    if (section === "transactionsHistory") {
      setTransactionsExpanded(!transactionsExpanded)
      if (!transactionsExpanded && !activeTransactionSubsection) {
        setActiveTransactionSubsection("withdrawals")
      }
    } else if (section === "emailManagement") {
      setEmailExpanded(!emailExpanded)
      if (!emailExpanded && !activeEmailSubsection) {
        setActiveEmailSubsection("systemNotifications")
      }
    } else if (section === "blogManagement") {
      setBlogExpanded(!blogExpanded)
      if (!blogExpanded && !activeBlogSubsection && setActiveBlogSubsection) {
        setActiveBlogSubsection("blogPosts")
      }
    } else if (section === "homepage") {
      setHomepageExpanded(!homepageExpanded)
      if (!homepageExpanded && !activeHomepageSubsection) {
        setActiveHomepageSubsection("general")
      }
      setActiveSection("homepage")
    } else {
      setActiveSection(section)
    }
  }

  const handleTransactionSubsectionClick = (subsection: string) => {
    setActiveTransactionSubsection(subsection)
    setActiveSection("transactionsHistory")
  }

  const handleEmailSubsectionClick = (subsection: string) => {
    setActiveEmailSubsection(subsection)
    setActiveSection("emailManagement")
  }

  const handleBlogSubsectionClick = (subsection: string) => {
    if (setActiveBlogSubsection) {
      setActiveBlogSubsection(subsection)
      setActiveSection("blogManagement")
    }
  }

  const handleHomepageSubsectionClick = (subsection: string) => {
    setActiveHomepageSubsection(subsection)
    setActiveSection("homepage")
  }

  // Adjust button size for mobile
  const buttonSize = isMobile ? "sm" : "default"
  const iconSize = isMobile ? "h-4 w-4" : "h-5 w-5"
  const textSize = isMobile ? "text-sm" : "text-base"

  const sidebarContent = (
    <nav className={cn("flex-1 px-2 space-y-1", isMobile && "px-3")}>
      <Button
        variant="ghost"
        size={buttonSize}
        className={cn(
          "w-full justify-start",
          activeSection === "dashboard" && "bg-gray-100 dark:bg-gray-700",
          textSize,
        )}
        onClick={() => handleSectionClick("dashboard")}
      >
        <BarChart3 className={cn("mr-3", iconSize)} />
        Dashboard
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn("w-full justify-start", activeSection === "users" && "bg-gray-100 dark:bg-gray-700", textSize)}
        onClick={() => handleSectionClick("users")}
      >
        <Users className={cn("mr-3", iconSize)} />
        User Management
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn("w-full justify-start", activeSection === "products" && "bg-gray-100 dark:bg-gray-700", textSize)}
        onClick={() => handleSectionClick("products")}
      >
        <ShoppingBag className={cn("mr-3", iconSize)} />
        Product Management
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn(
          "w-full justify-start",
          activeSection === "affiliateStats" && "bg-gray-100 dark:bg-gray-700",
          textSize,
        )}
        onClick={() => handleSectionClick("affiliateStats")}
      >
        <BarChart3 className={cn("mr-3", iconSize)} />
        Affiliate Statistics
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn(
          "w-full justify-start",
          activeSection === "transactionsHistory" && "bg-gray-100 dark:bg-gray-700",
          textSize,
        )}
        onClick={() => handleSectionClick("transactionsHistory")}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <History className={cn("mr-3", iconSize)} />
            Transaction History
          </div>
          {transactionsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </Button>

      {transactionsExpanded && (
        <div className={cn("pl-10 space-y-1", isMobile && "pl-8")}>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "transactionsHistory" &&
                activeTransactionSubsection === "withdrawals" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleTransactionSubsectionClick("withdrawals")}
          >
            Withdrawals
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "transactionsHistory" &&
                activeTransactionSubsection === "purchases" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleTransactionSubsectionClick("purchases")}
          >
            Purchases
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "transactionsHistory" &&
                activeTransactionSubsection === "platformFees" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleTransactionSubsectionClick("platformFees")}
          >
            Platform Fees
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "transactionsHistory" &&
                activeTransactionSubsection === "earnings" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleTransactionSubsectionClick("earnings")}
          >
            Earning History
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn(
          "w-full justify-start",
          activeSection === "dashboardManagement" && "bg-gray-100 dark:bg-gray-700",
          textSize,
        )}
        onClick={() => handleSectionClick("dashboardManagement")}
      >
        <LayoutDashboard className={cn("mr-3", iconSize)} />
        User Dashboard
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn("w-full justify-start", activeSection === "homepage" && "bg-gray-100 dark:bg-gray-700", textSize)}
        onClick={() => handleSectionClick("homepage")}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <FileText className={cn("mr-3", iconSize)} />
            Homepage Settings
          </div>
          {homepageExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </Button>

      {homepageExpanded && (
        <div className={cn("pl-10 space-y-1", isMobile && "pl-8")}>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "homepage" && activeHomepageSubsection === "general" && "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleHomepageSubsectionClick("general")}
          >
            General Settings
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "homepage" &&
                activeHomepageSubsection === "salesVideo" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleHomepageSubsectionClick("salesVideo")}
          >
            Sales Video
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn(
          "w-full justify-start",
          activeSection === "blogManagement" && "bg-gray-100 dark:bg-gray-700",
          textSize,
        )}
        onClick={() => handleSectionClick("blogManagement")}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <FileText className={cn("mr-3", iconSize)} />
            Blog Management
          </div>
          {blogExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </Button>

      {blogExpanded && (
        <div className={cn("pl-10 space-y-1", isMobile && "pl-8")}>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "blogManagement" &&
                activeBlogSubsection === "blogPosts" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleBlogSubsectionClick("blogPosts")}
          >
            Blog Posts
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "blogManagement" &&
                activeBlogSubsection === "blogCategories" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleBlogSubsectionClick("blogCategories")}
          >
            Categories
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "blogManagement" &&
                activeBlogSubsection === "blogEmails" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleBlogSubsectionClick("blogEmails")}
          >
            Email Updates
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "blogManagement" &&
                activeBlogSubsection === "featuredPosts" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleBlogSubsectionClick("featuredPosts")}
          >
            Featured Posts
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn(
          "w-full justify-start",
          activeSection === "emailManagement" && "bg-gray-100 dark:bg-gray-700",
          textSize,
        )}
        onClick={() => handleSectionClick("emailManagement")}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Mail className={cn("mr-3", iconSize)} />
            Email Management
          </div>
          {emailExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </Button>

      {emailExpanded && (
        <div className={cn("pl-10 space-y-1", isMobile && "pl-8")}>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "emailManagement" &&
                activeEmailSubsection === "systemNotifications" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleEmailSubsectionClick("systemNotifications")}
          >
            System Notifications
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "emailManagement" &&
                activeEmailSubsection === "newsletters" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleEmailSubsectionClick("newsletters")}
          >
            Newsletters
          </Button>
          <Button
            variant="ghost"
            size={buttonSize}
            className={cn(
              "w-full justify-start text-sm",
              activeSection === "emailManagement" &&
                activeEmailSubsection === "autoresponder" &&
                "bg-gray-100 dark:bg-gray-700",
            )}
            onClick={() => handleEmailSubsectionClick("autoresponder")}
          >
            Autoresponder
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn("w-full justify-start", activeSection === "support" && "bg-gray-100 dark:bg-gray-700", textSize)}
        onClick={() => handleSectionClick("support")}
      >
        <Users className={cn("mr-3", iconSize)} />
        Support Management
      </Button>

      <Button
        variant="ghost"
        size={buttonSize}
        className={cn("w-full justify-start", activeSection === "settings" && "bg-gray-100 dark:bg-gray-700", textSize)}
        onClick={() => handleSectionClick("settings")}
      >
        <Settings className={cn("mr-3", iconSize)} />
        Platform Settings
      </Button>
    </nav>
  )

  // For mobile view, we just return the content
  if (isMobile) {
    return sidebarContent
  }

  // For desktop view, we wrap it in the sidebar container
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center flex-shrink-0 px-4">
          <Link href="/admin" className="text-xl font-semibold text-gray-800 dark:text-white">
            Sol Run Admin
          </Link>
        </div>
        <div className="mt-5 flex-grow flex flex-col">{sidebarContent}</div>
      </div>
    </div>
  )
}
