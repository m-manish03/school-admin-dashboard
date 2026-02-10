// ── School Overview ──
export const schoolOverview = {
  name: "Greenfield International Academy",
  totalTeachers: 48,
  activeTeachersDaily: 42,
  activeTeachersWeekly: 46,
  totalStudents: 1240,
  activeStudentsDaily: 1085,
  activeStudentsWeekly: 1198,
  totalClasses: 32,
  overallPerformance: 78.4,
  academicYear: "2025-26",
}

// ── KPI metrics ──
export const kpiMetrics = [
  { label: "Teacher Platform Usage", value: 87.5, suffix: "%", trend: +2.3, icon: "users" as const },
  { label: "Student Platform Usage", value: 87.5, suffix: "%", trend: +4.1, icon: "graduation-cap" as const },
  { label: "Avg. Attendance Rate", value: 91.2, suffix: "%", trend: -0.8, icon: "calendar-check" as const },
  { label: "Avg. Academic Score", value: 78.4, suffix: "%", trend: +1.5, icon: "trophy" as const },
]

// ── Usage trend (last 30 days) ──
export const usageTrend = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 1, 10)
  date.setDate(date.getDate() - (29 - i))
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return {
    date: day,
    teachers: Math.round(35 + Math.random() * 12),
    students: Math.round(900 + Math.random() * 250),
  }
})

// ── Teachers ──
const subjects = ["Mathematics", "English", "Science", "Social Studies", "Hindi", "Computer Science", "Physics", "Chemistry", "Biology", "History"]
const firstNames = ["Aarav", "Priya", "Rahul", "Sneha", "Vikram", "Anita", "Deepak", "Kavita", "Suresh", "Meena", "Raj", "Suman", "Amit", "Neha", "Ravi", "Pooja", "Manish", "Swati", "Arun", "Divya"]
const lastNames = ["Sharma", "Patel", "Verma", "Singh", "Kumar", "Gupta", "Joshi", "Reddy", "Nair", "Rao", "Das", "Bhat", "Iyer", "Chopra", "Mehta", "Malhotra", "Chauhan", "Saxena", "Kapoor", "Bansal"]

export const teachers = Array.from({ length: 24 }, (_, i) => {
  const active = Math.random() > 0.15
  const daysAgo = active ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 30 + 7)
  const lastActive = new Date(2026, 1, 10)
  lastActive.setDate(lastActive.getDate() - daysAgo)
  return {
    id: `T${String(i + 1).padStart(3, "0")}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    subject: subjects[i % subjects.length],
    classesHandled: Math.floor(Math.random() * 3 + 1),
    lastActive: lastActive.toISOString().split("T")[0],
    activeStudentsPercent: Math.round(60 + Math.random() * 38),
    status: active ? ("active" as const) : ("inactive" as const),
    lessonsCreated: Math.floor(Math.random() * 40 + 5),
    assignmentsGraded: Math.floor(Math.random() * 200 + 20),
  }
})

// ── Teacher engagement chart ──
export const teacherEngagement = [
  { name: "Active", value: teachers.filter((t) => t.status === "active").length, fill: "hsl(var(--success))" },
  { name: "Inactive", value: teachers.filter((t) => t.status === "inactive").length, fill: "hsl(var(--destructive))" },
]

// ── Classes / Sections ──
const sections = ["A", "B"]
export const classes = Array.from({ length: 10 }, (_, i) => {
  const grade = i + 1
  return sections.map((sec) => ({
    id: `${grade}-${sec}`,
    grade,
    section: sec,
    label: `Class ${grade}-${sec}`,
    totalStudents: Math.round(28 + Math.random() * 12),
    activeStudentsPercent: Math.round(75 + Math.random() * 23),
    avgAttendance: Math.round(82 + Math.random() * 16),
    avgPerformance: Math.round(62 + Math.random() * 30),
  }))
}).flat()

// ── Subject-wise average marks ──
export const subjectPerformance = subjects.slice(0, 8).map((s) => ({
  subject: s,
  avgMarks: Math.round(55 + Math.random() * 35),
}))

// ── Monthly performance trend ──
export const performanceTrend = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb",
].map((month) => ({
  month,
  performance: Math.round(68 + Math.random() * 20),
  attendance: Math.round(80 + Math.random() * 15),
}))

// ── Daily active users ──
export const dailyActiveUsers = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 1, 10)
  date.setDate(date.getDate() - (29 - i))
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  return {
    date: day,
    students: isWeekend ? Math.round(100 + Math.random() * 200) : Math.round(900 + Math.random() * 250),
    teachers: isWeekend ? Math.round(5 + Math.random() * 10) : Math.round(35 + Math.random() * 12),
  }
})

// ── Attendance per class ──
export const attendanceByClass = classes.filter((_, i) => i % 2 === 0).map((c) => ({
  class: c.label,
  attendance: c.avgAttendance,
  belowThreshold: c.avgAttendance < 85,
}))

// ── Attendance trend over time ──
export const attendanceTrend = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb",
].map((month) => ({
  month,
  attendance: Math.round(83 + Math.random() * 12),
}))

// ── Login heatmap (hourly, weekly) ──
export const loginHeatmap = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7am - 8pm
  const data: { day: string; hour: number; value: number }[] = []
  for (const day of days) {
    for (const hour of hours) {
      const isWeekend = day === "Sat" || day === "Sun"
      const isPeak = hour >= 8 && hour <= 14
      const base = isWeekend ? 5 : isPeak ? 60 : 20
      data.push({ day, hour, value: Math.round(base + Math.random() * (isWeekend ? 10 : 40)) })
    }
  }
  return data
})()

// ── Class-wise achievement for academics ──
export const classAchievement = classes.filter((_, i) => i % 2 === 0).map((c) => ({
  class: c.label,
  achievement: c.avgPerformance,
  isLow: c.avgPerformance < 70,
}))

// ══════════════════════════════════════════
// AI & AR ANALYTICS DATA
// ══════════════════════════════════════════

// ── AI Usage Overview ──
export const aiUsageOverview = {
  totalAISessions: 18420,
  avgAITimePerStudent: 34, // minutes
  aiAdoptionPercent: 76.3,
  totalAILessonsCreated: 312,
  aiSessionsTrend: +8.5,
  aiTimeTrend: +3.2,
  adoptionTrend: +5.1,
}

// ── AR Usage Overview ──
export const arUsageOverview = {
  totalARLessons: 148,
  arStudentParticipation: 892,
  avgARTimePerSession: 22, // minutes
  arEnabledSubjects: 5,
  arLessonsTrend: +12.4,
  participationTrend: +6.8,
  arTimeTrend: +1.9,
}

// ── AI Usage Trend (daily / weekly / monthly) ──
export const aiUsageTrend = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 1, 10)
  date.setDate(date.getDate() - (29 - i))
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  return {
    date: day,
    sessions: isWeekend ? Math.round(50 + Math.random() * 100) : Math.round(450 + Math.random() * 200),
    avgTime: Math.round(25 + Math.random() * 20),
  }
})

// ── AR Usage Trend ──
export const arUsageTrend = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 1, 10)
  date.setDate(date.getDate() - (29 - i))
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  return {
    date: day,
    lessons: isWeekend ? Math.round(1 + Math.random() * 3) : Math.round(4 + Math.random() * 6),
    participants: isWeekend ? Math.round(10 + Math.random() * 30) : Math.round(60 + Math.random() * 50),
  }
})

// ── AI/AR Usage by Subject ──
export const aiArBySubject = [
  { subject: "Mathematics", aiSessions: 3200, arLessons: 28, aiTime: 38, arTime: 25 },
  { subject: "Science", aiSessions: 4100, arLessons: 42, aiTime: 42, arTime: 28 },
  { subject: "English", aiSessions: 2800, arLessons: 12, aiTime: 30, arTime: 18 },
  { subject: "Social Studies", aiSessions: 1900, arLessons: 22, aiTime: 28, arTime: 22 },
  { subject: "Physics", aiSessions: 2400, arLessons: 18, aiTime: 36, arTime: 24 },
  { subject: "Chemistry", aiSessions: 2100, arLessons: 15, aiTime: 34, arTime: 26 },
  { subject: "Biology", aiSessions: 1920, arLessons: 11, aiTime: 32, arTime: 20 },
]

// ── Student Improvement (before vs after AI/AR) ──
export const studentImprovement = classes.filter((_, i) => i % 2 === 0).map((c) => {
  const beforeScore = Math.round(50 + Math.random() * 20)
  const improvementPct = Math.round(5 + Math.random() * 25)
  const afterScore = Math.min(100, Math.round(beforeScore * (1 + improvementPct / 100)))
  return {
    class: c.label,
    beforeScore,
    afterScore,
    improvement: improvementPct,
    isHigh: improvementPct > 18,
    isLow: improvementPct < 10,
  }
})

// ── AI/AR Usage vs Performance Correlation ──
export const usageVsPerformance = classes.filter((_, i) => i % 3 === 0).map((c) => {
  const aiUsage = Math.round(20 + Math.random() * 60) // % of time
  const performance = Math.round(55 + aiUsage * 0.45 + (Math.random() - 0.5) * 15)
  return {
    class: c.label,
    aiUsagePercent: aiUsage,
    performance: Math.min(100, performance),
  }
})

// ── Monthly Improvement Index ──
export const monthlyImprovement = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb",
].map((month, i) => ({
  month,
  improvementIndex: Math.round(3 + i * 1.2 + Math.random() * 4),
  aiAdoption: Math.round(35 + i * 4 + Math.random() * 5),
}))

// ── Engagement Time Metrics ──
export const engagementMetrics = {
  avgDailyStudentTime: 42, // minutes
  avgWeeklyTeacherTime: 185, // minutes
  peakUsageHour: "10:00 AM",
  avgSessionsPerDay: 3.4,
  dailyTimeTrend: +2.8,
  weeklyTimeTrend: +5.1,
}

// ── Drop-off Analysis ──
export const dropoffStudents = [
  { classLabel: "Class 3-A", studentsDeclined: 8, avgDeclinePercent: -18 },
  { classLabel: "Class 5-B", studentsDeclined: 12, avgDeclinePercent: -22 },
  { classLabel: "Class 7-A", studentsDeclined: 5, avgDeclinePercent: -14 },
  { classLabel: "Class 8-B", studentsDeclined: 9, avgDeclinePercent: -19 },
  { classLabel: "Class 10-A", studentsDeclined: 3, avgDeclinePercent: -11 },
]

// ── Session Frequency Heatmap ──
export const sessionHeatmap = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 14 }, (_, i) => i + 7)
  const data: { day: string; hour: number; ai: number; ar: number }[] = []
  for (const day of days) {
    for (const hour of hours) {
      const isWeekend = day === "Sat" || day === "Sun"
      const isPeak = hour >= 9 && hour <= 13
      const aiBase = isWeekend ? 3 : isPeak ? 40 : 15
      const arBase = isWeekend ? 1 : isPeak ? 12 : 4
      data.push({
        day,
        hour,
        ai: Math.round(aiBase + Math.random() * (isWeekend ? 5 : 25)),
        ar: Math.round(arBase + Math.random() * (isWeekend ? 3 : 10)),
      })
    }
  }
  return data
})()
