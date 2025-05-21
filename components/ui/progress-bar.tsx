"use client"

import type React from "react"

import { motion } from "framer-motion"

interface ProgressBarProps {
  step: number
  totalSteps: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  const percentage = (step / totalSteps) * 100

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
      <motion.div
        className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}
