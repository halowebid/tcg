import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"

interface User {
  userId: string
  username: string
  level: number
  coins: number
  gems: number
  isBanned: boolean
}

interface UserManagementTableProps {
  users: User[] | undefined
  onBanUser: (userId: string, banned: boolean) => Promise<void>
  isPending: boolean
}

export function UserManagementTable({ users, onBanUser, isPending }: UserManagementTableProps) {
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
                <th className="text-left py-2">Username</th>
                <th className="text-left py-2">Level</th>
                <th className="text-left py-2">Coins</th>
                <th className="text-left py-2">Gems</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.userId} className="border-b">
                  <td className="py-2">{user.username}</td>
                  <td className="py-2">{user.level}</td>
                  <td className="py-2">{user.coins}</td>
                  <td className="py-2">{user.gems}</td>
                  <td className="py-2">
                    <span className={user.isBanned ? "text-red-600" : "text-green-600"}>
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
