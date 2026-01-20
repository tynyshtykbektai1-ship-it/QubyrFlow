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
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import type { Device } from '@/types/pipeline'

export default function DevicesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [devices, setDevices] = useState<Device[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({
    id: '',
    name: '',
    pipelineId: '',
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
      return
    }

    // Fetch devices from backend
    const fetchDevices = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/devices')
        // const data = await response.json()

        // Mock data
        const mockDevices: Device[] = [
          {
            id: 'ESP32-001',
            name: 'Device 001',
            pipelineId: 'P001',
            status: 'online',
          },
          {
            id: 'ESP32-002',
            name: 'Device 002',
            pipelineId: 'P002',
            status: 'online',
          },
          {
            id: 'ESP32-003',
            name: 'Device 003',
            pipelineId: 'P003',
            status: 'offline',
          },
          {
            id: 'ESP32-004',
            name: 'Device 004',
            pipelineId: 'P004',
            status: 'online',
          },
          {
            id: 'ESP32-005',
            name: 'Device 005',
            pipelineId: undefined,
            status: 'offline',
          },
        ]

        setDevices(mockDevices)
      } catch (error) {
        console.error('[v0] Error fetching devices:', error)
      }
    }

    fetchDevices()
  }, [isAuthenticated, user, router, toast])

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/devices', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newDevice),
      // })

      console.log('[v0] Adding new device:', newDevice)

      const device: Device = {
        ...newDevice,
        status: 'offline',
      }

      setDevices([...devices, device])

      toast({
        title: 'Success',
        description: 'Device added successfully',
      })

      setIsDialogOpen(false)
      setNewDevice({ id: '', name: '', pipelineId: '' })
    } catch (error) {
      console.error('[v0] Error adding device:', error)
      toast({
        title: 'Error',
        description: 'Failed to add device',
        variant: 'destructive',
      })
    }
  }

  // Only show to experts
  if (user?.role !== 'expert') {
    return null
  }

  return (
    <DashboardLayout title="Device Management">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>ESP32 Devices</CardTitle>
              <CardDescription>
                Manage and monitor ESP32 devices connected to pipelines
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Device</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                  <DialogDescription>
                    Register a new ESP32 device and assign it to a pipeline
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDevice} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceId">Device ID</Label>
                    <Input
                      id="deviceId"
                      type="text"
                      placeholder="e.g., ESP32-006"
                      value={newDevice.id}
                      onChange={(e) =>
                        setNewDevice({ ...newDevice, id: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceName">Device Name</Label>
                    <Input
                      id="deviceName"
                      type="text"
                      placeholder="e.g., Device 006"
                      value={newDevice.name}
                      onChange={(e) =>
                        setNewDevice({ ...newDevice, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pipelineId">Pipeline ID (optional)</Label>
                    <Input
                      id="pipelineId"
                      type="text"
                      placeholder="e.g., P001"
                      value={newDevice.pipelineId}
                      onChange={(e) =>
                        setNewDevice({ ...newDevice, pipelineId: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Add Device
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Pipeline ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>
                      {device.pipelineId || (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          device.status === 'online'
                            ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                            : 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
                        }
                      >
                        {device.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {devices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No devices found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Device Status Legend</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                ONLINE
              </Badge>
              <span>Device is connected and sending data</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20">
                OFFLINE
              </Badge>
              <span>Device is not connected or not responding</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
