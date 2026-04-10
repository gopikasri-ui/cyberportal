import { useActor } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { createActor } from "./backend";
import { Layout } from "./components/layout/Layout";
import { useIncidentStore } from "./store/incidentStore";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ReportIncident = lazy(() => import("./pages/ReportIncident"));
const AllIncidents = lazy(() => import("./pages/AllIncidents"));
const TrackTimeline = lazy(() => import("./pages/TrackTimeline"));
const ThreatIntel = lazy(() => import("./pages/ThreatIntel"));
const AlertsPage = lazy(() => import("./pages/Alerts"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyber-blue/30 border-t-cyber-blue animate-spin" />
        <span className="text-xs text-cyber-secondary font-body">
          Loading...
        </span>
      </div>
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <AppInitializer>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Layout>
    </AppInitializer>
  ),
});

function AppInitializer({ children }: { children: React.ReactNode }) {
  const {
    loadIncidents,
    loadAlerts,
    loadStats,
    loadIOCs,
    loadFeeds,
    setActor,
  } = useIncidentStore();
  const { actor, isFetching } = useActor(createActor);

  // Wire actor into the store and reload data once actor is ready
  useEffect(() => {
    if (actor && !isFetching) {
      setActor(actor);
      void loadStats();
      void loadAlerts();
      void loadIncidents();
      void loadIOCs();
      void loadFeeds();
    }
  }, [
    actor,
    isFetching,
    setActor,
    loadStats,
    loadAlerts,
    loadIncidents,
    loadIOCs,
    loadFeeds,
  ]);

  // Initial load with sample data (before actor is ready)
  useEffect(() => {
    void loadStats();
    void loadAlerts();
    void loadIncidents();
    void loadIOCs();
    void loadFeeds();
  }, [loadStats, loadAlerts, loadIncidents, loadIOCs, loadFeeds]);

  return <>{children}</>;
}

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  ),
});

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/report",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ReportIncident />
    </Suspense>
  ),
});

const incidentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incidents",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AllIncidents />
    </Suspense>
  ),
});

const timelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/timeline",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TrackTimeline />
    </Suspense>
  ),
});

const threatIntelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/threat-intel",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ThreatIntel />
    </Suspense>
  ),
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alerts",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AlertsPage />
    </Suspense>
  ),
});

// Build route tree and router
const routeTree = rootRoute.addChildren([
  indexRoute,
  reportRoute,
  incidentsRoute,
  timelineRoute,
  threatIntelRoute,
  alertsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
