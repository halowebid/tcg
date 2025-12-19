import { StatCard } from "@/components/ui"

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Users"
        value={stats?.totalUsers || 0}
      />
      <StatCard
        title="Total Pulls"
        value={stats?.totalPulls || 0}
      />
      <StatCard
        title="Total Revenue"
        value={`${stats?.totalRevenue || 0} coins`}
      />
    </div>
  )
}
