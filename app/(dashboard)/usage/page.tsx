"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { dailyActiveUsers, loginHeatmap } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function HeatmapGrid() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 14 }, (_, i) => i + 7)
  const maxVal = Math.max(...loginHeatmap.map((d) => d.value))

  const getColor = (value: number) => {
    const intensity = value / maxVal
    if (intensity > 0.75) return "bg-primary"
    if (intensity > 0.5) return "bg-primary/70"
    if (intensity > 0.25) return "bg-primary/40"
    return "bg-primary/15"
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour labels */}
        <div className="flex items-center gap-0.5 mb-1 pl-12">
          {hours.map((h) => (
            <div key={h} className="flex-1 text-center text-[10px] text-muted-foreground">
              {h > 12 ? `${h - 12}p` : h === 12 ? "12p" : `${h}a`}
            </div>
          ))}
        </div>

        {/* Grid */}
        {days.map((day) => (
          <div key={day} className="flex items-center gap-0.5 mb-0.5">
            <div className="w-12 text-xs text-muted-foreground text-right pr-2">{day}</div>
            {hours.map((hour) => {
              const cell = loginHeatmap.find((d) => d.day === day && d.hour === hour)
              return (
                <div
                  key={`${day}-${hour}`}
                  className={cn("flex-1 aspect-square rounded-sm", getColor(cell?.value ?? 0))}
                  title={`${day} ${hour}:00 - ${cell?.value ?? 0} logins`}
                />
              )
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 pl-12">
          <span className="text-[10px] text-muted-foreground">Low</span>
          <div className="flex gap-0.5">
            <div className="h-3 w-6 rounded-sm bg-primary/15" />
            <div className="h-3 w-6 rounded-sm bg-primary/40" />
            <div className="h-3 w-6 rounded-sm bg-primary/70" />
            <div className="h-3 w-6 rounded-sm bg-primary" />
          </div>
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  )
}

export default function UsagePage() {
  const latestDay = dailyActiveUsers[dailyActiveUsers.length - 1]
  const totalDAU = latestDay.students + latestDay.teachers

  return (
    <>
      <DashboardHeader title="Usage & Activity" description="Daily active users and engagement metrics" />
      <div className="flex flex-col gap-6 p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Today&apos;s DAU</p>
              <p className="text-2xl font-bold text-foreground">{totalDAU.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Active Students Today</p>
              <p className="text-2xl font-bold text-[hsl(var(--chart-2))]">{latestDay.students.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Active Teachers Today</p>
              <p className="text-2xl font-bold text-[hsl(var(--chart-1))]">{latestDay.teachers}</p>
            </CardContent>
          </Card>
        </div>

        {/* DAU chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyActiveUsers}>
                  <defs>
                    <linearGradient id="studentGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="teacherGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={45} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey="students" name="Students" stroke="hsl(var(--chart-2))" fill="url(#studentGrad2)" strokeWidth={2} />
                  <Area type="monotone" dataKey="teachers" name="Teachers" stroke="hsl(var(--chart-1))" fill="url(#teacherGrad2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Login Frequency Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <HeatmapGrid />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
