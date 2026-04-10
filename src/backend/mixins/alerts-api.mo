import List "mo:core/List";
import AlertLib "../lib/alerts";
import AlertTypes "../types/alerts";
import Common "../types/common";

mixin (alerts : List.List<AlertTypes.Alert>) {
  public func createAlert(args : AlertTypes.CreateAlertArgs) : async () {
    AlertLib.create(alerts, args);
  };

  public query func listAlerts() : async [AlertTypes.AlertView] {
    AlertLib.list(alerts);
  };

  public func acknowledgeAlert(id : Common.AlertId) : async Bool {
    AlertLib.acknowledge(alerts, id);
  };

  public func markAlertFalsePositive(id : Common.AlertId) : async Bool {
    AlertLib.markFalsePositive(alerts, id);
  };

  public func linkAlertToIncident(alertId : Common.AlertId, incidentId : Common.IncidentId) : async Bool {
    AlertLib.linkIncident(alerts, alertId, incidentId);
  };
};
