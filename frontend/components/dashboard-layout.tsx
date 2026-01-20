'use client'

import React from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Settings, HardDrive, LogOut } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Dark green sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-semibold tracking-tight">IntegrityOS</h1>
          <div className="mt-3">
            <Badge 
              variant={user?.role === 'expert' ? 'default' : 'secondary'}
              className={user?.role === 'expert' ? 'bg-primary text-primary-foreground' : ''}
            >
              {user?.role?.toUpperCase()}
            </Badge>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => router.push('/dashboard')}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Button>
          
          {user?.role === 'expert' && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => router.push('/pipeline/parameters')}
              >
                <Settings className="h-5 w-5" />
                Pipeline Parameters
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => router.push('/devices')}
              >
                <HardDrive className="h-5 w-5" />
                Devices
              </Button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 bg-background">
        <main className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
