"use client";

import { useEffect, useState, useCallback } from "react";
import { PipelineCard } from "@/components/dashboard/pipeline-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Thermometer, Gauge, AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface SensorData {
  pipeline_id: string;
  temperature: number;
  pressure: number;
  thickness_loss_mm: number;
  timestamp: string;
}

const PIPELINES = ["A", "B"];

export default function DashboardPage() {
  const [pipelineData, setPipelineData] = useState<Record<string, SensorData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAllPipelines = useCallback(async () => {
    try {
      const results = await Promise.all(
        PIPELINES.map(async (id) => {
          const res = await fetch(`/api/sensor/${id}`);
          const data = await res.json();
          return data;
        })
      );

      const dataMap: Record<string, SensorData> = {};
      results.forEach((data) => {
        dataMap[data.pipeline_id] = data;
      });

      setPipelineData(dataMap);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("[v0] Failed to fetch pipeline data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPipelines();

    // Auto refresh every 10 seconds
    const interval = setInterval(fetchAllPipelines, 10000);
    return () => clearInterval(interval);
  }, [fetchAllPipelines]);

  const avgTemp =
    Object.values(pipelineData).reduce((acc, d) => acc + d.temperature, 0) /
    (Object.keys(pipelineData).length || 1);

  const avgPressure =
    Object.values(pipelineData).reduce((acc, d) => acc + d.pressure, 0) /
    (Object.keys(pipelineData).length || 1);

  const alerts = Object.values(pipelineData).filter(
    (d) => d.temperature > 45 || d.pressure > 900 || d.thickness_loss_mm > 1.8
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time pipeline monitoring overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Pipelines
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{PIPELINES.length}</div>
              <p className="text-xs text-muted-foreground">All systems online</p>
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
                Avg Temperature
              </CardTitle>
              <Thermometer className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : avgTemp.toFixed(1)}°C
              </div>
              <p className="text-xs text-muted-foreground">Across all pipelines</p>
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
                Avg Pressure
              </CardTitle>
              <Gauge className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? "..." : Math.round(avgPressure)} hPa
              </div>
              <p className="text-xs text-muted-foreground">Within normal range</p>
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
                Active Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {isLoading ? "..." : alerts}
                </span>
                {alerts === 0 && (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    All Clear
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Pipeline Status</h2>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {PIPELINES.map((id) => (
              <Card key={id} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {Object.values(pipelineData).map((data, index) => (
              <PipelineCard key={data.pipeline_id} data={data} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
