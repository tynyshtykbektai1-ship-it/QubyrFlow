'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'guest' | 'expert'

interface User {
  username: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Predefined credentials
const CREDENTIALS = {
  guest: { username: 'guest', password: 'guest123', role: 'guest' as UserRole },
  expert: { username: 'expert', password: 'expert123', role: 'expert' as UserRole },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('integrityos_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    // Check credentials
    const credential = Object.values(CREDENTIALS).find(
      (cred) => cred.username === username && cred.password === password
    )

    if (credential) {
      const user = { username: credential.username, role: credential.role }
      setUser(user)
      localStorage.setItem('integrityos_user', JSON.stringify(user))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('integrityos_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
