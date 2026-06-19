import { useEffect, useState, useRef } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import { AIBackground } from "./components/AIBackground";
import { Header } from "./components/Header";
import { HologramInterface } from "./components/HologramInterface";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { BeyondAcademics } from "./components/BeyondAcademics";
import { Contact } from "./components/Contact";
import { BottomRightHUD } from "./components/BottomRightHUD";
import { useHashScroll } from "./hooks/useHashScroll";
import { AdminDashboard } from "./components/AdminDashboard";
import { initAnalyticsTracker } from "./utils/analytics";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const triggerFired = useRef(false);
  useHashScroll();

  useEffect(() => {
    // Initialize standard click listeners globally
    const cleanupTracker = initAnalyticsTracker();

    // Listen to route/pathname modifications
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    
    // Intercept pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      const res = originalPushState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return res;
    };
    
    history.replaceState = function(...args) {
      const res = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return res;
    };

    window.addEventListener("locationchange", handleLocationChange);

    const el = document.querySelector(".hologram-interface") as HTMLElement | null;
    
    const onScroll = () => {
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;
      setScrollProgress(progress);
    };

    if (el) {
      el.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("locationchange", handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      if (cleanupTracker) cleanupTracker();
      if (el) {
        el.removeEventListener("scroll", onScroll);
      }
    };
  }, []);

  const isAdmin = currentPath.toLowerCase() === "/admin" || currentPath.toLowerCase() === "/admin/";

  if (isAdmin) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="spatial-scene">
          <AIBackground />
          <AdminDashboard onClose={() => { history.pushState(null, "", "/"); }} />
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="spatial-scene">
        <AIBackground />
        <Header />
        
        <HologramInterface>
          <Hero />
          <About />
          <ExperienceTimeline />
          <Projects />
          <Skills />
          <BeyondAcademics />
          <Contact />
        </HologramInterface>

        {/* Floating Scroll Indicator on the right edge */}
        <div
          style={{
            position: "fixed",
            right: "8px",
            top: "10%",
            bottom: "10%",
            width: "2px",
            zIndex: 900,
            borderRadius: "4px",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${scrollProgress * 100}%`,
              borderRadius: "4px",
              background: "linear-gradient(to bottom, #2ed4c8, #c87eff)",
              transition: "height 0.1s ease-out",
            }}
          />
        </div>

        <BottomRightHUD />
      </div>
    </LazyMotion>
  );
}
