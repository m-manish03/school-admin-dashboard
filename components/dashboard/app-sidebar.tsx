"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  CalendarCheck,
  Activity,
  School,
  BrainCircuit,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Teachers", href: "/teachers", icon: Users },
  { title: "Students", href: "/students", icon: GraduationCap },
  { title: "Academics", href: "/academics", icon: BarChart3 },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
  { title: "AI & AR Analytics", href: "/ai-ar-analytics", icon: BrainCircuit },
  { title: "Usage & Activity", href: "/usage", icon: Activity },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <School className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm text-sidebar-foreground">Greenfield</span>
            <span className="text-xs text-sidebar-foreground/60">School Dashboard</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <SidebarSeparator />
        <div className="p-2 text-xs text-sidebar-foreground/50">
          Academic Year 2025-26
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
