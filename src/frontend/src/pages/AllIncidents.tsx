import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Search,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useIncidentStore } from "../store/incidentStore";
import type { Incident, IncidentStatus, Severity } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: bigint): string {
  const d = new Date(Number(ts));
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function exportCSV(incidents: Incident[]) {
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
    "Business Impact",
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
    `"${i.businessImpact.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `incidents-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Badges ──────────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Severity }) {
  const classes: Record<Severity, string> = {
    critical: "badge-critical pulse-critical",
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${classes[severity]}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: IncidentStatus }) {
  const map: Record<
    IncidentStatus,
    { label: string; bg: string; color: string; border: string }
  > = {
    reported: {
      label: "Reported",
      bg: "rgba(107,140,255,0.12)",
      color: "#6b8cff",
      border: "rgba(107,140,255,0.3)",
    },
    investigating: {
      label: "Investigating",
      bg: "rgba(255,179,71,0.12)",
      color: "#ffb347",
      border: "rgba(255,179,71,0.3)",
    },
    mitigating: {
      label: "Mitigating",
      bg: "rgba(255,120,71,0.12)",
      color: "#ff7843",
      border: "rgba(255,120,71,0.3)",
    },
    resolved: {
      label: "Resolved",
      bg: "rgba(45,227,165,0.12)",
      color: "#2de3a5",
      border: "rgba(45,227,165,0.3)",
    },
    closed: {
      label: "Closed",
      bg: "rgba(141,158,224,0.1)",
      color: "#8d9ee0",
      border: "rgba(141,158,224,0.25)",
    },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"];

function TableSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="h-12 rounded"
          style={{ background: "rgba(42,47,107,0.3)" }}
        />
      ))}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function IncidentModal({
  incident,
  onClose,
}: {
  incident: Incident;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="incident-modal-overlay"
      style={{ background: "rgba(10,14,39,0.85)", backdropFilter: "blur(4px)" }}
    >
      {/* invisible backdrop button for closing on outside click */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />
      <div
        className="glassmorphic-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10"
        data-ocid="incident-modal"
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-5 border-b"
          style={{ borderColor: "rgba(42,47,107,0.6)" }}
        >
          <div>
            <p className="text-xs text-cyber-secondary font-mono mb-1">
              INCIDENT REPORT
            </p>
            <h2 className="text-lg font-display font-bold text-cyber-blue">
              {incident.id}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              <span className="text-xs text-cyber-secondary">
                {formatDate(incident.timestamp)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-cyber-secondary hover:text-cyber-blue hover:bg-cyber-blue/10 transition-colors-fast"
            aria-label="Close modal"
            data-ocid="incident-modal-close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField label="Affected Hostnames / IPs">
              <div className="flex flex-wrap gap-1 mt-1">
                {incident.hostnames.map((h) => (
                  <span
                    key={h}
                    className="px-2 py-0.5 rounded font-mono text-xs"
                    style={{
                      background: "rgba(107,140,255,0.1)",
                      color: "#6b8cff",
                      border: "1px solid rgba(107,140,255,0.2)",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </DetailField>

            <DetailField label="Affected User Accounts">
              <div className="flex flex-wrap gap-1 mt-1">
                {incident.userAccounts.map((u) => (
                  <span
                    key={u}
                    className="px-2 py-0.5 rounded font-mono text-xs"
                    style={{
                      background: "rgba(45,227,165,0.08)",
                      color: "#2de3a5",
                      border: "1px solid rgba(45,227,165,0.2)",
                    }}
                  >
                    {u}
                  </span>
                ))}
              </div>
            </DetailField>

            <DetailField label="Systems / Applications">
              <p className="text-sm text-foreground mt-1">
                {incident.systems.join(", ")}
              </p>
            </DetailField>

            <DetailField label="Data Types Exposed">
              <div className="flex flex-wrap gap-1 mt-1">
                {incident.dataExposed.map((d) => (
                  <span
                    key={d}
                    className="badge-high px-2 py-0.5 rounded text-xs font-semibold"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </DetailField>

            <DetailField label="Users Affected">
              <p className="text-2xl font-display font-bold text-cyber-warning mt-1">
                {Number(incident.usersAffected).toLocaleString()}
              </p>
            </DetailField>

            <DetailField label="Incident Type">
              <p className="text-sm font-semibold text-foreground mt-1 capitalize">
                {incident.type_}
              </p>
            </DetailField>
          </div>

          <DetailField label="Business Impact">
            <p className="text-sm text-foreground mt-1 leading-relaxed">
              {incident.businessImpact || "—"}
            </p>
          </DetailField>

          {/* Affected systems */}
          {incident.affectedSystems.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-cyber-secondary uppercase tracking-wider mb-2">
                Affected Systems
              </p>
              <div
                className="overflow-x-auto rounded-lg"
                style={{ border: "1px solid rgba(42,47,107,0.5)" }}
              >
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: "rgba(26,31,58,0.8)" }}>
                      {[
                        "System",
                        "Type",
                        "Criticality",
                        "Compromise Date",
                        "Detection",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-cyber-secondary font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {incident.affectedSystems.map((sys) => (
                      <tr
                        key={`${sys.systemName}-${sys.compromiseDate}`}
                        style={{ borderTop: "1px solid rgba(42,47,107,0.4)" }}
                      >
                        <td className="px-3 py-2 font-medium text-foreground">
                          {sys.systemName}
                        </td>
                        <td className="px-3 py-2 text-cyber-secondary">
                          {sys.systemType}
                        </td>
                        <td className="px-3 py-2">
                          <SeverityBadge
                            severity={sys.criticality.toLowerCase() as Severity}
                          />
                        </td>
                        <td className="px-3 py-2 text-cyber-secondary font-mono">
                          {sys.compromiseDate}
                        </td>
                        <td className="px-3 py-2 text-cyber-secondary">
                          {sys.detectionMethod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Evidence */}
          <DetailField label="Evidence Files">
            <p className="text-sm text-cyber-secondary mt-1 italic">
              No evidence files attached.
            </p>
          </DetailField>

          <div
            className="text-xs text-cyber-secondary font-mono pt-2 border-t"
            style={{ borderColor: "rgba(42,47,107,0.4)" }}
          >
            Created: {new Date(Number(incident.timestamp)).toISOString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-cyber-secondary uppercase tracking-wider">
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Sort indicator ───────────────────────────────────────────────────────────

type SortField = "date" | "severity";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown size={13} className="ml-1 opacity-40" />;
  return dir === "asc" ? (
    <ChevronUp size={13} className="ml-1 text-cyber-blue" />
  ) : (
    <ChevronDown size={13} className="ml-1 text-cyber-blue" />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AllIncidents() {
  const { incidents, loading } = useIncidentStore();

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">(
    "all",
  );
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("desc");
      }
      setPage(1);
    },
    [sortField],
  );

  const filtered = useMemo(() => {
    let result = [...incidents];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.id.toLowerCase().includes(q) || i.type_.toLowerCase().includes(q),
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

  const handleFilterChange = useCallback(() => setPage(1), []);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            All Incidents
          </h1>
          <p className="text-sm text-cyber-secondary mt-0.5">
            {filtered.length} incident{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-cyber-blue transition-smooth hover:bg-cyber-blue/10"
          style={{ border: "1px solid rgba(107,140,255,0.3)" }}
          data-ocid="export-csv-btn"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Filter bar */}
      <div
        className="glassmorphic-card rounded-xl p-4 flex flex-col sm:flex-row gap-3"
        data-ocid="filter-bar"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-secondary pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by ID or type…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            className="input-cyber w-full pl-9 pr-3 py-2 rounded-lg text-sm"
            data-ocid="search-input"
          />
        </div>

        {/* Severity filter */}
        <select
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value as Severity | "all");
            handleFilterChange();
          }}
          className="input-cyber px-3 py-2 rounded-lg text-sm min-w-[140px]"
          data-ocid="severity-filter"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as IncidentStatus | "all");
            handleFilterChange();
          }}
          className="input-cyber px-3 py-2 rounded-lg text-sm min-w-[150px]"
          data-ocid="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="reported">Reported</option>
          <option value="investigating">Investigating</option>
          <option value="mitigating">Mitigating</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="glassmorphic-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-5">
            <TableSkeleton />
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            hasFilters={
              search !== "" ||
              severityFilter !== "all" ||
              statusFilter !== "all"
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "rgba(20,24,50,0.9)",
                    borderBottom: "1px solid rgba(42,47,107,0.5)",
                  }}
                >
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider">
                    Incident ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider"
                    data-ocid="sort-date-btn"
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-0 hover:text-cyber-blue transition-colors-fast select-none"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      <SortIcon active={sortField === "date"} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-cyber-secondary uppercase tracking-wider"
                    data-ocid="sort-severity-btn"
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-0 hover:text-cyber-blue transition-colors-fast select-none"
                      onClick={() => handleSort("severity")}
                    >
                      Severity
                      <SortIcon
                        active={sortField === "severity"}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((incident, idx) => (
                  <tr
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedIncident(incident);
                    }}
                    tabIndex={0}
                    className="cursor-pointer transition-colors-fast hover:bg-cyber-blue/5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-cyber-blue/50"
                    style={{
                      borderBottom:
                        idx < paginated.length - 1
                          ? "1px solid rgba(42,47,107,0.35)"
                          : undefined,
                    }}
                    data-ocid={`incident-row-${incident.id}`}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-cyber-blue group-hover:text-cyber-blue/90 font-semibold whitespace-nowrap">
                      {incident.id}
                    </td>
                    <td className="px-4 py-3.5 capitalize text-foreground font-medium">
                      {incident.type_}
                    </td>
                    <td className="px-4 py-3.5 text-cyber-secondary whitespace-nowrap font-mono text-xs">
                      {formatDate(incident.timestamp)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <SeverityBadge severity={incident.severity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid rgba(42,47,107,0.4)" }}
            data-ocid="pagination"
          >
            <p className="text-xs text-cyber-secondary">
              Page <span className="text-foreground font-semibold">{page}</span>{" "}
              of{" "}
              <span className="text-foreground font-semibold">
                {totalPages}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyber-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:text-cyber-blue hover:bg-cyber-blue/10 transition-colors-fast"
                style={{ border: "1px solid rgba(42,47,107,0.5)" }}
                data-ocid="pagination-prev"
              >
                <ChevronLeft size={14} />
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyber-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:text-cyber-blue hover:bg-cyber-blue/10 transition-colors-fast"
                style={{ border: "1px solid rgba(42,47,107,0.5)" }}
                data-ocid="pagination-next"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      data-ocid="empty-state"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "rgba(107,140,255,0.1)",
          border: "1px solid rgba(107,140,255,0.2)",
        }}
      >
        <AlertTriangle size={24} className="text-cyber-blue" />
      </div>
      <h3 className="text-base font-display font-bold text-foreground mb-1">
        {hasFilters ? "No incidents match your filters" : "No incidents yet"}
      </h3>
      <p className="text-sm text-cyber-secondary max-w-xs mb-5">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "When incidents are reported, they'll appear here for review and management."}
      </p>
      <Link
        to="/report"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-cyber-bg bg-cyber-green hover:opacity-90 transition-smooth"
        data-ocid="report-incident-link"
      >
        Report an Incident
      </Link>
    </div>
  );
}
