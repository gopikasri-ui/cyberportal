import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/incidents";
import Common "../types/common";

module {
  public func toView(inc : Types.Incident) : Types.IncidentView {
    {
      id = inc.id;
      timestamp = inc.timestamp;
      status = inc.status;
      severity = inc.severity;
      type_ = inc.type_;
      hostnames = inc.hostnames;
      userAccounts = inc.userAccounts;
      systems = inc.systems;
      dataExposed = inc.dataExposed;
      usersAffected = inc.usersAffected;
      businessImpact = inc.businessImpact;
      qrCode = inc.qrCode;
      affectedSystems = inc.affectedSystems;
    };
  };

  public func create(
    incidents : List.List<Types.Incident>,
    args : Types.CreateIncidentArgs,
  ) {
    let inc : Types.Incident = {
      id = args.id;
      timestamp = args.timestamp;
      var status = args.status;
      severity = args.severity;
      type_ = args.type_;
      hostnames = args.hostnames;
      userAccounts = args.userAccounts;
      systems = args.systems;
      dataExposed = args.dataExposed;
      usersAffected = args.usersAffected;
      businessImpact = args.businessImpact;
      var qrCode = args.qrCode;
      var affectedSystems = args.affectedSystems;
    };
    incidents.add(inc);
  };

  public func get(
    incidents : List.List<Types.Incident>,
    id : Common.IncidentId,
  ) : ?Types.IncidentView {
    switch (incidents.find(func(inc : Types.Incident) : Bool { inc.id == id })) {
      case (?inc) ?toView(inc);
      case null null;
    };
  };

  public func list(incidents : List.List<Types.Incident>) : [Types.IncidentView] {
    let views = incidents.map<Types.Incident, Types.IncidentView>(func(inc) { toView(inc) });
    views.toArray();
  };

  public func updateStatus(
    incidents : List.List<Types.Incident>,
    id : Common.IncidentId,
    newStatus : Text,
  ) : Bool {
    switch (incidents.find(func(inc : Types.Incident) : Bool { inc.id == id })) {
      case (?inc) {
        inc.status := newStatus;
        true;
      };
      case null false;
    };
  };

  public func updateQrCode(
    incidents : List.List<Types.Incident>,
    id : Common.IncidentId,
    qrCode : Text,
  ) : Bool {
    switch (incidents.find(func(inc : Types.Incident) : Bool { inc.id == id })) {
      case (?inc) {
        inc.qrCode := ?qrCode;
        true;
      };
      case null false;
    };
  };

  public func delete(
    incidents : List.List<Types.Incident>,
    id : Common.IncidentId,
  ) : Bool {
    let sizeBefore = incidents.size();
    let filtered = incidents.filter(func(inc : Types.Incident) : Bool { inc.id != id });
    incidents.clear();
    incidents.append(filtered);
    incidents.size() < sizeBefore;
  };

  public func getStats(
    incidents : List.List<Types.Incident>,
    criticalAlertCount : Nat,
    nowNs : Int,
  ) : Types.Stats {
    let oneDayNs : Int = 86_400_000_000_000;
    let sevenDaysNs : Int = 7 * oneDayNs;
    let cutoffToday = nowNs - oneDayNs;
    let cutoffWeek = nowNs - sevenDaysNs;

    var todayCount : Nat = 0;
    var weekCount : Nat = 0;
    incidents.forEach(func(inc : Types.Incident) {
      if (inc.timestamp >= cutoffToday) { todayCount += 1 };
      if (inc.timestamp >= cutoffWeek) { weekCount += 1 };
    });

    {
      incidentsToday = todayCount;
      incidentsThisWeek = weekCount;
      avgResponseMinutes = 45.0;
      criticalAlertCount = criticalAlertCount;
    };
  };

  public func preload(incidents : List.List<Types.Incident>) {
    // Only seed if empty
    if (incidents.size() > 0) return;

    let now = Time.now();
    let oneDayNs : Int = 86_400_000_000_000;
    let twoDaysAgo = now - 2 * oneDayNs;
    let threeDaysAgo = now - 3 * oneDayNs;

    create(
      incidents,
      {
        id = "INC-20260410-001";
        timestamp = now - 3_600_000_000_000; // 1 hour ago
        status = "reported";
        severity = "high";
        type_ = "phishing";
        hostnames = "FIN-SRV-02, 192.168.1.4";
        userAccounts = "priya.m, admin-db";
        systems = "SAP Finance, CRM";
        dataExposed = "PII, Financial";
        usersAffected = 50;
        businessImpact = "Financial loss estimated at ₹2L due to credential compromise. SAP Finance access suspended pending investigation. CRM data integrity under review.";
        qrCode = null;
        affectedSystems = [
          {
            systemName = "Finance Server";
            systemType = "Server";
            criticality = "Critical";
            compromiseDate = "2026-04-09";
            detectionMethod = "IDS";
          },
          {
            systemName = "CRM Platform";
            systemType = "Cloud";
            criticality = "High";
            compromiseDate = "2026-04-09";
            detectionMethod = "Manual";
          },
        ];
      },
    );

    create(
      incidents,
      {
        id = "INC-20260409-002";
        timestamp = twoDaysAgo;
        status = "investigating";
        severity = "critical";
        type_ = "malware";
        hostnames = "WKS-HR-07, WKS-HR-08, 10.0.5.22";
        userAccounts = "ananya.r, suresh.k, backup-svc";
        systems = "HR Portal, Active Directory, File Share";
        dataExposed = "Credentials, PII";
        usersAffected = 220;
        businessImpact = "Ransomware variant detected on HR workstations. Lateral movement observed across subnet 10.0.5.0/24. Active Directory accounts locked as precautionary measure. HR operations halted.";
        qrCode = null;
        affectedSystems = [
          {
            systemName = "HR Workstation 07";
            systemType = "Workstation";
            criticality = "High";
            compromiseDate = "2026-04-08";
            detectionMethod = "AV";
          },
          {
            systemName = "Active Directory";
            systemType = "Server";
            criticality = "Critical";
            compromiseDate = "2026-04-08";
            detectionMethod = "IDS";
          },
        ];
      },
    );

    create(
      incidents,
      {
        id = "INC-20260408-003";
        timestamp = threeDaysAgo;
        status = "mitigating";
        severity = "medium";
        type_ = "breach";
        hostnames = "DB-PROD-01, 172.16.0.5";
        userAccounts = "db-admin, reporting-svc";
        systems = "Customer Database, Reporting Engine";
        dataExposed = "PII, Financial";
        usersAffected = 1400;
        businessImpact = "Unauthorised read access to customer records table detected via anomalous query patterns. Estimated 1,400 customer records potentially exposed. Reporting service credentials rotated. CERT-In notification being prepared.";
        qrCode = null;
        affectedSystems = [
          {
            systemName = "Production DB Server";
            systemType = "Server";
            criticality = "Critical";
            compromiseDate = "2026-04-07";
            detectionMethod = "Third-party";
          },
        ];
      },
    );
  };
};
