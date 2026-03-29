import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Education } from "@/pages/Education";
import { Experience } from "@/pages/Experience";
import { Home } from "@/pages/Home";
import { Projects } from "@/pages/Projects";
import { Research } from "@/pages/Research";
import { Skills } from "@/pages/Skills";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="research" element={<Research />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experience" element={<Experience />} />
          <Route path="skills" element={<Skills />} />
          <Route path="education" element={<Education />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
