"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  MoreVertical,
  RefreshCw,
  Power,
  Wifi,
  WifiOff,
  Cpu,
  Activity,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

interface Device {
  id: string;
  name: string;
  pipeline: string;
  status: "online" | "offline" | "warning";
  lastUpdate: string;
  firmware: string;
  signalStrength: number;
}

const mockDevices: Device[] = [
  {
    id: "ESP32-01",
    name: "Sensor Unit A1",
    pipeline: "A",
    status: "online",
    lastUpdate: "2 min ago",
    firmware: "v2.1.3",
    signalStrength: 92,
  },
  {
    id: "ESP32-02",
    name: "Sensor Unit A2",
    pipeline: "A",
    status: "online",
    lastUpdate: "1 min ago",
    firmware: "v2.1.3",
    signalStrength: 88,
  },
  {
    id: "ESP32-03",
    name: "Sensor Unit B1",
    pipeline: "B",
    status: "online",
    lastUpdate: "30 sec ago",
    firmware: "v2.1.3",
    signalStrength: 95,
  },
  {
    id: "ESP32-04",
    name: "Sensor Unit B2",
    pipeline: "B",
    status: "warning",
    lastUpdate: "5 min ago",
    firmware: "v2.0.8",
    signalStrength: 65,
  },
  {
    id: "ESP32-05",
    name: "Pressure Monitor A",
    pipeline: "A",
    status: "online",
    lastUpdate: "1 min ago",
    firmware: "v2.1.3",
    signalStrength: 90,
  },
  {
    id: "ESP32-06",
    name: "Backup Sensor C1",
    pipeline: "C",
    status: "offline",
    lastUpdate: "2 hours ago",
    firmware: "v2.0.5",
    signalStrength: 0,
  },
];

const statusConfig = {
  online: {
    label: "Online",
    className: "bg-success/10 text-success border-success/20",
    icon: Wifi,
  },
  offline: {
    label: "Offline",
    className: "bg-muted text-muted-foreground border-border",
    icon: WifiOff,
  },
  warning: {
    label: "Warning",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
    icon: Activity,
  },
};

export default function DeviceManagementPage() {
  const { isExpert } = useAuth();
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [restartingDevice, setRestartingDevice] = useState<string | null>(null);

  useEffect(() => {
    if (!isExpert) {
      router.push("/dashboard");
    }
  }, [isExpert, router]);

  const handleRestart = async (deviceId: string) => {
    setRestartingDevice(deviceId);
    // Simulate restart
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRestartingDevice(null);
  };

  const onlineCount = devices.filter((d) => d.status === "online").length;
  const offlineCount = devices.filter((d) => d.status === "offline").length;
  const warningCount = devices.filter((d) => d.status === "warning").length;

  if (!isExpert) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Device Management</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and control IoT sensor devices
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Devices
              </CardTitle>
              <Cpu className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{devices.length}</div>
              <p className="text-xs text-muted-foreground">Registered sensors</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Online
              </CardTitle>
              <Wifi className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{onlineCount}</div>
              <p className="text-xs text-muted-foreground">Active connections</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Warnings
              </CardTitle>
              <Activity className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning-foreground">
                {warningCount}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Offline
              </CardTitle>
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {offlineCount}
              </div>
              <p className="text-xs text-muted-foreground">Disconnected</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Device Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Settings className="h-5 w-5" />
              Device Registry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Device</TableHead>
                  <TableHead className="text-muted-foreground">Pipeline</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Signal</TableHead>
                  <TableHead className="text-muted-foreground">Firmware</TableHead>
                  <TableHead className="text-muted-foreground">Last Update</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => {
                  const status = statusConfig[device.status];
                  const StatusIcon = status.icon;

                  return (
                    <TableRow key={device.id} className="border-border/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{device.id}</p>
                          <p className="text-xs text-muted-foreground">{device.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{device.pipeline}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                            <div
                              className={`h-full rounded-full ${
                                device.signalStrength > 80
                                  ? "bg-success"
                                  : device.signalStrength > 50
                                  ? "bg-warning"
                                  : "bg-critical"
                              }`}
                              style={{ width: `${device.signalStrength}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {device.signalStrength}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {device.firmware}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {device.lastUpdate}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRestart(device.id)}
                              disabled={restartingDevice === device.id}
                            >
                              <RefreshCw
                                className={`mr-2 h-4 w-4 ${
                                  restartingDevice === device.id ? "animate-spin" : ""
                                }`}
                              />
                              {restartingDevice === device.id
                                ? "Restarting..."
                                : "Restart"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Power className="mr-2 h-4 w-4" />
                              Power Cycle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
