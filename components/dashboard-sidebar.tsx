"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Users,
  MapPin,
  Zap,
  Gauge,
  FileText,
  CreditCard,
  Building,
  ChevronLeft,
  ChevronRight,
  Network,
} from "lucide-react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

const navigationItems = [
  { id: "relationships", label: "Relationships", icon: Network },
  { id: "clients", label: "Clients", icon: Users },
  { id: "sites", label: "Sites", icon: MapPin },
  { id: "supplies", label: "Supplies", icon: Zap },
  { id: "meters", label: "Meters", icon: Gauge },
  { id: "accounts", label: "Accounts", icon: CreditCard },
  { id: "retailers", label: "Retailers", icon: Building },
  { id: "invoices", label: "Invoices", icon: FileText },
]

export function DashboardSidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("border-r bg-sidebar transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h2 className="text-lg font-bold text-sidebar-foreground">Navigation</h2>}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "px-2")}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && item.label}
                </Button>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}
