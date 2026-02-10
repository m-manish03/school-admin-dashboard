"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "recharts"
import { classes, performanceTrend } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function StudentsPage() {
  const [gradeFilter, setGradeFilter] = useState("all")

  const grades = Array.from(new Set(classes.map((c) => c.grade))).sort((a, b) => a - b)
  const filtered = gradeFilter === "all" ? classes : classes.filter((c) => c.grade === Number(gradeFilter))

  const classPerformanceData = filtered.map((c) => ({
    name: c.label,
    performance: c.avgPerformance,
    attendance: c.avgAttendance,
  }))

  const totalStudents = filtered.reduce((s, c) => s + c.totalStudents, 0)
  const avgActive = Math.round(filtered.reduce((s, c) => s + c.activeStudentsPercent, 0) / (filtered.length || 1))
  const avgPerf = Math.round(filtered.reduce((s, c) => s + c.avgPerformance, 0) / (filtered.length || 1))

  return (
    <>
      <DashboardHeader title="Student Analytics" description="Class-wise student activity and performance" />
      <div className="flex flex-col gap-6 p-6">
        {/* Filter */}
        <div className="flex items-center gap-3">
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map((g) => (
                <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">{totalStudents.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Avg. Active Students</p>
              <p className="text-2xl font-bold text-[hsl(var(--success))]">{avgActive}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Avg. Performance</p>
              <p className="text-2xl font-bold text-foreground">{avgPerf}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Class-wise Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="performance" name="Performance %" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attendance" name="Attendance %" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Performance & Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[50, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="performance" name="Performance" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="attendance" name="Attendance" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class-wise table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class-wise Metrics</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Total Students</TableHead>
                  <TableHead className="text-center">Active %</TableHead>
                  <TableHead className="text-center">Avg. Attendance</TableHead>
                  <TableHead className="text-center">Avg. Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-foreground">{c.label}</TableCell>
                    <TableCell className="text-center text-foreground">{c.totalStudents}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Progress value={c.activeStudentsPercent} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{c.activeStudentsPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("text-sm font-medium", c.avgAttendance < 85 ? "text-destructive" : "text-foreground")}>
                        {c.avgAttendance}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("text-sm font-medium", c.avgPerformance < 70 ? "text-destructive" : "text-foreground")}>
                        {c.avgPerformance}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
