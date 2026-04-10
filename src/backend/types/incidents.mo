import Common "common";

module {
  public type AffectedSystem = {
    systemName : Text;
    systemType : Text;
    criticality : Text;
    compromiseDate : Text;
    detectionMethod : Text;
  };

  public type Incident = {
    id : Common.IncidentId;
    timestamp : Common.Timestamp;
    var status : Text;
    severity : Text;
    type_ : Text;
    hostnames : Text;
    userAccounts : Text;
    systems : Text;
    dataExposed : Text;
    usersAffected : Nat;
    businessImpact : Text;
    var qrCode : ?Text;
    var affectedSystems : [AffectedSystem];
  };

  public type IncidentView = {
    id : Common.IncidentId;
    timestamp : Common.Timestamp;
    status : Text;
    severity : Text;
    type_ : Text;
    hostnames : Text;
    userAccounts : Text;
    systems : Text;
    dataExposed : Text;
    usersAffected : Nat;
    businessImpact : Text;
    qrCode : ?Text;
    affectedSystems : [AffectedSystem];
  };

  public type CreateIncidentArgs = {
    id : Common.IncidentId;
    timestamp : Common.Timestamp;
    status : Text;
    severity : Text;
    type_ : Text;
    hostnames : Text;
    userAccounts : Text;
    systems : Text;
    dataExposed : Text;
    usersAffected : Nat;
    businessImpact : Text;
    qrCode : ?Text;
    affectedSystems : [AffectedSystem];
  };

  public type Stats = {
    incidentsToday : Nat;
    incidentsThisWeek : Nat;
    avgResponseMinutes : Float;
    criticalAlertCount : Nat;
  };
};
