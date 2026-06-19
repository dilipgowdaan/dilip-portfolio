import { useEffect } from "react";
import { trackSectionView } from "../utils/analytics";

const SECTION_IDS = [
  "hero",
  "about",
  "stack",
  "experience",
  "projects",
  "contact",
];

function getSectionFromPath(path: string): string {
  const section = path.replace(/^\//, "");
  return SECTION_IDS.includes(section) ? section : "";
}

export function scrollToSection(
  id: string,
  behavior: ScrollBehavior = "smooth",
) {
  const container = document.querySelector(
    ".hologram-interface",
  ) as HTMLElement | null;
  if (!container) return;
  const target = document.getElementById(id);
  if (!target) return;

  let offset =
    container.scrollTop +
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top;

  // Subtract sticky header height (90px) to prevent layout overlap
  if (id === "hero") {
    offset = 0;
  } else {
    offset -= 90;
    if (offset < 0) offset = 0;
  }

  const portfolioScroll = (window as any).__portfolioScrollTop as
    | ((top: number) => void)
    | undefined;
  if (behavior === "smooth" && portfolioScroll) {
    portfolioScroll(offset);
  } else {
    container.scrollTo({ top: offset, behavior });
  }
}

export function useHashScroll() {
  useEffect(() => {
    const container = document.querySelector(
      ".hologram-interface",
    ) as HTMLElement | null;
    if (!container) return;

    const pathSection = getSectionFromPath(window.location.pathname);
    const hashSection = window.location.hash.slice(1);
    const initial =
      pathSection || (SECTION_IDS.includes(hashSection) ? hashSection : "");

    if (initial && initial !== "hero") {
      let attempts = 0;
      const tryScroll = () => {
        const target = document.getElementById(initial);
        if (target) {
          document.fonts.ready.then(() => {
            requestAnimationFrame(() => {
              scrollToSection(initial, "instant");
              setTimeout(() => scrollToSection(initial, "instant"), 300);
            });
          });
        } else if (attempts < 20) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 50);
    }

    const updatePath = () => {
      const containerRect = container.getBoundingClientRect();
      const threshold = containerRect.top + containerRect.height * 0.4;

      let activeId = "";
      let bestDist = Infinity;

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) {
          const dist = threshold - top;
          if (dist < bestDist) {
            bestDist = dist;
            activeId = id;
          }
        }
      }

      if (activeId) {
        const next = activeId === "hero" ? "/" : `/${activeId}`;
        if (window.location.pathname !== next) {
          history.replaceState(null, "", next);
          trackSectionView(activeId);
        }
      }
    };

    container.addEventListener("scroll", updatePath, { passive: true });
    return () => container.removeEventListener("scroll", updatePath);
  }, []);
}
