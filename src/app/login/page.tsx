"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { signIn } from "@/lib/auth/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [emailError, setEmailError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("Invalid email format")
    } else {
      setEmailError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateEmail(email)) {
      setEmailError("Invalid email format")
      return
    }

    setIsLoading(true)
    try {
      await signIn.email({
        email,
        password,
      })
      router.push("/collection")
    } catch {
      setError("Invalid email or password")
      setPassword("")
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
            <h1 className="mb-2 text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-text-secondary text-sm">
              Enter your details to access your collection.
            </p>
          </div>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-text-secondary mb-1 block text-sm">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-text-secondary absolute top-2.5 left-3">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-white outline-none focus:ring-1"
                  placeholder="collector@gacha.com"
                  disabled={isLoading}
                  required
                />
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-red-400">{emailError}</p>
              )}
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-sm">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-text-secondary absolute top-2.5 left-3">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-10 pl-10 text-white outline-none focus:ring-1"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined text-text-secondary hover:text-primary absolute top-2.5 right-3 transition-colors"
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !!emailError}
              className="bg-primary hover:bg-primary-hover shadow-primary/20 w-full rounded-xl py-3 font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Log In"}
            </button>
          </form>
          <div className="text-text-secondary mt-6 flex flex-col gap-2 text-center text-sm">
            <Link
              href="/forgot-password"
              className="hover:text-primary transition-colors"
            >
              Forgot Password?
            </Link>
            <p>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-hover font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
