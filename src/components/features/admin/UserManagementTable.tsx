import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui"
import { formatUSD } from "@/lib/utils/currency"

interface User {
  userId: string
  username: string
  level: number
  balance: number
  isBanned: boolean
  role?: string
}

interface UserManagementTableProps {
  users: User[] | undefined
  onBanUser: (userId: string, banned: boolean) => Promise<void>
  onChangeRole?: (userId: string, role: string) => Promise<void>
  isPending: boolean
  currentUserId?: string
}

export function UserManagementTable({
  users,
  onBanUser,
  onChangeRole,
  isPending,
  currentUserId,
}: UserManagementTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Username</th>
                <th className="py-2 text-left">Level</th>
                <th className="py-2 text-left">Balance</th>
                {onChangeRole && <th className="py-2 text-left">Role</th>}
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.userId} className="border-b">
                  <td className="py-2">{user.username}</td>
                  <td className="py-2">{user.level}</td>
                  <td className="py-2">{formatUSD(user.balance)}</td>
                  {onChangeRole && (
                    <td className="py-2">
                      <select
                        value={user.role ?? "user"}
                        onChange={(e) =>
                          onChangeRole(user.userId, e.target.value)
                        }
                        disabled={isPending || user.userId === currentUserId}
                        className="bg-background-dark border-border-dark rounded border px-2 py-1 text-sm text-white disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  )}
                  <td className="py-2">
                    <span
                      className={
                        user.isBanned ? "text-red-600" : "text-green-600"
                      }
                    >
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="py-2">
                    <Button
                      size="sm"
                      variant={user.isBanned ? "secondary" : "danger"}
                      onClick={() => onBanUser(user.userId, !user.isBanned)}
                      disabled={isPending}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
