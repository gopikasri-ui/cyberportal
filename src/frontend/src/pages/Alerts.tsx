import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Plus,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useIncidentStore } from "../store/incidentStore";
import type { Alert, Severity } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(ts: bigint): string {
  const diffMs = Date.now() - Number(ts);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "badge-critical",
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const FILTER_BUTTONS: { label: string; value: Severity | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

// ─── Alert Card ───────────────────────────────────────────────────────────────

function AlertCard({
  alert,
  onAcknowledge,
  onFalsePositive,
  onCreateIncident,
}: {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onFalsePositive: (id: string) => void;
  onCreateIncident: (alert: Alert) => void;
}) {
  const isCriticalUnacked =
    alert.severity === "critical" && !alert.acknowledged;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className={[
        "glassmorphic-card rounded-lg p-4 relative overflow-hidden",
        "transition-smooth hover:border-cyber-blue/30",
        isCriticalUnacked
          ? "border-l-4 border-l-cyber-critical glow-critical"
          : "",
      ].join(" ")}
      data-ocid={`alert-card-${alert.id}`}
    >
      {/* Top row */}
      <div className="flex flex-wrap items-start gap-2 mb-2">
        {/* Alert ID */}
        <span className="font-mono text-xs text-cyber-secondary bg-[rgba(26,31,58,0.8)] px-2 py-0.5 rounded border border-cyber-border/40 shrink-0">
          {alert.id}
        </span>

        {/* Severity badge */}
        <span
          className={[
            "text-xs font-semibold px-2 py-0.5 rounded-full border",
            SEVERITY_COLORS[alert.severity],
            isCriticalUnacked ? "pulse-critical" : "",
          ].join(" ")}
        >
          {SEVERITY_LABELS[alert.severity]}
        </span>

        {/* Source tag */}
        <span className="text-xs px-2 py-0.5 rounded bg-[rgba(107,140,255,0.1)] border border-[rgba(107,140,255,0.2)] text-cyber-blue font-medium">
          {alert.source}
        </span>

        {/* Status indicators */}
        {alert.acknowledged && !alert.falsePositive && (
          <span className="text-xs px-2 py-0.5 rounded bg-[rgba(45,227,165,0.1)] border border-[rgba(45,227,165,0.25)] text-cyber-green font-medium ml-auto">
            ✓ Acknowledged
          </span>
        )}
        {alert.falsePositive && (
          <span className="text-xs px-2 py-0.5 rounded bg-[rgba(141,158,224,0.1)] border border-[rgba(141,158,224,0.2)] text-cyber-secondary font-medium ml-auto">
            False Positive
          </span>
        )}

        {/* Time */}
        <span className="text-xs text-cyber-secondary ml-auto shrink-0">
          {timeAgo(alert.timestamp)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-cyber-text mb-1 leading-snug text-sm">
        {alert.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-cyber-secondary leading-relaxed mb-3 line-clamp-2">
        {alert.description}
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Acknowledge */}
        <button
          type="button"
          data-ocid={`btn-acknowledge-${alert.id}`}
          onClick={() => !alert.acknowledged && onAcknowledge(alert.id)}
          disabled={alert.acknowledged}
          aria-label={
            alert.acknowledged ? "Already acknowledged" : "Acknowledge alert"
          }
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth",
            alert.acknowledged
              ? "bg-[rgba(45,227,165,0.08)] text-cyber-green border border-[rgba(45,227,165,0.25)] cursor-default opacity-70"
              : "bg-[rgba(45,227,165,0.12)] text-cyber-green border border-[rgba(45,227,165,0.3)] hover:bg-[rgba(45,227,165,0.2)] hover:border-[rgba(45,227,165,0.5)] active:scale-95",
          ].join(" ")}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {alert.acknowledged ? "Acknowledged" : "Acknowledge"}
        </button>

        {/* False Positive */}
        <button
          type="button"
          data-ocid={`btn-false-positive-${alert.id}`}
          onClick={() => !alert.falsePositive && onFalsePositive(alert.id)}
          disabled={alert.falsePositive}
          aria-label={
            alert.falsePositive
              ? "Marked as false positive"
              : "Mark as false positive"
          }
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth",
            alert.falsePositive
              ? "bg-[rgba(141,158,224,0.08)] text-cyber-secondary border border-[rgba(141,158,224,0.2)] cursor-default opacity-70"
              : "bg-[rgba(141,158,224,0.08)] text-cyber-secondary border border-[rgba(141,158,224,0.2)] hover:bg-[rgba(141,158,224,0.15)] hover:text-cyber-text active:scale-95",
          ].join(" ")}
        >
          <XCircle className="w-3.5 h-3.5" />
          {alert.falsePositive ? "False Positive" : "False Positive"}
        </button>

        {/* Create Incident */}
        <button
          type="button"
          data-ocid={`btn-create-incident-${alert.id}`}
          onClick={() => onCreateIncident(alert)}
          aria-label="Create incident from alert"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth bg-[rgba(107,140,255,0.12)] text-cyber-blue border border-[rgba(107,140,255,0.3)] hover:bg-[rgba(107,140,255,0.22)] hover:border-[rgba(107,140,255,0.55)] active:scale-95 ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Incident
        </button>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AlertSkeleton() {
  return (
    <div className="glassmorphic-card rounded-lg p-4 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-20 bg-[rgba(107,140,255,0.1)] rounded" />
        <div className="h-5 w-16 bg-[rgba(107,140,255,0.07)] rounded-full" />
        <div className="h-5 w-12 bg-[rgba(107,140,255,0.07)] rounded" />
      </div>
      <div className="h-4 w-3/4 bg-[rgba(107,140,255,0.07)] rounded mb-2" />
      <div className="h-3 w-full bg-[rgba(107,140,255,0.05)] rounded mb-1" />
      <div className="h-3 w-2/3 bg-[rgba(107,140,255,0.05)] rounded mb-3" />
      <div className="flex gap-2">
        <div className="h-7 w-28 bg-[rgba(107,140,255,0.07)] rounded" />
        <div className="h-7 w-28 bg-[rgba(107,140,255,0.07)] rounded" />
        <div className="h-7 w-28 bg-[rgba(107,140,255,0.07)] rounded ml-auto" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: Severity | "all" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glassmorphic-card rounded-lg p-10 flex flex-col items-center text-center"
      data-ocid="alerts-empty-state"
    >
      <div className="w-14 h-14 rounded-full bg-[rgba(107,140,255,0.08)] border border-[rgba(107,140,255,0.2)] flex items-center justify-center mb-4">
        <ShieldAlert className="w-7 h-7 text-cyber-secondary" />
      </div>
      <p className="text-cyber-text font-semibold mb-1">No alerts found</p>
      <p className="text-xs text-cyber-secondary">
        {filter === "all"
          ? "No security alerts are currently active."
          : `No ${filter} severity alerts match the current filter.`}
      </p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Alerts() {
  const { alerts, loading, acknowledgeAlert, markFalsePositive } =
    useIncidentStore();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<Severity | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate brief load state
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  const filtered =
    activeFilter === "all"
      ? alerts
      : alerts.filter((a) => a.severity === activeFilter);

  // Sort: critical unacked first, then by timestamp desc
  const sorted = [...filtered].sort((a, b) => {
    const aUrgent = a.severity === "critical" && !a.acknowledged ? 1 : 0;
    const bUrgent = b.severity === "critical" && !b.acknowledged ? 1 : 0;
    if (bUrgent !== aUrgent) return bUrgent - aUrgent;
    return Number(b.timestamp) - Number(a.timestamp);
  });

  const handleCreateIncident = (_alert: Alert) => {
    void navigate({ to: "/report" });
  };

  return (
    <div className="space-y-5" data-ocid="alerts-page">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[rgba(107,140,255,0.12)] border border-[rgba(107,140,255,0.25)] flex items-center justify-center">
            <Bell className="w-4.5 h-4.5 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-cyber-text leading-tight">
              Security Alerts
            </h1>
            <p className="text-xs text-cyber-secondary">
              Real-time threat monitoring &amp; triage
            </p>
          </div>
        </div>

        {/* Unacknowledged count badge */}
        {unacknowledgedCount > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full badge-critical pulse-critical"
            data-ocid="unacked-badge"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">
              {unacknowledgedCount} unacknowledged
            </span>
          </motion.div>
        )}
      </div>

      {/* Severity Filter Bar */}
      <fieldset
        className="flex flex-wrap gap-2 border-0 p-0 m-0"
        aria-label="Filter alerts by severity"
        data-ocid="severity-filter-bar"
      >
        <legend className="sr-only">Filter by severity</legend>
        {FILTER_BUTTONS.map(({ label, value }) => {
          const isActive = activeFilter === value;
          const colorMap: Record<string, string> = {
            all: "bg-[rgba(107,140,255,0.18)] text-cyber-blue border-[rgba(107,140,255,0.45)]",
            critical: "badge-critical",
            high: "badge-high",
            medium: "badge-medium",
            low: "badge-low",
          };
          return (
            <button
              type="button"
              key={value}
              onClick={() => setActiveFilter(value)}
              aria-pressed={isActive}
              data-ocid={`filter-${value}`}
              className={[
                "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-smooth",
                isActive
                  ? colorMap[value]
                  : "bg-[rgba(26,31,58,0.5)] text-cyber-secondary border-[rgba(42,47,107,0.5)] hover:border-[rgba(107,140,255,0.3)] hover:text-cyber-text",
              ].join(" ")}
            >
              {label}
              {value !== "all" && (
                <span className="ml-1.5 opacity-70">
                  ({alerts.filter((a) => a.severity === value).length})
                </span>
              )}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-cyber-secondary self-center">
          {sorted.length} alert{sorted.length !== 1 ? "s" : ""} shown
        </span>
      </fieldset>

      {/* Alerts List */}
      <div className="space-y-3">
        {isLoading || loading ? (
          <>
            <AlertSkeleton />
            <AlertSkeleton />
            <AlertSkeleton />
          </>
        ) : sorted.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <AnimatePresence mode="popLayout">
            {sorted.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={(id) => void acknowledgeAlert(id)}
                onFalsePositive={(id) => void markFalsePositive(id)}
                onCreateIncident={handleCreateIncident}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
