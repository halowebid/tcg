"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { DashboardHeader } from "@/components/Headers"
import { trpc } from "@/lib/trpc/client"

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["user", "staff", "admin"]),
})

type CreateUserInput = z.infer<typeof createUserSchema>

export default function AdminUsersPage() {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "user",
    },
  })

  const { data: usersData, isLoading } = trpc.admin.listUsers.useQuery({
    limit: 50,
    offset: 0,
  })

  const banMutation = trpc.admin.banUserAdmin.useMutation({
    onSuccess: () => {
      toast.success("User status updated successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`)
    },
  })

  const unbanMutation = trpc.admin.unbanUser.useMutation({
    onSuccess: () => {
      toast.success("User unbanned successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to unban user: ${error.message}`)
    },
  })

  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      toast.success("User created successfully!")
      setShowCreateModal(false)
      reset()
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to create user: ${error.message}`)
    },
  })

  const handleCreateUser = (data: CreateUserInput) => {
    createUserMutation.mutate(data)
  }

  const handleBanToggle = (userId: string, isBanned: boolean) => {
    if (isBanned) {
      unbanMutation.mutate({ userId })
    } else {
      if (confirm("Are you sure you want to ban this user?")) {
        banMutation.mutate({ userId, banReason: "Banned by administrator" })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-text-secondary">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="User Management"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors"
          >
            <UserPlusIcon className="size-5" />
            Create User
          </button>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="bg-surface-dark border-border-dark rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border-dark border-b">
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border-dark divide-y">
                {usersData?.users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-highlight transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-10 rounded-full bg-cover bg-center"
                          style={{
                            backgroundImage: user.image
                              ? `url("${user.image}")`
                              : `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}")`,
                          }}
                        />
                        <span className="font-medium text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-text-secondary px-6 py-4 text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-primary/20 text-primary"
                            : user.role === "staff"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {user.role === "admin"
                          ? "Admin"
                          : user.role === "staff"
                            ? "Staff"
                            : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                          user.banned
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="text-text-secondary px-6 py-4 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                          className="hover:bg-primary/20 hover:border-primary/30 rounded-lg border border-transparent px-3 py-1 text-sm font-bold text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleBanToggle(user.id, user.banned ?? false)
                          }
                          disabled={
                            banMutation.isPending || unbanMutation.isPending
                          }
                          className={`rounded-lg border px-3 py-1 text-sm font-bold transition-colors disabled:opacity-50 ${
                            user.banned
                              ? "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                              : "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          }`}
                        >
                          {user.banned ? "Unban" : "Ban"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface-dark border-border-dark w-full max-w-md rounded-xl border p-6">
              <h2 className="mb-4 text-xl font-bold text-white">
                Create New User
              </h2>
              <form onSubmit={handleSubmit(handleCreateUser)}>
                <div className="space-y-4">
                  <div>
                    <label className="text-text-secondary mb-2 block text-xs font-bold uppercase">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-text-secondary mb-2 block text-xs font-bold uppercase">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-text-secondary mb-2 block text-xs font-bold uppercase">
                      Password
                    </label>
                    <input
                      {...register("password")}
                      type="password"
                      className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      placeholder="Min. 8 characters"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-text-secondary mb-2 block text-xs font-bold uppercase">
                      Role
                    </label>
                    <select
                      {...register("role")}
                      className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                        errors.role ? "border-red-500" : ""
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-surface-highlight hover:bg-surface-dark flex-1 rounded-lg px-4 py-2 font-bold text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    className="bg-primary hover:bg-primary-hover flex-1 rounded-lg px-4 py-2 font-bold text-white transition-colors disabled:opacity-50"
                  >
                    {createUserMutation.isPending
                      ? "Creating..."
                      : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
