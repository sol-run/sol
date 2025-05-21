"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Eye } from "lucide-react"

export default function LoginRegister() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "login" | "register" | "forgotPassword">("email")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)
  const [associatedUsername, setAssociatedUsername] = useState("")
  const router = useRouter()
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "tkkeithm@gmail.com") {
      setStep("login")
      setAssociatedUsername("demo")
    } else {
      setStep("register")
      setAssociatedUsername("")
    }
  }

  const checkUsernameAvailability = (username: string) => {
    const unavailableUsernames = ["demo", "admin", "user"]
    const isAvailable = !unavailableUsernames.includes(username.toLowerCase())
    setIsUsernameAvailable(isAvailable)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "tkkeithm@gmail.com" && password === "demo") {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", "demo")
      router.push("/dashboard")
    } else {
      alert("Invalid credentials. Please use username: demo and password: demo")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isUsernameAvailable) {
      alert("Please choose an available username")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("username", username)
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[350px] dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">
            {step === "email"
              ? "Login / Register"
              : step === "login"
                ? "Login"
                : step === "register"
                  ? "Register"
                  : "Forgot Password"}
          </CardTitle>
          <CardDescription className="dark:text-gray-300">
            {step === "email"
              ? "Enter your email to continue"
              : step === "login"
                ? "Enter your password to login"
                : step === "register"
                  ? "Complete your registration"
                  : "Enter your email to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleContinue}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </form>
          )}
          {step === "login" && (
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="loginEmail">Email</Label>
                  <div className="relative">
                    <Input
                      id="loginEmail"
                      type="email"
                      value={email}
                      disabled
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    {associatedUsername && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xs">
                        [{associatedUsername}]
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                      onMouseDown={() => setShowPassword(true)}
                      onMouseUp={() => setShowPassword(false)}
                      onMouseLeave={() => setShowPassword(false)}
                      onTouchStart={() => setShowPassword(true)}
                      onTouchEnd={() => setShowPassword(false)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="justify-start p-0 dark:hover:bg-gray-700"
                  onClick={() => setStep("forgotPassword")}
                >
                  Forgot password?
                </Button>
              </div>
            </form>
          )}
          {step === "register" && (
            <form onSubmit={handleRegister}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      checkUsernameAvailability(e.target.value)
                    }}
                    required
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  {username && (
                    <p className={`text-sm ${isUsernameAvailable ? "text-green-500" : "text-red-500"}`}>
                      {isUsernameAvailable ? "Username is available" : "Username is not available"}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                      onMouseDown={() => setShowPassword(true)}
                      onMouseUp={() => setShowPassword(false)}
                      onMouseLeave={() => setShowPassword(false)}
                      onTouchStart={() => setShowPassword(true)}
                      onTouchEnd={() => setShowPassword(false)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </form>
          )}
          {step === "forgotPassword" && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert("Password reset link sent to your email")
                setStep("email")
              }}
            >
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </form>
          )}
        </CardContent>
        <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">
          By proceeding you acknowledge and agree to the{" "}
          <Button
            variant="link"
            className="p-0 text-blue-600 hover:underline dark:text-blue-400"
            onClick={() => setIsTermsOpen(true)}
          >
            terms
          </Button>
          .
        </div>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")} className="dark:hover:bg-gray-700">
            Cancel
          </Button>
          <Button
            onClick={
              step === "email"
                ? handleContinue
                : step === "login"
                  ? handleLogin
                  : step === "register"
                    ? handleRegister
                    : () => {
                        alert("Password reset link sent to your email")
                        setStep("email")
                      }
            }
            className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-gray-100"
          >
            {step === "email"
              ? "Continue"
              : step === "login"
                ? "Login"
                : step === "register"
                  ? "Register"
                  : "Reset Password"}
          </Button>
        </CardFooter>
        <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
          <DialogContent variant="auth" className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Terms of Service</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
              <p className="mb-4">Effective Date: Saturday 08th February 2025</p>
              <p className="mb-4">
                Welcome to Sol.Run! By accessing or using our platform, you agree to comply with and be bound by these
                Terms and Conditions. If you do not agree, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold mt-6 mb-4">1. Definitions</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  "Platform" refers to Sol.Run, the digital products marketplace operating on the Solana blockchain.
                </li>
                <li>
                  "User" refers to anyone who registers or uses the platform, including sellers, buyers, and affiliates.
                </li>
                <li>"Seller" refers to a user who lists digital products for sale.</li>
                <li>"Affiliate" refers to a user who promotes products in exchange for commissions.</li>
                <li>"Customer" refers to a user who purchases digital products.</li>
                <li>"Commission" refers to earnings from the platform's affiliate program.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">2. Account Registration & Access</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Users must provide accurate information when signing up.</li>
                <li>Users must be at least 18 years old or have legal guardian permission.</li>
                <li>
                  Sellers, Affiliates, and Customers will have access to different sections of the User Dashboard.
                </li>
                <li>The platform automatically generates a Solana Wallet Address for transactions and commissions.</li>
                <li>Admin Area (/manage) is restricted to authorized personnel only.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">3. Selling on Sol.Run</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Sellers may list digital products such as eBooks, software, videos, audiobooks, and images.</li>
                <li>Sellers are responsible for ensuring their products do not infringe copyright or violate laws.</li>
                <li>Sellers can set up affiliate programs (single-tier or multi-tier, up to 10 levels).</li>
                <li>Platform approval is required before a product goes live.</li>
                <li>The platform deducts a 10% transaction fee per successful order.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">4. Buying Digital Products</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>All purchases are final; refunds are not available due to the nature of digital products.</li>
                <li>Customers receive instant access to download links upon payment confirmation.</li>
                <li>The duration of access depends on the seller's settings (e.g., limited-time or lifetime).</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">5. Affiliate Program</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Affiliates earn commissions by sharing referral links.</li>
                <li>Commissions are paid automatically via Solana upon a successful sale.</li>
                <li>Multi-level affiliate structures (up to 10 levels) depend on the seller's program.</li>
                <li>Fraudulent activity (e.g., self-referrals, fake traffic) will result in account suspension.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">6. Payments & Withdrawals</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Payments are processed via Solana blockchain for speed and transparency.</li>
                <li>Sellers and affiliates can withdraw their earnings from the User Dashboard.</li>
                <li>Withdrawals may be subject to verification for security purposes.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">7. Restricted Content & Activities</h2>
              <p className="mb-4">Users may not:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Sell illegal, copyrighted, or misleading products.</li>
                <li>Use automated scripts, bots, or fraudulent methods to generate commissions.</li>
                <li>Attempt to hack, disrupt, or abuse the platform in any way.</li>
              </ul>
              <p className="mb-4">Violations may result in account termination and legal action.</p>

              <h2 className="text-2xl font-bold mt-6 mb-4">8. Platform Fees & Revenue Sharing</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Sol.Run charges a 10% transaction fee per successful order.</li>
                <li>This fee covers platform maintenance, Solana gas fees, and security measures.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">9. Disclaimers & Liability</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Sol.Run operates as a marketplace and is not responsible for the quality or legality of products
                  listed by sellers.
                </li>
                <li>Users assume full responsibility for their transactions and compliance with local laws.</li>
                <li>The platform is provided "as-is" without warranties of any kind.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">10. Privacy Policy</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>User data is stored securely and is not shared with third parties except as required by law.</li>
                <li>Blockchain transactions are public, but personal data remains confidential.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">11. Modifications & Updates</h2>
              <p className="mb-4">
                These terms may be updated at any time. Continued use of the platform implies acceptance of the latest
                version.
              </p>

              <h2 className="text-2xl font-bold mt-6 mb-4">12. Contact & Support</h2>
              <p className="mb-4">For questions, contact support@sol.run or visit our Help Center.</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsTermsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
