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
  ReferenceLine,
} from "recharts"
import { attendanceByClass, attendanceTrend } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function AttendancePage() {
  const avgAttendance = Math.round(
    attendanceByClass.reduce((s, c) => s + c.attendance, 0) / attendanceByClass.length
  )
  const belowThreshold = attendanceByClass.filter((c) => c.belowThreshold).length

  return (
    <>
      <DashboardHeader title="Attendance Insights" description="School-wide attendance analytics and trends" />
      <div className="flex flex-col gap-6 p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Avg. Attendance</p>
              <p className="text-2xl font-bold text-foreground">{avgAttendance}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Classes Below 85%</p>
              <p className={cn("text-2xl font-bold", belowThreshold > 0 ? "text-destructive" : "text-[hsl(var(--success))]")}>
                {belowThreshold}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Threshold</p>
              <p className="text-2xl font-bold text-foreground">85%</p>
              <p className="text-xs text-muted-foreground mt-1">Minimum expected</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance per Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceByClass}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="class" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <ReferenceLine y={85} stroke="hsl(var(--chart-4))" strokeDasharray="4 4" label={{ value: "85% threshold", position: "right", fill: "hsl(var(--chart-4))", fontSize: 11 }} />
                    <Bar dataKey="attendance" name="Attendance %" radius={[4, 4, 0, 0]}>
                      {attendanceByClass.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.belowThreshold ? "hsl(var(--chart-4))" : "hsl(var(--chart-1))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance Trend (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[70, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <ReferenceLine y={85} stroke="hsl(var(--chart-4))" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Below threshold alert */}
        {belowThreshold > 0 && (
          <Card className="border-destructive/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Classes Below Attendance Threshold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {attendanceByClass
                  .filter((c) => c.belowThreshold)
                  .map((c) => (
                    <div key={c.class} className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2">
                      <span className="text-sm font-medium text-destructive">{c.class}</span>
                      <span className="text-xs text-destructive/70">{c.attendance}%</span>
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
