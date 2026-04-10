import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  RefreshCw,
  ShieldAlert,
  WifiOff,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIncidentStore } from "../store/incidentStore";
import type { Alert, Incident } from "../types";

// ─── Color constants ──────────────────────────────────────────────────────────
const COLORS = {
  malware: "#ff4757",
  phishing: "#ffb347",
  breach: "#6b8cff",
  ransomware: "#2de3a5",
  ddos: "#c678dd",
  insider: "#e06c75",
  other: "#8d9ee0",
  low: "#2de3a5",
  medium: "#ffb347",
  high: "#ff4757",
  critical: "#ff1744",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ts: bigint): string {
  const diff = Date.now() - Number(ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getDayLabel(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function buildTypeData(incidents: Incident[]) {
  const map: Record<string, number> = {
    malware: 0,
    phishing: 0,
    breach: 0,
    ransomware: 0,
  };
  for (const inc of incidents) {
    if (inc.type_ in map) map[inc.type_]++;
  }
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name as keyof typeof COLORS] ?? COLORS.other,
    }));
}

function buildTimelineData(incidents: Incident[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() - daysAgo);
    const dayEnd = new Date(dayStart.getTime() + 86400000);
    const count = incidents.filter((inc) => {
      const t = Number(inc.timestamp);
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    }).length;
    return { day: getDayLabel(daysAgo), count };
  });
}

function buildSeverityData(incidents: Incident[]) {
  const keys = ["low", "medium", "high", "critical"] as const;
  return keys.map((sev) => ({
    name: sev.charAt(0).toUpperCase() + sev.slice(1),
    count: incidents.filter((i) => i.severity === sev).length,
    color: COLORS[sev],
  }));
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accent?: string;
  loading?: boolean;
}

function MetricCard({
  icon,
  value,
  label,
  accent = "#6b8cff",
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="glassmorphic-card rounded-xl p-5 flex flex-col gap-3">
        <Skeleton
          className="w-9 h-9 rounded-lg"
          style={{ background: "rgba(107,140,255,0.12)" }}
        />
        <Skeleton
          className="h-8 w-16 rounded"
          style={{ background: "rgba(107,140,255,0.12)" }}
        />
        <Skeleton
          className="h-4 w-28 rounded"
          style={{ background: "rgba(107,140,255,0.08)" }}
        />
      </div>
    );
  }
  return (
    <div
      className="glassmorphic-card rounded-xl p-5 flex flex-col gap-2 transition-smooth hover:scale-[1.02] cursor-default"
      data-ocid="dashboard-metric-card"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}22` }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <p className="text-3xl font-bold font-display" style={{ color: accent }}>
        {value}
      </p>
      <p className="text-xs text-cyber-secondary font-body leading-snug">
        {label}
      </p>
    </div>
  );
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  value: number;
  name?: string;
  color?: string;
}

function CyberTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glassmorphic-card rounded-lg px-3 py-2 text-xs">
      {label && <p className="text-cyber-secondary mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.name ?? p.value} style={{ color: p.color ?? "#6b8cff" }}>
          {p.name ? `${p.name}: ` : ""}
          <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Critical Alert Row ───────────────────────────────────────────────────────

function AlertRow({ alert }: { alert: Alert }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-cyber-border/40 hover:bg-white/[0.02] transition-colors-fast"
        data-ocid="dashboard-alert-row"
      >
        <td className="px-4 py-3 text-xs font-mono text-cyber-blue">
          {alert.id}
        </td>
        <td className="px-4 py-3 text-xs text-cyber-secondary">
          {alert.source}
        </td>
        <td className="px-4 py-3">
          <span className="badge-critical pulse-critical inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            CRITICAL
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-cyber-secondary whitespace-nowrap">
          {formatTime(alert.timestamp)}
        </td>
        <td className="px-4 py-3">
          <span className="badge-high rounded-full px-2 py-0.5 text-xs font-medium">
            {alert.acknowledged ? "ACK" : "OPEN"}
          </span>
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setExpanded((v) => !v);
            }}
            aria-label="Toggle details"
            className="text-cyber-secondary hover:text-cyber-blue transition-colors-fast"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-cyber-border/20">
          <td colSpan={6} className="px-4 py-3">
            <div
              className="rounded-lg p-3 text-xs text-cyber-secondary leading-relaxed"
              style={{
                background: "rgba(255,71,87,0.05)",
                borderLeft: "2px solid #ff4757",
              }}
            >
              <p className="font-semibold text-cyber-blue mb-1">
                {alert.title}
              </p>
              <p>{alert.description}</p>
              {alert.incidentId && (
                <p className="mt-1 text-cyber-blue">
                  Linked incident:{" "}
                  <span className="font-mono">{alert.incidentId}</span>
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Offline Sync Card ────────────────────────────────────────────────────────

function OfflineSyncCard() {
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(7);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSynced(0);
    }, 1800);
  };

  return (
    <div
      className="glassmorphic-card rounded-xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      data-ocid="dashboard-sync-card"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,179,71,0.12)" }}
        >
          <WifiOff className="w-4 h-4" style={{ color: "#ffb347" }} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-foreground">
              Offline Queue
            </p>
            <Badge
              variant="outline"
              className="badge-high rounded-full px-2 py-0.5 text-xs font-bold border-0"
            >
              3 pending sync
            </Badge>
          </div>
          <p className="text-xs text-cyber-secondary">
            Last synced:{" "}
            <span className="text-cyber-blue">
              {lastSynced === 0 ? "just now" : `${lastSynced} minutes ago`}
            </span>
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={syncing}
        className="shrink-0 border-cyber-border text-cyber-blue hover:bg-cyber-blue/10 hover:text-cyber-blue"
        data-ocid="dashboard-sync-btn"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`}
        />
        {syncing ? "Syncing…" : "Sync Now"}
      </Button>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { incidents, alerts, stats, loading } = useIncidentStore();

  const criticalAlerts = useMemo(
    () =>
      alerts
        .filter((a) => a.severity === "critical" && !a.acknowledged)
        .slice(0, 3),
    [alerts],
  );

  const typeData = useMemo(() => buildTypeData(incidents), [incidents]);
  const timelineData = useMemo(() => buildTimelineData(incidents), [incidents]);
  const severityData = useMemo(() => buildSeverityData(incidents), [incidents]);

  const todayCount = Number(stats.incidentsToday);
  const weekCount = Number(stats.incidentsThisWeek);
  const avgResp = Number(stats.avgResponseMinutes);

  return (
    <div className="space-y-6 p-4 sm:p-6 cyber-grid min-h-screen">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyber-blue" />
            SOC Dashboard
          </h1>
          <p className="text-xs text-cyber-secondary mt-0.5">
            Real-time incident operations overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green pulse-dot" />
          <span className="text-xs text-cyber-secondary hidden sm:inline">
            Live
          </span>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="dashboard-metrics-grid"
      >
        <MetricCard
          loading={loading}
          icon={<ShieldAlert className="w-4 h-4" />}
          value={todayCount}
          label="Incidents Today"
          accent="#ff4757"
        />
        <MetricCard
          loading={loading}
          icon={<CalendarDays className="w-4 h-4" />}
          value={weekCount}
          label="Incidents This Week"
          accent="#6b8cff"
        />
        <MetricCard
          loading={loading}
          icon={<Clock className="w-4 h-4" />}
          value={`${avgResp}m`}
          label="Avg Response Time"
          accent="#2de3a5"
        />
        <MetricCard
          loading={loading}
          icon={<WifiOff className="w-4 h-4" />}
          value={3}
          label="Pending Reports (Offline)"
          accent="#ffb347"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie chart — incident types */}
        <div
          className="glassmorphic-card rounded-xl p-5"
          data-ocid="dashboard-chart-types"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-cyber-blue" />
            Incident Types
          </h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <Skeleton
                className="w-32 h-32 rounded-full"
                style={{ background: "rgba(107,140,255,0.12)" }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {typeData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CyberTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                {typeData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs text-cyber-secondary"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: d.color }}
                    />
                    {d.name}{" "}
                    <span className="font-semibold" style={{ color: d.color }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bar chart — 7-day timeline */}
        <div
          className="glassmorphic-card rounded-xl p-5"
          data-ocid="dashboard-chart-timeline"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-cyber-blue" />
            7-Day Timeline
          </h2>
          {loading ? (
            <Skeleton
              className="h-48 w-full rounded-lg"
              style={{ background: "rgba(107,140,255,0.08)" }}
            />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={timelineData}
                margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(107,140,255,0.08)"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#8d9ee0", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#8d9ee0", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CyberTooltip />}
                  cursor={{ fill: "rgba(107,140,255,0.06)" }}
                />
                <Bar
                  dataKey="count"
                  name="Incidents"
                  fill="#6b8cff"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart — Severity distribution */}
        <div
          className="glassmorphic-card rounded-xl p-5"
          data-ocid="dashboard-chart-severity"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span
              className="w-1.5 h-4 rounded-full"
              style={{ background: "#ff4757" }}
            />
            Severity Distribution
          </h2>
          {loading ? (
            <Skeleton
              className="h-48 w-full rounded-lg"
              style={{ background: "rgba(107,140,255,0.08)" }}
            />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={severityData}
                margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(107,140,255,0.08)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8d9ee0", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#8d9ee0", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CyberTooltip />}
                  cursor={{ fill: "rgba(107,140,255,0.06)" }}
                />
                <Bar dataKey="count" name="Count" radius={[3, 3, 0, 0]}>
                  {severityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Critical Alerts Table ── */}
      <div
        className="glassmorphic-card rounded-xl overflow-hidden"
        data-ocid="dashboard-alerts-table"
      >
        <div className="px-5 py-4 border-b border-cyber-border/30 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" style={{ color: "#ff4757" }} />
            Critical Alerts
            <span className="badge-critical pulse-critical rounded-full px-2 py-0.5 text-xs font-bold">
              {criticalAlerts.length}
            </span>
          </h2>
          <span className="text-xs text-cyber-secondary hidden sm:inline">
            Click row to expand details
          </span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                className="h-12 w-full rounded-lg"
                style={{ background: "rgba(107,140,255,0.08)" }}
              />
            ))}
          </div>
        ) : criticalAlerts.length === 0 ? (
          <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 className="w-8 h-8" style={{ color: "#2de3a5" }} />
            <p className="text-sm font-semibold text-cyber-secondary">
              No critical alerts
            </p>
            <p className="text-xs text-cyber-secondary opacity-60">
              All critical alerts have been acknowledged
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[540px]">
              <thead>
                <tr className="border-b border-cyber-border/20">
                  {["Alert ID", "Source", "Severity", "Time", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-xs font-semibold text-cyber-secondary uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {criticalAlerts.map((alert) => (
                  <AlertRow key={alert.id} alert={alert} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Offline Sync Card ── */}
      <OfflineSyncCard />
    </div>
  );
}
