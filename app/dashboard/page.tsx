import type { Metadata } from "next"
import DashboardClientPage from "./DashboardClientPage"

export const metadata: Metadata = {
  title: "Dashboard | Sol.Run",
  description: "Manage your Sol.Run account, products, and earnings",
}

export default function DashboardPage() {
  return <DashboardClientPage />
}
