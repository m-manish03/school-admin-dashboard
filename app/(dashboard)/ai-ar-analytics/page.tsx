"use client"

import React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Brain,
  Glasses,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  BookOpen,
  AlertTriangle,
} from "lucide-react"
import {
  aiUsageOverview,
  arUsageOverview,
  aiUsageTrend,
  arUsageTrend,
  aiArBySubject,
  studentImprovement,
  usageVsPerformance,
  monthlyImprovement,
  engagementMetrics,
  dropoffStudents,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function TrendBadge({ value }: { value: number }) {
  const isPositive = value >= 0
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", isPositive ? "text-[hsl(var(--success))]" : "text-destructive")}>
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isPositive ? "+" : ""}{value}%
    </span>
  )
}

function MetricCard({ label, value, unit, trend, icon: Icon }: { label: string; value: number | string; unit?: string; trend: number; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-2xl font-bold text-foreground">{value}{unit}</span>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2">
          <TrendBadge value={trend} />
          <span className="ml-1.5 text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AIARAnalyticsPage() {
  const [subjectFilter, setSubjectFilter] = useState("all")

  const filteredSubjects = subjectFilter === "all" ? aiArBySubject : aiArBySubject.filter((s) => s.subject === subjectFilter)
  const highImprovement = studentImprovement.filter((s) => s.isHigh)
  const lowImprovement = studentImprovement.filter((s) => s.isLow)

  return (
    <>
      <DashboardHeader title="AI & AR Analytics" description="AI-assisted learning and AR-enabled lesson insights" />
      <div className="flex flex-col gap-6 p-6">
        {/* KPI cards row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="AI Sessions" value={aiUsageOverview.totalAISessions.toLocaleString()} trend={aiUsageOverview.aiSessionsTrend} icon={Brain} />
          <MetricCard label="Avg. AI Time" value={aiUsageOverview.avgAITimePerStudent} unit=" min" trend={aiUsageOverview.aiTimeTrend} icon={Clock} />
          <MetricCard label="AI Adoption" value={aiUsageOverview.aiAdoptionPercent} unit="%" trend={aiUsageOverview.adoptionTrend} icon={TrendingUp} />
          <MetricCard label="AR Lessons" value={arUsageOverview.totalARLessons} trend={arUsageOverview.arLessonsTrend} icon={Glasses} />
          <MetricCard label="AR Participation" value={arUsageOverview.arStudentParticipation} trend={arUsageOverview.participationTrend} icon={Users} />
          <MetricCard label="Avg. AR Time" value={arUsageOverview.avgARTimePerSession} unit=" min" trend={arUsageOverview.arTimeTrend} icon={Clock} />
        </div>

        {/* Usage Trend Charts */}
        <Tabs defaultValue="ai" className="w-full">
          <TabsList>
            <TabsTrigger value="ai">AI Usage Trend</TabsTrigger>
            <TabsTrigger value="ar">AR Usage Trend</TabsTrigger>
          </TabsList>
          <TabsContent value="ai">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Sessions & Avg. Time (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aiUsageTrend}>
                      <defs>
                        <linearGradient id="aiSessionsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} width={45} />
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12, backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
                      <Area type="monotone" dataKey="sessions" name="Sessions" stroke="hsl(var(--chart-1))" fill="url(#aiSessionsGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ar">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AR Lessons & Participants (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={arUsageTrend}>
                      <defs>
                        <linearGradient id="arParticipantsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} width={45} />
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12, backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
                      <Area type="monotone" dataKey="participants" name="Participants" stroke="hsl(var(--chart-5))" fill="url(#arParticipantsGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Subject-wise breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI & AR Usage by Subject</CardTitle>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-44 h-9 text-sm">
                <SelectValue placeholder="Filter subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {aiArBySubject.map((s) => (
                  <SelectItem key={s.subject} value={s.subject}>{s.subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">AI Sessions</TableHead>
                  <TableHead className="text-center">Avg. AI Time</TableHead>
                  <TableHead className="text-center">AR Lessons</TableHead>
                  <TableHead className="text-center">Avg. AR Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((s) => (
                  <TableRow key={s.subject}>
                    <TableCell className="font-medium text-foreground">{s.subject}</TableCell>
                    <TableCell className="text-center text-foreground">{s.aiSessions.toLocaleString()}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{s.aiTime} min</TableCell>
                    <TableCell className="text-center text-foreground">{s.arLessons}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{s.arTime} min</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Student improvement & Correlation */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Student Improvement (Before vs After AI/AR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentImprovement}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="class" tick={{ fontSize: 10 }} className="fill-muted-foreground" tickLine={false} axisLine={false} interval={0} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12, backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="beforeScore" name="Before" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="afterScore" name="After" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AI/AR Usage vs Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" dataKey="aiUsagePercent" name="AI Usage %" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} domain={[0, 100]} />
                    <YAxis type="number" dataKey="performance" name="Performance %" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", fontSize: 12, backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                    <Scatter name="Classes" data={usageVsPerformance} fill="hsl(var(--chart-2))">
                      {usageVsPerformance.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="hsl(var(--chart-2))" />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly improvement index */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Improvement Index & AI Adoption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyImprovement}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12, backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="improvementIndex" name="Improvement Index" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="aiAdoption" name="AI Adoption %" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement & Drop-off */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Engagement time metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Engagement Time Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Avg. Daily Student Time</p>
                  <p className="text-xl font-bold text-foreground">{engagementMetrics.avgDailyStudentTime} min</p>
                  <TrendBadge value={engagementMetrics.dailyTimeTrend} />
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Avg. Weekly Teacher Time</p>
                  <p className="text-xl font-bold text-foreground">{engagementMetrics.avgWeeklyTeacherTime} min</p>
                  <TrendBadge value={engagementMetrics.weeklyTimeTrend} />
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Peak Usage Hour</p>
                  <p className="text-xl font-bold text-foreground">{engagementMetrics.peakUsageHour}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Avg. Sessions / Day</p>
                  <p className="text-xl font-bold text-foreground">{engagementMetrics.avgSessionsPerDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drop-off analysis */}
          <Card className="border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Drop-off Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Students Declined</TableHead>
                    <TableHead className="text-center">Avg. Decline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dropoffStudents.map((d) => (
                    <TableRow key={d.classLabel}>
                      <TableCell className="font-medium text-foreground">{d.classLabel}</TableCell>
                      <TableCell className="text-center text-foreground">{d.studentsDeclined}</TableCell>
                      <TableCell className="text-center text-destructive font-medium">{d.avgDeclinePercent}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* High/Low improvement alerts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {highImprovement.length > 0 && (
            <Card className="border-[hsl(var(--success))]/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[hsl(var(--success))]">High-Improvement Classes ({'>'}18%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {highImprovement.map((c) => (
                    <Badge key={c.class} className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30" variant="outline">
                      {c.class}: +{c.improvement}%
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {lowImprovement.length > 0 && (
            <Card className="border-destructive/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Low-Improvement Classes ({'<'}10%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lowImprovement.map((c) => (
                    <Badge key={c.class} className="bg-destructive/10 text-destructive border-destructive/30" variant="outline">
                      {c.class}: +{c.improvement}%
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
