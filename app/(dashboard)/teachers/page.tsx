"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
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
import { teachers, teacherEngagement } from "@/lib/mock-data"

type Teacher = (typeof teachers)[number]

function TeacherProfile({ teacher, open, onClose }: { teacher: Teacher | null; open: boolean; onClose: () => void }) {
  if (!teacher) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{teacher.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium text-foreground">{teacher.subject}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={teacher.status === "active" ? "default" : "secondary"}
                className={teacher.status === "active" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : ""}
              >
                {teacher.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classes Handled</p>
              <p className="font-medium text-foreground">{teacher.classesHandled}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="font-medium text-foreground">{teacher.lastActive}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="font-medium text-foreground">{teacher.activeStudentsPercent}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lessons Created</p>
              <p className="font-medium text-foreground">{teacher.lessonsCreated}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Assignments Graded</p>
            <div className="flex items-center gap-3">
              <Progress value={Math.min(teacher.assignmentsGraded / 2, 100)} className="h-2 flex-1" />
              <span className="text-sm font-medium text-foreground">{teacher.assignmentsGraded}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function TeachersPage() {
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const subjects = Array.from(new Set(teachers.map((t) => t.subject)))
  const filtered = subjectFilter === "all" ? teachers : teachers.filter((t) => t.subject === subjectFilter)

  const engagementBySubject = subjects.map((s) => {
    const subTeachers = teachers.filter((t) => t.subject === s)
    const active = subTeachers.filter((t) => t.status === "active").length
    return { subject: s.length > 8 ? `${s.slice(0, 7)}...` : s, active, inactive: subTeachers.length - active }
  })

  return (
    <>
      <DashboardHeader title="Teacher Analytics" description="Monitor teacher activity and engagement" />
      <div className="flex flex-col gap-6 p-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-2xl font-bold text-foreground">{teachers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Active Teachers</p>
              <p className="text-2xl font-bold text-[hsl(var(--success))]">
                {teachers.filter((t) => t.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Inactive Teachers</p>
              <p className="text-2xl font-bold text-destructive">
                {teachers.filter((t) => t.status === "inactive").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Engagement by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementBySubject} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={70} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }}
                    />
                    <Bar dataKey="active" name="Active" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="inactive" name="Inactive" stackId="a" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active vs Inactive</CardTitle>
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
                    <Legend verticalAlign="bottom" height={36} formatter={(value: string) => <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>{value}</span>} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teacher table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Teacher Directory</CardTitle>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-44 h-9 text-sm">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Classes</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-center">Active Students</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((teacher) => (
                  <TableRow
                    key={teacher.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <TableCell className="font-medium text-foreground">{teacher.name}</TableCell>
                    <TableCell className="text-muted-foreground">{teacher.subject}</TableCell>
                    <TableCell className="text-center text-foreground">{teacher.classesHandled}</TableCell>
                    <TableCell className="text-muted-foreground">{teacher.lastActive}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Progress value={teacher.activeStudentsPercent} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">{teacher.activeStudentsPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={teacher.status === "active" ? "default" : "secondary"}
                        className={teacher.status === "active" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : ""}
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TeacherProfile
        teacher={selectedTeacher}
        open={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
    </>
  )
}
