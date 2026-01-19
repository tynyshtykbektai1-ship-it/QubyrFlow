"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  FileText,
  Activity,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    expertOnly: false,
  },
  {
    label: "Predictive Analytics",
    href: "/dashboard/analytics",
    icon: TrendingUp,
    expertOnly: false,
  },
  {
    label: "Device Management",
    href: "/dashboard/devices",
    icon: Settings,
    expertOnly: true,
  },
  {
    label: "Executive Summary",
    href: "/dashboard/summary",
    icon: FileText,
    expertOnly: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isExpert } = useAuth();

  const filteredItems = navItems.filter(
    (item) => !item.expertOnly || isExpert
  );

  return (
    <aside className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Navigation
          </p>
        </div>
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
              {item.expertOnly && (
                <span className="ml-auto rounded bg-sidebar-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-primary">
                  ADMIN
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-4">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <Activity className="h-4 w-4 text-sidebar-primary" />
            <span className="text-xs font-medium">System Status</span>
          </div>
          <p className="mt-2 text-xs text-sidebar-foreground/60">
            All systems operational
          </p>
          <div className="mt-2 flex gap-1">
            <div className="h-1.5 flex-1 rounded-full bg-success" />
            <div className="h-1.5 flex-1 rounded-full bg-success" />
            <div className="h-1.5 flex-1 rounded-full bg-success" />
            <div className="h-1.5 flex-1 rounded-full bg-success" />
          </div>
        </div>
      </div>
    </aside>
  );
}
