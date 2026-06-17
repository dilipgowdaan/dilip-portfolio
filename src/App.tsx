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

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const triggerFired = useRef(false);
  useHashScroll();

  useEffect(() => {
    const el = document.querySelector(".hologram-interface") as HTMLElement | null;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;
      setScrollProgress(progress);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

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
