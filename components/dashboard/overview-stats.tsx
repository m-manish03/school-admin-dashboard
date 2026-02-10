import { Card, CardContent } from "@/components/ui/card"
import { Users, GraduationCap, School, TrendingUp } from "lucide-react"
import { schoolOverview } from "@/lib/mock-data"

const stats = [
  {
    label: "Total Teachers",
    value: schoolOverview.totalTeachers,
    sub: `${schoolOverview.activeTeachersDaily} active today`,
    icon: Users,
  },
  {
    label: "Total Students",
    value: schoolOverview.totalStudents.toLocaleString(),
    sub: `${schoolOverview.activeStudentsDaily.toLocaleString()} active today`,
    icon: GraduationCap,
  },
  {
    label: "Total Classes",
    value: schoolOverview.totalClasses,
    sub: "Across all grades",
    icon: School,
  },
  {
    label: "School Performance",
    value: `${schoolOverview.overallPerformance}%`,
    sub: "Overall academic score",
    icon: TrendingUp,
  },
]

export function OverviewStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{stat.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
