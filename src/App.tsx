import { lazy } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DivePage } from "@/pages/DivePage";

const ResearchDetail = lazy(() => import("@/pages/ResearchDetail").then((m) => ({ default: m.ResearchDetail })));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail").then((m) => ({ default: m.ProjectDetail })));
const AuvDetail = lazy(() => import("@/pages/AuvDetail").then((m) => ({ default: m.AuvDetail })));

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DivePage />} />
          <Route path=":section" element={<DivePage />} />
          <Route path="research/:slug" element={<ResearchDetail />} />
          <Route path="models/:slug" element={<AuvDetail />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
