import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CalendarIcon, ChevronLeftIcon, ClockIcon, ShareIcon, TagIcon, UserIcon } from "lucide-react"

export async function generateStaticParams() {
  // This function tells Next.js which blog posts to pre-render
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}

// Sample blog post data (same as in blog/page.tsx)
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Digital Product Sales on Sol.Run",
    excerpt:
      "Learn how to set up your first digital product on Sol.Run and start earning with Solana blockchain payments.",
    content: `
      <p>Setting up your first digital product on Sol.Run is straightforward. This guide walks you through the process from account creation to receiving your first payment.</p>
      
      <h2>Creating Your Account</h2>
      <p>To get started, you'll need to create a Sol.Run account. The process is simple:</p>
      <ol>
        <li>Visit the Sol.Run homepage and click on "Sign Up"</li>
        <li>Enter your email address and create a secure password</li>
        <li>Verify your email address through the confirmation link</li>
        <li>Complete your profile by adding your name, profile picture, and a brief bio</li>
      </ol>
      
      <h2>Setting Up Your Solana Wallet</h2>
      <p>Sol.Run uses the Solana blockchain for all transactions, so you'll need a compatible wallet:</p>
      <ol>
        <li>Download a Solana-compatible wallet like Phantom or Solflare</li>
        <li>Create a new wallet or import an existing one</li>
        <li>Connect your wallet to your Sol.Run account in the "Wallet Settings" section</li>
      </ol>
      
      <h2>Creating Your First Digital Product</h2>
      <p>Now you're ready to create your first product:</p>
      <ol>
        <li>Navigate to the "Products" section in your dashboard</li>
        <li>Click on "Create New Product"</li>
        <li>Fill in the product details including title, description, and price</li>
        <li>Upload your digital files (PDFs, videos, images, etc.)</li>
        <li>Set up your product thumbnail and preview content</li>
        <li>Configure your affiliate program settings if desired</li>
        <li>Publish your product to make it available in the marketplace</li>
      </ol>
      
      <h2>Promoting Your Product</h2>
      <p>After publishing, it's time to promote your product:</p>
      <ol>
        <li>Share your unique product link on social media</li>
        <li>Invite potential affiliates to promote your product</li>
        <li>Create blog posts or videos showcasing your product's value</li>
        <li>Consider running limited-time promotions to generate initial sales</li>
      </ol>
      
      <h2>Managing Sales and Payments</h2>
      <p>As sales come in, you'll want to stay on top of your business:</p>
      <ol>
        <li>Monitor your sales dashboard for new purchases</li>
        <li>Track affiliate performance and commissions</li>
        <li>Withdraw your earnings to your connected Solana wallet</li>
        <li>Analyze customer feedback to improve your offerings</li>
      </ol>
      
      <p>By following these steps, you'll be well on your way to building a successful digital product business on Sol.Run. The platform's integration with Solana ensures that you receive payments instantly with minimal fees, allowing you to focus on creating great products and growing your customer base.</p>
    `,
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
    content: `
      <p>A well-structured affiliate program can significantly boost your product sales. In this article, we explore proven strategies to attract quality affiliates and maximize your passive income through Sol.Run's powerful multi-level marketing structure.</p>
      
      <h2>Understanding Sol.Run's MLM Structure</h2>
      <p>Sol.Run offers a unique 3-level affiliate structure that allows you to earn commissions not just from your direct affiliates (Level 1), but also from their affiliates (Level 2) and even one level deeper (Level 3). This creates a powerful network effect that can exponentially increase your earnings.</p>
      
      <h2>Setting Competitive Commission Rates</h2>
      <p>Finding the right balance in your commission structure is crucial:</p>
      <ul>
        <li>Level 1 (Direct Affiliates): Consider rates between 20-30% to attract motivated promoters</li>
        <li>Level 2: Rates between 10-15% provide good incentive for network growth</li>
        <li>Level 3: Even a small 5-10% commission at this level can generate significant passive income</li>
      </ul>
      
      <h2>Identifying and Recruiting Quality Affiliates</h2>
      <p>Not all affiliates are created equal. Focus on quality over quantity:</p>
      <ul>
        <li>Look for affiliates with established audiences in your niche</li>
        <li>Reach out to content creators, bloggers, and influencers who align with your product values</li>
        <li>Consider creating an application process to screen potential affiliates</li>
        <li>Offer exclusive bonuses or higher commission rates to high-performing affiliates</li>
      </ul>
      
      <h2>Providing Affiliates with Effective Marketing Materials</h2>
      <p>Set your affiliates up for success by providing them with high-quality marketing resources:</p>
      <ul>
        <li>Create compelling banner ads in various sizes</li>
        <li>Develop email templates they can customize and send to their lists</li>
        <li>Write sample social media posts they can use or modify</li>
        <li>Record video testimonials and product demonstrations they can share</li>
        <li>Design landing pages specifically for affiliate traffic</li>
      </ul>
      
      <h2>Training and Supporting Your Affiliate Network</h2>
      <p>Educated affiliates are more effective promoters:</p>
      <ul>
        <li>Create a comprehensive affiliate onboarding guide</li>
        <li>Host regular training webinars on effective promotion strategies</li>
        <li>Establish a private community where affiliates can share tips and ask questions</li>
        <li>Provide one-on-one coaching for your top performers</li>
      </ul>
      
      <h2>Incentivizing Network Growth</h2>
      <p>Encourage your Level 1 affiliates to recruit their own affiliates:</p>
      <ul>
        <li>Explain the benefits of building their downline</li>
        <li>Offer bonuses when their recruits reach certain sales milestones</li>
        <li>Create leaderboards and competitions to gamify the recruitment process</li>
        <li>Highlight success stories from affiliates who have built large networks</li>
      </ul>
      
      <h2>Analyzing and Optimizing Performance</h2>
      <p>Use Sol.Run's analytics to continuously improve your program:</p>
      <ul>
        <li>Identify which affiliates and products are performing best</li>
        <li>Analyze traffic sources and conversion rates</li>
        <li>Test different commission structures and promotional materials</li>
        <li>Regularly prune inactive affiliates and focus resources on active ones</li>
      </ul>
      
      <p>By implementing these strategies, you can build a thriving affiliate network that generates substantial passive income. Remember that building a successful MLM structure takes time and consistent effort, but the compounding returns make it well worth the investment.</p>
    `,
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
    content: `
      <p>Solana's high-speed, low-cost blockchain is changing the landscape of digital commerce. This article examines the current state and future potential of Solana-powered marketplaces like Sol.Run.</p>
      
      <h2>The Limitations of Traditional Payment Systems</h2>
      <p>Before diving into Solana's advantages, it's worth understanding the problems with conventional payment processing:</p>
      <ul>
        <li>High transaction fees (typically 2.9% + $0.30 per transaction)</li>
        <li>Payment delays of 2-7 days before funds are available</li>
        <li>Chargebacks and payment disputes</li>
        <li>Limited global accessibility</li>
        <li>Complex integration requirements</li>
      </ul>
      
      <h2>Solana's Technical Advantages</h2>
      <p>Solana offers several key technical benefits that make it ideal for e-commerce:</p>
      <ul>
        <li>Transaction speeds of up to 65,000 TPS (transactions per second)</li>
        <li>Average transaction cost of $0.00025</li>
        <li>Block finality in approximately 400ms</li>
        <li>Energy-efficient proof-of-stake consensus</li>
        <li>Smart contract functionality for complex business logic</li>
      </ul>
      
      <h2>The Current State of Solana Commerce</h2>
      <p>Solana-powered marketplaces like Sol.Run are already demonstrating the blockchain's potential:</p>
      <ul>
        <li>Instant settlement of payments to seller wallets</li>
        <li>Automated affiliate commission distribution</li>
        <li>Transparent on-chain transaction history</li>
        <li>Programmable escrow services</li>
        <li>Global accessibility without currency conversion fees</li>
      </ul>
      
      <h2>Emerging Trends in Solana Commerce</h2>
      <p>Several exciting developments are shaping the future of digital commerce on Solana:</p>
      <ul>
        <li>Integration of NFTs as proof of purchase and ownership</li>
        <li>Decentralized reputation systems for buyers and sellers</li>
        <li>Tokenized loyalty and reward programs</li>
        <li>Cross-chain interoperability with other blockchain ecosystems</li>
        <li>AI-powered recommendation engines using on-chain data</li>
      </ul>
      
      <h2>Challenges and Solutions</h2>
      <p>Despite its promise, Solana commerce faces several challenges:</p>
      <ul>
        <li>User experience barriers for crypto newcomers</li>
        <li>Regulatory uncertainty in some jurisdictions</li>
        <li>Price volatility of SOL and other tokens</li>
        <li>Network congestion during peak usage periods</li>
      </ul>
      
      <p>Platforms like Sol.Run are addressing these challenges through:</p>
      <ul>
        <li>Simplified wallet onboarding processes</li>
        <li>Stablecoin payment options</li>
        <li>Compliance-focused KYC/AML procedures</li>
        <li>Layer 2 scaling solutions</li>
      </ul>
      
      <h2>The Road Ahead: Predictions for 2025-2030</h2>
      <p>Looking forward, we can expect several developments in Solana-powered commerce:</p>
      <ul>
        <li>Mainstream adoption of Solana wallets through mobile integration</li>
        <li>Seamless fiat on/off ramps reducing the visibility of blockchain technology</li>
        <li>Integration with traditional e-commerce platforms</li>
        <li>Specialized marketplaces for different digital product categories</li>
        <li>Advanced analytics and marketing tools leveraging on-chain data</li>
      </ul>
      
      <p>The future of digital commerce on Solana looks exceptionally bright. As platforms like Sol.Run continue to innovate and address existing challenges, we can expect to see a significant shift away from traditional payment processors toward blockchain-based solutions that offer greater speed, lower costs, and enhanced functionality.</p>
    `,
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

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const postId = Number(params.id)

  const post = blogPosts.find((post) => post.id === postId)

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/blog">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    )
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="ghost">
          <Link href="/blog" className="mb-4">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <UserIcon className="h-4 w-4 mr-1" />
              <span className="mr-4">{post.author}</span>
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        <div
          className="prose prose-purple dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="border-t border-b py-4 mb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
              >
                <TagIcon className="h-4 w-4 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="hover:shadow-md transition-shadow duration-300">
                <div className="p-4">
                  <h3 className="font-semibold mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Link href={`/blog/${relatedPost.id}`}>{relatedPost.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{relatedPost.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{relatedPost.date}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="max-w-4xl mx-auto mt-16 bg-purple-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Enjoyed this article?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Subscribe to our newsletter to receive more insights about digital product sales and the Solana ecosystem.
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
