import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Bell,
  BellOff,
  RefreshCw,
  Shield,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useIncidentStore } from "../store/incidentStore";
import type { IOCType, Severity } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeTime(ts: bigint): string {
  const diffMs = Date.now() - Number(ts);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const cls =
    severity === "critical"
      ? "badge-critical"
      : severity === "high"
        ? "badge-high"
        : severity === "medium"
          ? "badge-medium"
          : "badge-low";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      {severity}
    </span>
  );
}

const IOC_TYPE_LABELS: Record<IOCType, string> = {
  ip: "IP",
  domain: "Domain",
  hash: "Hash",
  url: "URL",
  email: "Email",
  filename: "File",
};

function IOCTypeBadge({ type }: { type: IOCType }) {
  const colors: Record<IOCType, string> = {
    ip: "bg-primary/20 text-primary border-primary/30",
    domain: "bg-secondary/20 text-secondary border-secondary/30",
    hash: "bg-muted text-muted-foreground border-border",
    url: "bg-[rgba(255,179,71,0.15)] text-cyber-warning border-[rgba(255,179,71,0.3)]",
    email:
      "bg-[rgba(255,71,87,0.12)] text-cyber-critical border-[rgba(255,71,87,0.3)]",
    filename: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${colors[type]}`}
    >
      {IOC_TYPE_LABELS[type]}
    </span>
  );
}

// ─── Heatmap data ─────────────────────────────────────────────────────────────

const HEATMAP_DATA = [
  [1, 2, 1, 3, 4, 2, 1],
  [2, 1, 3, 4, 3, 1, 2],
  [1, 3, 4, 4, 2, 3, 1],
  [2, 2, 1, 3, 4, 3, 2],
  [1, 1, 2, 2, 3, 4, 2],
];

const INTENSITY_CLASSES = [
  "bg-transparent border border-border/40",
  "bg-secondary/20 border border-secondary/30",
  "bg-[rgba(255,179,71,0.25)] border border-[rgba(255,179,71,0.4)]",
  "bg-[rgba(255,120,50,0.3)] border border-[rgba(255,120,50,0.45)]",
  "bg-[rgba(255,71,87,0.35)] border border-[rgba(255,71,87,0.5)]",
];

const INTENSITY_LABELS = ["None", "Low", "Medium", "High", "Critical"];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Section heading component ────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg glassmorphic flex items-center justify-center">
        <Icon className="w-4 h-4 text-cyber-blue" />
      </div>
      <h2 className="text-lg font-display font-semibold text-foreground">
        {title}
      </h2>
      {count !== undefined && (
        <span className="ml-auto text-xs text-cyber-secondary">
          {count} entries
        </span>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ThreatIntel() {
  const { feeds, iocs, loading, loadFeeds, loadIOCs } = useIncidentStore();
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    loadFeeds();
    loadIOCs();
  }, [loadFeeds, loadIOCs]);

  function handleSubscribeToggle() {
    const next = !subscribed;
    setSubscribed(next);
    if (next) {
      toast.success("Subscribed to threat alerts", {
        description: "You'll be notified when new threats are detected.",
        icon: <Bell className="w-4 h-4 text-cyber-green" />,
      });
    } else {
      toast.info("Unsubscribed from threat alerts", {
        description: "You won't receive threat notifications.",
        icon: <BellOff className="w-4 h-4 text-cyber-secondary" />,
      });
    }
  }

  return (
    <div className="min-h-full cyber-grid" data-ocid="threat-intel-page">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glassmorphic-card flex items-center justify-center glow-primary">
            <Shield className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
              Threat Intelligence
            </h1>
            <p className="text-xs text-cyber-secondary mt-0.5">
              Live feeds from CERT-In, NCIIPC &amp; CISA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border text-cyber-secondary hover:text-foreground hover:border-primary/50 transition-smooth"
            onClick={() => {
              loadFeeds();
              loadIOCs();
              toast.info("Refreshing threat data...");
            }}
            data-ocid="threat-refresh-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            className={`gap-2 transition-smooth font-semibold ${
              subscribed
                ? "bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary/30"
                : "bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
            }`}
            variant="outline"
            onClick={handleSubscribeToggle}
            data-ocid="subscribe-alerts-btn"
          >
            {subscribed ? (
              <>
                <Bell className="w-3.5 h-3.5 fill-current" />
                Subscribed
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                Subscribe to Alerts
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Threat Feeds ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
        data-ocid="threat-feeds-section"
      >
        <SectionHeader
          icon={Activity}
          title="Threat Feeds"
          count={feeds.length}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["sk-0", "sk-1", "sk-2", "sk-3"].map((k) => (
              <Skeleton key={k} className="h-40 rounded-xl bg-muted/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeds.map((feed, idx) => (
              <motion.div
                key={feed.feedId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.35 }}
                className="glassmorphic-card rounded-xl p-4 hover:border-primary/30 transition-smooth group"
                data-ocid={`feed-card-${feed.feedId}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/25">
                      {feed.source}
                    </span>
                    <SeverityBadge severity={feed.severity} />
                  </div>
                  <span className="text-xs text-cyber-secondary shrink-0">
                    {formatRelativeTime(feed.publishedAt)}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 group-hover:text-cyber-blue transition-colors-fast line-clamp-2">
                  {feed.title}
                </h3>

                <p className="text-xs text-cyber-secondary leading-relaxed line-clamp-2">
                  {feed.description.length > 100
                    ? `${feed.description.slice(0, 100)}…`
                    : feed.description}
                </p>

                {/* severity accent bar */}
                <div
                  className={`mt-3 h-0.5 rounded-full opacity-60 ${
                    feed.severity === "critical"
                      ? "bg-cyber-critical"
                      : feed.severity === "high"
                        ? "bg-cyber-warning"
                        : feed.severity === "medium"
                          ? "bg-cyber-blue"
                          : "bg-cyber-green"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── IOC Indicators ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-8"
        data-ocid="ioc-section"
      >
        <SectionHeader
          icon={Terminal}
          title="Indicators of Compromise"
          count={iocs.length}
        />

        <div className="glassmorphic-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary">
                    IOC Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary">
                    Severity
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"].map((k) => (
                      <tr key={k} className="border-b border-border/30">
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-16 bg-muted/30" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-48 bg-muted/30" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-16 bg-muted/30" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-12 bg-muted/30 ml-auto" />
                        </td>
                      </tr>
                    ))
                  : iocs.map((ioc, idx) => (
                      <motion.tr
                        key={ioc.iocId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border/30 hover:bg-primary/5 transition-colors-fast"
                        data-ocid={`ioc-row-${ioc.iocId}`}
                      >
                        <td className="py-3 px-4">
                          <IOCTypeBadge type={ioc.iocType} />
                        </td>
                        <td className="py-3 px-4">
                          <code className="font-mono text-xs text-cyber-green bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 break-all">
                            {ioc.value}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <SeverityBadge severity={ioc.severity} />
                        </td>
                        <td className="py-3 px-4 text-right text-xs text-cyber-secondary">
                          {formatRelativeTime(ioc.addedAt)}
                        </td>
                      </motion.tr>
                    ))}
              </tbody>
            </table>
          </div>

          {!loading && iocs.length === 0 && (
            <div className="py-10 text-center text-cyber-secondary text-sm">
              No IOCs found. Feed is clean.
            </div>
          )}
        </div>
      </motion.section>

      {/* ── Severity Heatmap ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-8"
        data-ocid="heatmap-section"
      >
        <SectionHeader icon={Activity} title="Threat Activity Heatmap" />

        <div className="glassmorphic-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-cyber-secondary">
              Last 5 weeks — daily threat activity intensity
            </p>
            {/* Legend */}
            <div className="flex items-center gap-2">
              {INTENSITY_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-sm ${INTENSITY_CLASSES[i]}`}
                  />
                  <span className="text-[10px] text-cyber-secondary hidden sm:inline">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Day labels */}
          <div className="flex gap-1 mb-1 ml-12">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="flex-1 text-center text-[10px] text-cyber-secondary"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="space-y-1">
            {HEATMAP_DATA.map((week, wIdx) => {
              const weekLabel = `W${HEATMAP_DATA.length - wIdx}`;
              return (
                <div key={weekLabel} className="flex items-center gap-1">
                  <span className="w-10 shrink-0 text-right text-[10px] text-cyber-secondary pr-2">
                    {weekLabel}
                  </span>
                  {week.map((intensity, dIdx) => (
                    <div
                      key={DAY_LABELS[dIdx]}
                      title={`${DAY_LABELS[dIdx]}, ${weekLabel}: ${INTENSITY_LABELS[intensity]}`}
                      className={`flex-1 aspect-square rounded-sm transition-smooth hover:scale-110 cursor-default ${INTENSITY_CLASSES[intensity]}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Month label */}
          <p className="mt-4 text-center text-xs text-cyber-secondary tracking-widest uppercase">
            April 2026
          </p>

          {/* Stat row */}
          <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-3 gap-4 text-center">
            {[
              {
                label: "Peak Day",
                value: "Thu, W3",
                color: "text-cyber-critical",
              },
              {
                label: "Avg Intensity",
                value: "High",
                color: "text-cyber-warning",
              },
              {
                label: "Trend",
                value: "↑ Escalating",
                color: "text-cyber-critical",
              },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-xs text-cyber-secondary mb-1">{label}</p>
                <p className={`text-sm font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Bottom padding ── */}
      <div className="h-8" />
    </div>
  );
}
