import { m } from "motion/react";
import { useIsMobile } from "../hooks/useMediaQuery";
import { Rocket, Gauge, Orbit, Compass, Gamepad2, Cpu, Lightbulb } from "lucide-react";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

type CardItem = {
  emoji: string;
  tag: string;
  title: string;
  desc: string;
  icon: any;
};

const BEYOND_ITEMS = [
  {
    emoji: "🚀",
    tag: "AEROSPACE & JET ENGINEERING",
    title: "Aerospace Technologies",
    icon: <Rocket size={16} style={{ color: "#c87eff" }} />,
    desc: "Active student of complete aerospace system architectures. Fascinated by aerostructure design, avionics array layouts, jet-turbine fluid cycles, multi-stage ignition parameters, and real-time sensor telemetry under extreme vibration environments.",
  },
  {
    emoji: "🏎️",
    tag: "DYNAMICS & AERODYNAMICS",
    title: "Formula 1 & Motorsport Engineering",
    icon: <Gauge size={16} style={{ color: "#4ade80" }} />,
    desc: "Passionate analyzer of high-rate aerodynamic downforce, chassis composites, and mechanizing layouts in F1. Deep interest in microscopic structural tolerances, where even a single suspension bolt undergoes intensive crack/stress inspection to survive high-G cornering stress.",
  },
  {
    emoji: "🌌",
    tag: "COSMOLOGY & TELEMETRY",
    title: "Astronomy & Space Exploration",
    icon: <Orbit size={16} style={{ color: "#2ed4c8" }} />,
    desc: "Examines cosmic mapping algorithms, satellite orbit mechanics, deep-space radio astronomy, and custom thermal insulation jackets designed for cryogenic sensors on deep-sky orbital telescopes.",
  },
  {
    emoji: "🏏",
    tag: "BALL FLIGHT PHYSICS",
    title: "Cricket",
    icon: <Compass size={16} style={{ color: "#ffaa2e" }} />,
    desc: "Integrating physics and fluid dynamics models to analyze reverse-swing aerodynamics, boundary layer transition states, Magnus drift paths, and the material elastic mechanics of willow blades under high-velocity impacts.",
  },
  {
    emoji: "🎮",
    tag: "REAL-TIME RENDERING",
    title: "Mobile Gaming",
    icon: <Gamepad2 size={16} style={{ color: "#e14585" }} />,
    desc: "Fascinated by high-refresh-rate systems, real-time thread scheduling, core governor profiles, and sub-millisecond physical controller polling rates on ARM-based chip architectures.",
  },
  {
    emoji: "💡",
    tag: "MATERIALS & DESIGN",
    title: "Emerging Engineering Innovations",
    icon: <Cpu size={16} style={{ color: "#6366f1" }} />,
    desc: "Tracking multidisciplinary design breakthroughs including advanced generative structural CAD meshes, finite element analysis (FEA), and robust micro-electromechanical systems (MEMS) in aerospace and automotive applications.",
  },
  {
    emoji: "🧪",
    tag: "SEMICONDUCTORS & SIGNALS",
    title: "Scientific Research & Tech Trends",
    icon: <Lightbulb size={16} style={{ color: "#fafaf8" }} />,
    desc: "Monitoring micro-hardware fabrication trends, sub-nanometer extreme ultraviolet (EUV) silicon lithography developments, advanced signal filter layouts, and novel high-conductivity composite materials.",
  },
];

export function BeyondAcademics() {
  const isMobile = useIsMobile();

  return (
    <section
      id="beyond-academics"
      style={{
        padding: isMobile ? "4rem 5vw" : "6rem 8vw",
        background: "transparent",
        position: "relative",
      }}
    >
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
            color: "#c87eff", // Violet color
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          BEYOND ACADEMICS
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(200, 126, 255, 0.12)" }} />
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: isMobile ? "2rem" : "3rem",
            fontWeight: 800,
            color: "#fafaf8",
            margin: "0 0 1rem 0",
            lineHeight: 1.15,
          }}
        >
          Multidisciplinary Interests
        </h2>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: isMobile ? "1rem" : "1.2rem",
            lineHeight: 1.6,
            color: "rgba(255, 255, 255, 0.55)",
            maxWidth: "720px",
            margin: 0,
          }}
        >
          Fusing theoretical digital modeling with a genuine curiosity for complete domains of physical engineering and real-world system mechanics.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          marginTop: "3rem",
        }}
      >
        {BEYOND_ITEMS.map((item, idx) => (
          <m.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            whileHover={{ y: -4, borderColor: "rgba(200, 126, 255, 0.4)" }}
            style={{
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "1.5rem",
              background: "rgba(10, 10, 10, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "border-color 0.25s, transform 0.25s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.52rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255, 255, 255, 0.45)",
                  fontWeight: 700,
                }}
              >
                {item.tag}
              </span>
              <span style={{ fontSize: "1.1rem" }}>{item.emoji}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {item.icon}
              <h4
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#fafaf8",
                  margin: 0,
                }}
              >
                {item.title}
              </h4>
            </div>
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.78rem",
                lineHeight: 1.55,
                color: "rgba(255, 255, 255, 0.45)",
                margin: 0,
              }}
            >
              {item.desc}
            </p>
          </m.div>
        ))}
      </div>
    </section>
  );
}
