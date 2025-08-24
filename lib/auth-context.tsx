"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ApiClient, type User, type ServerEnvironment } from "./api"

interface AuthContextType {
  user: User | null
  apiClient: ApiClient
  environment: ServerEnvironment
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchEnvironment: (env: ServerEnvironment) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [environment, setEnvironment] = useState<ServerEnvironment>("PROD")
  const [apiClient, setApiClient] = useState(new ApiClient("PROD"))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and environment on mount
    const storedToken = localStorage.getItem("suitespace_token")
    const storedEnv = localStorage.getItem("suitespace_environment") as ServerEnvironment

    if (storedEnv) {
      setEnvironment(storedEnv)
      const client = new ApiClient(storedEnv)
      setApiClient(client)

      if (storedToken) {
        client.setToken(storedToken)
        // Verify token is still valid
        client
          .getUser()
          .then(setUser)
          .catch(() => {
            localStorage.removeItem("suitespace_token")
          })
          .finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      if (response.success && response.userToken) {
        apiClient.setToken(response.userToken)
        localStorage.setItem("suitespace_token", response.userToken)

        const userData = await apiClient.getUser()
        setUser(userData)
      } else {
        throw new Error(response.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.setToken("")
    localStorage.removeItem("suitespace_token")
  }

  const switchEnvironment = (env: ServerEnvironment) => {
    setUser(null)
    localStorage.removeItem("suitespace_token")

    setEnvironment(env)
    localStorage.setItem("suitespace_environment", env)

    const newClient = new ApiClient(env)
    setApiClient(newClient)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        apiClient,
        environment,
        isLoading,
        login,
        logout,
        switchEnvironment,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
