export interface Pipeline {
  id: string
  deviceId: string
  temperature: number
  pressure: number
  thicknessLoss: number
  yearsToFailure: number
  status: 'normal' | 'warning' | 'critical'
}

export interface PipelineDetails extends Pipeline {
  pipeSize: number
  thickness: number
  material: string
  corrosionImpact: number
  condition: string
}

export interface Device {
  id: string
  name: string
  pipelineId?: string
  status: 'online' | 'offline'
}

export interface PipelineParameters {
  pipelineId: string
  pipeSize: number
  thickness: number
  material: string
  corrosionImpact: number
  condition: string
}

export interface NewPipeline {
  pipe_size: number
  initial_thickness: number
  min_thickness: number
  material: string
  grade: string
  corrosion_impact: number
  material_loss: number
  time_years: number
  condition: string
}
