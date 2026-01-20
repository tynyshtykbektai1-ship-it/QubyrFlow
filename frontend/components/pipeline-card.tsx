'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Pipeline } from '@/types/pipeline'

interface PipelineCardProps {
  pipeline: Pipeline
}

export function PipelineCard({ pipeline }: PipelineCardProps) {
  const router = useRouter()

  const getStatusColor = (status: Pipeline['status']) => {
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
    <Card className="bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer border" onClick={() => router.push(`/pipeline/${pipeline.id}`)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-medium text-card-foreground">
          Pipeline {pipeline.id}
        </CardTitle>
        <Badge className={getStatusColor(pipeline.status)}>
          {pipeline.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Device ID</p>
            <p className="text-sm font-medium text-card-foreground">{pipeline.deviceId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Temperature</p>
            <p className="text-sm font-medium text-card-foreground">{pipeline.temperature}°C</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pressure</p>
            <p className="text-sm font-medium text-card-foreground">{pipeline.pressure} PSI</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Thickness Loss</p>
            <p className="text-sm font-medium text-card-foreground">{pipeline.thicknessLoss} mm</p>
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground mb-1">Years to Failure</p>
          <p className="text-3xl font-semibold text-card-foreground">{pipeline.yearsToFailure}</p>
        </div>

        <Button 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/pipeline/${pipeline.id}`)
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
