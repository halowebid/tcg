"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { signUp } from "@/lib/auth/client"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [emailError, setEmailError] = React.useState("")
  const [passwordError, setPasswordError] = React.useState("")
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("")
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

  const handlePasswordBlur = () => {
    if (password && password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
    } else {
      setPasswordError("")
    }
  }

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match")
    } else {
      setConfirmPasswordError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateEmail(email)) {
      setEmailError("Invalid email format")
      return
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      await signUp.email({
        email,
        password,
        name,
      })
      router.push("/collection")
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        const message = (err as { message: string }).message
        if (message?.includes("already")) {
          setError("Email already registered")
        } else {
          setError("Failed to create account. Please try again.")
        }
      } else {
        setError("Failed to create account. Please try again.")
      }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-text-secondary mb-1 block text-sm">
                Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-text-secondary absolute top-2.5 left-3">
                  person
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-white outline-none focus:ring-1"
                  placeholder="Your Name"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
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
                  onBlur={handlePasswordBlur}
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
              {passwordError && (
                <p className="mt-1 text-xs text-red-400">{passwordError}</p>
              )}
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-text-secondary absolute top-2.5 left-3">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-white outline-none focus:ring-1"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-xs text-red-400">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={
                isLoading ||
                !!emailError ||
                !!passwordError ||
                !!confirmPasswordError
              }
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
