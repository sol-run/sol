import { BookOpen, Users, DollarSign, Shield } from "lucide-react"

const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-purple-600" />,
    title: "Digital Product Marketplace",
    description: "Sell eBooks, software, videos, audiobooks, and images with ease.",
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: "Affiliate Programs",
    description: "Set up single-tier or multi-level marketing programs for your products.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-purple-600" />,
    title: "Solana Payments",
    description: "Fast and secure blockchain transactions for payments and commissions.",
  },
  {
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    title: "Secure Wallets",
    description: "Automatically generated Solana wallets for all users.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
