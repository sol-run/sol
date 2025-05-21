"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, ClockIcon, TagIcon, UserIcon } from "lucide-react"

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Digital Product Sales on Sol.Run",
    excerpt:
      "Learn how to set up your first digital product on Sol.Run and start earning with Solana blockchain payments.",
    content:
      "Setting up your first digital product on Sol.Run is straightforward. This guide walks you through the process from account creation to receiving your first payment...",
    author: "Sol.Run Team",
    date: "March 20, 2025",
    readTime: "5 min read",
    category: "Tutorials",
    tags: ["Getting Started", "Digital Products", "Solana"],
    featured: true,
  },
  {
    id: 2,
    title: "Maximizing Your Affiliate Program Potential",
    excerpt:
      "Discover strategies to grow your affiliate network and increase your passive income through Sol.Run's multi-level marketing structure.",
    content:
      "A well-structured affiliate program can significantly boost your product sales. In this article, we explore proven strategies to attract quality affiliates...",
    author: "Marketing Expert",
    date: "March 15, 2025",
    readTime: "8 min read",
    category: "Marketing",
    tags: ["Affiliate Marketing", "MLM", "Passive Income"],
    featured: true,
  },
  {
    id: 3,
    title: "The Future of Digital Commerce on Solana",
    excerpt:
      "Explore how Solana blockchain is revolutionizing digital commerce with instant payments and minimal fees.",
    content:
      "Solana's high-speed, low-cost blockchain is changing the landscape of digital commerce. This article examines the current state and future potential...",
    author: "Blockchain Analyst",
    date: "March 10, 2025",
    readTime: "6 min read",
    category: "Blockchain",
    tags: ["Solana", "Blockchain", "Future Trends"],
    featured: false,
  },
  {
    id: 4,
    title: "Creating Compelling Digital Products That Sell",
    excerpt:
      "Tips and best practices for creating high-quality digital products that attract customers and generate consistent sales.",
    content:
      "The quality of your digital products directly impacts your sales success. This guide provides actionable advice on creating products that stand out in the marketplace...",
    author: "Product Designer",
    date: "March 5, 2025",
    readTime: "7 min read",
    category: "Product Development",
    tags: ["Product Design", "Sales Strategy", "Quality"],
    featured: false,
  },
  {
    id: 5,
    title: "Understanding Sol.Run's Payment Structure",
    excerpt:
      "A detailed breakdown of how payments work on Sol.Run, including platform fees, affiliate commissions, and withdrawal processes.",
    content:
      "Transparency in payment processing is essential for sellers. This article explains every aspect of Sol.Run's payment structure to help you maximize your earnings...",
    author: "Finance Specialist",
    date: "February 28, 2025",
    readTime: "4 min read",
    category: "Finance",
    tags: ["Payments", "Fees", "Withdrawals"],
    featured: false,
  },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = ["all", "Tutorials", "Marketing", "Blockchain", "Product Development", "Finance"]

  const filteredPosts =
    activeCategory === "all" ? blogPosts : blogPosts.filter((post) => post.category === activeCategory)

  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Sol.Run Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Insights, tutorials, and updates about digital product sales, affiliate marketing, and the Solana ecosystem
        </p>
      </div>

      {/* Featured Posts Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-base">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2 pb-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {post.date}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="mb-12">
        <div className="border-b mb-6">
          <TabsList className="flex overflow-x-auto pb-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "All Posts" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <UserIcon className="h-3 w-3 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Newsletter Signup */}
      <section className="bg-purple-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive the latest updates, tutorials, and insights about digital product sales
          and Solana ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex-grow"
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Subscribe</Button>
        </div>
      </section>
    </div>
  )
}
