"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    question: "What is Sol Run?",
    answer:
      "Sol Run is a digital marketplace platform built on Solana blockchain that allows creators to sell digital products like eBooks, software, videos, and more. It features secure payments, affiliate programs, and automatic wallet generation for all users.",
  },
  {
    question: "How do I start selling my digital products?",
    answer:
      "To start selling, create an account, set up your profile, and use our 'Create Product' feature to upload your digital content. You can set pricing, add descriptions, and even create an affiliate program for your products.",
  },
  {
    question: "What types of digital products can I sell?",
    answer:
      "You can sell a wide range of digital products including eBooks, software applications, video courses, audiobooks, digital art, templates, plugins, and more.",
  },
  {
    question: "How do payments work?",
    answer:
      "Sol Run uses Solana blockchain for fast and secure payments. When a customer purchases your product, the payment is processed instantly with minimal fees. Earnings are credited to your Sol Run wallet, which you can withdraw to your personal Solana wallet.",
  },
  {
    question: "What are the fees for selling on Sol Run?",
    answer:
      "Sol Run charges a small platform fee on each sale. The exact percentage may vary based on product type and pricing tier. Check our current fee structure in your seller dashboard for the most up-to-date information.",
  },
  {
    question: "How does the affiliate program work?",
    answer:
      "As a seller, you can enable an affiliate program for your products. You set the commission rate, and affiliates who promote your product receive that percentage of each sale they generate. You can choose between single-tier or multi-level marketing structures.",
  },
]

export default function FAQs() {
  const [defaultValue, setDefaultValue] = useState("item-0")

  return (
    <section id="faqs" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible defaultValue={defaultValue}>
            {faqData.map((faq, index) => (
              <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
