"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Settings, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export function SystemNotifications() {
  const [selectedRecipients, setSelectedRecipients] = useState("all")
  const [emailType, setEmailType] = useState("registration")
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [currentEmailData, setCurrentEmailData] = useState({
    type: "",
    subject: "",
    content: "",
  })
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.sol.run",
    smtpPort: "587",
    smtpUsername: "notifications@sol.run",
    smtpPassword: "••••••••••••",
    fromEmail: "notifications@sol.run",
    fromName: "Sol.Run Notifications",
    replyToEmail: "support@sol.run",
    emailSignature: `Best regards,
The Sol.Run Team`,
    batchSize: "50",
    sendingInterval: "5",
  })

  const handleEmailSettingsClick = () => {
    // Open the settings dialog instead of navigating
    setSettingsDialogOpen(true)
  }

  const handleSaveEmailSettings = () => {
    // Save email settings (in a real app, this would call an API)
    console.log("Saving email settings:", emailSettings)
    toast({
      title: "Email settings saved",
      description: "Your email configuration has been updated successfully.",
    })
    setSettingsDialogOpen(false)
  }

  const handleEditEmail = (type: string) => {
    // Set the email data based on type
    let subject = ""
    let content = ""

    switch (type) {
      case "registration":
        subject = "Welcome to Sol.Run - Confirm Your Registration"
        content = `Dear {{username}},

Thank you for registering with Sol.Run! We're excited to have you join our community.

To complete your registration, please click the link below to confirm your email address:
{{confirmation_link}}

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The Sol.Run Team`
        break
      case "commission":
        subject = "Congratulations! You've Earned a Commission on Sol.Run"
        content = `Dear {{username}},

Great news! You've earned a commission of {{commission_amount}} for the sale of {{product_name}} in Level {{level_number}}.

Your current balance is now {{current_balance}}.

Visit your dashboard to view more details and withdraw your earnings.

Thank you for being a valued affiliate partner!

Best regards,
The Sol.Run Team`
        break
      case "sale":
        subject = "New Sale Notification - Your Product Has Been Purchased"
        content = `Dear {{username}},

Congratulations! Your product "{{product_name}}" has been purchased by a customer.

Transaction details:
- Product: {{product_name}}
- Amount: {{sale_amount}}
- Total commissions Distributed: {{sale_commission_total}}
- Your earnings: {{earnings_amount}}

Visit your dashboard to view more details.

Best regards,
The Sol.Run Team`
        break
      case "purchase":
        subject = "Your Sol.Run Purchase Receipt - Access Your Products"
        content = `Dear {{username}},

Thank you for your purchase on Sol.Run!

Order details:
- Product: {{product_name}}
- Amount: {{purchase_amount}}

You can access your purchased products at any time from your dashboard.

If you have any questions, please contact our support team.

Best regards,
The Sol.Run Team`
        break
      case "cart":
        subject = "Don't Miss Out - Items Still in Your Cart"
        content = `Dear {{username}},

We noticed you have items in your cart that you haven't completed checkout for:
{{cart_items}}

Click here to complete your purchase: {{cart_link}}

If you have any questions, our support team is here to help.

Best regards,
The Sol.Run Team`
        break
      case "product-post":
        subject = 'New Post for "{{product_name}}": Latest Update'
        content = `Hi {{Client_username}},

Just a quick heads-up — {{seller_username}} has added a new post to the product you purchased on Sol.Run!

🛍️ Product Name: {{product_name}}
📅 Access Expiry: {{expiry_date}}
📝 Post Title: {{post_title}}
✍️ Word Count: {{word_count}} words
📎 Total Product Files: {{post_files_count}}

You can access the updated content directly here:
🔗 Access URL: https://sol.run/product-files-view/{{product_id}}

Enjoy the update!

Warm regards,
The Sol.Run Team`
        break
      case "affiliate-updates":
        subject = "Updates to Affiliate Program for {{product_name}}"
        content = `Hi {{username}},

An update has just been made to the Affiliate Program for {{product_name}}.

Affiliate Program Summary:
Levels: {{levels_count}}
Total Commissions (All Levels): {{total_commission_percentage}}%
Affiliate Resource Files Added: {{resource_files_count}}

Login to your Sol.Run Dashboard to view the updated Affiliate Program details.

Warm regards,
Sol.Run Team`
        break
      case "platform-fees":
        subject = "Platform Fees Earned - Sol.Run Admin Notification"
        content = `Dear Admin,

Platform fees have been earned from recent transactions:

Transaction details:
- Total fees earned: {{fees_amount}}
- Number of transactions: {{transaction_count}}
- Time period: {{time_period}}

A detailed breakdown is available in the admin dashboard.

System generated notification
Sol.Run Platform`
        break
    }

    setCurrentEmailData({
      type,
      subject,
      content,
    })
    setEmailType(type)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">System Notifications</h2>
        <Button onClick={handleEmailSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          Email Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Email Templates</CardTitle>
          <CardDescription>Configure and customize system notification emails sent to users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm border-b bg-muted">
              <div className="col-span-3">Notification Type</div>
              <div className="col-span-5">Subject Preview</div>
              <div className="col-span-2 text-center">Edit</div>
              <div className="col-span-2 text-center">Status</div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-3 font-medium">Registration</div>
              <div className="col-span-5 text-sm truncate">Welcome to Sol.Run - Confirm Your Registration</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("registration")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="registration-enabled" defaultChecked />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-3 font-medium">Commission Earned</div>
              <div className="col-span-5 text-sm truncate">Congratulations! You've Earned a Commission on Sol.Run</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("commission")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="commission-enabled" defaultChecked />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-3 font-medium">Sale Made</div>
              <div className="col-span-5 text-sm truncate">New Sale Notification - Your Product Has Been Purchased</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("sale")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="sale-enabled" defaultChecked />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-3 font-medium">Purchase Made</div>
              <div className="col-span-5 text-sm truncate">Your Sol.Run Purchase Receipt - Access Your Products</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("purchase")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="purchase-enabled" defaultChecked />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-3 font-medium">Cart Reminders</div>
              <div className="col-span-5 text-sm truncate">Don't Miss Out - Items Still in Your Cart</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("cart")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="cart-enabled" defaultChecked />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-3 font-medium">New Product Post Alert</div>
              <div className="col-span-5 text-sm truncate">{'New Post for "{{product_name}}": Latest Update'}</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("product-post")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="product-post-enabled" defaultChecked />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center border-b">
              <div className="col-span-3 font-medium">Affiliate Program Updates</div>
              <div className="col-span-5 text-sm truncate">{"Updates to Affiliate Program for {{product_name}}"}</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("affiliate-updates")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="affiliate-updates-enabled" defaultChecked />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-3 font-medium">Platform Fees Earned</div>
              <div className="col-span-5 text-sm truncate">Platform Fees Earned - Sol.Run Admin Notification</div>
              <div className="col-span-2 text-center">
                <Button variant="outline" size="sm" onClick={() => handleEditEmail("platform-fees")}>
                  Edit Email
                </Button>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex justify-center">
                  <Switch id="platform-fees-enabled" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
          <CardDescription>Send a test email to verify your template configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input id="test-email" placeholder="Enter email address" />
            </div>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Test Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Template Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Edit {currentEmailData.type.charAt(0).toUpperCase() + currentEmailData.type.slice(1)} Email Template
            </DialogTitle>
            <DialogDescription>
              Customize the email template that will be sent to users. You can use variables enclosed in double curly
              braces.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email-subject">Email Subject</Label>
              <Input
                id="email-subject"
                value={currentEmailData.subject}
                onChange={(e) => setCurrentEmailData({ ...currentEmailData, subject: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-content">Email Content</Label>
              <Textarea
                id="email-content"
                rows={12}
                value={currentEmailData.content}
                onChange={(e) => setCurrentEmailData({ ...currentEmailData, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Saving email template:", currentEmailData)
                toast({
                  title: "Email template saved",
                  description: "Your changes have been saved successfully.",
                })
                setDialogOpen(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Email Configuration Settings</DialogTitle>
            <DialogDescription>
              Configure your email server settings and default options for all system notifications.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="smtp" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
              <TabsTrigger value="defaults">Default Settings</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Options</TabsTrigger>
            </TabsList>

            <TabsContent value="smtp" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input
                    id="smtp-server"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input
                    id="smtp-username"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Test connection successful",
                      description: "Successfully connected to SMTP server.",
                    })
                  }}
                >
                  Test Connection
                </Button>
                <span className="text-sm text-muted-foreground">Verify your SMTP settings are correct</span>
              </div>
            </TabsContent>

            <TabsContent value="defaults" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reply-to">Reply-To Email</Label>
                <Input
                  id="reply-to"
                  value={emailSettings.replyToEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, replyToEmail: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email-signature">Default Email Signature</Label>
                <Textarea
                  id="email-signature"
                  rows={4}
                  value={emailSettings.emailSignature}
                  onChange={(e) => setEmailSettings({ ...emailSettings, emailSignature: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={emailSettings.batchSize}
                    onChange={(e) => setEmailSettings({ ...emailSettings, batchSize: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">Maximum number of emails to send in one batch</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sending-interval">Sending Interval (minutes)</Label>
                  <Input
                    id="sending-interval"
                    type="number"
                    value={emailSettings.sendingInterval}
                    onChange={(e) => setEmailSettings({ ...emailSettings, sendingInterval: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">Time between sending batches</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="track-opens" defaultChecked />
                <Label htmlFor="track-opens">Track email opens</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="track-clicks" defaultChecked />
                <Label htmlFor="track-clicks">Track link clicks</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-unsubscribe" defaultChecked />
                <Label htmlFor="auto-unsubscribe">Add unsubscribe link to all emails</Label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmailSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
