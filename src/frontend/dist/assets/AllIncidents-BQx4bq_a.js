import { c as createLucideIcon, u as useIncidentStore, r as reactExports, j as jsxRuntimeExports, L as Link, X } from "./index-ljKLTZYa.js";
import { D as Download } from "./download-CtN7u6X5.js";
import { S as Search } from "./search-CMxDzG5c.js";
import { C as ChevronRight } from "./chevron-right-B0S6Ug7V.js";
import { T as TriangleAlert } from "./triangle-alert-DYIlsCz5.js";
import { C as ChevronDown } from "./chevron-down-BYvwejg9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode);
const PAGE_SIZE = 10;
const SEVERITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};
function formatDate(ts) {
  const d = new Date(Number(ts));
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function exportCSV(incidents) {
  const headers = [
    "Incident ID",
    "Type",
    "Date",
    "Status",
    "Severity",
    "Hostnames",
    "User Accounts",
    "Systems",
    "Data Exposed",
    "Users Affected",
    "Business Impact"
  ];
  const rows = incidents.map((i) => [
    i.id,
    i.type_,
    formatDate(i.timestamp),
    i.status,
    i.severity,
    i.hostnames.join("; "),
    i.userAccounts.join("; "),
    i.systems.join("; "),
    i.dataExposed.join("; "),
    String(i.usersAffected),
    `"${i.businessImpact.replace(/"/g, '""')}"`
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `incidents-export-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function SeverityBadge({ severity }) {
  const classes = {
    critical: "badge-critical pulse-critical",
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${classes[severity]}`,
      children: severity
    }
  );
}
function StatusBadge({ status }) {
  const map = {
    reported: {
      label: "Reported",
      bg: "rgba(107,140,255,0.12)",
      color: "#6b8cff",
      border: "rgba(107,140,255,0.3)"
    },
    investigating: {
      label: "Investigating",
      bg: "rgba(255,179,71,0.12)",
      color: "#ffb347",
      border: "rgba(255,179,71,0.3)"
    },
    mitigating: {
      label: "Mitigating",
      bg: "rgba(255,120,71,0.12)",
      color: "#ff7843",
      border: "rgba(255,120,71,0.3)"
    },
    resolved: {
      label: "Resolved",
      bg: "rgba(45,227,165,0.12)",
      color: "#2de3a5",
      border: "rgba(45,227,165,0.3)"
    },
    closed: {
      label: "Closed",
      bg: "rgba(141,158,224,0.1)",
      color: "#8d9ee0",
      border: "rgba(141,158,224,0.25)"
    }
  };
  const s = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
      style: {
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`
      },
      children: s.label
    }
  );
}
const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"];
function TableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 animate-pulse", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-12 rounded",
      style: { background: "rgba(42,47,107,0.3)" }
    },
    k
  )) });
}
function IncidentModal({
  incident,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      "data-ocid": "incident-modal-overlay",
      style: { background: "rgba(10,14,39,0.85)", backdropFilter: "blur(4px)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Close modal",
            className: "absolute inset-0 w-full h-full cursor-default",
            onClick: onClose,
            onKeyDown: (e) => {
              if (e.key === "Escape") onClose();
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glassmorphic-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10",
            "data-ocid": "incident-modal",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start justify-between p-5 border-b",
                  style: { borderColor: "rgba(42,47,107,0.6)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-cyber-secondary font-mono mb-1", children: "INCIDENT REPORT" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-bold text-cyber-blue", children: incident.id }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: incident.severity }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: incident.status }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyber-secondary", children: formatDate(incident.timestamp) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        className: "p-1.5 rounded-lg text-cyber-secondary hover:text-cyber-blue hover:bg-cyber-blue/10 transition-colors-fast",
                        "aria-label": "Close modal",
                        "data-ocid": "incident-modal-close",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Affected Hostnames / IPs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: incident.hostnames.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-2 py-0.5 rounded font-mono text-xs",
                      style: {
                        background: "rgba(107,140,255,0.1)",
                        color: "#6b8cff",
                        border: "1px solid rgba(107,140,255,0.2)"
                      },
                      children: h
                    },
                    h
                  )) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Affected User Accounts", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: incident.userAccounts.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-2 py-0.5 rounded font-mono text-xs",
                      style: {
                        background: "rgba(45,227,165,0.08)",
                        color: "#2de3a5",
                        border: "1px solid rgba(45,227,165,0.2)"
                      },
                      children: u
                    },
                    u
                  )) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Systems / Applications", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-1", children: incident.systems.join(", ") }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Data Types Exposed", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: incident.dataExposed.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "badge-high px-2 py-0.5 rounded text-xs font-semibold",
                      children: d
                    },
                    d
                  )) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Users Affected", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-cyber-warning mt-1", children: Number(incident.usersAffected).toLocaleString() }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Incident Type", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-1 capitalize", children: incident.type_ }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Business Impact", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-1 leading-relaxed", children: incident.businessImpact || "—" }) }),
                incident.affectedSystems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-cyber-secondary uppercase tracking-wider mb-2", children: "Affected Systems" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "overflow-x-auto rounded-lg",
                      style: { border: "1px solid rgba(42,47,107,0.5)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "rgba(26,31,58,0.8)" }, children: [
                          "System",
                          "Type",
                          "Criticality",
                          "Compromise Date",
                          "Detection"
                        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "th",
                          {
                            className: "px-3 py-2 text-left text-cyber-secondary font-semibold",
                            children: h
                          },
                          h
                        )) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: incident.affectedSystems.map((sys) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "tr",
                          {
                            style: { borderTop: "1px solid rgba(42,47,107,0.4)" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: sys.systemName }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-cyber-secondary", children: sys.systemType }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SeverityBadge,
                                {
                                  severity: sys.criticality.toLowerCase()
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-cyber-secondary font-mono", children: sys.compromiseDate }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-cyber-secondary", children: sys.detectionMethod })
                            ]
                          },
                          `${sys.systemName}-${sys.compromiseDate}`
                        )) })
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { label: "Evidence Files", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyber-secondary mt-1 italic", children: "No evidence files attached." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "text-xs text-cyber-secondary font-mono pt-2 border-t",
                    style: { borderColor: "rgba(42,47,107,0.4)" },
                    children: [
                      "Created: ",
                      new Date(Number(incident.timestamp)).toISOString()
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function DetailField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-cyber-secondary uppercase tracking-wider", children: label }),
    children
  ] });
}
function SortIcon({ active, dir }) {
  if (!active) return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 13, className: "ml-1 opacity-40" });
  return dir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13, className: "ml-1 text-cyber-blue" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13, className: "ml-1 text-cyber-blue" });
}
function AllIncidents() {
  const { incidents, loading } = useIncidentStore();
  const [search, setSearch] = reactExports.useState("");
  const [severityFilter, setSeverityFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState(
    "all"
  );
  const [sortField, setSortField] = reactExports.useState("date");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [page, setPage] = reactExports.useState(1);
  const [selectedIncident, setSelectedIncident] = reactExports.useState(
    null
  );
  const handleSort = reactExports.useCallback(
    (field) => {
      if (sortField === field) {
        setSortDir((d) => d === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDir("desc");
      }
      setPage(1);
    },
    [sortField]
  );
  const filtered = reactExports.useMemo(() => {
    let result = [...incidents];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.id.toLowerCase().includes(q) || i.type_.toLowerCase().includes(q)
      );
    }
    if (severityFilter !== "all") {
      result = result.filter((i) => i.severity === severityFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = Number(a.timestamp) - Number(b.timestamp);
      } else {
        cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [incidents, search, severityFilter, statusFilter, sortField, sortDir]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleFilterChange = reactExports.useCallback(() => setPage(1), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "All Incidents" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-cyber-secondary mt-0.5", children: [
          filtered.length,
          " incident",
          filtered.length !== 1 ? "s" : "",
          " found"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => exportCSV(filtered),
          className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-cyber-blue transition-smooth hover:bg-cyber-blue/10",
          style: { border: "1px solid rgba(107,140,255,0.3)" },
          "data-ocid": "export-csv-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 15 }),
            "Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "glassmorphic-card rounded-xl p-4 flex flex-col sm:flex-row gap-3",
        "data-ocid": "filter-bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                size: 15,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-cyber-secondary pointer-events-none"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Search by ID or type…",
                value: search,
                onChange: (e) => {
                  setSearch(e.target.value);
                  handleFilterChange();
                },
                className: "input-cyber w-full pl-9 pr-3 py-2 rounded-lg text-sm",
                "data-ocid": "search-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: severityFilter,
              onChange: (e) => {
                setSeverityFilter(e.target.value);
                handleFilterChange();
              },
              className: "input-cyber px-3 py-2 rounded-lg text-sm min-w-[140px]",
              "data-ocid": "severity-filter",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Severities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "critical", children: "Critical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: statusFilter,
              onChange: (e) => {
                setStatusFilter(e.target.value);
                handleFilterChange();
              },
              className: "input-cyber px-3 py-2 rounded-lg text-sm min-w-[150px]",
              "data-ocid": "status-filter",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Statuses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "reported", children: "Reported" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "investigating", children: "Investigating" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mitigating", children: "Mitigating" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "resolved", children: "Resolved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "closed", children: "Closed" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glassmorphic-card rounded-xl overflow-hidden", children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) }) : paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          hasFilters: search !== "" || severityFilter !== "all" || statusFilter !== "all"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            style: {
              background: "rgba(20,24,50,0.9)",
              borderBottom: "1px solid rgba(42,47,107,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider", children: "Incident ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider",
                  "data-ocid": "sort-date-btn",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "inline-flex items-center gap-0 hover:text-cyber-blue transition-colors-fast select-none",
                      onClick: () => handleSort("date"),
                      children: [
                        "Date",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { active: sortField === "date", dir: sortDir })
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider",
                  "data-ocid": "sort-severity-btn",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "inline-flex items-center gap-0 hover:text-cyber-blue transition-colors-fast select-none",
                      onClick: () => handleSort("severity"),
                      children: [
                        "Severity",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SortIcon,
                          {
                            active: sortField === "severity",
                            dir: sortDir
                          }
                        )
                      ]
                    }
                  )
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: paginated.map((incident, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            onClick: () => setSelectedIncident(incident),
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ")
                setSelectedIncident(incident);
            },
            tabIndex: 0,
            className: "cursor-pointer transition-colors-fast hover:bg-cyber-blue/5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-cyber-blue/50",
            style: {
              borderBottom: idx < paginated.length - 1 ? "1px solid rgba(42,47,107,0.35)" : void 0
            },
            "data-ocid": `incident-row-${incident.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 font-mono text-xs text-cyber-blue group-hover:text-cyber-blue/90 font-semibold whitespace-nowrap", children: incident.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 capitalize text-foreground font-medium", children: incident.type_ }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 text-cyber-secondary whitespace-nowrap font-mono text-xs", children: formatDate(incident.timestamp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: incident.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBadge, { severity: incident.severity }) })
            ]
          },
          incident.id
        )) })
      ] }) }),
      !loading && totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-4 py-3",
          style: { borderTop: "1px solid rgba(42,47,107,0.4)" },
          "data-ocid": "pagination",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-cyber-secondary", children: [
              "Page ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: page }),
              " ",
              "of",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: totalPages })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setPage((p) => Math.max(1, p - 1)),
                  disabled: page === 1,
                  className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyber-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:text-cyber-blue hover:bg-cyber-blue/10 transition-colors-fast",
                  style: { border: "1px solid rgba(42,47,107,0.5)" },
                  "data-ocid": "pagination-prev",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 }),
                    "Prev"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
                  disabled: page === totalPages,
                  className: "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyber-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:text-cyber-blue hover:bg-cyber-blue/10 transition-colors-fast",
                  style: { border: "1px solid rgba(42,47,107,0.5)" },
                  "data-ocid": "pagination-next",
                  children: [
                    "Next",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] }),
    selectedIncident && /* @__PURE__ */ jsxRuntimeExports.jsx(
      IncidentModal,
      {
        incident: selectedIncident,
        onClose: () => setSelectedIncident(null)
      }
    )
  ] });
}
function EmptyState({ hasFilters }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-16 px-4 text-center",
      "data-ocid": "empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-14 h-14 rounded-full flex items-center justify-center mb-4",
            style: {
              background: "rgba(107,140,255,0.1)",
              border: "1px solid rgba(107,140,255,0.2)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, className: "text-cyber-blue" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-display font-bold text-foreground mb-1", children: hasFilters ? "No incidents match your filters" : "No incidents yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-cyber-secondary max-w-xs mb-5", children: hasFilters ? "Try adjusting your search or filter criteria to find what you're looking for." : "When incidents are reported, they'll appear here for review and management." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/report",
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-cyber-bg bg-cyber-green hover:opacity-90 transition-smooth",
            "data-ocid": "report-incident-link",
            children: "Report an Incident"
          }
        )
      ]
    }
  );
}
export {
  AllIncidents as default
};
