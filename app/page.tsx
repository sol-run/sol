import Hero from "./components/Hero"
import BestSellers from "./components/BestSellers"
import Features from "./components/Features"
import Workflow from "./components/Workflow"
import FAQs from "./components/FAQs"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Hero />
      <BestSellers />
      <Features />
      <Workflow />
      <FAQs />
    </main>
  )
}
