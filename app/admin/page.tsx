"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { UserManagement } from "@/components/admin/UserManagement"
import { ProductManagement } from "@/components/admin/ProductManagement"
import { PaymentManagement } from "@/components/admin/PaymentManagement"
import Analytics from "@/components/admin/Analytics"
import { ContentManagement } from "@/components/admin/ContentManagement"
import { SupportManagement } from "@/components/admin/SupportManagement"
import { PlatformSettings } from "@/components/admin/PlatformSettings"
import { DeveloperTools } from "@/components/admin/DeveloperTools"
import { Customization } from "@/components/admin/Customization"
import { AffiliateStatistics } from "@/components/admin/AffiliateStatistics"
import { WithdrawalsHistory } from "@/components/admin/WithdrawalsHistory"
import { PurchasesHistory } from "@/components/admin/PurchasesHistory"
import { PlatformFeesEarned } from "@/components/admin/PlatformFeesEarned"
import { EarningHistory } from "@/components/admin/EarningHistory"
import { SystemNotifications } from "@/components/admin/SystemNotifications"
import { Newsletters } from "@/components/admin/Newsletters"
import { Autoresponder } from "@/components/admin/Autoresponder"
import { BlogPostManagement } from "@/components/admin/BlogPostManagement"
import { CategoryManagement } from "@/components/admin/CategoryManagement"
import { EmailUpdates } from "@/components/admin/EmailUpdates"
import { FeaturedPostsSelection } from "@/components/admin/FeaturedPostsSelection"
import { AlertTriangle, AlertOctagon, MoreHorizontal, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { HomepageSettings } from "@/components/admin/HomepageSettings"
import { UserDashboardManagement } from "@/components/admin/UserDashboardManagement"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [activeTransactionSubsection, setActiveTransactionSubsection] = useState<string | null>(null)
  const [activeEmailSubsection, setActiveEmailSubsection] = useState<string | null>(null)
  const [activeBlogSubsection, setActiveBlogSubsection] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()

  // Close sidebar when changing sections on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [activeSection, isMobile])

  const renderSection = () => {
    // Handle transaction history subsections
    if (activeSection === "transactionsHistory") {
      switch (activeTransactionSubsection) {
        case "withdrawals":
          return <WithdrawalsHistory />
        case "purchases":
          return <PurchasesHistory />
        case "platformFees":
          return <PlatformFeesEarned />
        case "earnings":
          return <EarningHistory />
        default:
          return <WithdrawalsHistory /> // Default to withdrawals if no subsection selected
      }
    }

    // Handle email management subsections
    if (activeSection === "emailManagement") {
      switch (activeEmailSubsection) {
        case "systemNotifications":
          return <SystemNotifications />
        case "newsletters":
          return <Newsletters />
        case "autoresponder":
          return <Autoresponder />
        default:
          return <SystemNotifications /> // Default to system notifications if no subsection selected
      }
    }

    // Handle blog management subsections
    if (activeSection === "blogManagement") {
      switch (activeBlogSubsection) {
        case "blogPosts":
          return <BlogPostManagement />
        case "blogCategories":
          return <CategoryManagement />
        case "blogEmails":
          return <EmailUpdates />
        case "featuredPosts":
          return <FeaturedPostsSelection />
        default:
          return <BlogPostManagement /> // Default to blog posts if no subsection selected
      }
    }

    // Handle main sections
    switch (activeSection) {
      case "users":
        return <UserManagement />
      case "products":
        return <ProductManagement />
      case "affiliateStats":
        return <AffiliateStatistics />
      case "payments":
        return <PaymentManagement />
      case "analytics":
        return <Analytics />
      case "content":
        return <ContentManagement />
      case "support":
        return <SupportManagement />
      case "settings":
        return <PlatformSettings />
      case "homepage":
        return <HomepageSettings />
      case "salesVideo":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Sales Video</h2>
                <p className="text-muted-foreground">Update the YouTube video that appears on the homepage.</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Homepage Sales Video</CardTitle>
                <CardDescription>
                  Enter the YouTube video URL that will be displayed at the top of the homepage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="youtube-url">YouTube Video URL</Label>
                    <Input
                      id="youtube-url"
                      placeholder="https://www.youtube.com/watch?v=1jzROE6EhxM"
                      defaultValue="https://www.youtube.com/watch?v=1jzROE6EhxM"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the full YouTube URL. The system will automatically extract the video ID.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="relative pb-[56.25%] h-0">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src="https://www.youtube.com/embed/1jzROE6EhxM"
                          title="Platform Overview Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </div>
        )
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>Critical system notifications requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-md p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Storage Warning</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                          <p>Storage usage at 85%. Consider upgrading your plan or removing unused files.</p>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertOctagon className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Failed Payments</h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <p>3 payment attempts failed in the last 24 hours. Check payment gateway settings.</p>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Recent user actions and registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { user: "john_doe", action: "registered", time: "5 minutes ago" },
                      { user: "sarah_smith", action: "purchased Product X", time: "15 minutes ago" },
                      { user: "mike_johnson", action: "requested refund", time: "1 hour ago" },
                      { user: "emily_wilson", action: "became an affiliate", time: "3 hours ago" },
                      { user: "david_brown", action: "published new product", time: "5 hours ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>{activity.user.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Server Load</div>
                        <div className="text-sm text-muted-foreground">42%</div>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Database Performance</div>
                        <div className="text-sm text-muted-foreground">87%</div>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">API Response Time</div>
                        <div className="text-sm text-muted-foreground">156ms</div>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Storage Usage</div>
                        <div className="text-sm text-muted-foreground">85%</div>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="email">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="mobile">Mobile</TabsTrigger>
                  </TabsList>
                  <TabsContent value="email" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="user-registrations" className="text-base">
                            User Registrations
                          </Label>
                          <p className="text-sm text-muted-foreground">Receive notifications when new users register</p>
                        </div>
                        <Switch id="user-registrations" defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="new-sales" className="text-base">
                            New Sales
                          </Label>
                          <p className="text-sm text-muted-foreground">Receive notifications for new sales</p>
                        </div>
                        <Switch id="new-sales" defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="platform-fees" className="text-base">
                            Platform Fees Earned
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications when platform fees are collected from sales or withdrawals
                          </p>
                        </div>
                        <Switch id="platform-fees" defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-alerts" className="text-base">
                            System Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">Receive critical system notifications</p>
                        </div>
                        <Switch id="system-alerts" defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="dashboard" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dashboard-alerts" className="text-base">
                            Show Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">Display alert notifications in dashboard</p>
                        </div>
                        <Switch id="dashboard-alerts" defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dashboard-activity" className="text-base">
                            User Activity
                          </Label>
                          <p className="text-sm text-muted-foreground">Show user activity in dashboard</p>
                        </div>
                        <Switch id="dashboard-activity" defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dashboard-sound" className="text-base">
                            Notification Sounds
                          </Label>
                          <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
                        </div>
                        <Switch id="dashboard-sound" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="mobile" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications" className="text-base">
                            Push Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">Enable push notifications on mobile devices</p>
                        </div>
                        <Switch id="push-notifications" defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-alerts" className="text-base">
                            SMS Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                        </div>
                        <Switch id="sms-alerts" />
                      </div>
                      <Separator />
                      <div>
                        <Label htmlFor="phone-number" className="text-base">
                          Phone Number
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">Phone number for SMS notifications</p>
                        <Input id="phone-number" placeholder="+1 (555) 123-4567" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>View and manage past notifications</CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { type: "System", message: "Storage usage at 85%", date: "Today, 10:30 AM", status: "Unread" },
                        {
                          type: "User",
                          message: "New user registration: john_doe",
                          date: "Today, 9:15 AM",
                          status: "Read",
                        },
                        {
                          type: "Payment",
                          message: "Failed payment attempt for order #12345",
                          date: "Yesterday, 3:45 PM",
                          status: "Unread",
                        },
                        {
                          type: "Product",
                          message: "New product published: Digital Marketing Course",
                          date: "Yesterday, 1:20 PM",
                          status: "Read",
                        },
                        {
                          type: "Support",
                          message: "New support ticket #789",
                          date: "Mar 19, 2025, 11:05 AM",
                          status: "Read",
                        },
                      ].map((notification, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge
                              variant={
                                notification.type === "System"
                                  ? "destructive"
                                  : notification.type === "Payment"
                                    ? "outline"
                                    : "default"
                              }
                            >
                              {notification.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[150px] sm:max-w-none truncate">{notification.message}</TableCell>
                          <TableCell className="hidden md:table-cell">{notification.date}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={notification.status === "Unread" ? "secondary" : "outline"}>
                              {notification.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                <Button variant="outline">Mark All as Read</Button>
                <Button variant="outline">Clear All</Button>
              </CardFooter>
            </Card>
          </div>
        )
      case "dashboardManagement":
        return <UserDashboardManagement />
      case "developer":
        return <DeveloperTools />
      case "customization":
        return <Customization />
      default:
        return <Analytics /> // Default to analytics as the main dashboard view
    }
  }

  // Mobile sidebar implementation using Sheet component
  const MobileSidebar = () => (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="p-0 w-[85%] max-w-[300px]">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="text-xl font-semibold">Sol Run Admin</div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              activeTransactionSubsection={activeTransactionSubsection}
              setActiveTransactionSubsection={setActiveTransactionSubsection}
              activeEmailSubsection={activeEmailSubsection}
              setActiveEmailSubsection={setActiveEmailSubsection}
              activeBlogSubsection={activeBlogSubsection}
              setActiveBlogSubsection={setActiveBlogSubsection}
              isMobile={true}
              hideCloseButton={true}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activeTransactionSubsection={activeTransactionSubsection}
          setActiveTransactionSubsection={setActiveTransactionSubsection}
          activeEmailSubsection={activeEmailSubsection}
          setActiveEmailSubsection={setActiveEmailSubsection}
          activeBlogSubsection={activeBlogSubsection}
          setActiveBlogSubsection={setActiveBlogSubsection}
          isMobile={false}
          hideCloseButton={true}
        />
      </div>

      {/* Mobile Sidebar */}
      {isMobile && <MobileSidebar />}

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center md:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-16 px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-2">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="text-xl font-semibold">Sol Run Admin</div>
        </div>
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">{renderSection()}</div>
        </main>
      </div>
    </div>
  )
}
