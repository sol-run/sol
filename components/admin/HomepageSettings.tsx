"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Save, Plus, Trash2, MoveUp, MoveDown, Edit } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type FAQ = {
  id: string
  question: string
  answer: string
}

export function HomepageSettings() {
  const [sections, setSections] = useState([
    { id: "topEarners", name: "Top Earners", description: "Display top earning users on the homepage", enabled: true },
    {
      id: "bestSellers",
      name: "Best Sellers This Month",
      description: "Show the most popular products",
      enabled: true,
    },
    {
      id: "features",
      name: "Platform Features",
      description: "Highlight key features of your platform",
      enabled: true,
    },
    { id: "workflow", name: "How It Works", description: "Show the workflow process", enabled: true },
    { id: "recentEvents", name: "Recent User Events", description: "Display recent platform activity", enabled: false },
    { id: "faqs", name: "FAQs", description: "Show frequently asked questions", enabled: true },
  ])

  const [heroContent, setHeroContent] = useState({
    mainTitle: "Your Digital Products Marketplace",
    animatedTexts: [
      "Automated + Instant Solana Payments",
      "Start Your Affiliate or MLM Program",
      "Unlock Unlimited Earning Potential",
      "Sell eBooks + Videos + Images + More!",
    ],
    subtitle: "Sell your digital products, set up affiliate programs, and earn with blockchain efficiency.",
    footerText: "Powered by Solana Blockchain ⚡",
    buttons: [
      { label: "Features", link: "#features", enabled: true },
      { label: "How It Works", link: "#workflow", enabled: true },
      { label: "Marketplace", link: "/products", enabled: true },
      { label: "Blog", link: "/blog", enabled: true },
      { label: "FAQs", link: "#faqs", enabled: true },
    ],
  })

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "What is Sol Run?",
      answer:
        "Sol Run is a digital marketplace platform built on Solana blockchain that allows creators to sell digital products like eBooks, software, videos, and more. It features secure payments, affiliate programs, and automatic wallet generation for all users.",
    },
    {
      id: "2",
      question: "How do I start selling my digital products?",
      answer:
        "To start selling, create an account, set up your profile, and use our 'Create Product' feature to upload your digital content. You can set pricing, add descriptions, and even create an affiliate program for your products.",
    },
    {
      id: "3",
      question: "What types of digital products can I sell?",
      answer:
        "You can sell a wide range of digital products including eBooks, software applications, video courses, audiobooks, digital art, templates, plugins, and more.",
    },
    {
      id: "4",
      question: "How do payments work?",
      answer:
        "Sol Run uses Solana blockchain for fast and secure payments. When a customer purchases your product, the payment is processed instantly with minimal fees. Earnings are credited to your Sol Run wallet, which you can withdraw to your personal Solana wallet.",
    },
    {
      id: "5",
      question: "What are the fees for selling on Sol Run?",
      answer:
        "Sol Run charges a small platform fee on each sale. The exact percentage may vary based on product type and pricing tier. Check our current fee structure in your seller dashboard for the most up-to-date information.",
    },
    {
      id: "6",
      question: "How does the affiliate program work?",
      answer:
        "As a seller, you can enable an affiliate program for your products. You set the commission rate, and affiliates who promote your product receive that percentage of each sale they generate. You can choose between single-tier or multi-level marketing structures.",
    },
  ])

  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [newFaq, setNewFaq] = useState<Omit<FAQ, "id">>({ question: "", answer: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSectionToggle = (index: number) => {
    const newSections = [...sections]
    newSections[index] = {
      ...newSections[index],
      enabled: !newSections[index].enabled,
    }
    setSections(newSections)
  }

  const handleHeroChange = (field: keyof typeof heroContent, value: any) => {
    setHeroContent({
      ...heroContent,
      [field]: value,
    })
  }

  const handleAnimatedTextChange = (index: number, value: string) => {
    const newTexts = [...heroContent.animatedTexts]
    newTexts[index] = value
    handleHeroChange("animatedTexts", newTexts)
  }

  const handleButtonChange = (index: number, field: "label" | "link" | "enabled", value: any) => {
    const newButtons = [...heroContent.buttons]
    newButtons[index] = { ...newButtons[index], [field]: value }
    handleHeroChange("buttons", newButtons)
  }

  const handleAddFaq = () => {
    if (newFaq.question.trim() === "" || newFaq.answer.trim() === "") {
      return
    }

    const newId = (faqs.length + 1).toString()
    setFaqs([...faqs, { ...newFaq, id: newId }])
    setNewFaq({ question: "", answer: "" })
    setIsDialogOpen(false)
  }

  const handleUpdateFaq = () => {
    if (!editingFaq || editingFaq.question.trim() === "" || editingFaq.answer.trim() === "") {
      return
    }

    setFaqs(faqs.map((faq) => (faq.id === editingFaq.id ? editingFaq : faq)))
    setEditingFaq(null)
    setIsDialogOpen(false)
  }

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
  }

  const handleMoveFaq = (id: string, direction: "up" | "down") => {
    const index = faqs.findIndex((faq) => faq.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === faqs.length - 1)) {
      return
    }

    const newFaqs = [...faqs]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = newFaqs[index]
    newFaqs[index] = newFaqs[newIndex]
    newFaqs[newIndex] = temp

    setFaqs(newFaqs)
  }

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === sections.length - 1)) {
      return
    }

    const newSections = [...sections]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = newSections[index]
    newSections[index] = newSections[newIndex]
    newSections[newIndex] = temp

    setSections(newSections)
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Homepage Settings</h2>
          <p className="text-muted-foreground">Manage the content and sections displayed on your homepage.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="sections">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Visible Sections</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Sections</CardTitle>
              <CardDescription>Enable or disable sections on your homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor={`section-${section.id}`} className="text-base">
                        {section.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSection(index, "up")}
                          disabled={index === 0}
                          className="h-7 w-7"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveSection(index, "down")}
                          disabled={index === sections.length - 1}
                          className="h-7 w-7"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Switch
                        id={`section-${section.id}`}
                        checked={section.enabled}
                        onCheckedChange={() => handleSectionToggle(index)}
                      />
                    </div>
                  </div>
                  {index < sections.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Content</CardTitle>
              <CardDescription>Edit the main content displayed in the hero section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="main-title">Main Title</Label>
                <Input
                  id="main-title"
                  value={heroContent.mainTitle}
                  onChange={(e) => handleHeroChange("mainTitle", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Animated Text Phrases</Label>
                <p className="text-sm text-muted-foreground">These phrases will animate in sequence on the homepage.</p>

                {heroContent.animatedTexts.map((text, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={text}
                      onChange={(e) => handleAnimatedTextChange(index, e.target.value)}
                      placeholder={`Phrase ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={heroContent.subtitle}
                  onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input
                  id="footer-text"
                  value={heroContent.footerText}
                  onChange={(e) => handleHeroChange("footerText", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Buttons</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heroContent.buttons.map((button, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`button-${index}-enabled`}>Enable Button</Label>
                          <Switch
                            id={`button-${index}-enabled`}
                            checked={button.enabled}
                            onCheckedChange={(checked) => handleButtonChange(index, "enabled", checked)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`button-${index}-label`}>Button Text</Label>
                          <Input
                            id={`button-${index}-label`}
                            value={button.label}
                            onChange={(e) => handleButtonChange(index, "label", e.target.value)}
                            disabled={!button.enabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`button-${index}-link`}>Button Link</Label>
                          <Input
                            id={`button-${index}-link`}
                            value={button.link}
                            onChange={(e) => handleButtonChange(index, "link", e.target.value)}
                            disabled={!button.enabled}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
                {isSaving ? "Saving..." : "Save Hero Content"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Manage the FAQs displayed on your homepage.</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingFaq(null)
                      setNewFaq({ question: "", answer: "" })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add FAQ
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
                    <DialogDescription>
                      {editingFaq
                        ? "Update this frequently asked question and its answer."
                        : "Create a new frequently asked question for your homepage."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        placeholder="Enter the question"
                        value={editingFaq ? editingFaq.question : newFaq.question}
                        onChange={(e) =>
                          editingFaq
                            ? setEditingFaq({ ...editingFaq, question: e.target.value })
                            : setNewFaq({ ...newFaq, question: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea
                        id="answer"
                        placeholder="Enter the answer"
                        rows={5}
                        value={editingFaq ? editingFaq.answer : newFaq.answer}
                        onChange={(e) =>
                          editingFaq
                            ? setEditingFaq({ ...editingFaq, answer: e.target.value })
                            : setNewFaq({ ...newFaq, answer: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingFaq ? handleUpdateFaq : handleAddFaq}>
                      {editingFaq ? "Update FAQ" : "Add FAQ"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <div className="flex items-center">
                        <AccordionTrigger className="flex-1 text-left">{faq.question}</AccordionTrigger>
                        <div className="flex items-center space-x-1 mr-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingFaq(faq)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveFaq(faq.id, "up")
                            }}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveFaq(faq.id, "down")
                            }}
                            disabled={index === faqs.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFaq(faq.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {faqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No FAQs added yet. Click the "Add FAQ" button to create your first FAQ.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
                {isSaving ? "Saving..." : "Save FAQs"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
