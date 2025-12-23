"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilIcon, Wallet } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useSession } from "@/lib/auth/client"
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/db/schema/validations"
import { trpc } from "@/lib/trpc/client"
import { formatUSD } from "@/lib/utils/currency"

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldShowTopUp = searchParams.get("topup") === "true"
  const { data: session } = useSession()
  const { data: profile, isLoading: profileLoading } =
    trpc.users.getProfile.useQuery()
  const { data: wallet, isLoading: walletLoading } =
    trpc.users.getWallet.useQuery()
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
  })

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName ?? "",
        username: profile.username ?? "",
      })
    }
  }, [profile, reset])

  useEffect(() => {
    if (shouldShowTopUp) {
      setShowTopUp(true)
      // Remove the query parameter from URL
      router.replace("/profile", { scroll: false })
    }
  }, [shouldShowTopUp, router])

  const updateProfile = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`)
    },
  })

  const onSubmit = (data: ProfileUpdateInput) => {
    updateProfile.mutate({
      displayName: data.displayName ?? undefined,
      username: data.username ?? undefined,
    })
  }

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    router.push(`/checkout?source=topup&amount=${amount}`)
  }

  const quickTopUp = (amount: number) => {
    router.push(`/checkout?source=topup&amount=${amount}`)
  }

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

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="bg-surface-dark border-border-dark mb-8 flex flex-col items-center gap-8 rounded-2xl border p-8 md:flex-row">
          <div className="relative">
            <div className="border-primary h-32 w-32 rounded-full border-4 bg-gradient-to-br from-orange-500 to-yellow-500"></div>
            <button className="bg-primary absolute right-0 bottom-0 rounded-full p-2 text-white">
              <PencilIcon className="size-4" />
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
              {session?.user?.role === "admin" && (
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">
                  Display Name
                </label>
                <input
                  {...register("displayName")}
                  className={`bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white ${
                    errors.displayName ? "border-red-500" : ""
                  }`}
                  placeholder="Enter display name"
                />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.displayName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary text-sm">Username</label>
                <input
                  {...register("username")}
                  className={`bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.username.message}
                  </p>
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
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white">Wallet</h3>
              <Wallet className="text-primary h-5 w-5" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Balance</span>
                <span className="text-primary text-xl font-bold">
                  {formatUSD(wallet?.balance ?? 0)}
                </span>
              </div>
              <div className="border-border-dark border-t pt-4">
                {!showTopUp ? (
                  <button
                    onClick={() => setShowTopUp(true)}
                    className="bg-primary hover:bg-primary-hover w-full rounded-lg py-3 font-bold text-white"
                  >
                    Add Funds
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => quickTopUp(10)}
                        className="bg-background-dark hover:bg-border-dark flex-1 rounded-lg py-2 text-sm font-bold text-white"
                      >
                        $10
                      </button>
                      <button
                        onClick={() => quickTopUp(25)}
                        className="bg-background-dark hover:bg-border-dark flex-1 rounded-lg py-2 text-sm font-bold text-white"
                      >
                        $25
                      </button>
                      <button
                        onClick={() => quickTopUp(50)}
                        className="bg-background-dark hover:bg-border-dark flex-1 rounded-lg py-2 text-sm font-bold text-white"
                      >
                        $50
                      </button>
                      <button
                        onClick={() => quickTopUp(100)}
                        className="bg-background-dark hover:bg-border-dark flex-1 rounded-lg py-2 text-sm font-bold text-white"
                      >
                        $100
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="Custom amount"
                        className="bg-background-dark border-border-dark flex-1 rounded-lg border px-3 py-2 text-white"
                        min="1"
                        step="0.01"
                      />
                      <button
                        onClick={handleTopUp}
                        className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2 font-bold text-white"
                      >
                        Go
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowTopUp(false)
                        setTopUpAmount("")
                      }}
                      className="text-text-secondary w-full text-sm hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
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

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-text-secondary">Loading profile...</div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}
