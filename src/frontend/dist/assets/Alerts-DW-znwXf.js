import { c as createLucideIcon, u as useIncidentStore, d as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Bell } from "./index-ljKLTZYa.js";
import { m as motion } from "./proxy-D0aaadKu.js";
import { T as TriangleAlert } from "./triangle-alert-DYIlsCz5.js";
import { A as AnimatePresence } from "./index-DX1TyZvF.js";
import { S as ShieldAlert } from "./shield-alert-CeeqRRu6.js";
import { P as Plus } from "./plus-DR0C_EUV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
function timeAgo(ts) {
  const diffMs = Date.now() - Number(ts);
  const mins = Math.floor(diffMs / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
const SEVERITY_COLORS = {
  critical: "badge-critical",
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low"
};
const SEVERITY_LABELS = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low"
};
const FILTER_BUTTONS = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" }
];
function AlertCard({
  alert,
  onAcknowledge,
  onFalsePositive,
  onCreateIncident
}) {
  const isCriticalUnacked = alert.severity === "critical" && !alert.acknowledged;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8, scale: 0.97 },
      transition: { duration: 0.22 },
      className: [
        "glassmorphic-card rounded-lg p-4 relative overflow-hidden",
        "transition-smooth hover:border-cyber-blue/30",
        isCriticalUnacked ? "border-l-4 border-l-cyber-critical glow-critical" : ""
      ].join(" "),
      "data-ocid": `alert-card-${alert.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-cyber-secondary bg-[rgba(26,31,58,0.8)] px-2 py-0.5 rounded border border-cyber-border/40 shrink-0", children: alert.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: [
                "text-xs font-semibold px-2 py-0.5 rounded-full border",
                SEVERITY_COLORS[alert.severity],
                isCriticalUnacked ? "pulse-critical" : ""
              ].join(" "),
              children: SEVERITY_LABELS[alert.severity]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-[rgba(107,140,255,0.1)] border border-[rgba(107,140,255,0.2)] text-cyber-blue font-medium", children: alert.source }),
          alert.acknowledged && !alert.falsePositive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-[rgba(45,227,165,0.1)] border border-[rgba(45,227,165,0.25)] text-cyber-green font-medium ml-auto", children: "✓ Acknowledged" }),
          alert.falsePositive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-[rgba(141,158,224,0.1)] border border-[rgba(141,158,224,0.2)] text-cyber-secondary font-medium ml-auto", children: "False Positive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyber-secondary ml-auto shrink-0", children: timeAgo(alert.timestamp) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-cyber-text mb-1 leading-snug text-sm", children: alert.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary leading-relaxed mb-3 line-clamp-2", children: alert.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `btn-acknowledge-${alert.id}`,
              onClick: () => !alert.acknowledged && onAcknowledge(alert.id),
              disabled: alert.acknowledged,
              "aria-label": alert.acknowledged ? "Already acknowledged" : "Acknowledge alert",
              className: [
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth",
                alert.acknowledged ? "bg-[rgba(45,227,165,0.08)] text-cyber-green border border-[rgba(45,227,165,0.25)] cursor-default opacity-70" : "bg-[rgba(45,227,165,0.12)] text-cyber-green border border-[rgba(45,227,165,0.3)] hover:bg-[rgba(45,227,165,0.2)] hover:border-[rgba(45,227,165,0.5)] active:scale-95"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
                alert.acknowledged ? "Acknowledged" : "Acknowledge"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `btn-false-positive-${alert.id}`,
              onClick: () => !alert.falsePositive && onFalsePositive(alert.id),
              disabled: alert.falsePositive,
              "aria-label": alert.falsePositive ? "Marked as false positive" : "Mark as false positive",
              className: [
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth",
                alert.falsePositive ? "bg-[rgba(141,158,224,0.08)] text-cyber-secondary border border-[rgba(141,158,224,0.2)] cursor-default opacity-70" : "bg-[rgba(141,158,224,0.08)] text-cyber-secondary border border-[rgba(141,158,224,0.2)] hover:bg-[rgba(141,158,224,0.15)] hover:text-cyber-text active:scale-95"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                alert.falsePositive ? "False Positive" : "False Positive"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `btn-create-incident-${alert.id}`,
              onClick: () => onCreateIncident(alert),
              "aria-label": "Create incident from alert",
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-smooth bg-[rgba(107,140,255,0.12)] text-cyber-blue border border-[rgba(107,140,255,0.3)] hover:bg-[rgba(107,140,255,0.22)] hover:border-[rgba(107,140,255,0.55)] active:scale-95 ml-auto",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Create Incident"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function AlertSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glassmorphic-card rounded-lg p-4 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-20 bg-[rgba(107,140,255,0.1)] rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-16 bg-[rgba(107,140,255,0.07)] rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-12 bg-[rgba(107,140,255,0.07)] rounded" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-3/4 bg-[rgba(107,140,255,0.07)] rounded mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full bg-[rgba(107,140,255,0.05)] rounded mb-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-2/3 bg-[rgba(107,140,255,0.05)] rounded mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-28 bg-[rgba(107,140,255,0.07)] rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-28 bg-[rgba(107,140,255,0.07)] rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-28 bg-[rgba(107,140,255,0.07)] rounded ml-auto" })
    ] })
  ] });
}
function EmptyState({ filter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.97 },
      animate: { opacity: 1, scale: 1 },
      className: "glassmorphic-card rounded-lg p-10 flex flex-col items-center text-center",
      "data-ocid": "alerts-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-[rgba(107,140,255,0.08)] border border-[rgba(107,140,255,0.2)] flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-7 h-7 text-cyber-secondary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyber-text font-semibold mb-1", children: "No alerts found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary", children: filter === "all" ? "No security alerts are currently active." : `No ${filter} severity alerts match the current filter.` })
      ]
    }
  );
}
function Alerts() {
  const { alerts, loading, acknowledgeAlert, markFalsePositive } = useIncidentStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const filtered = activeFilter === "all" ? alerts : alerts.filter((a) => a.severity === activeFilter);
  const sorted = [...filtered].sort((a, b) => {
    const aUrgent = a.severity === "critical" && !a.acknowledged ? 1 : 0;
    const bUrgent = b.severity === "critical" && !b.acknowledged ? 1 : 0;
    if (bUrgent !== aUrgent) return bUrgent - aUrgent;
    return Number(b.timestamp) - Number(a.timestamp);
  });
  const handleCreateIncident = (_alert) => {
    void navigate({ to: "/report" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "alerts-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-[rgba(107,140,255,0.12)] border border-[rgba(107,140,255,0.25)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4.5 h-4.5 text-cyber-blue" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-cyber-text leading-tight", children: "Security Alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary", children: "Real-time threat monitoring & triage" })
        ] })
      ] }),
      unacknowledgedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          className: "flex items-center gap-2 px-3 py-1.5 rounded-full badge-critical pulse-critical",
          "data-ocid": "unacked-badge",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", children: [
              unacknowledgedCount,
              " unacknowledged"
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "fieldset",
      {
        className: "flex flex-wrap gap-2 border-0 p-0 m-0",
        "aria-label": "Filter alerts by severity",
        "data-ocid": "severity-filter-bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Filter by severity" }),
          FILTER_BUTTONS.map(({ label, value }) => {
            const isActive = activeFilter === value;
            const colorMap = {
              all: "bg-[rgba(107,140,255,0.18)] text-cyber-blue border-[rgba(107,140,255,0.45)]",
              critical: "badge-critical",
              high: "badge-high",
              medium: "badge-medium",
              low: "badge-low"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveFilter(value),
                "aria-pressed": isActive,
                "data-ocid": `filter-${value}`,
                className: [
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-smooth",
                  isActive ? colorMap[value] : "bg-[rgba(26,31,58,0.5)] text-cyber-secondary border-[rgba(42,47,107,0.5)] hover:border-[rgba(107,140,255,0.3)] hover:text-cyber-text"
                ].join(" "),
                children: [
                  label,
                  value !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 opacity-70", children: [
                    "(",
                    alerts.filter((a) => a.severity === value).length,
                    ")"
                  ] })
                ]
              },
              value
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-cyber-secondary self-center", children: [
            sorted.length,
            " alert",
            sorted.length !== 1 ? "s" : "",
            " shown"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: isLoading || loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertSkeleton, {})
    ] }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { filter: activeFilter }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: sorted.map((alert) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertCard,
      {
        alert,
        onAcknowledge: (id) => void acknowledgeAlert(id),
        onFalsePositive: (id) => void markFalsePositive(id),
        onCreateIncident: handleCreateIncident
      },
      alert.id
    )) }) })
  ] });
}
export {
  Alerts as default
};
