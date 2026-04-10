import List "mo:core/List";
import IncidentTypes "types/incidents";
import AlertTypes "types/alerts";
import IntelTypes "types/intel";
import IncidentLib "lib/incidents";
import AlertLib "lib/alerts";
import IntelLib "lib/intel";
import IncidentsApi "mixins/incidents-api";
import AlertsApi "mixins/alerts-api";
import IntelApi "mixins/intel-api";

actor {
  let incidents = List.empty<IncidentTypes.Incident>();
  let alerts = List.empty<AlertTypes.Alert>();
  let iocs = List.empty<IntelTypes.IOC>();
  let feeds = List.empty<IntelTypes.ThreatFeed>();

  IncidentLib.preload(incidents);
  AlertLib.preload(alerts);
  IntelLib.preload(iocs, feeds);

  include IncidentsApi(incidents, alerts);
  include AlertsApi(alerts);
  include IntelApi(iocs, feeds);
};
