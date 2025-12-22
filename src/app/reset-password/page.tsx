"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/db/schema/validations"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    setError("")
    setIsLoading(true)

    try {
      const token = searchParams.get("token")

      if (!token) {
        setError("Reset link is invalid or expired")
        setIsLoading(false)
        return
      }

      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      })
      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
    } catch {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"></div>
      </div>
      <div className="bg-surface-dark border-border-dark relative z-10 w-full max-w-md overflow-hidden rounded-xl border shadow-2xl">
        <div className="from-primary h-1.5 w-full bg-gradient-to-r to-orange-400"></div>
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-white">
              Reset Password
            </h1>
            <p className="text-text-secondary text-sm">
              Enter your new password below.
            </p>
          </div>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          {success ? (
            <div className="mb-4 rounded-lg border border-green-500/30 bg-green-900/20 p-4 text-sm text-green-200">
              <p className="mb-2 font-semibold">Password Reset Successful!</p>
              <p>Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-text-secondary mb-1 block text-sm">
                  New Password
                </label>
                <div className="relative">
                  <LockIcon className="text-text-secondary absolute top-2.5 left-3 size-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-10 pl-10 text-white outline-none focus:ring-1 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-secondary hover:text-primary absolute top-2.5 right-3 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockIcon className="text-text-secondary absolute top-2.5 left-3 size-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={`bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-white outline-none focus:ring-1 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary-hover shadow-primary/20 w-full rounded-xl py-3 font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
          <div className="text-text-secondary mt-6 text-center text-sm">
            <Link
              href="/login"
              className="hover:text-primary transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="text-text-secondary text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
