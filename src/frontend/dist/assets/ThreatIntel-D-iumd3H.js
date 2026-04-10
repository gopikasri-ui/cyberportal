import { c as createLucideIcon, u as useIncidentStore, r as reactExports, j as jsxRuntimeExports, S as Shield, B as Bell } from "./index-ljKLTZYa.js";
import { B as Button } from "./button-96lfI4Wz.js";
import { R as RefreshCw, S as Skeleton } from "./skeleton-D4tHT_Di.js";
import { u as ue } from "./index-Mbc3iauN.js";
import { m as motion } from "./proxy-D0aaadKu.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 19h8", key: "baeox8" }],
  ["path", { d: "m4 17 6-6-6-6", key: "1yngyt" }]
];
const Terminal = createLucideIcon("terminal", __iconNode);
function formatRelativeTime(ts) {
  const diffMs = Date.now() - Number(ts);
  const mins = Math.floor(diffMs / 6e4);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function SeverityBadge({ severity }) {
  const cls = severity === "critical" ? "badge-critical" : severity === "high" ? "badge-high" : severity === "medium" ? "badge-medium" : "badge-low";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${cls}`,
      children: severity
    }
  );
}
const IOC_TYPE_LABELS = {
  ip: "IP",
  domain: "Domain",
  hash: "Hash",
  url: "URL",
  email: "Email",
  filename: "File"
};
function IOCTypeBadge({ type }) {
  const colors = {
    ip: "bg-primary/20 text-primary border-primary/30",
    domain: "bg-secondary/20 text-secondary border-secondary/30",
    hash: "bg-muted text-muted-foreground border-border",
    url: "bg-[rgba(255,179,71,0.15)] text-cyber-warning border-[rgba(255,179,71,0.3)]",
    email: "bg-[rgba(255,71,87,0.12)] text-cyber-critical border-[rgba(255,71,87,0.3)]",
    filename: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${colors[type]}`,
      children: IOC_TYPE_LABELS[type]
    }
  );
}
const HEATMAP_DATA = [
  [1, 2, 1, 3, 4, 2, 1],
  [2, 1, 3, 4, 3, 1, 2],
  [1, 3, 4, 4, 2, 3, 1],
  [2, 2, 1, 3, 4, 3, 2],
  [1, 1, 2, 2, 3, 4, 2]
];
const INTENSITY_CLASSES = [
  "bg-transparent border border-border/40",
  "bg-secondary/20 border border-secondary/30",
  "bg-[rgba(255,179,71,0.25)] border border-[rgba(255,179,71,0.4)]",
  "bg-[rgba(255,120,50,0.3)] border border-[rgba(255,120,50,0.45)]",
  "bg-[rgba(255,71,87,0.35)] border border-[rgba(255,71,87,0.5)]"
];
const INTENSITY_LABELS = ["None", "Low", "Medium", "High", "Critical"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function SectionHeader({
  icon: Icon,
  title,
  count
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg glassmorphic flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-cyber-blue" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold text-foreground", children: title }),
    count !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-cyber-secondary", children: [
      count,
      " entries"
    ] })
  ] });
}
function ThreatIntel() {
  const { feeds, iocs, loading, loadFeeds, loadIOCs } = useIncidentStore();
  const [subscribed, setSubscribed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadFeeds();
    loadIOCs();
  }, [loadFeeds, loadIOCs]);
  function handleSubscribeToggle() {
    const next = !subscribed;
    setSubscribed(next);
    if (next) {
      ue.success("Subscribed to threat alerts", {
        description: "You'll be notified when new threats are detected.",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-cyber-green" })
      });
    } else {
      ue.info("Unsubscribed from threat alerts", {
        description: "You won't receive threat notifications.",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "w-4 h-4 text-cyber-secondary" })
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full cyber-grid", "data-ocid": "threat-intel-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl glassmorphic-card flex items-center justify-center glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-cyber-blue" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground leading-tight", children: "Threat Intelligence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary mt-0.5", children: "Live feeds from CERT-In, NCIIPC & CISA" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-2 border-border text-cyber-secondary hover:text-foreground hover:border-primary/50 transition-smooth",
            onClick: () => {
              loadFeeds();
              loadIOCs();
              ue.info("Refreshing threat data...");
            },
            "data-ocid": "threat-refresh-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
              "Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            className: `gap-2 transition-smooth font-semibold ${subscribed ? "bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary/30" : "bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"}`,
            variant: "outline",
            onClick: handleSubscribeToggle,
            "data-ocid": "subscribe-alerts-btn",
            children: subscribed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3.5 h-3.5 fill-current" }),
              "Subscribed"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3.5 h-3.5" }),
              "Subscribe to Alerts"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "mb-8",
        "data-ocid": "threat-feeds-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: Activity,
              title: "Threat Feeds",
              count: feeds.length
            }
          ),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: ["sk-0", "sk-1", "sk-2", "sk-3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl bg-muted/30" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: feeds.map((feed, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: idx * 0.07, duration: 0.35 },
              className: "glassmorphic-card rounded-xl p-4 hover:border-primary/30 transition-smooth group",
              "data-ocid": `feed-card-${feed.feedId}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/25", children: feed.source }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: feed.severity })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyber-secondary shrink-0", children: formatRelativeTime(feed.publishedAt) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground leading-snug mb-2 group-hover:text-cyber-blue transition-colors-fast line-clamp-2", children: feed.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary leading-relaxed line-clamp-2", children: feed.description.length > 100 ? `${feed.description.slice(0, 100)}…` : feed.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `mt-3 h-0.5 rounded-full opacity-60 ${feed.severity === "critical" ? "bg-cyber-critical" : feed.severity === "high" ? "bg-cyber-warning" : feed.severity === "medium" ? "bg-cyber-blue" : "bg-cyber-green"}`
                  }
                )
              ]
            },
            feed.feedId
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.15 },
        className: "mb-8",
        "data-ocid": "ioc-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              icon: Terminal,
              title: "Indicators of Compromise",
              count: iocs.length
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glassmorphic-card rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary", children: "IOC Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary", children: "Value" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary", children: "Severity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-cyber-secondary", children: "Added" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 bg-muted/30" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 bg-muted/30" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 bg-muted/30" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-12 bg-muted/30 ml-auto" }) })
              ] }, k)) : iocs.map((ioc, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.tr,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: idx * 0.05 },
                  className: "border-b border-border/30 hover:bg-primary/5 transition-colors-fast",
                  "data-ocid": `ioc-row-${ioc.iocId}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IOCTypeBadge, { type: ioc.iocType }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-xs text-cyber-green bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 break-all", children: ioc.value }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: ioc.severity }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right text-xs text-cyber-secondary", children: formatRelativeTime(ioc.addedAt) })
                  ]
                },
                ioc.iocId
              )) })
            ] }) }),
            !loading && iocs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-cyber-secondary text-sm", children: "No IOCs found. Feed is clean." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.25 },
        className: "mb-8",
        "data-ocid": "heatmap-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: Activity, title: "Threat Activity Heatmap" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glassmorphic-card rounded-xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary", children: "Last 5 weeks — daily threat activity intensity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: INTENSITY_LABELS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-3 h-3 rounded-sm ${INTENSITY_CLASSES[i]}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-cyber-secondary hidden sm:inline", children: label })
              ] }, label)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-1 ml-12", children: DAY_LABELS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 text-center text-[10px] text-cyber-secondary",
                children: d
              },
              d
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: HEATMAP_DATA.map((week, wIdx) => {
              const weekLabel = `W${HEATMAP_DATA.length - wIdx}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 shrink-0 text-right text-[10px] text-cyber-secondary pr-2", children: weekLabel }),
                week.map((intensity, dIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    title: `${DAY_LABELS[dIdx]}, ${weekLabel}: ${INTENSITY_LABELS[intensity]}`,
                    className: `flex-1 aspect-square rounded-sm transition-smooth hover:scale-110 cursor-default ${INTENSITY_CLASSES[intensity]}`
                  },
                  DAY_LABELS[dIdx]
                ))
              ] }, weekLabel);
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-xs text-cyber-secondary tracking-widest uppercase", children: "April 2026" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-border/40 grid grid-cols-3 gap-4 text-center", children: [
              {
                label: "Peak Day",
                value: "Thu, W3",
                color: "text-cyber-critical"
              },
              {
                label: "Avg Intensity",
                value: "High",
                color: "text-cyber-warning"
              },
              {
                label: "Trend",
                value: "↑ Escalating",
                color: "text-cyber-critical"
              }
            ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary mb-1", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-semibold ${color}`, children: value })
            ] }, label)) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8" })
  ] });
}
export {
  ThreatIntel as default
};
