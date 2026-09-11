import { useState } from "react";
import { m } from "motion/react";
import { useIsMobile } from "../hooks/useMediaQuery";
import { TechIcon } from "./TechIcons";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

type Unit = { f: string; chip?: boolean; filter?: boolean };
type Tech = {
  n: string;
  f?: string;
  parts?: Unit[];
  brk?: string;
  chip?: boolean;
  filter?: boolean;
};
type Category = { label: string; color: string; techs: Tech[] };

const C = {
  lang: "#fafaf8",
  data: "#fafaf8",
  devops: "#fafaf8",
};

const CATEGORIES: Category[] = [
  {
    label: "Languages & Frameworks",
    color: C.lang,
    techs: [
      { n: "Python", f: "python.svg" },
      { n: "React", f: "react.svg" },
      { n: "Next.js", f: "vercel.svg" },
      { n: "TypeScript", f: "visualstudiocode.svg" },
      { n: "Node.js", f: "flask.svg", brk: "Express / REST" },
      { n: "FastAPI / Flask", f: "flask.svg" },
      { n: "C / C++", f: "c.svg", brk: "Systems" },
      { n: "HTML5 / CSS3", f: "html5.svg" },
    ],
  },
  {
    label: "Databases & Storage",
    color: C.data,
    techs: [
      { n: "PostgreSQL", f: "postgresql.svg", brk: "Relational / SQL" },
      { n: "MongoDB", f: "postgresql.svg", brk: "Document Store" },
      { n: "Redis", f: "firebase.svg", brk: "In-Memory / Cache" },
      { n: "Supabase", f: "supabase.svg" },
      { n: "Firebase", f: "firebase.svg" },
      { n: "SQL Optimization", f: "postgresql.svg" },
    ],
  },
  {
    label: "DevOps, Cloud & Mobile",
    color: C.devops,
    techs: [
      { n: "Docker", f: "tb-clock-bolt.svg", brk: "Containers" },
      { n: "Kubernetes", f: "tb-clock-bolt.svg", brk: "Orchestration" },
      { n: "React Native", f: "react.svg", brk: "Cross-Platform" },
      { n: "Expo", f: "expo.svg" },
      { n: "Git & CI/CD", f: "visualstudiocode.svg" },
      { n: "Linux / Bash", f: "tb-shield-check.svg" },
      { n: "Vercel", f: "vercel.svg" },
    ],
  },
];

function Icon({ size, techName }: { u?: Unit; size: number; techName: string; key?: number | string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size}px`,
        height: `${size}px`,
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "4px",
        transition: "all 0.25s ease",
      }}
      title={techName}
    >
      <TechIcon name={techName} size={size - 8} />
    </span>
  );
}

function Tile({ t, isMobile }: { t: Tech; isMobile: boolean; key?: number | string }) {
  const size = isMobile ? 38 : 42;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "9px",
        width: isMobile ? "80px" : "94px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "7px",
          alignItems: "center",
          justifyContent: "center",
          height: "44px",
        }}
      >
        <Icon size={size} techName={t.n} />
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {t.n}
        {t.brk && (
          <span
            style={{
              display: "block",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.62rem",
              marginTop: "2px",
            }}
          >
            ({t.brk})
          </span>
        )}
      </div>
    </div>
  );
}

export function Skills() {
  const isMobile = useIsMobile();

  return (
    <section
      id="stack"
      style={{
        padding: isMobile ? "4rem 4vw" : "4rem 6vw 10rem",
        background: "transparent",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: isMobile ? "3rem" : "5rem",
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
          SKILLS & STACK
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(255,255,255,0.07)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
          gap: isMobile ? "5rem" : "8vw",
          alignItems: "start",
        }}
      >
        <div
          style={{
            position: isMobile ? "relative" : "sticky",
            top: isMobile ? "0" : "6rem",
            marginBottom: isMobile ? "2rem" : "0",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <m.h2
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontFamily: FONT_SERIF,
                fontSize: isMobile
                  ? "clamp(1.8rem, 7vw, 4rem)"
                  : "clamp(2.6rem, 4.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                color: "#fafaf8",
                margin: "0 0 1.2rem",
              }}
            >
              Technical Expertise.
            </m.h2>
          </div>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "0.88rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.48)",
              maxWidth: "260px",
            }}
          >
            A production-grade stack engineered for scalable web backends, responsive interfaces, containerized microservices, and distributed databases.
          </m.p>
        </div>

        <div>
          {CATEGORIES.map((cat, ci) => (
            <div
              key={cat.label}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "1.3rem" : "24px",
                alignItems: "center",
                padding: ci === 0 ? "0 0 24px" : "24px 0",
                borderTop:
                  ci === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: cat.color,
                  width: isMobile ? "100%" : "118px",
                  flexShrink: 0,
                  lineHeight: 1.5,
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                {cat.label}
              </div>
              <div
                style={
                  isMobile
                    ? {
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "22px 14px",
                        width: "100%",
                      }
                    : { display: "flex", flexWrap: "wrap", gap: "22px 24px" }
                }
              >
                {cat.techs.map((t) => (
                  <Tile key={t.n} t={t} isMobile={isMobile} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
