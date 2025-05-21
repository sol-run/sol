import { Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Input type="search" placeholder="Search..." className="w-64 mr-4 dark:bg-gray-700 dark:text-white" />
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5 dark:text-gray-300" />
        </Button>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <Bell className="h-5 w-5 dark:text-gray-300" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5 dark:text-gray-300" />
        </Button>
      </div>
    </header>
  )
}
