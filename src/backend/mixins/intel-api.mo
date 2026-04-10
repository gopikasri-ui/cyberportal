import List "mo:core/List";
import IntelLib "../lib/intel";
import IntelTypes "../types/intel";

mixin (
  iocs : List.List<IntelTypes.IOC>,
  feeds : List.List<IntelTypes.ThreatFeed>,
) {
  public query func listIOCs() : async [IntelTypes.IOC] {
    IntelLib.listIOCs(iocs);
  };

  public query func listThreatFeeds() : async [IntelTypes.ThreatFeed] {
    IntelLib.listThreatFeeds(feeds);
  };
};
