'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { PipelineCard } from '@/components/pipeline-card'
import { AddPipelineDialog } from '@/components/add-pipeline-dialog'
import type { Pipeline } from '@/types/pipeline'

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Fetch pipelines from backend
    const fetchPipelines = async () => {
      try {
        const response = await fetch('/api/dashboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch pipelines')
        }
        
        const data = await response.json()
        setPipelines(data.pipelines || [])
      } catch (error) {
        console.error('[v0] Error fetching pipelines:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPipelines()
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading pipelines...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Add New Pipeline Card - Expert Only */}
        {user?.role === 'expert' && <AddPipelineDialog />}
        
        {/* Pipeline Cards */}
        {pipelines.map((pipeline) => (
          <PipelineCard key={pipeline.id} pipeline={pipeline} />
        ))}
      </div>

      {pipelines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No pipelines found</p>
        </div>
      )}
    </DashboardLayout>
  )
}
