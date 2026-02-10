"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "greenfield_auth"

// Mock users database
const MOCK_USERS: { email: string; password: string; name: string; role: string }[] = [
  { email: "admin@greenfield.edu", password: "admin123", name: "Dr. Rajesh Kumar", role: "School Head" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = useCallback(async (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (found) {
      const userData = { email: found.email, name: found.name, role: found.role }
      setUser(userData)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      router.push("/")
      return { success: true }
    }
    return { success: false, error: "Invalid email or password" }
  }, [router])

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (MOCK_USERS.some((u) => u.email === email)) {
      return { success: false, error: "Email already registered" }
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }
    const newUser = { email, password, name, role: "School Head" }
    MOCK_USERS.push(newUser)
    const userData = { email, name, role: "School Head" }
    setUser(userData)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    router.push("/")
    return { success: true }
  }, [router])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem(STORAGE_KEY)
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
