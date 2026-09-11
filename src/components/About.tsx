import { Fragment } from "react";
import { m } from "motion/react";
import { useIsMobile } from "../hooks/useMediaQuery";
import { Award, Target, Zap, Cpu, Settings } from "lucide-react";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

const pillars = [
  {
    title: "Full-Stack System Integrity",
    desc: "Building reliable web & mobile products requires clean API boundaries, typed contracts, resilient data models, and performant server-side rendering with Next.js and React.",
  },
  {
    title: "Scalable Data & Containerization",
    desc: "Robust backends must withstand variable workloads. I design normalized PostgreSQL schemas, document stores with MongoDB, and package microservices inside Docker and Kubernetes for deterministic deployments.",
  },
  {
    title: "Real-Time Telemetry & Mobile UX",
    desc: "Modern user experiences depend on fast client responsiveness. Using Python, React Native, and real-time database listeners, I deliver cross-platform mobile apps with sub-second interfaces and dynamic sync.",
  },
];

const dontDo = [
  "I don't ship brittle prototypes. Production software demands robust error boundaries, strict types, and automated testing.",
  "I don't neglect database efficiency. A backend is only as scalable as its query plans, indexes, and connection pools.",
  "I don't ignore deployment constraints. If an application isn't reproducible across containers with Docker and orchestrated reliably, it's not production-ready.",
];

const highlightsParagraphs = [
  "I am a Full Stack Software Engineer passionate about architecting scalable web and mobile platforms with Python, React, Next.js, PostgreSQL, Docker, Kubernetes, and MongoDB.",
  "With an analytical engineering foundation from RV College of Engineering and hands-on systems experience at URSC/ISRO, I approach software with rigorous attention to latency, data consistency, and architectural cleanliness. I specialize in turning complex requirements into resilient full-stack systems with intuitive user experiences.",
];


export function About() {
  const isMobile = useIsMobile();

  return (
    <section
      id="about"
      style={{
        position: "relative",
        background: "transparent",
        padding: isMobile ? "4rem 4vw" : "4rem 0 0",
      }}
    >
      <style>{`
        @keyframes highlights-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={isMobile ? {} : { padding: "0.85rem 6vw 2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
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
              ABOUT
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.07)",
              }}
            />
          </div>

          <div style={{ overflow: "hidden" }}>
            <m.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: FONT_SERIF,
                fontSize: isMobile
                  ? "clamp(1.4rem, 5.5vw, 2.2rem)"
                  : "clamp(1.8rem, 2.8vw, 2.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: 0,
                whiteSpace: "normal",
              }}
            >
              Theory is secondary. Operational systems speak the absolute truth.
            </m.h2>
          </div>
        </div>

        <div>
          <div style={{ padding: isMobile ? "2rem 0 0" : "1.5rem 6vw 2rem" }}>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: FONT_SANS,
                fontSize: isMobile ? "0.9rem" : "1.02rem",
                lineHeight: 1.65,
                color: "#e8e0d0",
                marginBottom: isMobile ? "2rem" : "2.5rem",
                borderLeft: "2px solid rgba(232,224,208,0.3)",
                paddingLeft: "1rem",
                maxWidth: "600px",
              }}
            >
              Measured in API response times, verified with resilient tests, and built to scale under production traffic.
            </m.p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "3rem" : "6vw",
                alignItems: "start",
              }}
            >
              <div style={{ alignSelf: "start" }}>
                {/* Profile Image Holder */}
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "2.2rem" }}>
                  <div className="relative group cursor-default" style={{ position: "relative" }}>
                    <div 
                      style={{
                        position: "absolute",
                        inset: "-6px",
                        borderRadius: "50%",
                        background: "linear-gradient(to right, #ffffff, #222222)",
                        filter: "blur(6px)",
                        opacity: 0.25,
                        zIndex: 0
                      }}
                      className="animate-pulse"
                    />
                    <div 
                      style={{
                        position: "relative",
                        width: "110px",
                        height: "110px",
                        borderRadius: "50%",
                        padding: "2px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        zIndex: 1,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <img 
                        src="/profile.jpg" 
                        alt="Dilip Kumar A N" 
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                          background: "rgba(10, 10, 10, 0.85)"
                        }}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div 
                        style={{
                          display: "none",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03))",
                          color: "#fafaf8",
                          fontFamily: FONT_SERIF,
                          fontSize: "1.8rem",
                          fontWeight: 500,
                          textShadow: "0 0 10px rgba(255,255,255,0.4)"
                        }}
                      >
                        DK
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: FONT_SERIF, fontSize: "1.3rem", color: "#fafaf8", fontWeight: 750, margin: "0 0 4px 0" }}>
                      Dilip Kumar A N
                    </h3>
                    <p style={{ fontFamily: FONT_MONO, fontSize: "0.58rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", margin: 0 }}>
                      Full Stack Software Engineer
                    </p>
                  </div>
                </div>

                {highlightsParagraphs.map((para, i) => (
                  <m.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: "0.95rem",
                      lineHeight: 1.8,
                      color: "rgba(255,255,255,0.62)",
                      marginBottom: i === highlightsParagraphs.length - 1 ? 0 : "1.2rem",
                      maxWidth: "580px",
                      textAlign: "justify",
                      textJustify: "inter-word",
                    }}
                  >
                    {para}
                  </m.p>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {pillars.map(({ title, desc }, i) => (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1.2rem",
                        padding: "1.4rem 1.6rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "transparent",
                      }}
                    >
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#e8e0d0",
                          marginTop: "7px",
                          flexShrink: 0,
                          opacity: 0.6,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontFamily: FONT_SERIF,
                            fontWeight: 800,
                            fontSize: "0.95rem",
                            color: "#fafaf8",
                            marginBottom: "6px",
                          }}
                        >
                          {title}
                        </p>
                        <p
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: "0.83rem",
                            lineHeight: 1.65,
                            color: "rgba(255,255,255,0.58)",
                            textAlign: "justify",
                            textJustify: "inter-word",
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
