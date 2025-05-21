"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TimeframeOption = "day" | "week" | "month" | "year" | "lifetime"

interface TimeframeSelectorProps {
  value: TimeframeOption
  onChange: (value: TimeframeOption) => void
}

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">Day</SelectItem>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="month">Month</SelectItem>
        <SelectItem value="year">Year</SelectItem>
        <SelectItem value="lifetime">Lifetime</SelectItem>
      </SelectContent>
    </Select>
  )
}
