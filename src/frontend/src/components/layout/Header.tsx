import { Bell, Menu } from "lucide-react";
import {
  selectCriticalAlertCount,
  useIncidentStore,
} from "../../store/incidentStore";

interface HeaderProps {
  onMenuToggle: () => void;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const criticalCount = useIncidentStore(selectCriticalAlertCount);
  const today = formatDate(new Date());

  return (
    <header
      className="glassmorphic-header sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 h-14"
      data-ocid="header"
    >
      {/* Left: hamburger + branding */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded-md hover:bg-white/5 transition-smooth text-cyber-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue"
          aria-label="Toggle sidebar"
          data-ocid="header-menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo mark */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-cyber-blue/20 border border-cyber-blue/40 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-label="CyberPortal logo"
              >
                <title>CyberPortal logo</title>
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
          </div>
          <span className="font-display font-bold text-lg text-cyber-text tracking-tight">
            Cyber<span className="text-cyber-blue">Portal</span>
          </span>
        </div>
      </div>

      {/* Center: SOC status + date */}
      <div className="hidden sm:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <span className="pulse-dot w-2 h-2 rounded-full bg-cyber-green flex-shrink-0" />
        <span className="text-sm font-medium text-cyber-secondary font-body">
          SOC Live — <span className="text-cyber-text">{today}</span>
        </span>
      </div>

      {/* Right: alerts badge + analyst */}
      <div className="flex items-center gap-3">
        {/* Critical alerts bell */}
        <button
          type="button"
          className="relative p-2 rounded-md hover:bg-white/5 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue"
          aria-label={`${criticalCount} critical alerts`}
          data-ocid="header-alerts-bell"
        >
          <Bell className="w-5 h-5 text-cyber-secondary" />
          {criticalCount > 0 && (
            <span
              className="pulse-critical absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-cyber-critical text-white text-[10px] font-bold flex items-center justify-center px-1"
              data-ocid="header-critical-badge"
            >
              {criticalCount}
            </span>
          )}
        </button>

        {/* Analyst badge */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md glassmorphic-card"
          data-ocid="header-analyst"
        >
          <div className="w-6 h-6 rounded-full bg-cyber-blue/30 border border-cyber-blue/50 flex items-center justify-center text-[10px] font-bold text-cyber-blue flex-shrink-0">
            MS
          </div>
          <span className="text-xs text-cyber-secondary font-body">
            Analyst:{" "}
            <span className="text-cyber-text font-medium">Meena S.</span>
          </span>
        </div>
      </div>
    </header>
  );
}
