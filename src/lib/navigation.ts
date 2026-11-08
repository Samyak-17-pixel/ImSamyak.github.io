import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sectionById } from "@/content/sections";
import { scrollToSection } from "./smoothScroll";

export function sectionPath(id: string) {
  return id === "home" ? "/" : `/${id}`;
}

/** The dive page owns "/" and "/<section>"; everything deeper is a detail page. */
export function isDivePath(pathname: string) {
  if (pathname === "/") return true;
  const parts = pathname.split("/").filter(Boolean);
  return parts.length === 1 && !!sectionById(parts[0]);
}

/** Point the address bar at a section without a router navigation (keeps scroll smooth). */
export function replaceSectionHash(id: string) {
  const hash = `#${sectionPath(id)}`;
  if (window.location.hash !== hash) window.history.replaceState(window.history.state, "", hash);
}

/** Smooth-scroll when already diving, otherwise route back to the dive at that section. */
export function useGoToSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (id: string) => {
      if (isDivePath(pathname)) {
        scrollToSection(id);
        replaceSectionHash(id);
      } else {
        navigate(sectionPath(id));
      }
    },
    [navigate, pathname]
  );
}
