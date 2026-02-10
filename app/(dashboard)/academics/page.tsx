"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts"
import { subjectPerformance, classAchievement, performanceTrend } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function AcademicsPage() {
  const lowPerformingClasses = classAchievement.filter((c) => c.isLow)
  const lowPerformingSubjects = subjectPerformance.filter((s) => s.avgMarks < 65)

  return (
    <>
      <DashboardHeader title="Academic Performance" description="School-wide academic outcomes and trends" />
      <div className="flex flex-col gap-6 p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">School-wide Avg. Score</p>
              <p className="text-2xl font-bold text-foreground">78.4%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Low-Performing Classes</p>
              <p className="text-2xl font-bold text-destructive">{lowPerformingClasses.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Below 70% achievement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Low-Performing Subjects</p>
              <p className="text-2xl font-bold text-destructive">{lowPerformingSubjects.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Below 65% avg. marks</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Class-wise Achievement %</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classAchievement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="class" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="achievement" name="Achievement %" radius={[4, 4, 0, 0]}>
                      {classAchievement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isLow ? "hsl(var(--chart-4))" : "hsl(var(--chart-1))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Subject-wise Average Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={100} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="avgMarks" name="Avg. Marks" radius={[0, 4, 4, 0]}>
                      {subjectPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.avgMarks < 65 ? "hsl(var(--chart-3))" : "hsl(var(--chart-2))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">School-wide Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[50, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="performance" name="Performance %" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Low-performing alerts */}
        {lowPerformingClasses.length > 0 && (
          <Card className="border-destructive/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Attention: Low-Performing Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {lowPerformingClasses.map((c) => (
                  <div key={c.class} className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2">
                    <span className={cn("text-sm font-medium text-destructive")}>{c.class}</span>
                    <span className="text-xs text-destructive/70">{c.achievement}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
