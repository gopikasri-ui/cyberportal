import { useRouter } from "@tanstack/react-router";
import {
  Bell,
  FileWarning,
  GitBranch,
  LayoutDashboard,
  List,
  Shield,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import {
  selectUnacknowledgedCount,
  useIncidentStore,
} from "../../store/incidentStore";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: "new" | "count";
}

const OPERATIONS_NAV: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  {
    label: "Report Incident",
    path: "/report",
    icon: FileWarning,
    badge: "NEW",
    badgeType: "new",
  },
  { label: "All Incidents", path: "/incidents", icon: List },
  { label: "Track & Timeline", path: "/timeline", icon: GitBranch },
];

const INTEL_NAV: NavItem[] = [
  { label: "Threat Intel", path: "/threat-intel", icon: Shield },
  { label: "Alerts", path: "/alerts", icon: Bell, badgeType: "count" },
];

function NavItemComponent({
  item,
  isActive,
  alertCount,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  alertCount: number;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-smooth
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue
        ${
          isActive
            ? "bg-cyber-blue/15 text-white border border-cyber-blue/30 glow-blue-pulse"
            : "text-cyber-secondary hover:bg-white/5 hover:text-cyber-text border border-transparent"
        }
      `}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-cyber-blue" : "text-cyber-secondary"}`}
      />
      <span className="flex-1 text-sm font-medium font-body min-w-0 truncate">
        {item.label}
      </span>

      {/* NEW badge */}
      {item.badgeType === "new" && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-sm bg-cyber-green/20 text-cyber-green border border-cyber-green/40 flex-shrink-0">
          NEW
        </span>
      )}

      {/* Alert count badge */}
      {item.badgeType === "count" && alertCount > 0 && (
        <span className="min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-cyber-critical text-white flex items-center justify-center flex-shrink-0">
          {alertCount}
        </span>
      )}
    </button>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const alertCount = useIncidentStore(selectUnacknowledgedCount);
  const sidebarRef = useRef<HTMLElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Focus sidebar when opened on mobile
  useEffect(() => {
    if (open && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [open]);

  const handleNavigation = (path: string) => {
    void router.navigate({ to: path });
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        tabIndex={-1}
        data-ocid="sidebar"
        className={`
          glassmorphic-sidebar flex flex-col h-full
          md:static md:translate-x-0
          fixed top-0 left-0 z-50 w-64
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-cyber-border/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-cyber-blue/20 border border-cyber-blue/40 flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <title>CyberPortal</title>
                <path
                  d="M7 1L13 4V10L7 13L1 10V4L7 1Z"
                  stroke="#6b8cff"
                  strokeWidth="1.5"
                  fill="rgba(107,140,255,0.15)"
                />
                <path
                  d="M7 4L10 5.5V8.5L7 10L4 8.5V5.5L7 4Z"
                  fill="#6b8cff"
                  opacity="0.8"
                />
              </svg>
            </div>
            <span className="font-display font-bold text-sm text-cyber-text">
              Cyber<span className="text-cyber-blue">Portal</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded hover:bg-white/5 transition-smooth text-cyber-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyber-blue"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Operations section */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-cyber-secondary/60 font-body">
              Operations
            </p>
            <ul className="space-y-1">
              {OPERATIONS_NAV.map((item) => (
                <li key={item.path}>
                  <NavItemComponent
                    item={item}
                    isActive={isActive(item.path)}
                    alertCount={alertCount}
                    onClick={() => handleNavigation(item.path)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Intelligence section */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-cyber-secondary/60 font-body">
              Intelligence
            </p>
            <ul className="space-y-1">
              {INTEL_NAV.map((item) => (
                <li key={item.path}>
                  <NavItemComponent
                    item={item}
                    isActive={isActive(item.path)}
                    alertCount={alertCount}
                    onClick={() => handleNavigation(item.path)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sidebar footer — SOC status */}
        <div className="px-4 py-3 border-t border-cyber-border/50">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyber-green/5 border border-cyber-green/20">
            <span className="pulse-dot w-2 h-2 rounded-full bg-cyber-green flex-shrink-0" />
            <span className="text-xs text-cyber-secondary font-body">
              SOC <span className="text-cyber-green font-medium">Active</span>
            </span>
            <span className="ml-auto text-[10px] text-cyber-secondary/50">
              24/7
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
