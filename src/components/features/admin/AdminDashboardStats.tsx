import { StatCard } from "@/components/ui"
import { formatUSD } from "@/lib/utils/currency"

interface DashboardStats {
  totalUsers: number
  totalPulls: number
  totalRevenue: number
}

interface AdminDashboardStatsProps {
  stats: DashboardStats | undefined
}

export function AdminDashboardStats({ stats }: AdminDashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
      <StatCard title="Total Pulls" value={stats?.totalPulls ?? 0} />
      <StatCard
        title="Total Revenue"
        value={formatUSD(stats?.totalRevenue ?? 0)}
      />
    </div>
  )
}
