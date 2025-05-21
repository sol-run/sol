"use client"
import { useState } from "react"
import { format, startOfDay, endOfDay, startOfWeek, startOfMonth, startOfYear, subYears } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}) {
  const [selectedPreset, setSelectedPreset] = useState<string>("custom")

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)
    const today = new Date()

    switch (preset) {
      case "all-time":
        setDate({
          from: subYears(today, 10),
          to: today,
        })
        break
      case "year":
        setDate({
          from: startOfYear(today),
          to: today,
        })
        break
      case "month":
        setDate({
          from: startOfMonth(today),
          to: today,
        })
        break
      case "week":
        setDate({
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: today,
        })
        break
      case "today":
        setDate({
          from: startOfDay(today),
          to: endOfDay(today),
        })
        break
      default:
        break
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center">
            <Button
              id="date"
              variant={"outline"}
              className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
            <div className="relative ml-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <span className="mr-1">
                      {selectedPreset === "all-time" && "All Time"}
                      {selectedPreset === "year" && "Year"}
                      {selectedPreset === "month" && "Month"}
                      {selectedPreset === "week" && "Week"}
                      {selectedPreset === "today" && "Today"}
                      {selectedPreset === "custom" && "Custom"}
                    </span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePresetChange("all-time")}>All Time</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePresetChange("year")}>Year</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePresetChange("month")}>Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePresetChange("week")}>Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePresetChange("today")}>Today</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              setSelectedPreset("custom")
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
