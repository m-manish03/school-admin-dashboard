"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"
import { useAuth } from "@/lib/auth-context"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { user, logout } = useAuth()

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "SH"

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2025-26">
            <SelectTrigger className="w-36 h-9 text-sm">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-26">2025-26</SelectItem>
              <SelectItem value="2024-25">2024-25</SelectItem>
            </SelectContent>
          </Select>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                {user?.role}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
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
