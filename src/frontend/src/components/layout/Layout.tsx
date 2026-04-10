import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid flex flex-col">
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — fixed on desktop, overlay on mobile */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar open={true} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile sidebar */}
        <div className="md:hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto" data-ocid="main-content">
          <div className="min-h-full p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
