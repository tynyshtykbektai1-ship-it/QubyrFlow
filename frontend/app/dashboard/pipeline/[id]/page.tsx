"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Thermometer,
  Gauge,
  Ruler,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import use from "next/use"; // Importing use from next/use

interface SensorData {
  pipeline_id: string;
  temperature: number;
  pressure: number;
  thickness_loss_mm: number;
  timestamp: string;
}

interface HistoryPoint {
  timestamp: string;
  temperature: number;
  pressure: number;
  thickness_loss_mm: number;
}

function getStatus(data: SensorData): "normal" | "warning" | "critical" {
  if (data.temperature > 50 || data.pressure > 950 || data.thickness_loss_mm > 2) {
    return "critical";
  }
  if (data.temperature > 45 || data.pressure > 900 || data.thickness_loss_mm > 1.8) {
    return "warning";
  }
  return "normal";
}

const statusConfig = {
  normal: {
    label: "Normal",
    className: "bg-success/10 text-success border-success/20",
  },
  warning: {
    label: "Warning",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  critical: {
    label: "Critical",
    className: "bg-critical/10 text-critical border-critical/20",
  },
};

export default function PipelineDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        fetch(`/api/sensor/${id}`),
        fetch(`/api/sensor/${id}/history?hours=12`),
      ]);

      const current = await currentRes.json();
      const history = await historyRes.json();

      setCurrentData(current);
      setHistoryData(history.data || []);
    } catch (error) {
      console.error("Failed to fetch pipeline data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Pipeline not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const status = getStatus(currentData);
  const config = statusConfig[status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Pipeline {currentData.pipeline_id}
            </h1>
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {new Date(currentData.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Current Values */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Temperature
              </CardTitle>
              <Thermometer className="h-5 w-5 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {currentData.temperature.toFixed(1)}
                <span className="text-lg font-normal text-muted-foreground">°C</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Safe range: 30-45°C
              </p>
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
                Pressure
              </CardTitle>
              <Gauge className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {currentData.pressure}
                <span className="text-lg font-normal text-muted-foreground"> hPa</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Safe range: 850-900 hPa
              </p>
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
                Thickness Loss
              </CardTitle>
              <Ruler className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {currentData.thickness_loss_mm.toFixed(2)}
                <span className="text-lg font-normal text-muted-foreground"> mm</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Alert threshold: 1.8 mm
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Thermometer className="h-5 w-5 text-chart-3" />
                Temperature History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.18 45)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.65 0.18 45)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 240)" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTime}
                      stroke="oklch(0.45 0.01 240)"
                      fontSize={12}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      stroke="oklch(0.45 0.01 240)"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.9 0.005 240)",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                    />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stroke="oklch(0.65 0.18 45)"
                      fill="url(#tempGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Gauge className="h-5 w-5 text-accent" />
                Pressure History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.6 0.12 220)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.6 0.12 220)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 240)" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTime}
                      stroke="oklch(0.45 0.01 240)"
                      fontSize={12}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      stroke="oklch(0.45 0.01 240)"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.9 0.005 240)",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                    />
                    <Area
                      type="monotone"
                      dataKey="pressure"
                      stroke="oklch(0.6 0.12 220)"
                      fill="url(#pressureGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Ruler className="h-5 w-5 text-primary" />
                Thickness Loss Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 240)" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTime}
                      stroke="oklch(0.45 0.01 240)"
                      fontSize={12}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      stroke="oklch(0.45 0.01 240)"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.9 0.005 240)",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="thickness_loss_mm"
                      stroke="oklch(0.55 0.15 160)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
