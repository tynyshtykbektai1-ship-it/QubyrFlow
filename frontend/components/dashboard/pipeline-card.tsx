"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Thermometer, Gauge, Ruler, ArrowRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface SensorData {
  pipeline_id: string;
  temperature: number;
  pressure: number;
  thickness_loss_mm: number;
  timestamp: string;
}

interface PipelineCardProps {
  data: SensorData;
  index: number;
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

export function PipelineCard({ data, index }: PipelineCardProps) {
  const status = getStatus(data);
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/dashboard/pipeline/${data.pipeline_id}`}>
        <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
          
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Pipeline {data.pipeline_id}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(data.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn("font-medium", config.className)}>
              {config.label}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="h-4 w-4" />
                  <span className="text-xs">Temperature</span>
                </div>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {data.temperature.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground">°C</span>
                </p>
              </div>

              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs">Pressure</span>
                </div>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {data.pressure}
                  <span className="text-sm font-normal text-muted-foreground"> hPa</span>
                </p>
              </div>

              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <span className="text-xs">Thickness Loss</span>
                </div>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {data.thickness_loss_mm.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground"> mm</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
