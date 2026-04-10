// Types for CyberPortal incident management system

export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentStatus =
  | "reported"
  | "investigating"
  | "mitigating"
  | "resolved"
  | "closed";
export type IncidentType =
  | "phishing"
  | "malware"
  | "breach"
  | "ransomware"
  | "ddos"
  | "insider"
  | "other";
export type DataExposedType =
  | "PII"
  | "Financial"
  | "Health"
  | "Credentials"
  | "None";
export type SystemType =
  | "Server"
  | "Workstation"
  | "Cloud"
  | "Network"
  | "Endpoint"
  | "Database";
export type DetectionMethod =
  | "IDS"
  | "AV"
  | "Manual"
  | "Third-party"
  | "SIEM"
  | "EDR";
export type Criticality = "Low" | "Medium" | "High" | "Critical";
export type AlertSource =
  | "IDS"
  | "SIEM"
  | "EDR"
  | "Firewall"
  | "Email"
  | "Manual"
  | "Third-party";
export type IOCType = "ip" | "domain" | "hash" | "url" | "email" | "filename";

export interface AffectedSystem {
  systemName: string;
  systemType: SystemType;
  criticality: Criticality;
  compromiseDate: string;
  detectionMethod: DetectionMethod;
}

export interface Incident {
  id: string;
  timestamp: bigint;
  status: IncidentStatus;
  severity: Severity;
  type_: IncidentType;
  hostnames: string[];
  userAccounts: string[];
  systems: string[];
  dataExposed: DataExposedType[];
  usersAffected: bigint;
  businessImpact: string;
  qrCode: string;
  affectedSystems: AffectedSystem[];
}

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  source: AlertSource;
  timestamp: bigint;
  description: string;
  acknowledged: boolean;
  falsePositive: boolean;
  incidentId: string | null;
}

export interface IOC {
  iocId: string;
  iocType: IOCType;
  value: string;
  severity: Severity;
  addedAt: bigint;
}

export interface ThreatFeed {
  feedId: string;
  title: string;
  source: string;
  severity: Severity;
  publishedAt: bigint;
  description: string;
}

export interface Stats {
  incidentsToday: bigint;
  incidentsThisWeek: bigint;
  avgResponseMinutes: bigint;
  criticalAlertCount: bigint;
}

// Form types for the incident report form
export interface IncidentFormDetails {
  hostnames: string;
  userAccounts: string;
  systems: string;
  dataExposed: DataExposedType;
  usersAffected: number;
  businessImpact: string;
}

export interface IncidentFormSystem {
  systemName: string;
  systemType: SystemType;
  criticality: Criticality;
  compromiseDate: string;
  detectionMethod: DetectionMethod;
}

export interface IncidentFormData {
  type_: IncidentType;
  severity: Severity;
  details: IncidentFormDetails;
  affectedSystems: IncidentFormSystem[];
  evidenceFiles: File[];
}

// Timeline event
export interface TimelineEvent {
  id: string;
  status: IncidentStatus;
  timestamp: number;
  analyst: string;
  comment: string;
}
