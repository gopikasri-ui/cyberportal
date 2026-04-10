import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  ScanLine,
  Search,
  Shield,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useIncidentStore } from "../store/incidentStore";
import type { Incident, IncidentStatus } from "../types";

// ─── Timeline config ─────────────────────────────────────────────────────────

const STAGES: IncidentStatus[] = [
  "reported",
  "investigating",
  "mitigating",
  "resolved",
];

const STAGE_LABELS: Record<IncidentStatus, string> = {
  reported: "Reported",
  investigating: "Investigating",
  mitigating: "Mitigating",
  resolved: "Resolved",
  closed: "Closed",
};

const ANALYST_COMMENTS: Record<IncidentStatus, string> = {
  reported: "Incident received and logged by automated system.",
  investigating: "Analyst Meena S. assigned. Initial triage in progress.",
  mitigating: "Containment measures applied. Monitoring affected systems.",
  resolved: "Incident closed. Post-incident report filed.",
  closed: "Incident archived and closed.",
};

const STAGE_ICONS: Record<IncidentStatus, typeof AlertTriangle> = {
  reported: FileText,
  investigating: Search,
  mitigating: Shield,
  resolved: CheckCircle2,
  closed: CheckCircle2,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-[#ff4757]/20 text-[#ff4757] border-[#ff4757]/40",
  high: "bg-[#ffb347]/20 text-[#ffb347] border-[#ffb347]/40",
  medium: "bg-[#6b8cff]/20 text-[#6b8cff] border-[#6b8cff]/40",
  low: "bg-[#2de3a5]/20 text-[#2de3a5] border-[#2de3a5]/40",
};

const TYPE_LABELS: Record<string, string> = {
  phishing: "Phishing",
  malware: "Malware",
  breach: "Data Breach",
  ransomware: "Ransomware",
  ddos: "DDoS",
  insider: "Insider Threat",
  other: "Other",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusIndex(status: IncidentStatus): number {
  return STAGES.indexOf(status === "closed" ? "resolved" : status);
}

function getStageTimestamp(
  incident: Incident,
  stageIndex: number,
): number | null {
  const base = Number(incident.timestamp);
  const statusIdx = getStatusIndex(incident.status);
  if (stageIndex > statusIdx) return null;
  const offsets = [
    0,
    30 * 60 * 1000,
    2 * 60 * 60 * 1000,
    4 * 60 * 60 * 1000,
  ] as const;
  return base + (offsets[stageIndex] ?? 0);
}

function formatTs(ms: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(ms));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScanEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-6"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2.5,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-[#6b8cff]/20"
        />
        <div className="relative w-20 h-20 rounded-full border border-[#6b8cff]/40 flex items-center justify-center bg-[#1a1f3a]">
          <ScanLine className="w-9 h-9 text-[#6b8cff]" />
        </div>
        <motion.div
          animate={{ y: [0, 56, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "linear",
          }}
          className="absolute left-2 right-2 h-px bg-[#6b8cff]/70 top-2"
        />
      </div>
      <div className="text-center">
        <p className="text-[#eef2ff] font-display font-semibold text-lg mb-1">
          Search an Incident
        </p>
        <p className="text-[#8d9ee0] text-sm max-w-xs leading-relaxed">
          Enter an incident ID (e.g. INC-20260410-001) to view its full timeline
          and analyst comments.
        </p>
      </div>
    </motion.div>
  );
}

function NotFoundState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <div className="w-16 h-16 rounded-full border border-[#ff4757]/40 bg-[#ff4757]/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-[#ff4757]" />
      </div>
      <div className="text-center">
        <p className="text-[#ff4757] font-display font-semibold text-base mb-1">
          No incident found with that ID
        </p>
        <p className="text-[#8d9ee0] text-sm">
          "<span className="text-[#eef2ff]">{query}</span>" does not match any
          incident in the system.
        </p>
      </div>
    </motion.div>
  );
}

function SummaryCard({ incident }: { incident: Incident }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[#2a2f6b] p-4 mb-6"
      style={{ background: "rgba(26,31,58,0.8)" }}
    >
      <div className="flex flex-wrap items-start gap-3 mb-3">
        <div>
          <p className="text-xs text-[#8d9ee0] mb-0.5">Incident ID</p>
          <p className="font-mono text-sm font-semibold text-[#6b8cff]">
            {incident.id}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${SEVERITY_COLORS[incident.severity]}`}
          >
            {incident.severity.toUpperCase()}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border border-[#6b8cff]/40 bg-[#6b8cff]/10 text-[#6b8cff]">
            {TYPE_LABELS[incident.type_] ?? incident.type_}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-[#8d9ee0] mb-0.5">Status</p>
          <p className="text-[#eef2ff] capitalize font-medium">
            {STAGE_LABELS[incident.status] ?? incident.status}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#8d9ee0] mb-0.5">Users Affected</p>
          <p className="text-[#eef2ff] font-medium">
            {Number(incident.usersAffected).toLocaleString()}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-[#8d9ee0] mb-0.5">Hostnames / IPs</p>
          <div className="flex flex-wrap gap-1">
            {incident.hostnames.map((h) => (
              <span
                key={h}
                className="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-[#0a0e27] border border-[#2a2f6b] text-[#8d9ee0]"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface TimelineNodeProps {
  stage: IncidentStatus;
  stageIndex: number;
  currentIndex: number;
  timestamp: number | null;
  isLast: boolean;
}

function TimelineNode({
  stage,
  stageIndex,
  currentIndex,
  timestamp,
  isLast,
}: TimelineNodeProps) {
  const [expanded, setExpanded] = useState(stageIndex === currentIndex);

  const isCompleted = stageIndex < currentIndex;
  const isActive = stageIndex === currentIndex;
  const isFuture = stageIndex > currentIndex;

  const dotColor = isCompleted
    ? "bg-[#2de3a5] border-[#2de3a5]"
    : isActive
      ? "bg-[#6b8cff] border-[#6b8cff] shadow-[0_0_12px_rgba(107,140,255,0.6)]"
      : "bg-[#1a1f3a] border-[#2a2f6b]";

  const lineColor = isCompleted ? "bg-[#2de3a5]/50" : "bg-[#2a2f6b]";

  const Icon = STAGE_ICONS[stage];

  return (
    <div className="flex gap-4">
      {/* Left axis */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 z-10 transition-all duration-500 ${dotColor}`}
          data-ocid={`timeline-dot-${stage}`}
        />
        {!isLast && (
          <div
            className={`w-0.5 flex-1 mt-1 min-h-[48px] ${lineColor} transition-colors duration-500`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <button
          type="button"
          onClick={() => !isFuture && setExpanded((v) => !v)}
          disabled={isFuture}
          className={`w-full text-left group ${isFuture ? "cursor-default" : "cursor-pointer"}`}
          data-ocid={`timeline-node-${stage}`}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <Icon
              className={`w-4 h-4 flex-shrink-0 ${
                isFuture
                  ? "text-[#2a2f6b]"
                  : isActive
                    ? "text-[#6b8cff]"
                    : "text-[#2de3a5]"
              }`}
            />
            <span
              className={`text-sm font-semibold font-display ${
                isFuture
                  ? "text-[#2a2f6b]"
                  : isActive
                    ? "text-[#6b8cff]"
                    : "text-[#2de3a5]"
              }`}
            >
              {STAGE_LABELS[stage]}
            </span>
            {isActive && (
              <Badge className="ml-1 text-[10px] py-0 px-1.5 bg-[#6b8cff]/20 text-[#6b8cff] border-[#6b8cff]/40 border">
                ACTIVE
              </Badge>
            )}
            {!isFuture && (
              <span className="ml-auto text-[#2a2f6b] group-hover:text-[#8d9ee0] transition-colors">
                {expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 ml-6 text-xs text-[#8d9ee0]">
            <Clock className="w-3 h-3" />
            {timestamp ? (
              <span>{formatTs(timestamp)}</span>
            ) : (
              <span className="italic text-[#2a2f6b]">Pending</span>
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && !isFuture && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 ml-6 rounded-lg border border-[#2a2f6b] p-3 space-y-2"
                style={{ background: "rgba(10,14,39,0.6)" }}
              >
                <div className="flex items-start gap-2">
                  <User className="w-3.5 h-3.5 text-[#8d9ee0] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#eef2ff] leading-relaxed">
                    {ANALYST_COMMENTS[stage]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#8d9ee0] flex-shrink-0" />
                  <p className="text-xs text-[#8d9ee0]">
                    No evidence files attached at this stage.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TrackTimeline() {
  const incidents = useIncidentStore((s) => s.incidents);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const foundIncident: Incident | undefined = incidents.find(
    (i) => i.id.toLowerCase() === query.toLowerCase(),
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const currentIndex = foundIncident ? getStatusIndex(foundIncident.status) : 0;

  return (
    <div className="min-h-full text-[#eef2ff]">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#eef2ff] mb-1">
          Track &amp; Timeline
        </h1>
        <p className="text-sm text-[#8d9ee0]">
          Search an incident ID to view its investigation timeline and analyst
          updates.
        </p>
      </div>

      {/* Search Bar */}
      <div
        className="rounded-xl border border-[#2a2f6b] p-4 mb-6"
        style={{ background: "rgba(26,31,58,0.7)" }}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8d9ee0] pointer-events-none" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. INC-20260410-001"
              className="pl-9 bg-[#0a0e27] border-[#2a2f6b] text-[#eef2ff] placeholder:text-[#2a2f6b] focus:border-[#6b8cff] focus:ring-[#6b8cff]/20"
              data-ocid="timeline-search-input"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchInput.trim()}
            className="bg-[#6b8cff] hover:bg-[#6b8cff]/80 text-white font-semibold px-5 transition-all duration-200 disabled:opacity-50"
            data-ocid="timeline-search-btn"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {/* Quick search suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-[#8d9ee0] mr-1 self-center">Try:</span>
          {["INC-20260410-001", "INC-20260410-002", "INC-20260409-001"].map(
            (id) => (
              <button
                type="button"
                key={id}
                onClick={() => {
                  setSearchInput(id);
                  setQuery(id);
                }}
                className="text-xs font-mono px-2 py-0.5 rounded border border-[#2a2f6b] text-[#6b8cff] bg-[#0a0e27] hover:border-[#6b8cff]/50 transition-colors"
                data-ocid={`timeline-quick-${id}`}
              >
                {id}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Results area */}
      <AnimatePresence mode="wait">
        {!query ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ScanEmptyState />
          </motion.div>
        ) : !foundIncident ? (
          <motion.div
            key="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NotFoundState query={query} />
          </motion.div>
        ) : (
          <motion.div
            key={foundIncident.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Summary card */}
            <SummaryCard incident={foundIncident} />

            {/* Timeline */}
            <div
              className="rounded-xl border border-[#2a2f6b] p-5"
              style={{ background: "rgba(26,31,58,0.7)" }}
            >
              <h2 className="text-sm font-display font-semibold text-[#eef2ff] mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6b8cff]" />
                Investigation Timeline
              </h2>

              <div>
                {STAGES.map((stage, idx) => {
                  const ts = getStageTimestamp(foundIncident, idx);
                  return (
                    <TimelineNode
                      key={stage}
                      stage={stage}
                      stageIndex={idx}
                      currentIndex={currentIndex}
                      timestamp={ts}
                      isLast={idx === STAGES.length - 1}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
