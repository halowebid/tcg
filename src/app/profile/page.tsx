"use client"

import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { trpc } from "@/lib/trpc/client"

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional()
    .or(z.literal("")),
})

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } =
    trpc.users.getProfile.useQuery()
  const { data: wallet, isLoading: walletLoading } =
    trpc.users.getWallet.useQuery()
  const updateProfile = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`)
    },
  })

  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [errors, setErrors] = useState<{
    displayName?: string
    username?: string
  }>({})

  const isLoading = profileLoading || walletLoading

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Profile not found</div>
      </div>
    )
  }

  // Set initial values from profile data
  if (!displayName && profile.displayName) {
    setDisplayName(profile.displayName)
  }
  if (!username && profile.username) {
    setUsername(profile.username)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    const result = profileSchema.safeParse({
      displayName: displayName || undefined,
      username: username || undefined,
    })

    if (!result.success) {
      const fieldErrors: { displayName?: string; username?: string } = {}
      result.error.issues.forEach((err) => {
        if (err.path[0] === "displayName") {
          fieldErrors.displayName = err.message
        }
        if (err.path[0] === "username") {
          fieldErrors.username = err.message
        }
      })
      setErrors(fieldErrors)
      toast.error("Please fix the validation errors")
      return
    }

    setErrors({})
    updateProfile.mutate({
      displayName: displayName || undefined,
      username: username || undefined,
    })
  }

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="bg-surface-dark border-border-dark mb-8 flex flex-col items-center gap-8 rounded-2xl border p-8 md:flex-row">
          <div className="relative">
            <div className="border-primary h-32 w-32 rounded-full border-4 bg-gradient-to-br from-orange-500 to-yellow-500"></div>
            <button className="bg-primary absolute right-0 bottom-0 rounded-full p-2 text-white">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">
              {profile.displayName || "User"}
            </h1>
            <p className="text-text-secondary mt-1">
              @{profile.username || "user"} • Joined{" "}
              {new Date(profile.createdAt).getFullYear()}
            </p>
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              <div className="bg-background-dark text-text-secondary border-border-dark rounded-lg border px-4 py-2 text-sm">
                Verified
              </div>
              {profile.isAdmin && (
                <div className="bg-background-dark border-primary/20 text-primary rounded-lg border px-4 py-2 text-sm">
                  Admin
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-surface-dark border-border-dark rounded-2xl border p-6">
            <h3 className="mb-4 font-bold text-white">Settings</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">
                  Display Name
                </label>
                <input
                  className={`bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white ${
                    errors.displayName ? "border-red-500" : ""
                  }`}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.displayName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary text-sm">Username</label>
                <input
                  className={`bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="bg-primary text-background-dark hover:bg-primary-hover mt-4 w-full rounded-lg py-2 font-bold disabled:opacity-50"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="bg-surface-dark border-border-dark rounded-2xl border p-6">
            <h3 className="mb-4 font-bold text-white">Wallet</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Coins</span>
                <span className="font-bold text-white">
                  {wallet?.coins ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Gems</span>
                <span className="font-bold text-white">
                  {wallet?.gems ?? 0}
                </span>
              </div>
              <div className="border-border-dark border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Member Since</span>
                  <span className="font-bold text-white">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
