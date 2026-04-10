import { c as createLucideIcon, u as useIncidentStore, r as reactExports, j as jsxRuntimeExports, S as Shield } from "./index-ljKLTZYa.js";
import { C as Clock, a as CircleCheck, B as Badge } from "./badge-D910ikyI.js";
import { B as Button } from "./button-96lfI4Wz.js";
import { I as Input, F as FileText } from "./input-B4sHvbig.js";
import { S as Search } from "./search-CMxDzG5c.js";
import { A as AnimatePresence } from "./index-DX1TyZvF.js";
import { m as motion } from "./proxy-D0aaadKu.js";
import { T as TriangleAlert } from "./triangle-alert-DYIlsCz5.js";
import { C as ChevronDown } from "./chevron-down-BYvwejg9.js";
import { C as ChevronRight } from "./chevron-right-B0S6Ug7V.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }],
  ["path", { d: "M7 12h10", key: "b7w52i" }]
];
const ScanLine = createLucideIcon("scan-line", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const STAGES = [
  "reported",
  "investigating",
  "mitigating",
  "resolved"
];
const STAGE_LABELS = {
  reported: "Reported",
  investigating: "Investigating",
  mitigating: "Mitigating",
  resolved: "Resolved",
  closed: "Closed"
};
const ANALYST_COMMENTS = {
  reported: "Incident received and logged by automated system.",
  investigating: "Analyst Meena S. assigned. Initial triage in progress.",
  mitigating: "Containment measures applied. Monitoring affected systems.",
  resolved: "Incident closed. Post-incident report filed.",
  closed: "Incident archived and closed."
};
const STAGE_ICONS = {
  reported: FileText,
  investigating: Search,
  mitigating: Shield,
  resolved: CircleCheck,
  closed: CircleCheck
};
const SEVERITY_COLORS = {
  critical: "bg-[#ff4757]/20 text-[#ff4757] border-[#ff4757]/40",
  high: "bg-[#ffb347]/20 text-[#ffb347] border-[#ffb347]/40",
  medium: "bg-[#6b8cff]/20 text-[#6b8cff] border-[#6b8cff]/40",
  low: "bg-[#2de3a5]/20 text-[#2de3a5] border-[#2de3a5]/40"
};
const TYPE_LABELS = {
  phishing: "Phishing",
  malware: "Malware",
  breach: "Data Breach",
  ransomware: "Ransomware",
  ddos: "DDoS",
  insider: "Insider Threat",
  other: "Other"
};
function getStatusIndex(status) {
  return STAGES.indexOf(status === "closed" ? "resolved" : status);
}
function getStageTimestamp(incident, stageIndex) {
  const base = Number(incident.timestamp);
  const statusIdx = getStatusIndex(incident.status);
  if (stageIndex > statusIdx) return null;
  const offsets = [
    0,
    30 * 60 * 1e3,
    2 * 60 * 60 * 1e3,
    4 * 60 * 60 * 1e3
  ];
  return base + (offsets[stageIndex] ?? 0);
}
function formatTs(ms) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(new Date(ms));
}
function ScanEmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-col items-center justify-center py-20 gap-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] },
              transition: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.5,
                ease: "easeInOut"
              },
              className: "absolute inset-0 rounded-full bg-[#6b8cff]/20"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-20 h-20 rounded-full border border-[#6b8cff]/40 flex items-center justify-center bg-[#1a1f3a]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "w-9 h-9 text-[#6b8cff]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { y: [0, 56, 0] },
              transition: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "linear"
              },
              className: "absolute left-2 right-2 h-px bg-[#6b8cff]/70 top-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#eef2ff] font-display font-semibold text-lg mb-1", children: "Search an Incident" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8d9ee0] text-sm max-w-xs leading-relaxed", children: "Enter an incident ID (e.g. INC-20260410-001) to view its full timeline and analyst comments." })
        ] })
      ]
    }
  );
}
function NotFoundState({ query }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: "flex flex-col items-center justify-center py-16 gap-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full border border-[#ff4757]/40 bg-[#ff4757]/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-[#ff4757]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#ff4757] font-display font-semibold text-base mb-1", children: "No incident found with that ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#8d9ee0] text-sm", children: [
            '"',
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#eef2ff]", children: query }),
            '" does not match any incident in the system.'
          ] })
        ] })
      ]
    }
  );
}
function SummaryCard({ incident }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-xl border border-[#2a2f6b] p-4 mb-6",
      style: { background: "rgba(26,31,58,0.8)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#8d9ee0] mb-0.5", children: "Incident ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-semibold text-[#6b8cff]", children: incident.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${SEVERITY_COLORS[incident.severity]}`,
                children: incident.severity.toUpperCase()
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border border-[#6b8cff]/40 bg-[#6b8cff]/10 text-[#6b8cff]", children: TYPE_LABELS[incident.type_] ?? incident.type_ })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#8d9ee0] mb-0.5", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#eef2ff] capitalize font-medium", children: STAGE_LABELS[incident.status] ?? incident.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#8d9ee0] mb-0.5", children: "Users Affected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#eef2ff] font-medium", children: Number(incident.usersAffected).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 sm:col-span-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#8d9ee0] mb-0.5", children: "Hostnames / IPs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: incident.hostnames.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-[#0a0e27] border border-[#2a2f6b] text-[#8d9ee0]",
                children: h
              },
              h
            )) })
          ] })
        ] })
      ]
    }
  );
}
function TimelineNode({
  stage,
  stageIndex,
  currentIndex,
  timestamp,
  isLast
}) {
  const [expanded, setExpanded] = reactExports.useState(stageIndex === currentIndex);
  const isCompleted = stageIndex < currentIndex;
  const isActive = stageIndex === currentIndex;
  const isFuture = stageIndex > currentIndex;
  const dotColor = isCompleted ? "bg-[#2de3a5] border-[#2de3a5]" : isActive ? "bg-[#6b8cff] border-[#6b8cff] shadow-[0_0_12px_rgba(107,140,255,0.6)]" : "bg-[#1a1f3a] border-[#2a2f6b]";
  const lineColor = isCompleted ? "bg-[#2de3a5]/50" : "bg-[#2a2f6b]";
  const Icon = STAGE_ICONS[stage];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 z-10 transition-all duration-500 ${dotColor}`,
          "data-ocid": `timeline-dot-${stage}`
        }
      ),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-0.5 flex-1 mt-1 min-h-[48px] ${lineColor} transition-colors duration-500`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => !isFuture && setExpanded((v) => !v),
          disabled: isFuture,
          className: `w-full text-left group ${isFuture ? "cursor-default" : "cursor-pointer"}`,
          "data-ocid": `timeline-node-${stage}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon,
                {
                  className: `w-4 h-4 flex-shrink-0 ${isFuture ? "text-[#2a2f6b]" : isActive ? "text-[#6b8cff]" : "text-[#2de3a5]"}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-sm font-semibold font-display ${isFuture ? "text-[#2a2f6b]" : isActive ? "text-[#6b8cff]" : "text-[#2de3a5]"}`,
                  children: STAGE_LABELS[stage]
                }
              ),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 text-[10px] py-0 px-1.5 bg-[#6b8cff]/20 text-[#6b8cff] border-[#6b8cff]/40 border", children: "ACTIVE" }),
              !isFuture && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[#2a2f6b] group-hover:text-[#8d9ee0] transition-colors", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-6 text-xs text-[#8d9ee0]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
              timestamp ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTs(timestamp) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-[#2a2f6b]", children: "Pending" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: expanded && !isFuture && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          transition: { duration: 0.25, ease: "easeInOut" },
          className: "overflow-hidden",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-3 ml-6 rounded-lg border border-[#2a2f6b] p-3 space-y-2",
              style: { background: "rgba(10,14,39,0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-[#8d9ee0] mt-0.5 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#eef2ff] leading-relaxed", children: ANALYST_COMMENTS[stage] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 text-[#8d9ee0] flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#8d9ee0]", children: "No evidence files attached at this stage." })
                ] })
              ]
            }
          )
        },
        "expanded"
      ) })
    ] })
  ] });
}
function TrackTimeline() {
  const incidents = useIncidentStore((s) => s.incidents);
  const [query, setQuery] = reactExports.useState("");
  const [searchInput, setSearchInput] = reactExports.useState("");
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const foundIncident = incidents.find(
    (i) => i.id.toLowerCase() === query.toLowerCase()
  );
  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setTimeout(() => {
      setQuery(trimmed);
      setIsSearching(false);
    }, 400);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  const currentIndex = foundIncident ? getStatusIndex(foundIncident.status) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full text-[#eef2ff]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-[#eef2ff] mb-1", children: "Track & Timeline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#8d9ee0]", children: "Search an incident ID to view its investigation timeline and analyst updates." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-[#2a2f6b] p-4 mb-6",
        style: { background: "rgba(26,31,58,0.7)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d9ee0] pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: searchInput,
                  onChange: (e) => setSearchInput(e.target.value),
                  onKeyDown: handleKeyDown,
                  placeholder: "e.g. INC-20260410-001",
                  className: "pl-9 bg-[#0a0e27] border-[#2a2f6b] text-[#eef2ff] placeholder:text-[#2a2f6b] focus:border-[#6b8cff] focus:ring-[#6b8cff]/20",
                  "data-ocid": "timeline-search-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSearch,
                disabled: isSearching || !searchInput.trim(),
                className: "bg-[#6b8cff] hover:bg-[#6b8cff]/80 text-white font-semibold px-5 transition-all duration-200 disabled:opacity-50",
                "data-ocid": "timeline-search-btn",
                children: isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Search"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#8d9ee0] mr-1 self-center", children: "Try:" }),
            ["INC-20260410-001", "INC-20260410-002", "INC-20260409-001"].map(
              (id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setSearchInput(id);
                    setQuery(id);
                  },
                  className: "text-xs font-mono px-2 py-0.5 rounded border border-[#2a2f6b] text-[#6b8cff] bg-[#0a0e27] hover:border-[#6b8cff]/50 transition-colors",
                  "data-ocid": `timeline-quick-${id}`,
                  children: id
                },
                id
              )
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !query ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanEmptyState, {})
      },
      "empty"
    ) : !foundIncident ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundState, { query })
      },
      "not-found"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { incident: foundIncident }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-[#2a2f6b] p-5",
              style: { background: "rgba(26,31,58,0.7)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-display font-semibold text-[#eef2ff] mb-5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-[#6b8cff]" }),
                  "Investigation Timeline"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: STAGES.map((stage, idx) => {
                  const ts = getStageTimestamp(foundIncident, idx);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TimelineNode,
                    {
                      stage,
                      stageIndex: idx,
                      currentIndex,
                      timestamp: ts,
                      isLast: idx === STAGES.length - 1
                    },
                    stage
                  );
                }) })
              ]
            }
          )
        ]
      },
      foundIncident.id
    ) })
  ] });
}
export {
  TrackTimeline as default
};
