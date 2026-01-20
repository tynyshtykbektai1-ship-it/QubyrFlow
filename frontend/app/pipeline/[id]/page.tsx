'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { PipelineDetails } from '@/types/pipeline'

export default function PipelineDetailsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const pipelineId = params.id as string

  const [pipeline, setPipeline] = useState<PipelineDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<{
    temperature: any[]
    pressure: any[]
    thickness: any[]
  }>({
    temperature: [],
    pressure: [],
    thickness: [],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Fetch pipeline details from backend
    const fetchPipelineDetails = async () => {
      try {
        const response = await fetch(`/api/pipeline/${pipelineId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch pipeline')
        }

        const data = await response.json()
        setPipeline(data)
      } catch (error) {
        console.error('Error fetching pipeline details:', error)
      }
    }

    // Fetch chart data from backend
    const fetchChartData = async () => {
      try {
        const response = await fetch(`/api/pipeline/${pipelineId}/charts`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch chart data')
        }

        const data = await response.json()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPipelineDetails()
    fetchChartData()
  }, [isAuthenticated, router, pipelineId])

  if (loading) {
    return (
      <DashboardLayout title="Pipeline Details">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading pipeline details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!pipeline) {
    return (
      <DashboardLayout title="Pipeline Details">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Pipeline not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusColor = (status: PipelineDetails['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-success/10 text-success border-success/20'
      case 'warning':
        return 'bg-warning/10 text-warning-foreground border-warning/30'
      case 'critical':
        return 'bg-destructive/10 text-destructive-foreground border-destructive/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <DashboardLayout title={`Pipeline ${pipeline.id}`}>
      <div className="space-y-6">
        {/* Overview */}
        <Card className="bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Overview</CardTitle>
            <Badge className={getStatusColor(pipeline.status)}>
              {pipeline.status.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Device ID</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.deviceId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pipeline ID</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Material</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.material}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Condition</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.condition}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI - Years to Failure */}
        <Card className="bg-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Years to Failure (Prediction)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-card-foreground">
              {pipeline.yearsToFailure}
            </div>
            <p className="text-sm text-muted-foreground mt-1">years</p>
          </CardContent>
        </Card>

        {/* Current Metrics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Current Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-card-foreground">{pipeline.temperature}</p>
              <p className="text-sm text-muted-foreground mt-1">°C</p>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Current Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-card-foreground">{pipeline.pressure}</p>
              <p className="text-sm text-muted-foreground mt-1">PSI</p>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Thickness Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-card-foreground">{pipeline.thicknessLoss}</p>
              <p className="text-sm text-muted-foreground mt-1">mm</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Temperature Chart */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Temperature (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.temperature}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="Temperature (°C)"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pressure Chart */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Pressure (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.pressure}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pressure"
                    name="Pressure (PSI)"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Thickness Loss Chart */}
        <Card className="bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Thickness Loss Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.thickness}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="loss"
                  name="Thickness Loss (mm)"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Additional Parameters (visible to all, but Expert can edit) */}
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Pipeline Parameters</CardTitle>
              {user?.role === 'expert' && (
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => router.push('/pipeline/parameters')}
                >
                  Edit Parameters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pipe Size</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.pipeSize} inches</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Thickness</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.thickness} mm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Corrosion Impact</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.corrosionImpact}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Material</p>
                <p className="text-lg font-medium text-card-foreground">{pipeline.material}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-transparent" variant="outline" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </DashboardLayout>
  )
}
