"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { User, LogOut, Settings, Server } from "lucide-react"

export function DashboardHeader() {
  const { user, logout, environment, switchEnvironment } = useAuth()

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-playfair font-bold">Account Dashboard</h1>
          <Badge variant={environment === "PROD" ? "default" : "secondary"}>{environment}</Badge>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchEnvironment(environment === "PROD" ? "TEST" : "PROD")}>
                <Server className="mr-2 h-4 w-4" />
                Switch to {environment === "PROD" ? "Test" : "Production"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
