"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { School, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(email, password)
    if (!result.success) {
      setError(result.error ?? "Login failed")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <School className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Greenfield Academy</h1>
            <p className="text-sm text-muted-foreground">School Dashboard</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@greenfield.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Register
                </Link>
              </p>
            </form>

            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Demo credentials:</p>
              <p className="text-xs text-muted-foreground">admin@greenfield.edu / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
