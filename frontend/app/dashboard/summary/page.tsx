"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface SensorData {
  pipeline_id: string;
  temperature: number;
  pressure: number;
  thickness_loss_mm: number;
  timestamp: string;
}

export default function ExecutiveSummaryPage() {
  const [pipelineData, setPipelineData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/sensor/A"),
        fetch("/api/sensor/B"),
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      setPipelineData([dataA, dataB]);
    } catch (error) {
      console.error("[v0] Failed to fetch summary data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportReport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create a simple text report
    const report = `
PIPELINE MONITORING HUB
Executive Summary Report
Generated: ${new Date().toLocaleString()}
================================

SYSTEM OVERVIEW
---------------
Total Pipelines Monitored: ${pipelineData.length}
System Status: Operational
Report Period: Last 24 Hours

PIPELINE STATUS
---------------
${pipelineData
  .map(
    (p) => `
Pipeline ${p.pipeline_id}:
  - Temperature: ${p.temperature.toFixed(1)}°C
  - Pressure: ${p.pressure} hPa
  - Thickness Loss: ${p.thickness_loss_mm.toFixed(2)} mm
  - Status: ${
    p.temperature > 45 || p.pressure > 900 || p.thickness_loss_mm > 1.8
      ? "Warning"
      : "Normal"
  }
`
  )
  .join("")}

KEY METRICS
-----------
Average Temperature: ${(
      pipelineData.reduce((acc, p) => acc + p.temperature, 0) / pipelineData.length
    ).toFixed(1)}°C
Average Pressure: ${Math.round(
      pipelineData.reduce((acc, p) => acc + p.pressure, 0) / pipelineData.length
    )} hPa
System Uptime: 99.9%

RECOMMENDATIONS
---------------
1. Continue regular monitoring of all pipeline sensors
2. Schedule preventive maintenance within 45 days
3. Update firmware on devices with outdated versions

================================
End of Report
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipeline-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
  };

  const statusData = [
    { name: "Normal", value: pipelineData.filter((p) => p.temperature <= 45 && p.pressure <= 900).length },
    { name: "Warning", value: pipelineData.filter((p) => p.temperature > 45 || p.pressure > 900).length },
  ];

  const COLORS = ["oklch(0.55 0.15 160)", "oklch(0.75 0.15 85)"];

  const performanceData = pipelineData.map((p) => ({
    pipeline: `Pipeline ${p.pipeline_id}`,
    temperature: p.temperature,
    pressure: p.pressure / 10, // Scale for visibility
    thickness: p.thickness_loss_mm * 50, // Scale for visibility
  }));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Summary</h1>
          <p className="text-sm text-muted-foreground">
            High-level overview and reporting
          </p>
        </div>
        <Button onClick={handleExportReport} disabled={isExporting}>
          {isExporting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Word Report
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Status
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">Operational</span>
              </div>
              <p className="text-xs text-muted-foreground">All systems running</p>
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
                System Uptime
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">99.9%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
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
                Data Points
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12.4K</div>
              <p className="text-xs text-muted-foreground">Collected today</p>
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
                Next Maintenance
              </CardTitle>
              <Calendar className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Mar 5</div>
              <p className="text-xs text-muted-foreground">Scheduled service</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Pipeline Health Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.9 0.005 240)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Warning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Metrics by Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 240)" />
                    <XAxis dataKey="pipeline" stroke="oklch(0.45 0.01 240)" fontSize={12} />
                    <YAxis stroke="oklch(0.45 0.01 240)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.9 0.005 240)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="temperature" name="Temperature (°C)" fill="oklch(0.65 0.18 45)" />
                    <Bar dataKey="pressure" name="Pressure (/10)" fill="oklch(0.6 0.12 220)" />
                    <Bar dataKey="thickness" name="Thickness (×50)" fill="oklch(0.55 0.15 160)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Key Findings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5" />
              Key Findings & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-success/5 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-foreground">
                    System Performance Excellent
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All pipelines operating within normal parameters. No immediate
                    action required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-warning/5 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium text-foreground">
                    Preventive Maintenance Recommended
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Schedule routine inspection for Pipeline B sensor units within the
                    next 45 days to maintain optimal performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-accent/5 p-4">
                <TrendingUp className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Efficiency Improvement</p>
                  <p className="text-sm text-muted-foreground">
                    Temperature variance reduced by 15% compared to previous month,
                    indicating improved pipeline insulation effectiveness.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
