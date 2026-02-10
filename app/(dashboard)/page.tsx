import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { UsageTrendChart, TeacherEngagementPie } from "@/components/dashboard/overview-charts"
import { AIARInsightsCard } from "@/components/dashboard/aiar-insights-card"
import { kpiMetrics } from "@/lib/mock-data"

export default function OverviewPage() {
  return (
    <>
      <DashboardHeader
        title="School Overview"
        description="Greenfield International Academy - Performance at a glance"
      />
      <div className="flex flex-col gap-6 p-6">
        <OverviewStats />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiMetrics.map((metric) => (
            <KpiCard key={metric.label} {...metric} />
          ))}
        </div>

        <AIARInsightsCard />

        <div className="grid gap-4 lg:grid-cols-3">
          <UsageTrendChart />
          <TeacherEngagementPie />
        </div>
      </div>
    </>
  )
}
