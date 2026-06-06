import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import RouteGate from "./components/RouteGate.jsx";
import DirectionMapPage from "./pages/DirectionMapPage.jsx";
import ExportPage from "./pages/ExportPage.jsx";
import GapPage from "./pages/GapPage.jsx";
import IntakePage from "./pages/IntakePage.jsx";
import LiteraturePage from "./pages/LiteraturePage.jsx";
import ProposalPage from "./pages/ProposalPage.jsx";
import RoutingPage from "./pages/RoutingPage.jsx";
import ScreeningPage from "./pages/ScreeningPage.jsx";
import TopicPage from "./pages/TopicPage.jsx";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/intake" replace />} />
        <Route path="/intake" element={<IntakePage />} />
        <Route
          path="/routing"
          element={
            <RouteGate route="/routing">
              <RoutingPage />
            </RouteGate>
          }
        />
        <Route
          path="/direction-map"
          element={
            <RouteGate route="/direction-map">
              <DirectionMapPage />
            </RouteGate>
          }
        />
        <Route
          path="/screening"
          element={
            <RouteGate route="/screening">
              <ScreeningPage />
            </RouteGate>
          }
        />
        <Route
          path="/topic/:rank"
          element={
            <RouteGate route="/topic/1">
              <TopicPage />
            </RouteGate>
          }
        />
        <Route
          path="/literature/:rank"
          element={
            <RouteGate route="/literature/1">
              <LiteraturePage />
            </RouteGate>
          }
        />
        <Route
          path="/gap/:rank"
          element={
            <RouteGate route="/gap/1">
              <GapPage />
            </RouteGate>
          }
        />
        <Route
          path="/proposal/:rank"
          element={
            <RouteGate route="/proposal/1">
              <ProposalPage />
            </RouteGate>
          }
        />
        <Route
          path="/export"
          element={
            <RouteGate route="/export">
              <ExportPage />
            </RouteGate>
          }
        />
        <Route path="*" element={<Navigate to="/intake" replace />} />
      </Routes>
    </AppShell>
  );
}
