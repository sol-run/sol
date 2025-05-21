"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, User, Power } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import {
  Settings,
  History,
  Lock,
  Shield,
  LogOut,
  X,
  Globe,
  Monitor,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  Award,
} from "lucide-react"

const marqueeStyles = `
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
.scrolling-text {
  display: inline-block;
  white-space: nowrap;
  animation: scroll 60s linear infinite;
  animation-delay: 0s;
}
.scrolling-text:hover {
  animation-play-state: paused;
}
`

const formatNumberWithSpaces = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

const handleFileUpload = (file) => {
  // Check if file is an image
  if (!file.type.match("image.*")) {
    alert("Please select an image file")
    return false
  }

  // Check file size (limit to 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("Image size should be less than 2MB")
    return false
  }

  return true
}

export default function Header() {
  const { isLoggedIn, login, logout } = useAuth()
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isOnDashboard = pathname?.includes("/dashboard")

  const [mounted, setMounted] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [loginHistoryOpen, setLoginHistoryOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [setup2FAOpen, setSetup2FAOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [twoFactorQRCode, setTwoFactorQRCode] = useState("/placeholder.svg?height=200&width=200")
  const [twoFactorSecret, setTwoFactorSecret] = useState("ABCDEF123456")
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "January 15, 2025",
    role: "Premium Member",
    purchases: 12,
    earnings: 1250.75,
    lastLogin: "March 4, 2025 - 9:30 PM",
    location: "New York, USA",
    bio: "Digital entrepreneur and content creator specializing in educational resources and digital products.",
  })
  const [loginHistory, setLoginHistory] = useState([
    {
      date: "March 4, 2025 - 9:30 PM",
      status: "Success",
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      location: "New York, USA",
    },
    {
      date: "March 3, 2025 - 2:15 PM",
      status: "Success",
      ip: "192.168.1.1",
      device: "Safari on iPhone",
      location: "New York, USA",
    },
    {
      date: "February 28, 2025 - 11:45 AM",
      status: "Failed",
      ip: "203.0.113.1",
      device: "Firefox on MacOS",
      location: "Los Angeles, USA",
    },
    {
      date: "February 25, 2025 - 8:20 AM",
      status: "Success",
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      location: "New York, USA",
    },
  ])

  const [profileEditDialogOpen, setProfileEditDialogOpen] = useState(false)
  const [editBio, setEditBio] = useState("")
  const [editAvatar, setEditAvatar] = useState("")
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // useEffect(() => {
  //   // Check login status on component mount
  //   const loginStatus = localStorage.getItem("isLoggedIn") === "true"
  //   setIsLoggedIn(loginStatus)
  // }, [])

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false)
    router.push("/")
  }

  const handleLogin = () => {
    login("user123")
  }

  const navigateToDashboard = () => {
    router.push("/dashboard")
  }

  const openProfileDialog = () => {
    setProfileDialogOpen(true)
    setProfileMenuOpen(false)
  }

  const openSettingsDialog = () => {
    setSettingsDialogOpen(true)
    setProfileMenuOpen(false)
  }

  const openLoginHistory = () => {
    setLoginHistoryOpen(true)
    setProfileMenuOpen(false)
  }

  const openChangePassword = () => {
    setChangePasswordOpen(true)
    setProfileMenuOpen(false)
  }

  const openSetup2FA = () => {
    setSetup2FAOpen(true)
    setProfileMenuOpen(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    // Validation
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match")
      return
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters")
      return
    }

    // Here you would call your API to change the password
    console.log("Changing password", { currentPassword, newPassword })

    // Reset form and close modal
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setChangePasswordOpen(false)

    // Show success message
    alert("Password changed successfully")
  }

  const handleSetup2FA = (e) => {
    e.preventDefault()

    // Here you would validate the 2FA code against the secret
    console.log("Setting up 2FA with code", twoFactorCode)

    // Reset form and close modal
    setTwoFactorCode("")
    setSetup2FAOpen(false)

    // Show success message
    alert("Two-factor authentication enabled successfully")
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert("Secret key copied to clipboard")
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()

    // Here you would call your API to update the user's profile
    console.log("Updating profile", { bio: editBio, avatar: editAvatar })

    // Update the user profile in state
    setUserProfile({
      ...userProfile,
      bio: editBio,
      avatar: editAvatar || userProfile.avatar,
    })

    // Close the dialog
    setProfileEditDialogOpen(false)

    // Show success message
    alert("Profile updated successfully")
  }

  const [stats, setStats] = useState({
    totalUsers: 0,
    unitsSold: 0,
    totalEarned: 0,
    solPrice: 0,
  })

  useEffect(() => {
    const updateStats = () => {
      setStats({
        totalUsers: Math.floor(Math.random() * 10000),
        unitsSold: Math.floor(Math.random() * 5000),
        totalEarned: Math.random() * 1000,
        solPrice: 20 + Math.random() * 5,
      })
    }
    updateStats()
    const interval = setInterval(updateStats, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest(".profile-menu-container")) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileMenuOpen])

  return (
    <header
      className="bg-white dark:bg-gray-800 dark:text-white shadow-md sticky top-0 z-50"
      style={{ height: "auto" }}
    >
      <nav className="w-full bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex justify-between items-center mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sol.Run_0a-4299JT5ovA1RSYHLxRGg3IDaZiXz49.png"
                  alt="Sol.Run Logo"
                  width={120}
                  height={30}
                  priority
                  className="h-8 w-auto"
                />
              </Link>
              <div className="flex md:hidden items-center space-x-2">
                {isLoggedIn && !isOnDashboard && (
                  <Button
                    onClick={navigateToDashboard}
                    variant="outline"
                    className="
                      border-purple-500 hover:border-purple-400 
                      shadow-[0_0_10px_3px_rgba(168,85,247,0.2)] 
                      hover:shadow-[0_0_15px_5px_rgba(168,85,247,0.3)] 
                      dark:border-purple-500 dark:hover:border-purple-400 
                      dark:shadow-[0_0_10px_3px_rgba(168,85,247,0.4)] 
                      dark:hover:shadow-[0_0_15px_5px_rgba(168,85,247,0.5)] 
                      transition-all duration-300
                    "
                  >
                    Dashboard
                  </Button>
                )}
                {!isLoggedIn && (
                  <Button
                    onClick={handleLogin}
                    variant="outline"
                    className="
                      border-purple-500 hover:border-purple-400 
                      shadow-[0_0_10px_3px_rgba(168,85,247,0.2)] 
                      hover:shadow-[0_0_15px_5px_rgba(168,85,247,0.3)] 
                      dark:border-purple-500 dark:hover:border-purple-400 
                      dark:shadow-[0_0_10px_3px_rgba(168,85,247,0.4)] 
                      dark:hover:shadow-[0_0_15px_5px_rgba(168,85,247,0.5)] 
                      transition-all duration-300
                    "
                  >
                    Login / Register
                  </Button>
                )}
                {isLoggedIn && (
                  <div className="relative profile-menu-container">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 border border-gray-200 dark:border-gray-700"
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    >
                      <div className="bg-purple-600 text-white flex items-center justify-center h-full w-full rounded-full border-2 border-purple-300 dark:border-purple-700">
                        <Power className="h-5 w-5" />
                      </div>
                    </Button>
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-72 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={openProfileDialog}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Your Profile
                          </button>
                          <button
                            onClick={openSettingsDialog}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </button>
                          <button
                            onClick={openLoginHistory}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <History className="mr-2 h-4 w-4" />
                            Login History
                          </button>
                          <button
                            onClick={openChangePassword}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Change Password
                          </button>
                          <button
                            onClick={openSetup2FA}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Setup 2FA
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="ml-2"
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-hidden md:mx-4">
              <style>{marqueeStyles}</style>
              <div className="overflow-hidden bg-transparent text-gray-700 dark:text-gray-200 py-1 px-2 rounded">
                <div
                  className="scrolling-text text-sm text-gray-700 dark:text-gray-200"
                  style={{ paddingRight: "100%" }}
                >
                  <span className="font-bold text-gray-900 dark:text-white">Referred By:</span> username{" "}
                  <span className="font-bold text-gray-900 dark:text-white">| Total Users:</span> {stats.totalUsers}{" "}
                  <span className="font-bold text-gray-900 dark:text-white">| Units Sold:</span> {stats.unitsSold}{" "}
                  <span className="font-bold text-gray-900 dark:text-white">| Total Earned:</span>{" "}
                  {Math.floor(stats.totalEarned)}.{stats.totalEarned.toFixed(4).split(".")[1]} SOL (
                  {Math.floor(stats.totalEarned * stats.solPrice)}.
                  {(stats.totalEarned * stats.solPrice).toFixed(2).split(".")[1]} USD){" "}
                  <span className="font-bold text-gray-900 dark:text-white">| 1 SOL =</span>{" "}
                  {Math.floor(stats.solPrice)}.{stats.solPrice.toFixed(2).split(".")[1]} USD &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="font-bold text-gray-900 dark:text-white">Referred By:</span> username{" "}
                  <span className="font-bold text-gray-900 dark:text-white">| Total Users:</span> {stats.totalUsers}{" "}
                  <span className="font-bold text-gray-900 dark:text-white">| Units Sold:</span> {stats.unitsSold}{" "}
                  <span className="font-bold text-gray-900 dark:text-white">| Total Earned:</span>{" "}
                  {Math.floor(stats.totalEarned)}.{stats.totalEarned.toFixed(4).split(".")[1]} SOL (
                  {Math.floor(stats.totalEarned * stats.solPrice)}.
                  {(stats.totalEarned * stats.solPrice).toFixed(2).split(".")[1]} USD){" "}
                  <span className="font-bold text-gray-900 dark:text-white">| 1 SOL =</span>{" "}
                  {Math.floor(stats.solPrice)}.{stats.solPrice.toFixed(2).split(".")[1]} USD
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-4">
              {(!isLoggedIn || (isLoggedIn && !isOnDashboard)) && (
                <Button
                  onClick={isLoggedIn ? navigateToDashboard : handleLogin}
                  variant="outline"
                  className="
                    border-purple-500 hover:border-purple-400 
                    shadow-[0_0_10px_3px_rgba(168,85,247,0.2)] 
                    hover:shadow-[0_0_15px_5px_rgba(168,85,247,0.3)] 
                    dark:border-purple-500 dark:hover:border-purple-400 
                    dark:shadow-[0_0_10px_3px_rgba(168,85,247,0.4)] 
                    dark:hover:shadow-[0_0_15px_5px_rgba(168,85,247,0.5)] 
                    transition-all duration-300
                  "
                >
                  {isLoggedIn ? "Dashboard" : "Login / Register"}
                </Button>
              )}
              {isLoggedIn && (
                <div className="relative profile-menu-container">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 border border-gray-200 dark:border-gray-700"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <div className="bg-purple-600 text-white flex items-center justify-center h-full w-full rounded-full border-2 border-purple-300 dark:border-purple-700">
                      <Power className="h-5 w-5" />
                    </div>
                  </Button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={openProfileDialog}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Your Profile
                        </button>
                        <button
                          onClick={openSettingsDialog}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </button>
                        <button
                          onClick={openLoginHistory}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <History className="mr-2 h-4 w-4" />
                          Login History
                        </button>
                        <button
                          onClick={openChangePassword}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Change Password
                        </button>
                        <button
                          onClick={openSetup2FA}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Setup 2FA
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {mounted && (
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Global dialogs that can be triggered from both mobile and desktop menus */}
      {profileDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
          <div className="w-full max-w-[95%] sm:max-w-md rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <Button variant="ghost" size="icon" onClick={() => setProfileDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden">
                  <img
                    src={userProfile.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-medium">{userProfile.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm">{userProfile.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm">Joined {userProfile.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm">{userProfile.purchases} Purchases</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm">${userProfile.earnings.toFixed(2)} Total Earnings</span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Bio</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">{userProfile.bio}</p>
              </div>

              <div className="pt-2 flex space-x-3">
                <Button
                  onClick={() => {
                    setEditBio(userProfile.bio)
                    setEditAvatar(userProfile.avatar)
                    setProfileEditDialogOpen(true)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={() => {
                    setProfileDialogOpen(false)
                    router.push("/dashboard")
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {loginHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
          <div className="w-full max-w-[95%] sm:max-w-md rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Login History</h3>
              <Button variant="ghost" size="icon" onClick={() => setLoginHistoryOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <div className="space-y-4">
                {loginHistory.map((login, index) => (
                  <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{login.date}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${login.status === "Success" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}
                      >
                        {login.status}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Globe className="mr-1 h-3 w-3" />
                        IP: {login.ip}
                      </div>
                      <div className="flex items-center mt-1">
                        <Monitor className="mr-1 h-3 w-3" />
                        {login.device}
                      </div>
                      <div className="flex items-center mt-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        {login.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {changePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
          <div className="w-full max-w-[95%] sm:max-w-md rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <Button variant="ghost" size="icon" onClick={() => setChangePasswordOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1                    text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                    minLength={8}
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Update Password
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {setup2FAOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
          <div className="w-full max-w-[95%] sm:max-w-md rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Setup Two-Factor Authentication</h3>
              <Button variant="ghost" size="icon" onClick={() => setSetup2FAOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scan the QR code below with your authenticator app (like Google Authenticator or Authy) to set up
                two-factor authentication.
              </p>
              <div className="flex justify-center">
                <img src={twoFactorQRCode || "/placeholder.svg"} alt="QR Code for 2FA" className="h-48 w-48" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Or enter this code manually in your app:
                </p>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                    {twoFactorSecret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(twoFactorSecret)}
                    className="text-xs"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <form onSubmit={handleSetup2FA} className="pt-2">
                <div>
                  <label
                    htmlFor="verification-code"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verification-code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter 6-digit code"
                    required
                    pattern="[0-9]{6}"
                  />
                </div>
                <div className="mt-4">
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Verify and Enable 2FA
                  </Button>
                </div>
              </form>
              <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                Important: Save your recovery codes in a safe place. You'll need them if you lose access to your
                authenticator app.
              </p>
            </div>
          </div>
        </div>
      )}
      {profileEditDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
          <div className="w-full max-w-[95%] sm:max-w-md rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <Button variant="ghost" size="icon" onClick={() => setProfileEditDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={editAvatar || "/placeholder.svg?height=80&width=80"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium inline-block"
                        >
                          Upload Image
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file && handleFileUpload(file)) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                setEditAvatar(event.target?.result as string)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Or enter an image URL:</p>
                      <input
                        type="text"
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        placeholder="Enter image URL"
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recommended: Square image, at least 200x200 pixels
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div className="pt-2 flex space-x-3">
                  <Button
                    type="button"
                    onClick={() => setProfileEditDialogOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {settingsDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
          <div className="w-full max-w-[95%] sm:max-w-md rounded-lg bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Account Settings</h3>
              <Button variant="ghost" size="icon" onClick={() => setSettingsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSettingsDialogOpen(false)
                alert("Settings updated successfully")
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Notifications
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-marketing"
                        defaultChecked={true}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="email-marketing" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Marketing emails
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-updates"
                        defaultChecked={true}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="email-updates" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Product updates
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email-security"
                        defaultChecked={true}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="email-security" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Security alerts
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Privacy Settings
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="privacy-profile"
                        defaultChecked={false}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="privacy-profile" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Make profile private
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="privacy-activity"
                        defaultChecked={true}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="privacy-activity" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Show activity status
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                  <select className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="pt-2 flex space-x-3">
                  <Button
                    type="button"
                    onClick={() => setSettingsDialogOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
