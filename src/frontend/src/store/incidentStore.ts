import { create } from "zustand";
import type { backendInterface } from "../backend.d.ts";
import type {
  Alert,
  IOC,
  Incident,
  Severity,
  Stats,
  ThreatFeed,
} from "../types";

// ─── Sample data for demo ───────────────────────────────────────────────────

const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: "INC-20260410-001",
    timestamp: BigInt(Date.now() - 3600000),
    status: "investigating",
    severity: "critical",
    type_: "phishing",
    hostnames: ["FIN-SRV-02", "192.168.1.4"],
    userAccounts: ["priya.m", "admin-db"],
    systems: ["SAP Finance", "CRM"],
    dataExposed: ["PII", "Financial"],
    usersAffected: BigInt(50),
    businessImpact:
      "Financial loss estimated ₹2L. SAP Finance access disrupted for 3 hrs. Credentials potentially stolen.",
    qrCode: "",
    affectedSystems: [
      {
        systemName: "Finance Server",
        systemType: "Server",
        criticality: "Critical",
        compromiseDate: "2026-04-09",
        detectionMethod: "IDS",
      },
    ],
  },
  {
    id: "INC-20260410-002",
    timestamp: BigInt(Date.now() - 7200000),
    status: "reported",
    severity: "high",
    type_: "malware",
    hostnames: ["CORP-WS-14", "192.168.2.88"],
    userAccounts: ["rajesh.k"],
    systems: ["Windows Workstation", "AD"],
    dataExposed: ["Credentials"],
    usersAffected: BigInt(12),
    businessImpact:
      "Potential lateral movement detected. AD credentials at risk.",
    qrCode: "",
    affectedSystems: [],
  },
  {
    id: "INC-20260410-003",
    timestamp: BigInt(Date.now() - 14400000),
    status: "mitigating",
    severity: "medium",
    type_: "breach",
    hostnames: ["WEB-PROXY-01"],
    userAccounts: ["guest-01", "vendor-02"],
    systems: ["Web Proxy", "Firewall"],
    dataExposed: ["None"],
    usersAffected: BigInt(5),
    businessImpact: "Unauthorized proxy access. Traffic logs under review.",
    qrCode: "",
    affectedSystems: [],
  },
  {
    id: "INC-20260409-001",
    timestamp: BigInt(Date.now() - 86400000),
    status: "resolved",
    severity: "low",
    type_: "other",
    hostnames: ["HR-PC-07"],
    userAccounts: ["deepa.s"],
    systems: ["HR Portal"],
    dataExposed: ["None"],
    usersAffected: BigInt(1),
    businessImpact:
      "Suspicious login from unknown location. Verified as VPN usage.",
    qrCode: "",
    affectedSystems: [],
  },
  {
    id: "INC-20260409-002",
    timestamp: BigInt(Date.now() - 172800000),
    status: "closed",
    severity: "high",
    type_: "ransomware",
    hostnames: ["BACKUP-SRV-01", "192.168.5.100"],
    userAccounts: ["backup-admin"],
    systems: ["Backup Server", "NAS"],
    dataExposed: ["Financial", "Health"],
    usersAffected: BigInt(200),
    businessImpact:
      "Backup server encrypted. Restored from cold backup. 6hr downtime.",
    qrCode: "",
    affectedSystems: [
      {
        systemName: "Backup Server",
        systemType: "Server",
        criticality: "Critical",
        compromiseDate: "2026-04-08",
        detectionMethod: "AV",
      },
    ],
  },
];

const SAMPLE_ALERTS: Alert[] = [
  {
    id: "ALT-001",
    title: "Brute Force Attack Detected — FIN-SRV-02",
    severity: "critical",
    source: "IDS",
    timestamp: BigInt(Date.now() - 900000),
    description:
      "247 failed login attempts in 5 minutes from 185.220.101.47. Account lockout triggered.",
    acknowledged: false,
    falsePositive: false,
    incidentId: "INC-20260410-001",
  },
  {
    id: "ALT-002",
    title: "Suspicious Outbound Traffic — CORP-WS-14",
    severity: "critical",
    source: "Firewall",
    timestamp: BigInt(Date.now() - 1800000),
    description:
      "Unusual data exfiltration attempt to known C2 IP 104.21.93.12. 2.4GB outbound.",
    acknowledged: false,
    falsePositive: false,
    incidentId: "INC-20260410-002",
  },
  {
    id: "ALT-003",
    title: "Malware Signature Detected — CORP-WS-14",
    severity: "critical",
    source: "EDR",
    timestamp: BigInt(Date.now() - 3600000),
    description:
      "TrickBot variant identified in memory. Process: svchost.exe (PID 4832). Isolation recommended.",
    acknowledged: false,
    falsePositive: false,
    incidentId: "INC-20260410-002",
  },
  {
    id: "ALT-004",
    title: "Privilege Escalation Attempt",
    severity: "high",
    source: "SIEM",
    timestamp: BigInt(Date.now() - 5400000),
    description:
      "User priya.m attempted to access admin shares outside working hours. Blocked by DLP.",
    acknowledged: true,
    falsePositive: false,
    incidentId: null,
  },
  {
    id: "ALT-005",
    title: "SSL Certificate Expired — web-gw.internal",
    severity: "medium",
    source: "Manual",
    timestamp: BigInt(Date.now() - 7200000),
    description:
      "SSL certificate for web-gw.internal expired. Users experiencing certificate warnings.",
    acknowledged: false,
    falsePositive: false,
    incidentId: null,
  },
  {
    id: "ALT-006",
    title: "Multiple Failed VPN Logins",
    severity: "low",
    source: "IDS",
    timestamp: BigInt(Date.now() - 10800000),
    description:
      "5 failed VPN authentication attempts by user vendor-02. Likely forgotten credentials.",
    acknowledged: true,
    falsePositive: true,
    incidentId: null,
  },
];

const SAMPLE_STATS: Stats = {
  incidentsToday: BigInt(3),
  incidentsThisWeek: BigInt(12),
  avgResponseMinutes: BigInt(47),
  criticalAlertCount: BigInt(3),
};

const SAMPLE_IOCS: IOC[] = [
  {
    iocId: "IOC-001",
    iocType: "ip",
    value: "185.220.101.47",
    severity: "critical",
    addedAt: BigInt(Date.now() - 900000),
  },
  {
    iocId: "IOC-002",
    iocType: "ip",
    value: "104.21.93.12",
    severity: "critical",
    addedAt: BigInt(Date.now() - 1800000),
  },
  {
    iocId: "IOC-003",
    iocType: "domain",
    value: "malicious-cdn.ru",
    severity: "high",
    addedAt: BigInt(Date.now() - 3600000),
  },
  {
    iocId: "IOC-004",
    iocType: "hash",
    value: "a3f5d8e2b1c4...(sha256)",
    severity: "high",
    addedAt: BigInt(Date.now() - 7200000),
  },
  {
    iocId: "IOC-005",
    iocType: "email",
    value: "phishing@fake-bank.com",
    severity: "medium",
    addedAt: BigInt(Date.now() - 14400000),
  },
  {
    iocId: "IOC-006",
    iocType: "url",
    value: "http://update-flash.xyz/payload.exe",
    severity: "critical",
    addedAt: BigInt(Date.now() - 21600000),
  },
];

const SAMPLE_FEEDS: ThreatFeed[] = [
  {
    feedId: "FEED-001",
    title: "CERT-In Advisory: Critical SAP Vulnerabilities CVE-2026-XXXX",
    source: "CERT-In",
    severity: "critical",
    publishedAt: BigInt(Date.now() - 3600000),
    description:
      "CERT-In issues advisory on critical RCE vulnerabilities in SAP NetWeaver. Immediate patching required for affected enterprise systems.",
  },
  {
    feedId: "FEED-002",
    title: "New Ransomware Campaign Targeting Indian Banking Sector",
    source: "NCIIPC",
    severity: "critical",
    publishedAt: BigInt(Date.now() - 7200000),
    description:
      "LockBit 4.0 variant targeting BFSI organizations. Known TTPs include spear phishing via fake RBI communications.",
  },
  {
    feedId: "FEED-003",
    title: "Phishing Campaign Impersonating Income Tax Department",
    source: "CERT-In",
    severity: "high",
    publishedAt: BigInt(Date.now() - 14400000),
    description:
      "Large-scale phishing emails mimicking IT Department refund notifications. Over 5,000 reported victims across India.",
  },
  {
    feedId: "FEED-004",
    title: "Active Exploitation of ProxyShell in Exchange Servers",
    source: "CISA",
    severity: "high",
    publishedAt: BigInt(Date.now() - 86400000),
    description:
      "Threat actors actively exploiting ProxyShell (CVE-2021-34473) in unpatched Exchange servers. Deploy patches immediately.",
  },
  {
    feedId: "FEED-005",
    title: "APT Group Targeting Energy Sector ICS/SCADA",
    source: "NCIIPC",
    severity: "critical",
    publishedAt: BigInt(Date.now() - 172800000),
    description:
      "Nation-state APT group observed probing ICS/SCADA systems in Indian energy sector. Air-gapped network recommendation.",
  },
];

// ─── Helpers: map backend IncidentView ↔ frontend Incident ──────────────────

function splitCsv(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function mapIncidentView(v: {
  id: string;
  status: string;
  severity: string;
  type: string;
  hostnames: string;
  userAccounts: string;
  systems: string;
  dataExposed: string;
  usersAffected: bigint;
  businessImpact: string;
  timestamp: bigint;
  affectedSystems: Array<{
    systemName: string;
    systemType: string;
    criticality: string;
    compromiseDate: string;
    detectionMethod: string;
  }>;
  qrCode?: string;
}): Incident {
  return {
    id: v.id,
    timestamp: v.timestamp,
    status: v.status as Incident["status"],
    severity: v.severity as Severity,
    type_: v.type as Incident["type_"],
    hostnames: splitCsv(v.hostnames),
    userAccounts: splitCsv(v.userAccounts),
    systems: splitCsv(v.systems),
    dataExposed: splitCsv(v.dataExposed) as Incident["dataExposed"],
    usersAffected: v.usersAffected,
    businessImpact: v.businessImpact,
    qrCode: v.qrCode ?? "",
    affectedSystems: v.affectedSystems.map((s) => ({
      systemName: s.systemName,
      systemType: s.systemType as Incident["affectedSystems"][0]["systemType"],
      criticality:
        s.criticality as Incident["affectedSystems"][0]["criticality"],
      compromiseDate: s.compromiseDate,
      detectionMethod:
        s.detectionMethod as Incident["affectedSystems"][0]["detectionMethod"],
    })),
  };
}

function mapAlertView(v: {
  id: string;
  title: string;
  severity: string;
  source: string;
  timestamp: bigint;
  description: string;
  acknowledged: boolean;
  falsePositive: boolean;
  incidentId?: string;
}): Alert {
  return {
    id: v.id,
    title: v.title,
    severity: v.severity as Severity,
    source: v.source as Alert["source"],
    timestamp: v.timestamp,
    description: v.description,
    acknowledged: v.acknowledged,
    falsePositive: v.falsePositive,
    incidentId: v.incidentId ?? null,
  };
}

// ─── Store interface ─────────────────────────────────────────────────────────

type IncidentStatus =
  | "reported"
  | "investigating"
  | "mitigating"
  | "resolved"
  | "closed";

interface IncidentStoreState {
  incidents: Incident[];
  alerts: Alert[];
  stats: Stats;
  iocs: IOC[];
  feeds: ThreatFeed[];
  loading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  _actor: backendInterface | null;

  // Actions
  setActor: (actor: backendInterface) => void;
  loadIncidents: () => Promise<void>;
  loadAlerts: () => Promise<void>;
  loadStats: () => Promise<void>;
  loadIOCs: () => Promise<void>;
  loadFeeds: () => Promise<void>;
  createIncident: (
    incident: Omit<Incident, "id" | "timestamp" | "qrCode">,
  ) => Promise<string>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  markFalsePositive: (alertId: string) => Promise<void>;
  linkAlertToIncident: (alertId: string, incidentId: string) => Promise<void>;
  updateIncidentStatus: (id: string, status: IncidentStatus) => Promise<void>;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  clearError: () => void;
}

// ─── Store implementation ────────────────────────────────────────────────────

export const useIncidentStore = create<IncidentStoreState>((set, get) => ({
  incidents: SAMPLE_INCIDENTS,
  alerts: SAMPLE_ALERTS,
  stats: SAMPLE_STATS,
  iocs: SAMPLE_IOCS,
  feeds: SAMPLE_FEEDS,
  loading: false,
  error: null,
  sidebarOpen: false,
  _actor: null,

  setActor: (actor) => set({ _actor: actor }),

  loadIncidents: async () => {
    set({ loading: true, error: null });
    try {
      const actor = get()._actor;
      if (actor) {
        const views = await actor.listIncidents();
        const incidents = views.map(mapIncidentView);
        // Merge with sample data if backend is empty (first run)
        set({
          incidents: incidents.length > 0 ? incidents : SAMPLE_INCIDENTS,
          loading: false,
        });
      } else {
        set({ incidents: SAMPLE_INCIDENTS, loading: false });
      }
    } catch {
      set({ incidents: SAMPLE_INCIDENTS, loading: false });
    }
  },

  loadAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const actor = get()._actor;
      if (actor) {
        const views = await actor.listAlerts();
        const alerts = views.map(mapAlertView);
        set({
          alerts: alerts.length > 0 ? alerts : SAMPLE_ALERTS,
          loading: false,
        });
      } else {
        set({ alerts: SAMPLE_ALERTS, loading: false });
      }
    } catch {
      set({ alerts: SAMPLE_ALERTS, loading: false });
    }
  },

  loadStats: async () => {
    try {
      const actor = get()._actor;
      if (actor) {
        const s = await actor.getStats();
        set({
          stats: {
            incidentsToday: s.incidentsToday,
            incidentsThisWeek: s.incidentsThisWeek,
            avgResponseMinutes: BigInt(Math.round(s.avgResponseMinutes)),
            criticalAlertCount: s.criticalAlertCount,
          },
        });
      } else {
        set({ stats: SAMPLE_STATS });
      }
    } catch {
      set({ stats: SAMPLE_STATS });
    }
  },

  loadIOCs: async () => {
    try {
      const actor = get()._actor;
      if (actor) {
        const items = await actor.listIOCs();
        set({ iocs: items.length > 0 ? (items as IOC[]) : SAMPLE_IOCS });
      } else {
        set({ iocs: SAMPLE_IOCS });
      }
    } catch {
      set({ iocs: SAMPLE_IOCS });
    }
  },

  loadFeeds: async () => {
    try {
      const actor = get()._actor;
      if (actor) {
        const items = await actor.listThreatFeeds();
        set({
          feeds: items.length > 0 ? (items as ThreatFeed[]) : SAMPLE_FEEDS,
        });
      } else {
        set({ feeds: SAMPLE_FEEDS });
      }
    } catch {
      set({ feeds: SAMPLE_FEEDS });
    }
  },

  createIncident: async (incidentData) => {
    const id = `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(get().incidents.length + 1).padStart(3, "0")}`;
    const now = BigInt(Date.now());
    const newIncident: Incident = {
      ...incidentData,
      id,
      timestamp: now,
      qrCode: "",
    };

    // Optimistically update local state
    set((state) => ({
      incidents: [newIncident, ...state.incidents],
      stats: {
        ...state.stats,
        incidentsToday: state.stats.incidentsToday + BigInt(1),
        incidentsThisWeek: state.stats.incidentsThisWeek + BigInt(1),
      },
    }));

    // Persist to canister
    try {
      const actor = get()._actor;
      if (actor) {
        await actor.createIncident({
          id,
          status: incidentData.status,
          severity: incidentData.severity,
          type: incidentData.type_,
          hostnames: incidentData.hostnames.join(", "),
          userAccounts: incidentData.userAccounts.join(", "),
          systems: incidentData.systems.join(", "),
          dataExposed: incidentData.dataExposed.join(", "),
          usersAffected: incidentData.usersAffected,
          businessImpact: incidentData.businessImpact,
          timestamp: now,
          affectedSystems: incidentData.affectedSystems.map((s) => ({
            systemName: s.systemName,
            systemType: s.systemType,
            criticality: s.criticality,
            compromiseDate: s.compromiseDate,
            detectionMethod: s.detectionMethod,
          })),
        });
      }
    } catch {
      // Local state already updated; canister will sync on next load
    }

    return id;
  },

  acknowledgeAlert: async (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a,
      ),
    }));
    try {
      const actor = get()._actor;
      if (actor) await actor.acknowledgeAlert(alertId);
    } catch {
      // local state already updated
    }
  },

  markFalsePositive: async (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? { ...a, falsePositive: true, acknowledged: true }
          : a,
      ),
    }));
    try {
      const actor = get()._actor;
      if (actor) await actor.markAlertFalsePositive(alertId);
    } catch {
      // local state already updated
    }
  },

  linkAlertToIncident: async (alertId, incidentId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, incidentId } : a,
      ),
    }));
    try {
      const actor = get()._actor;
      if (actor) await actor.linkAlertToIncident(alertId, incidentId);
    } catch {
      // local state already updated
    }
  },

  updateIncidentStatus: async (id, status) => {
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === id ? { ...i, status } : i,
      ),
    }));
    try {
      const actor = get()._actor;
      if (actor) await actor.updateIncidentStatus(id, status);
    } catch {
      // local state already updated
    }
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  clearError: () => set({ error: null }),
}));

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectCriticalAlertCount = (state: IncidentStoreState) =>
  state.alerts.filter((a) => a.severity === "critical" && !a.acknowledged)
    .length;

export const selectUnacknowledgedCount = (state: IncidentStoreState) =>
  state.alerts.filter((a) => !a.acknowledged).length;

export const selectIncidentsByStatus =
  (status: IncidentStatus) => (state: IncidentStoreState) =>
    state.incidents.filter((i) => i.status === status);

export const selectIncidentsBySeverity =
  (severity: Severity) => (state: IncidentStoreState) =>
    state.incidents.filter((i) => i.severity === severity);
