"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { usageTrend, teacherEngagement } from "@/lib/mock-data"

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
  color: "hsl(var(--foreground))",
}

export function UsageTrendChart() {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Usage Trend (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageTrend}>
              <defs>
                <linearGradient id="teacherGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="students" name="Students" stroke="hsl(var(--chart-2))" fill="url(#studentGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="teachers" name="Teachers" stroke="hsl(var(--chart-1))" fill="url(#teacherGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function TeacherEngagementPie() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Teacher Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={teacherEngagement}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {teacherEngagement.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
