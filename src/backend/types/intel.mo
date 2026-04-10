import Common "common";

module {
  public type IOC = {
    iocId : Common.IocId;
    iocType : Text;
    value : Text;
    severity : Text;
    addedAt : Common.Timestamp;
  };

  public type ThreatFeed = {
    feedId : Common.FeedId;
    title : Text;
    source : Text;
    severity : Text;
    publishedAt : Common.Timestamp;
    description : Text;
  };
};
