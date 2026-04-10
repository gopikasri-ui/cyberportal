import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/intel";

module {
  public func listIOCs(iocs : List.List<Types.IOC>) : [Types.IOC] {
    iocs.toArray();
  };

  public func listThreatFeeds(feeds : List.List<Types.ThreatFeed>) : [Types.ThreatFeed] {
    feeds.toArray();
  };

  public func preload(
    iocs : List.List<Types.IOC>,
    feeds : List.List<Types.ThreatFeed>,
  ) {
    if (iocs.size() > 0) return;

    let now = Time.now();
    let oneDayNs : Int = 86_400_000_000_000;

    // 5 IOC entries — mix of IPs, domains, hashes
    iocs.add({
      iocId = "IOC-001";
      iocType = "IP";
      value = "185.220.101.47";
      severity = "critical";
      addedAt = now - oneDayNs;
    });

    iocs.add({
      iocId = "IOC-002";
      iocType = "Domain";
      value = "malware-c2.ru";
      severity = "high";
      addedAt = now - 2 * oneDayNs;
    });

    iocs.add({
      iocId = "IOC-003";
      iocType = "Hash";
      value = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      severity = "critical";
      addedAt = now - oneDayNs;
    });

    iocs.add({
      iocId = "IOC-004";
      iocType = "IP";
      value = "91.108.4.100";
      severity = "high";
      addedAt = now - 3 * oneDayNs;
    });

    iocs.add({
      iocId = "IOC-005";
      iocType = "Domain";
      value = "phish-login.xyz";
      severity = "medium";
      addedAt = now - 4 * oneDayNs;
    });

    // 5 threat feed items from CERT-In / NCSC
    feeds.add({
      feedId = "FEED-001";
      title = "CERT-In Advisory: LockBit 3.0 Targeting Indian Finance Sector";
      source = "CERT-In";
      severity = "critical";
      publishedAt = now - oneDayNs;
      description = "CERT-In has observed active LockBit 3.0 campaigns targeting financial institutions. Attackers exploit unpatched VMware ESXi vulnerabilities (CVE-2021-22005) for initial access.";
    });

    feeds.add({
      feedId = "FEED-002";
      title = "NCSC Alert: Phishing Campaign Spoofing UIDAI Aadhaar Portal";
      source = "NCSC";
      severity = "high";
      publishedAt = now - 2 * oneDayNs;
      description = "Large-scale phishing campaign impersonating UIDAI. Malicious emails with subject 'Your Aadhaar Linked Mobile Update Required' harvesting credentials. IOCs shared in advisory.";
    });

    feeds.add({
      feedId = "FEED-003";
      title = "CERT-In: Supply Chain Attack via Malicious npm Packages";
      source = "CERT-In";
      severity = "high";
      publishedAt = now - 3 * oneDayNs;
      description = "Trojanised npm packages discovered exfiltrating environment variables. Affected packages: colors2, faker-js-extra. Developers advised to audit package.json dependencies immediately.";
    });

    feeds.add({
      feedId = "FEED-004";
      title = "NCSC: Critical RCE in Apache Log4j2 Active Exploitation";
      source = "NCSC";
      severity = "critical";
      publishedAt = now - 4 * oneDayNs;
      description = "Renewed exploitation of Log4Shell (CVE-2021-44228) observed targeting government and PSU infrastructure. Patch to Log4j2 2.17.1+ immediately. JNDI lookups should be disabled.";
    });

    feeds.add({
      feedId = "FEED-005";
      title = "CERT-In: Emotet Resurgence Targeting Corporate Email Systems";
      source = "CERT-In";
      severity = "medium";
      publishedAt = now - 5 * oneDayNs;
      description = "Emotet botnet resurgence detected with new evasion techniques. Delivered via malicious macro-enabled Excel attachments in invoice-themed emails. Network IOCs appended.";
    });
  };
};
