import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/alerts";
import Common "../types/common";

module {
  public func toView(alert : Types.Alert) : Types.AlertView {
    {
      id = alert.id;
      title = alert.title;
      severity = alert.severity;
      source = alert.source;
      timestamp = alert.timestamp;
      description = alert.description;
      acknowledged = alert.acknowledged;
      falsePositive = alert.falsePositive;
      incidentId = alert.incidentId;
    };
  };

  public func create(
    alerts : List.List<Types.Alert>,
    args : Types.CreateAlertArgs,
  ) {
    let alert : Types.Alert = {
      id = args.id;
      title = args.title;
      severity = args.severity;
      source = args.source;
      timestamp = args.timestamp;
      description = args.description;
      var acknowledged = false;
      var falsePositive = false;
      var incidentId = null;
    };
    alerts.add(alert);
  };

  public func list(alerts : List.List<Types.Alert>) : [Types.AlertView] {
    let views = alerts.map<Types.Alert, Types.AlertView>(func(a) { toView(a) });
    views.toArray();
  };

  public func acknowledge(
    alerts : List.List<Types.Alert>,
    id : Common.AlertId,
  ) : Bool {
    switch (alerts.find(func(a : Types.Alert) : Bool { a.id == id })) {
      case (?alert) {
        alert.acknowledged := true;
        true;
      };
      case null false;
    };
  };

  public func markFalsePositive(
    alerts : List.List<Types.Alert>,
    id : Common.AlertId,
  ) : Bool {
    switch (alerts.find(func(a : Types.Alert) : Bool { a.id == id })) {
      case (?alert) {
        alert.falsePositive := true;
        true;
      };
      case null false;
    };
  };

  public func linkIncident(
    alerts : List.List<Types.Alert>,
    alertId : Common.AlertId,
    incidentId : Common.IncidentId,
  ) : Bool {
    switch (alerts.find(func(a : Types.Alert) : Bool { a.id == alertId })) {
      case (?alert) {
        alert.incidentId := ?incidentId;
        true;
      };
      case null false;
    };
  };

  public func countCritical(alerts : List.List<Types.Alert>) : Nat {
    var count : Nat = 0;
    alerts.forEach(func(a : Types.Alert) {
      if (a.severity == "critical") { count += 1 };
    });
    count;
  };

  public func preload(alerts : List.List<Types.Alert>) {
    if (alerts.size() > 0) return;

    let now = Time.now();
    let oneHourNs : Int = 3_600_000_000_000;

    create(
      alerts,
      {
        id = "ALT-001";
        title = "Suspicious Login Attempt";
        severity = "critical";
        source = "IDS";
        timestamp = now - oneHourNs;
        description = "Multiple failed logins from unknown IP 185.220.101.47 targeting admin accounts across 3 systems. Possible brute-force or credential stuffing attack detected.";
      },
    );

    create(
      alerts,
      {
        id = "ALT-002";
        title = "Anomalous Data Exfiltration";
        severity = "critical";
        source = "DLP";
        timestamp = now - 2 * oneHourNs;
        description = "Unusual outbound data transfer of 4.7 GB detected from DB-PROD-01 to external IP 91.108.4.0/22. Transfer initiated by service account reporting-svc outside business hours.";
      },
    );

    create(
      alerts,
      {
        id = "ALT-003";
        title = "Ransomware Signature Detected";
        severity = "critical";
        source = "AV";
        timestamp = now - 3 * oneHourNs;
        description = "ESET AV detected LockBit 3.0 ransomware signature on WKS-HR-07. Executable dropped in %APPDATA%\\Temp\\svchost32.exe. Host isolated from network automatically.";
      },
    );
  };
};
