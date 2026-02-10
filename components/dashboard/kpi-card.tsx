import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Trophy,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  users: Users,
  "graduation-cap": GraduationCap,
  "calendar-check": CalendarCheck,
  trophy: Trophy,
} as const

interface KpiCardProps {
  label: string
  value: number
  suffix: string
  trend: number
  icon: keyof typeof iconMap
}

export function KpiCard({ label, value, suffix, trend, icon }: KpiCardProps) {
  const Icon = iconMap[icon]
  const isPositive = trend >= 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-2xl font-bold text-foreground">
              {value}
              {suffix}
            </span>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive ? "text-[hsl(var(--success))]" : "text-destructive"
            )}
          >
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
