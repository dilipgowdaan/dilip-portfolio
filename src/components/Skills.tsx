import { useState } from "react";
import { m } from "motion/react";
import { useIsMobile } from "../hooks/useMediaQuery";
import {
  Rocket,
  Gauge,
  Orbit,
  Compass,
  Gamepad2,
  Cpu,
  Lightbulb,
  Terminal,
  Database,
  Code,
  Globe,
  Layers,
} from "lucide-react";

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
  embedded: "#fafaf8",
  protocols: "#fafaf8",
};

const CATEGORIES: Category[] = [
  {
    label: "Programming & Web",
    color: C.lang,
    techs: [
      { n: "React", f: "react.svg" },
      { n: "React Native", f: "react.svg" },
      { n: "C", f: "c.svg" },
      { n: "Python", f: "python.svg" },
      { n: "HTML", f: "html5.svg" },
      { n: "SQL", f: "postgresql.svg", brk: "Postgre / SQLite" },
    ],
  },
  {
    label: "Software & Tools",
    color: C.embedded,
    techs: [
      { n: "Firebase", f: "firebase.svg" },
      { n: "Vercel", f: "vercel.svg" },
      { n: "Supabase", f: "supabase.svg" },
      { n: "Flask", f: "flask.svg" },
      { n: "Expo", f: "expo.svg" },
      { n: "VS Code", f: "visualstudiocode.svg" },
      { n: "Arduino IDE", f: "arduino.svg" },
      { n: "MATLAB", f: "tb-components.svg", chip: true },
    ],
  },
  {
    label: "Hardware Platforms",
    color: C.protocols,
    techs: [
      { n: "Verilog", f: "tb-components.svg", chip: true },
      { n: "System Verilog", f: "tb-components.svg", chip: true },
      { n: "FPGA Boards", f: "tb-clock-bolt.svg" },
      { n: "Raspberry Pi", f: "raspberrypi.svg" },
      { n: "Arduino Uno", f: "arduino.svg" },
      { n: "ESP8266/ESP32", f: "tb-shield-check.svg", brk: "IoT Boards" },
    ],
  },
];

function Icon({ u, size, techName }: { u: Unit; size: number; techName: string; key?: number | string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const n = techName.toLowerCase();
    let color = "rgba(255, 255, 255, 0.45)";
    let FallbackComp = Layers;

    if (n.includes("react")) {
      color = "#61dafb";
      FallbackComp = Code;
    } else if (n.includes("python")) {
      color = "#3776ab";
      FallbackComp = Terminal;
    } else if (n.includes("c")) {
      color = "#a8b9cc";
      FallbackComp = Terminal;
    } else if (n.includes("html")) {
      color = "#e34f26";
      FallbackComp = Globe;
    } else if (n.includes("sql") || n.includes("postgresql")) {
      color = "#336791";
      FallbackComp = Database;
    } else if (n.includes("firebase")) {
      color = "#ffca28";
      FallbackComp = Database;
    } else if (n.includes("supabase")) {
      color = "#3ecf8e";
      FallbackComp = Database;
    } else if (n.includes("vercel")) {
      color = "#fafaf8";
      FallbackComp = Globe;
    } else if (n.includes("flask")) {
      color = "#fafaf8";
      FallbackComp = Code;
    } else if (n.includes("expo") || n.includes("vs code")) {
      color = "#47a2ff";
      FallbackComp = Code;
    } else if (
      n.includes("arduino") ||
      n.includes("matlab") ||
      n.includes("verilog") ||
      n.includes("system verilog") ||
      n.includes("fpga") ||
      n.includes("pi") ||
      n.includes("esp")
    ) {
      color = "#2ed4c8";
      FallbackComp = Cpu;
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: `${size}px`,
          height: `${size}px`,
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
        title={techName}
      >
        <FallbackComp size={Math.max(size - 14, 15)} style={{ color }} />
      </span>
    );
  }

  const srcUrl = `/icons/${u.f}`;

  if (u.chip) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          borderRadius: "6px",
          padding: "3px",
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <img
          src={srcUrl}
          alt={techName}
          onError={() => setFailed(true)}
          loading="lazy"
          decoding="async"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </span>
    );
  }
  return (
    <img
      src={srcUrl}
      alt={techName}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        display: "block",
        filter: u.filter ? "brightness(0) invert(1)" : undefined,
      }}
    />
  );
}

function Tile({ t, isMobile }: { t: Tech; isMobile: boolean; key?: number | string }) {
  const units: Unit[] = t.parts ?? [
    { f: t.f!, chip: t.chip, filter: t.filter },
  ];
  const size = t.parts ? 30 : 38;
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
          height: "40px",
        }}
      >
        {units.map((u, i) => (
          <Icon key={i} u={u} size={size} techName={t.n} />
        ))}
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
            A high-performance stack bridging low-level hardware design and modern software systems.
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
