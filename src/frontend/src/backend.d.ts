import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AlertView {
    id: AlertId;
    title: string;
    incidentId?: IncidentId;
    source: string;
    falsePositive: boolean;
    description: string;
    acknowledged: boolean;
    timestamp: Timestamp;
    severity: string;
}
export type Timestamp = bigint;
export interface IncidentView {
    id: IncidentId;
    status: string;
    userAccounts: string;
    hostnames: string;
    businessImpact: string;
    type: string;
    dataExposed: string;
    systems: string;
    timestamp: Timestamp;
    affectedSystems: Array<AffectedSystem>;
    severity: string;
    usersAffected: bigint;
    qrCode?: string;
}
export type IncidentId = string;
export interface IOC {
    value: string;
    addedAt: Timestamp;
    iocType: string;
    severity: string;
    iocId: IocId;
}
export interface CreateAlertArgs {
    id: AlertId;
    title: string;
    source: string;
    description: string;
    timestamp: Timestamp;
    severity: string;
}
export type AlertId = string;
export interface ThreatFeed {
    title: string;
    source: string;
    feedId: FeedId;
    publishedAt: Timestamp;
    description: string;
    severity: string;
}
export interface Stats {
    avgResponseMinutes: number;
    incidentsThisWeek: bigint;
    incidentsToday: bigint;
    criticalAlertCount: bigint;
}
export interface AffectedSystem {
    criticality: string;
    compromiseDate: string;
    detectionMethod: string;
    systemName: string;
    systemType: string;
}
export type FeedId = string;
export interface CreateIncidentArgs {
    id: IncidentId;
    status: string;
    userAccounts: string;
    hostnames: string;
    businessImpact: string;
    type: string;
    dataExposed: string;
    systems: string;
    timestamp: Timestamp;
    affectedSystems: Array<AffectedSystem>;
    severity: string;
    usersAffected: bigint;
    qrCode?: string;
}
export type IocId = string;
export interface backendInterface {
    acknowledgeAlert(id: AlertId): Promise<boolean>;
    createAlert(args: CreateAlertArgs): Promise<void>;
    createIncident(args: CreateIncidentArgs): Promise<void>;
    deleteIncident(id: IncidentId): Promise<boolean>;
    getIncident(id: IncidentId): Promise<IncidentView | null>;
    getStats(): Promise<Stats>;
    linkAlertToIncident(alertId: AlertId, incidentId: IncidentId): Promise<boolean>;
    listAlerts(): Promise<Array<AlertView>>;
    listIOCs(): Promise<Array<IOC>>;
    listIncidents(): Promise<Array<IncidentView>>;
    listThreatFeeds(): Promise<Array<ThreatFeed>>;
    markAlertFalsePositive(id: AlertId): Promise<boolean>;
    updateIncidentQrCode(id: IncidentId, qrCode: string): Promise<boolean>;
    updateIncidentStatus(id: IncidentId, newStatus: string): Promise<boolean>;
}
