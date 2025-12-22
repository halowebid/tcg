"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { signUp } from "@/lib/auth/client"
import { signupSchema, type SignupInput } from "@/lib/db/schema/validations"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    setError("")
    setIsLoading(true)

    try {
      const result = await signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          onSuccess: () => {
            toast.success("Account created successfully!")
            router.push("/collection")
          },
          onError: (ctx) => {
            setIsLoading(false)
            const errorMessage = ctx.error.message ?? "Failed to create account"
            if (errorMessage.includes("already")) {
              setError("Email already registered")
              toast.error("Email already registered")
            } else if (errorMessage.includes("origin")) {
              setError("Configuration error. Please contact support.")
              toast.error("Configuration error. Please contact support.")
            } else {
              setError(errorMessage)
              toast.error(errorMessage)
            }
          },
        },
      )

      if (!result.error) {
        toast.success("Account created successfully!")
        router.push("/collection")
      }
    } catch (err: unknown) {
      setIsLoading(false)
      if (err && typeof err === "object" && "message" in err) {
        const message = (err as { message: string }).message
        if (message?.includes("already")) {
          setError("Email already registered")
          toast.error("Email already registered")
        } else if (message?.includes("origin")) {
          setError("Configuration error. Please contact support.")
          toast.error("Configuration error. Please contact support.")
        } else {
          setError("Failed to create account. Please try again.")
          toast.error("Failed to create account. Please try again.")
        }
      } else {
        setError("Failed to create account. Please try again.")
        toast.error("Failed to create account. Please try again.")
      }
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
              Create Account
            </h1>
            <p className="text-text-secondary text-sm">
              Join the community and start collecting cards.
            </p>
          </div>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-200">
              {error}
              {error.includes("already registered") && (
                <div className="mt-2">
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary-hover font-semibold"
                  >
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-text-secondary mb-1 block text-sm">
                Name
              </label>
              <div className="relative">
                <UserIcon className="text-text-secondary absolute top-2.5 left-3 size-5" />
                <input
                  type="text"
                  {...register("name")}
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-white outline-none focus:ring-1"
                  placeholder="Your Name"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-sm">
                Email
              </label>
              <div className="relative">
                <MailIcon className="text-text-secondary absolute top-2.5 left-3 size-5" />
                <input
                  type="email"
                  {...register("email")}
                  className={`bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-white outline-none focus:ring-1 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="collector@gacha.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-sm">
                Password
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
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <div className="text-text-secondary mt-6 text-center text-sm">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-hover font-semibold transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
