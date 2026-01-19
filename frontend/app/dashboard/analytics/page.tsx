"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
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
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface HistoryPoint {
  timestamp: string;
  temperature: number;
  pressure: number;
  thickness_loss_mm: number;
}

interface PipelineHistory {
  pipeline_id: string;
  data: HistoryPoint[];
}

export default function AnalyticsPage() {
  const [pipelineAHistory, setPipelineAHistory] = useState<HistoryPoint[]>([]);
  const [pipelineBHistory, setPipelineBHistory] = useState<HistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/sensor/A/history?hours=24"),
        fetch("/api/sensor/B/history?hours=24"),
      ]);

      const dataA: PipelineHistory = await resA.json();
      const dataB: PipelineHistory = await resB.json();

      setPipelineAHistory(dataA.data || []);
      setPipelineBHistory(dataB.data || []);
    } catch (error) {
      console.error("[v0] Failed to fetch analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate predictions (simple linear extrapolation)
  const calculatePredictions = (data: HistoryPoint[]) => {
    if (data.length < 2) return { tempTrend: 0, pressureTrend: 0, thicknessTrend: 0 };

    const recent = data.slice(-10);
    const first = recent[0];
    const last = recent[recent.length - 1];

    return {
      tempTrend: ((last.temperature - first.temperature) / first.temperature) * 100,
      pressureTrend: ((last.pressure - first.pressure) / first.pressure) * 100,
      thicknessTrend:
        ((last.thickness_loss_mm - first.thickness_loss_mm) / first.thickness_loss_mm) *
        100,
    };
  };

  const predictionsA = calculatePredictions(pipelineAHistory);
  const predictionsB = calculatePredictions(pipelineBHistory);

  // Combine data for comparison chart
  const comparisonData = pipelineAHistory.slice(-24).map((point, index) => ({
    time: formatTime(point.timestamp),
    "Pipeline A Temp": point.temperature,
    "Pipeline B Temp": pipelineBHistory[index]?.temperature || 0,
  }));

  const riskAssessment = [
    {
      pipeline: "A",
      corrosionRisk: predictionsA.thicknessTrend > 0 ? "Medium" : "Low",
      tempRisk: predictionsA.tempTrend > 5 ? "High" : predictionsA.tempTrend > 0 ? "Medium" : "Low",
      pressureRisk: predictionsA.pressureTrend > 5 ? "High" : "Low",
    },
    {
      pipeline: "B",
      corrosionRisk: predictionsB.thicknessTrend > 0 ? "Medium" : "Low",
      tempRisk: predictionsB.tempTrend > 5 ? "High" : predictionsB.tempTrend > 0 ? "Medium" : "Low",
      pressureRisk: predictionsB.pressureTrend > 5 ? "High" : "Low",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Predictive Analytics</h1>
        <p className="text-sm text-muted-foreground">
          ML-powered insights and trend analysis
        </p>
      </div>

      {/* Trend Indicators */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Temperature Trend
              </CardTitle>
              {predictionsA.tempTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-chart-3" />
              ) : (
                <TrendingDown className="h-4 w-4 text-primary" />
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {predictionsA.tempTrend > 0 ? "+" : ""}
                  {predictionsA.tempTrend.toFixed(1)}%
                </span>
                <Badge
                  variant="secondary"
                  className={
                    predictionsA.tempTrend > 5
                      ? "bg-warning/10 text-warning-foreground"
                      : "bg-success/10 text-success"
                  }
                >
                  {predictionsA.tempTrend > 5 ? "Rising" : "Stable"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Pipeline A (24h)</p>
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
                Pressure Stability
              </CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {Math.abs(predictionsA.pressureTrend).toFixed(1)}%
                </span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Normal
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Variance from baseline</p>
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
                Corrosion Rate
              </CardTitle>
              <Zap className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">0.02</span>
                <span className="text-sm text-muted-foreground">mm/month</span>
              </div>
              <p className="text-xs text-muted-foreground">Predicted erosion</p>
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
                Maintenance Window
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">45</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground">Until next service</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Temperature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 240)" />
                  <XAxis dataKey="time" stroke="oklch(0.45 0.01 240)" fontSize={12} />
                  <YAxis stroke="oklch(0.45 0.01 240)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.9 0.005 240)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Pipeline A Temp"
                    stroke="oklch(0.55 0.15 160)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Pipeline B Temp"
                    stroke="oklch(0.6 0.12 220)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Pipeline
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Corrosion Risk
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Temperature Risk
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Pressure Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {riskAssessment.map((item) => (
                    <tr key={item.pipeline} className="border-b border-border/50">
                      <td className="py-3 font-medium text-foreground">
                        Pipeline {item.pipeline}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={
                            item.corrosionRisk === "High"
                              ? "bg-critical/10 text-critical border-critical/20"
                              : item.corrosionRisk === "Medium"
                              ? "bg-warning/10 text-warning-foreground border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                          }
                        >
                          {item.corrosionRisk}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={
                            item.tempRisk === "High"
                              ? "bg-critical/10 text-critical border-critical/20"
                              : item.tempRisk === "Medium"
                              ? "bg-warning/10 text-warning-foreground border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                          }
                        >
                          {item.tempRisk}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={
                            item.pressureRisk === "High"
                              ? "bg-critical/10 text-critical border-critical/20"
                              : "bg-success/10 text-success border-success/20"
                          }
                        >
                          {item.pressureRisk}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
