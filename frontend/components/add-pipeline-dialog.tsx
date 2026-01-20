'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface NewPipelineFormData {
  pipe_size: string
  initial_thickness: string
  min_thickness: string
  material: string
  grade: string
  corrosion_impact: string
  material_loss: string
  time_years: string
  condition: string
}

export function AddPipelineDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<NewPipelineFormData>({
    pipe_size: '',
    initial_thickness: '',
    min_thickness: '',
    material: '',
    grade: '',
    corrosion_impact: '',
    material_loss: '',
    time_years: '',
    condition: '',
  })

  const handleInputChange = (field: keyof NewPipelineFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/pipelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pipe_size: parseFloat(formData.pipe_size),
          initial_thickness: parseFloat(formData.initial_thickness),
          min_thickness: parseFloat(formData.min_thickness),
          material: formData.material,
          grade: formData.grade,
          corrosion_impact: parseFloat(formData.corrosion_impact),
          material_loss: parseFloat(formData.material_loss),
          time_years: parseFloat(formData.time_years),
          condition: formData.condition,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create pipeline')
      }

      // Reset form and close dialog
      setFormData({
        pipe_size: '',
        initial_thickness: '',
        min_thickness: '',
        material: '',
        grade: '',
        corrosion_impact: '',
        material_loss: '',
        time_years: '',
        condition: '',
      })
      setOpen(false)

      // Refresh without full page reload
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Error creating pipeline:', error)
      alert('Failed to create pipeline. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-card-foreground">
              Add New Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Add Pipeline
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-card-foreground">
            Add New Pipeline
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter the details for the new pipeline. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pipe_size" className="text-sm font-medium text-card-foreground">
                  Pipe Size (mm)
                </Label>
                <Input
                  id="pipe_size"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 300"
                  value={formData.pipe_size}
                  onChange={(e) => handleInputChange('pipe_size', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="initial_thickness" className="text-sm font-medium text-card-foreground">
                  Initial Thickness (mm)
                </Label>
                <Input
                  id="initial_thickness"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 10.5"
                  value={formData.initial_thickness}
                  onChange={(e) => handleInputChange('initial_thickness', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="min_thickness" className="text-sm font-medium text-card-foreground">
                Minimum Thickness (mm)
              </Label>
              <Input
                id="min_thickness"
                type="number"
                step="0.01"
                placeholder="e.g., 5.0"
                value={formData.min_thickness}
                onChange={(e) => handleInputChange('min_thickness', e.target.value)}
                required
                className="bg-background border-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="material" className="text-sm font-medium text-card-foreground">
                  Material
                </Label>
                <Input
                  id="material"
                  placeholder="e.g., Carbon Steel"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grade" className="text-sm font-medium text-card-foreground">
                  Grade
                </Label>
                <Input
                  id="grade"
                  placeholder="e.g., API 5L X52"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="corrosion_impact" className="text-sm font-medium text-card-foreground">
                  Corrosion Impact
                </Label>
                <Input
                  id="corrosion_impact"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.5"
                  value={formData.corrosion_impact}
                  onChange={(e) => handleInputChange('corrosion_impact', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="material_loss" className="text-sm font-medium text-card-foreground">
                  Material Loss
                </Label>
                <Input
                  id="material_loss"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.2"
                  value={formData.material_loss}
                  onChange={(e) => handleInputChange('material_loss', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="time_years" className="text-sm font-medium text-card-foreground">
                  Service Time (years)
                </Label>
                <Input
                  id="time_years"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 15"
                  value={formData.time_years}
                  onChange={(e) => handleInputChange('time_years', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="condition" className="text-sm font-medium text-card-foreground">
                  Condition
                </Label>
                <Input
                  id="condition"
                  placeholder="e.g., Good"
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Creating...' : 'Create Pipeline'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
