import Common "common";

module {
  public type Alert = {
    id : Common.AlertId;
    title : Text;
    severity : Text;
    source : Text;
    timestamp : Common.Timestamp;
    description : Text;
    var acknowledged : Bool;
    var falsePositive : Bool;
    var incidentId : ?Common.IncidentId;
  };

  public type AlertView = {
    id : Common.AlertId;
    title : Text;
    severity : Text;
    source : Text;
    timestamp : Common.Timestamp;
    description : Text;
    acknowledged : Bool;
    falsePositive : Bool;
    incidentId : ?Common.IncidentId;
  };

  public type CreateAlertArgs = {
    id : Common.AlertId;
    title : Text;
    severity : Text;
    source : Text;
    timestamp : Common.Timestamp;
    description : Text;
  };
};
