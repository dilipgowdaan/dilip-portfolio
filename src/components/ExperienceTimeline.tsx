import { useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { useIsMobile } from "../hooks/useMediaQuery";
import { Cpu, GraduationCap, ChevronRight } from "lucide-react";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

type TimelineEvent = {
  id: string;
  type: "education" | "experience";
  role: string;
  institution: string;
  period: string;
  bullets: string[];
  icon: any;
  highlight: string;
  color: string;
};

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: "ece-be",
    type: "education",
    role: "B.E. in Electronics & Communication",
    institution: "R V College of Engineering, Bengaluru",
    period: "Dec 2023 - Aug 2026",
    highlight: "7.86 CGPA",
    color: "#c87eff", // Mild Violet
    icon: GraduationCap,
    bullets: [
      "Core academic focus on VLSI circuits, HDL programming, RTL design, DSP architectures, and digital design standards.",
      "Conducting robust simulation modeling and system validation for Vedic math ALU multipliers.",
      "Consistently maintaining an optimal GPA of 7.86 while managing complex project showcase assignments."
    ]
  },
  {
    id: "ece-diploma",
    type: "education",
    role: "Diploma in ECE",
    institution: "Govt. Polytechnic, Immadihalli",
    period: "Jun 2019 - Dec 2021",
    highlight: "83% Aggregate",
    color: "#6366f1", // Mild Blue
    icon: GraduationCap,
    bullets: [
      "Studied theoretical electronics principles, circuit analysis, semiconductor fundamentals, and digital logic gates.",
      "Successfully delivered senior-year Lab circuits and analog simulation boards, scoring an aggregate 83% average."
    ]
  },
  {
    id: "puc-science",
    type: "education",
    role: "PUC in Science",
    institution: "Sahyadri PU College, Kolar",
    period: "Jul 2017 - May 2019",
    highlight: "77.6%",
    color: "#4ade80", // Mild Green
    icon: GraduationCap,
    bullets: [
      "Studied basic natural sciences including Physics, Mathematics, chemistry, and specialized system fundamentals.",
      "Developed high computational skills and mathematical reasoning capabilities under academic guidance."
    ]
  },
  {
    id: "sslc",
    type: "education",
    role: "SSLC",
    institution: "Green Valley Public School",
    period: "May 2016 - May 2017",
    highlight: "90.26%",
    color: "#2ed4c8", // Mild Cyan
    icon: GraduationCap,
    bullets: [
      "Secured outstanding academic standing representing 90.26% overall results.",
      "Eagerly participated in regional mathematics research models and school science design shows."
    ]
  }
];

export function ExperienceTimeline() {
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState<string>("ece-be");

  const academicEvents = TIMELINE_DATA.filter((e) => e.type === "education");
  const activeEvent = academicEvents.find((e) => e.id === activeId) ?? academicEvents[0];

  // Hardcoded isolated premium ISRO professional experience
  const isroExperience = {
    role: "Technical Support Engineer",
    institution: "URSC / ISRO (Through Sree Venkateshwara enterprises)",
    period: "Mar 2022 – Dec 2023",
    highlight: "ISRO System Support",
    bullets: [
      "Diagnosed and resolved complex system-level hardware and software issues across desktops and enterprise networks.",
      "Automated critical system troubleshooting workflows to improve overall network and terminal availability.",
      "Worked extensively with bare-metal interface drivers, debugging operating system registry and custom drivers."
    ]
  };

  const renderAcademicItem = (e: TimelineEvent) => {
    const Icon = e.icon;
    const isActive = e.id === activeId;

    return (
      <m.div
        key={e.id}
        whileHover={{ x: isActive ? 0 : 4 }}
        onClick={() => setActiveId(e.id)}
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "10px",
          border: `1px solid ${isActive ? e.color + "55" : "rgba(255, 255, 255, 0.05)"}`,
          background: isActive ? `${e.color}08` : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.25s ease-out",
          pointerEvents: "auto",
        }}
        id={`academic-tab-${e.id}`}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", overflow: "hidden" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${e.color}15`,
              border: `1px solid ${e.color}35`,
              color: e.color,
              flexShrink: 0,
            }}
          >
            <Icon size={16} />
          </div>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            <h4
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "0.93rem",
                fontWeight: 700,
                color: isActive ? "#fafaf8" : "rgba(255,255,255,0.7)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {e.role}
            </h4>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.56rem",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                display: "block",
                marginTop: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {e.institution}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {!isMobile && (
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.56rem",
                letterSpacing: "0.05em",
                color: isActive ? e.color : "rgba(255,255,255,0.3)",
              }}
            >
              {e.period}
            </span>
          )}
          <ChevronRight
            size={14}
            style={{
              color: isActive ? e.color : "rgba(255,255,255,0.2)",
              transform: isActive ? "rotate(90deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </m.div>
    );
  };

  return (
    <section
      id="experience"
      style={{
        padding: isMobile ? "4rem 5vw" : "6rem 8vw",
        background: "transparent",
        position: "relative",
      }}
    >
      {/* Outer Section Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "3.5rem",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.95rem",
            letterSpacing: "0.22em",
            color: "#fafaf8",
            textTransform: "uppercase",
            fontWeight: 650,
          }}
        >
          TIMELINE
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* 1. PROFESSIONAL EXPERIENCE FLOW (Isolated, prominent, full-width) */}
      <div style={{ marginBottom: "2.5rem" }}>
        
        {/* Section Segment Header Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.8rem", paddingLeft: "4px" }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: "0.62rem", letterSpacing: "0.15em", color: "#2ed4c8", textTransform: "uppercase", fontWeight: 700 }}>
            Professional Experience
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(46, 212, 200, 0.15)" }} />
        </div>

        {/* Headline details */}
        <div style={{ marginBottom: "1.5rem", paddingLeft: "4px" }}>
          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontSize: isMobile ? "1.6rem" : "2.2rem",
              fontWeight: 800,
              color: "#fafaf8",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {isroExperience.role}
          </h3>
          
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: isMobile ? "1.05rem" : "1.25rem",
              color: "rgba(255,255,255,0.65)",
              margin: "0.4rem 0 1rem 0",
            }}
          >
            {isroExperience.institution}
          </p>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "0.5rem" }}>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#2ed4c8",
                background: "rgba(46, 212, 200, 0.08)",
                border: "1px solid rgba(46, 212, 200, 0.35)",
                borderRadius: "4px",
                padding: "3px 8px",
                fontWeight: 700,
              }}
            >
              {isroExperience.highlight}
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.05em",
              }}
            >
              {isroExperience.period}
            </span>
          </div>
        </div>

        {/* Fullwidth spread card showing details */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            border: "1px solid rgba(46, 212, 200, 0.22)",
            borderRadius: "12px",
            padding: isMobile ? "1.5rem" : "2.2rem",
            background: "rgba(10, 10, 10, 0.35)",
            boxShadow: "0 8px 32px -10px rgba(0,0,0,0.5), 0 0 20px rgba(46, 212, 200, 0.02)",
          }}
          id="isro-fullwidth-card"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {isroExperience.bullets.map((bullet, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#2ed4c8",
                    marginTop: "7px",
                    flexShrink: 0,
                    boxShadow: "0 0 10px #2ed4c8",
                  }}
                />
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}
                >
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </m.div>
      </div>

      {/* LINE SEPARATION */}
      <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "4rem 0" }} />

      {/* 2. ACADEMIC BACKGROUND TIMELINE */}
      <div>
        
        {/* Academic section segment header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.2rem", paddingLeft: "4px" }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: "0.62rem", letterSpacing: "0.15em", color: "#c87eff", textTransform: "uppercase", fontWeight: 700 }}>
            Academic Background
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(200, 126, 255, 0.15)" }} />
        </div>

        {/* Selectable grid system */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.28fr",
            gap: isMobile ? "2.5rem" : "3.5rem",
            alignItems: "start",
          }}
          id="academic-timeline-grid"
        >
          {/* Left panel Selection List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {academicEvents.map(renderAcademicItem)}
          </div>

          {/* Right panel Selection Details Display */}
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              <m.div
                key={activeId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                style={{
                  border: `1px solid ${activeEvent.color}25`,
                  borderRadius: "12px",
                  padding: isMobile ? "1.5rem" : "2rem",
                  background: "rgba(10, 10, 10, 0.45)",
                  boxShadow: `0 8px 32px -10px rgba(0,0,0,0.5), 0 0 20px ${activeEvent.color}05`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.5rem",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: isMobile ? "1.2rem" : "1.45rem",
                        fontWeight: 800,
                        color: "#fafaf8",
                        margin: 0,
                        marginBottom: "0.35rem",
                      }}
                    >
                      {activeEvent.role}
                    </h3>
                    <p
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: activeEvent.color,
                        margin: 0,
                      }}
                    >
                      {activeEvent.institution}
                    </p>
                  </div>

                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: activeEvent.color,
                      background: `${activeEvent.color}10`,
                      border: `1px solid ${activeEvent.color}35`,
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activeEvent.highlight}
                  </span>
                </div>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255, 255, 255, 0.08)",
                    marginBottom: "1.8rem",
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {activeEvent.bullets.map((bullet, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: activeEvent.color,
                          marginTop: "8px",
                          flexShrink: 0,
                          boxShadow: `0 0 10px ${activeEvent.color}`,
                        }}
                      />
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: "0.88rem",
                          lineHeight: 1.6,
                          color: "rgba(255,255,255,0.68)",
                          margin: 0,
                        }}
                      >
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>

                {isMobile && (
                  <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.58rem",
                        letterSpacing: "0.05em",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      Duration: {activeEvent.period}
                    </span>
                  </div>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
