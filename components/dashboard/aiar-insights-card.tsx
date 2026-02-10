"use client"

import React from "react"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Glasses, TrendingUp, TrendingDown, ArrowRight, AlertTriangle } from "lucide-react"
import { aiUsageOverview, arUsageOverview, dropoffStudents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function MiniKpi({
  label,
  value,
  unit,
  trend,
  icon: Icon,
}: {
  label: string
  value: number | string
  unit?: string
  trend: number
  icon: React.ElementType
}) {
  const isPositive = trend >= 0
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-lg font-bold text-foreground">{value}{unit}</span>
        <span className={cn("text-xs font-medium", isPositive ? "text-[hsl(var(--success))]" : "text-destructive")}>
          {isPositive ? <TrendingUp className="mr-0.5 inline h-3 w-3" /> : <TrendingDown className="mr-0.5 inline h-3 w-3" />}
          {isPositive ? "+" : ""}{trend}%
        </span>
      </div>
    </div>
  )
}

export function AIARInsightsCard() {
  const totalDropoff = dropoffStudents.reduce((s, d) => s + d.studentsDeclined, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">AI & AR Insights</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
          <Link href="/ai-ar-analytics">
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MiniKpi label="Total AI Sessions" value={aiUsageOverview.totalAISessions.toLocaleString()} trend={aiUsageOverview.aiSessionsTrend} icon={Brain} />
          <MiniKpi label="AI Adoption Rate" value={aiUsageOverview.aiAdoptionPercent} unit="%" trend={aiUsageOverview.adoptionTrend} icon={TrendingUp} />
          <MiniKpi label="AR-Enabled Lessons" value={arUsageOverview.totalARLessons} trend={arUsageOverview.arLessonsTrend} icon={Glasses} />
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Usage Drop-off</span>
              <span className="text-lg font-bold text-foreground">{totalDropoff} students</span>
              <span className="text-xs text-destructive font-medium">across {dropoffStudents.length} classes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
