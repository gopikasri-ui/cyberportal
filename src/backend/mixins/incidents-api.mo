import List "mo:core/List";
import Time "mo:core/Time";
import IncidentLib "../lib/incidents";
import AlertLib "../lib/alerts";
import IncidentTypes "../types/incidents";
import AlertTypes "../types/alerts";
import Common "../types/common";

mixin (
  incidents : List.List<IncidentTypes.Incident>,
  alerts : List.List<AlertTypes.Alert>,
) {
  public func createIncident(args : IncidentTypes.CreateIncidentArgs) : async () {
    IncidentLib.create(incidents, args);
  };

  public query func getIncident(id : Common.IncidentId) : async ?IncidentTypes.IncidentView {
    IncidentLib.get(incidents, id);
  };

  public query func listIncidents() : async [IncidentTypes.IncidentView] {
    IncidentLib.list(incidents);
  };

  public func updateIncidentStatus(id : Common.IncidentId, newStatus : Text) : async Bool {
    IncidentLib.updateStatus(incidents, id, newStatus);
  };

  public func updateIncidentQrCode(id : Common.IncidentId, qrCode : Text) : async Bool {
    IncidentLib.updateQrCode(incidents, id, qrCode);
  };

  public func deleteIncident(id : Common.IncidentId) : async Bool {
    IncidentLib.delete(incidents, id);
  };

  public query func getStats() : async IncidentTypes.Stats {
    let criticalCount = AlertLib.countCritical(alerts);
    IncidentLib.getStats(incidents, criticalCount, Time.now());
  };
};
