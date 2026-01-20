'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import type { PipelineParameters } from '@/types/pipeline'

export default function PipelineParametersPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<PipelineParameters>({
    pipelineId: '',
    pipeSize: 0,
    thickness: 0,
    material: '',
    corrosionImpact: 0,
    condition: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check if user is expert
    if (user?.role !== 'expert') {
      toast({
        title: 'Access Denied',
        description: 'Only experts can access this page',
        variant: 'destructive',
      })
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/pipelines', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      console.log('[v0] Submitting pipeline parameters:', formData)

      toast({
        title: 'Success',
        description: 'Pipeline parameters saved successfully',
      })

      // Reset form
      setFormData({
        pipelineId: '',
        pipeSize: 0,
        thickness: 0,
        material: '',
        corrosionImpact: 0,
        condition: '',
      })
    } catch (error) {
      console.error('[v0] Error saving pipeline parameters:', error)
      toast({
        title: 'Error',
        description: 'Failed to save pipeline parameters',
        variant: 'destructive',
      })
    }
  }

  const handleInputChange = (field: keyof PipelineParameters, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Only show to experts
  if (user?.role !== 'expert') {
    return null
  }

  return (
    <DashboardLayout title="Pipeline Parameters">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add / Edit Pipeline Parameters</CardTitle>
            <CardDescription>
              Configure pipeline parameters for monitoring and prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pipelineId">Pipeline ID</Label>
                  <Input
                    id="pipelineId"
                    type="text"
                    placeholder="e.g., P001"
                    value={formData.pipelineId}
                    onChange={(e) => handleInputChange('pipelineId', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pipeSize">Pipe Size (inches)</Label>
                  <Input
                    id="pipeSize"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 24"
                    value={formData.pipeSize || ''}
                    onChange={(e) => handleInputChange('pipeSize', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thickness">Thickness (mm)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10.5"
                    value={formData.thickness || ''}
                    onChange={(e) => handleInputChange('thickness', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => handleInputChange('material', value)}
                  >
                    <SelectTrigger id="material">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
                      <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                      <SelectItem value="PVC">PVC</SelectItem>
                      <SelectItem value="Copper">Copper</SelectItem>
                      <SelectItem value="Cast Iron">Cast Iron</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corrosionImpact">Corrosion Impact Factor</Label>
                  <Input
                    id="corrosionImpact"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 0.15"
                    value={formData.corrosionImpact || ''}
                    onChange={(e) => handleInputChange('corrosionImpact', parseFloat(e.target.value))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Range: 0.0 (low) to 1.0 (high)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleInputChange('condition', value)}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Save Parameters
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Note</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Pipeline parameters are sent to the backend for processing and prediction calculations.
              Ensure all values are accurate for optimal monitoring results.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
