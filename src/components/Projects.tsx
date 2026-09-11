import React, { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { useIsMobile } from "../hooks/useMediaQuery";
import { Github, ExternalLink, ArrowLeft, Cpu, Terminal, Sparkles, Trophy } from "lucide-react";
import { trackClick } from "../utils/analytics";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  categoryBadges: string[];
  contextHtml: string;
  approachHtml: string;
  systemHtml: string;
  color: string;
  url?: string;
  github?: string;
  statsLabel?: string;
  statsValue?: string;
  deepDiveProblemTitle: string;
  deepDiveProblemBody: string;
  deepDiveSolutionTitle: string;
  deepDiveSolutionBody: string;
  keyFeatures: string[];
};

const PROJECTS_DATA: Project[] = [
  {
    id: "vaidya-mithra",
    title: "Vaidya Mithra",
    subtitle: "AI-Powered Hospital Management & Symptom Triage",
    meta: "Academic Project • 2024",
    categoryBadges: ["AI SYSTEM", "COMPLETED"],
    color: "#c87eff", // Violet
    url: "https://vaidya-mithra-app.vercel.app/",
    github: "https://github.com/dilipgowdaan",
    statsLabel: "Triage Latency Reduction",
    statsValue: "42%",
    contextHtml: "Traditional medical registries suffer from <strong>clunky check-ins</strong> and severe lack of automated triage, leading to delayed emergency response.",
    approachHtml: "Integrated an <strong>AI symptom analyzer</strong> leveraging fine-tuned model queries to capture patient conditions and automate registry queues in <strong>real-time</strong>.",
    systemHtml: "Runs on <strong>React Framework</strong>, <strong>Firebase Firestore</strong>, and custom Vercel API proxies with secure token encryption templates.",
    deepDiveProblemTitle: "What's Wrong with Traditional Healthcare Check-ins Today",
    deepDiveProblemBody: "Patient registers and clinical triage are still largely manual or stateless across regional hubs. ER throughput suffers from high latency because clinical data must be manually recorded before a practitioner can handle the patient. Doctors operate without pre-analyzed contexts, increasing triage bottlenecks.",
    deepDiveSolutionTitle: "The Vaidya Mithra Intelligent Routing Engine",
    deepDiveSolutionBody: "Vaidya Mithra changes this dynamic by analyzing incoming symptom text streams instantly on submission, allocating internal emergency priorities based on algorithmic severity indicators, and delivering clean, structured summaries directly to doctors' panels. It establishes a real-time bridge that dramatically cuts down intake friction.",
    keyFeatures: [
      "Natural Language Symptom Triage Engine",
      "Real-time ER Priority Queue via Firestore listeners",
      "Secure Encrypted Patient Database Schema",
      "Integrated Live Consultation Module"
    ]
  },
  {
    id: "namma-raitha",
    title: "Namma Raitha",
    subtitle: "Hyper-Local Marketplace & Geo-Search for Farmers",
    meta: "Social Uplift Project • 2023-2024",
    categoryBadges: ["FULL-STACK WEB", "COMPLETED"],
    color: "#4ade80", // Green
    url: "https://nammaraitha.vercel.app/",
    github: "https://github.com/dilipgowdaan",
    statsLabel: "Farmer Margin Boost",
    statsValue: "+25%",
    contextHtml: "Rural farmers lack <strong>direct access</strong> to local urban buyers, giving middle-men room to squeeze crop margins and manipulate regional agricultural indexes.",
    approachHtml: "Designed a lightweight <strong>hyper-local marketplace</strong> featuring automated stock updates, real-time geofenced search queries, and multi-language support.",
    systemHtml: "Powered by <strong>React Engine</strong>, <strong>Leaflet.js Mapping Services</strong>, and reliable serverless database structures to handle transaction records.",
    deepDiveProblemTitle: "The Distribution Gap in Regional Agriculture",
    deepDiveProblemBody: "Smallholders have no direct outlet to post current inventory. They are at the mercy of localized brokers who artificially drop crop valuation at purchase, then inflate retail value in the cities. Standard platforms are too complex and ignore location constraints crucial for perishables.",
    deepDiveSolutionTitle: "Direct Crop Trading with Geofenced Queries",
    deepDiveSolutionBody: "By launching Namma Raitha, we connected rural growers directly with bulk buyers within a clickable 50km radius. Farmers update crop inventories on the fly, which recalculates regional availability grids. Multi-language optimization puts high-tech toolsets directly into standard mobile interfaces.",
    keyFeatures: [
      "Lightweight Geolocation Search Range Slider",
      "Multi-Language regional translation interface",
      "Instant Bulk Demand Matching Logs",
      "Simplified Localized SMS Notification Core"
    ]
  },
  {
    id: "smart-waste",
    title: "Smart Waste Management",
    subtitle: "Urban IoT & Mobile Fleet Tracking Platform",
    meta: "Mobile Fleet Platform • 2025",
    categoryBadges: ["REACT NATIVE", "GEOLOCATION", "EXPO"],
    color: "#ffaa2e", // Orange
    github: "https://github.com/dilipgowdaan/Bengaluru-Clean-Smart-Waste-Management",
    statsLabel: "Fleet Route Efficiency",
    statsValue: "38%",
    contextHtml: "Fixed municipal waste collection routes are inefficient, leading to <strong>missed pickups</strong>, overflowing bins, and unnecessary fuel consumption.",
    approachHtml: "Engineered a <strong>cross-platform React Native app</strong> with live GPS fleet mapping, arrival telemetry estimations, and multi-role operations.",
    systemHtml: "Built with <strong>React Native</strong>, <strong>JavaScript</strong>, <strong>Geolocation APIs</strong>, <strong>Expo</strong>, and <strong>Real-Time Database</strong>.",
    deepDiveProblemTitle: "Inefficiencies in Fixed Urban Waste Collection Routing",
    deepDiveProblemBody: "Fixed municipal waste collection routes are inefficient, leading to missed pickups, overflowing bins, and unnecessary fuel consumption across dense urban wards. Sanitation dispatchers have no real-time awareness of vehicle coordinates or route impediments.",
    deepDiveSolutionTitle: "Live Telemetry & Fleet Tracking with Multi-Role Management",
    deepDiveSolutionBody: "Smart Waste Management System deploys real-time GPS mapping inside a React Native mobile application that tracks municipal collection vehicles and estimates arrival times for citizens. It provides specialized application views for sanitation drivers (route guidance, pickup confirmations), municipal supervisors (fleet status, coverage metrics), and residents (service alerts, issue logging).",
    keyFeatures: [
      "Live Telemetry & Fleet Tracking: Real-time GPS mapping inside React Native",
      "Citizen ETA calculations and service alert notifications",
      "Driver Portal with route guidance and instant pickup confirmations",
      "Supervisor Dashboard with fleet status, vehicle telemetry, and coverage metrics",
      "Resident issue logging module with geospatial coordinates"
    ]
  },
  {
    id: "trip-tracker",
    title: "Trip Expense Tracker",
    subtitle: "Mobile Finance & Group Accounting Application",
    meta: "Mobile FinTech • 2024-2025",
    categoryBadges: ["REACT NATIVE", "FINTECH", "EXPO"],
    color: "#38bdf8", // Sky Blue
    github: "https://github.com/dilipgowdaan/TripTracker",
    statsLabel: "Expense Logging Speed",
    statsValue: "<5s",
    contextHtml: "Managing shared expenses during group travel is cumbersome due to <strong>mixed payment methods</strong> (cash and digital UPI) and delayed ledger entries.",
    approachHtml: "Built an <strong>ultra-rapid entry UI</strong> with net balance debt reconciliation algorithms and proactive budget threshold guardrails.",
    systemHtml: "Architected on <strong>React Native (Expo)</strong>, <strong>JavaScript</strong>, and <strong>Local Persistence / State Management</strong>.",
    deepDiveProblemTitle: "Friction in Multi-Party Travel & Group Expense Splitting",
    deepDiveProblemBody: "Managing shared group expenses during group travel is often cumbersome due to mixed payment methods (cash and digital UPI payments) and delayed ledger entries. Post-trip settlement turns into an arithmetic nightmare with circular debts and disputed records.",
    deepDiveSolutionTitle: "Rapid Single-Screen Entry & Multi-Channel Reconciliation",
    deepDiveSolutionBody: "Trip Expense Tracker eliminates settlement overhead through a sub-5-second rapid entry flow and automated multi-channel balance reconciliation. It tracks mixed cash and UPI payments across multiple participants, calculating net balances to minimize the total number of reimbursement transactions needed, backed by analytics breakdowns and budget threshold alerts.",
    keyFeatures: [
      "Rapid Entry UI: Record shared transactions in under 5 seconds",
      "Multi-Channel Balance Reconciliation for mixed cash and digital UPI payments",
      "Net Balance Algorithm minimizing the total number of reimbursement transactions",
      "Categorized spending breakdowns & daily transaction histories",
      "Budget threshold guardrails and proactive overspending alerts"
    ]
  },
  {
    id: "solar-enerlytics",
    title: "Solar Enerlytics",
    subtitle: "Grid-Integrated PV Telemetry & Battery Optimization",
    meta: "Systems & IoT Project • 2024-2025",
    categoryBadges: ["TELEMETRY", "COMPLETED"],
    color: "#6366f1", // Cosmic Blue
    url: "https://solarenerlytics.vercel.app/",
    github: "https://github.com/dilipgowdaan",
    statsLabel: "Battery Wear Reduction",
    statsValue: "35%",
    contextHtml: "Off-grid photovoltaic arrays experience <strong>severe cell degradation</strong> due to erratic weather spikes and unbuffered static load charging designs.",
    approachHtml: "Fitted state-of-the-art <strong>sensing controllers</strong> running a dynamic power routing logic to throttle load currents during surge intervals.",
    systemHtml: "Engineered around <strong>ESP32 Microcontrollers</strong>, raw MQTT pipelines, and a high-rate <strong>Supabase telemetry database</strong> dashboard.",
    deepDiveProblemTitle: "The Preservational Failure of Passive Photovoltaic Assemblies",
    deepDiveProblemBody: "Solar panels collect energy at fluctuating rates depending on weather conditions. Standard regulators charge batteries with static parameters, causing stress during current spikes or deep drops. This results in high degradation costs for off-grid communities.",
    deepDiveSolutionTitle: "Real-time Heuristic Load Throttling",
    deepDiveSolutionBody: "Solar Enerlytics implements microsecond-rate sensors to capture voltage dips and adjust internal impedance networks dynamically. It balances charging cycles, filters high-frequency ripple currents, and aggregates performance records into a lightweight, fully responsive telemetry interface.",
    keyFeatures: [
      "Dual ESP32 Telemetry Transmitters",
      "Surge Throttling Feedback Controller",
      "MQTT Broker message aggregate system",
      "Real-time Supabase Database Charts"
    ]
  },
  {
    id: "alu-design",
    title: "32-Bit ALU Core",
    subtitle: "FPGA VLSI Optimization via Vedic Multiplication",
    meta: "Silicon RTL Design • 2025",
    categoryBadges: ["VLSI RTL DESIGN", "SIMULATED"],
    color: "#e14585", // Pink Glow
    github: "https://github.com/dilipgowdaan",
    statsLabel: "Dynamic Power Savings",
    statsValue: "15%",
    contextHtml: "Traditional hardware arithmetic logic units consume <strong>excessive transistor areas</strong> and introduce severe timing delays during complex digital calculations.",
    approachHtml: "Simulated and formally verified a <strong>fully pipelined ALU Core</strong> executing standard RV32I base instructions, enhanced by Vedic mathematics (<em>Urdhva-Tiryagbhyam</em>).",
    systemHtml: "Written in robust <strong>Verilog RTL</strong>, validated with extensive verification testbenches, and compiled on industrial EDA software.",
    deepDiveProblemTitle: "The Timing Barriers of Traditional Silicon Adders & Multipliers",
    deepDiveProblemBody: "Modern CPUs allocate major clock constraints and thermal budgets to the multi-stage ALU multipliers. Traditional designs introduce long propagation delay paths, limiting overall processor speed and inducing dynamic power leakages under high loads.",
    deepDiveSolutionTitle: "Ancient Algorithmic Acceleration inside Silicon Logic",
    deepDiveSolutionBody: "By structuring hardware multiplexers and logic elements around Vedic computational shortcuts, propagation gate delays are solved concurrently rather than sequentially. This reduces delay steps, optimizing silicon area and achieving a robust timing margin at high frequencies.",
    keyFeatures: [
      "Vedic Urdhva-Tiryagbhyam Multiplier module",
      "Full RV32I base command set simulation model",
      "Extensive SystemVerilog Assertions Timing verification",
      "Synthesized FPGA clock rate validation runs"
    ]
  }
];

// Moving mesh canvas backdrop for the deep-dive view (Image 1 style)
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 65;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and connect particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect near neighbors
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p2.x - p.x, p2.y - p.y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}

export function Projects() {
  const isMobile = useIsMobile();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Group projects for visual hierarchy
  const fullstackRows = PROJECTS_DATA.filter(
    (p) => p.id === "vaidya-mithra" || p.id === "namma-raitha" || p.id === "smart-waste" || p.id === "trip-tracker"
  );
  const hardwareRows = PROJECTS_DATA.filter(
    (p) => p.id === "solar-enerlytics" || p.id === "alu-design"
  );

  // Deep Dive detail panel (Image 1 style)
  if (activeProject) {
    return (
      <m.div
        key="deep-dive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "#050505",
          zIndex: 9999,
          overflowY: "auto",
          padding: isMobile ? "2rem 1.2rem" : "5rem 6vw",
          color: "#fafaf8",
        }}
        id={`project-deep-dive-${activeProject.id}`}
      >
        <ParticleCanvas />

        {/* Outer Frame with hardware look */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1250px", margin: "0 auto" }}>
          
          {/* Back button */}
          <button
            onClick={() => setActiveProject(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              color: "rgba(255, 255, 255, 0.5)",
              fontFamily: FONT_MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              padding: "8px 0",
              textTransform: "uppercase",
              transition: "color 0.2s ease",
            }}
            id="back-to-featured-btn"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
          >
            <ArrowLeft size={14} />
            <span>BACK TO PROJECTS</span>
          </button>

          {/* Badges and Category Line */}
          <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {activeProject.categoryBadges.map((badge, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.58rem",
                  letterSpacing: "0.1em",
                  color: activeProject.color,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                {badge} {idx < activeProject.categoryBadges.length - 1 ? "•" : ""}
              </span>
            ))}
          </div>

          {/* Huge Serif Display Title */}
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: isMobile ? "2.2rem" : "3.6rem",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "1rem 0 0.5rem 0",
              color: "#ffffff",
            }}
          >
            {activeProject.title}
          </h1>

          {/* Slogan */}
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: isMobile ? "1.1rem" : "1.35rem",
              lineHeight: 1.4,
              color: "rgba(255, 255, 255, 0.65)",
              margin: "0 0 3rem 0",
            }}
          >
            {activeProject.subtitle}
          </p>

          <div
            style={{
              width: "100%",
              height: "1px",
              background: "rgba(255, 255, 255, 0.08)",
              marginBottom: "3rem",
            }}
          />

          {/* Core Content Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.4fr 0.8fr",
              gap: isMobile ? "3rem" : "5rem",
              alignItems: "start",
            }}
          >
            {/* Left Main Article Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              <div>
                <h3
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: isMobile ? "1.3rem" : "1.6rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: "1.2rem",
                  }}
                >
                  {activeProject.deepDiveProblemTitle}
                </h3>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    color: "rgba(255, 255, 255, 0.65)",
                    textAlign: "justify",
                  }}
                >
                  {activeProject.deepDiveProblemBody}
                </p>
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: isMobile ? "1.3rem" : "1.6rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: "1.2rem",
                  }}
                >
                  {activeProject.deepDiveSolutionTitle}
                </h3>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    color: "rgba(255, 255, 255, 0.65)",
                    textAlign: "justify",
                  }}
                >
                  {activeProject.deepDiveSolutionBody}
                </p>
              </div>

              {/* Row of project screenshots with descriptive caption margins */}
              <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <h4
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.68rem",
                    letterSpacing: "0.15em",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Project Telematics & Screenshots
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                    gap: "1rem",
                  }}
                >
                  {/* Photo 1 */}
                  <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", borderRadius: "4px", overflow: "hidden" }}>
                    <img
                      src={
                        activeProject.id === "vaidya-mithra" ? "/vaidyamithra1.jpg" :
                        activeProject.id === "namma-raitha" ? "/nammaraitha1.jpg" :
                        activeProject.id === "solar-enerlytics" ? "/solar1.jpg" :
                        activeProject.id === "smart-waste" ? "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80" :
                        activeProject.id === "trip-tracker" ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" :
                        "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={`${activeProject.title} view 1`}
                      referrerPolicy="no-referrer"
                      style={{ width: "100%", height: "130px", objectFit: "cover", display: "block", borderBottom: "1px solid rgba(255,255,255,0.08)", filter: "grayscale(1) brightness(0.8) contrast(1.15)" }}
                    />
                    <div style={{ padding: "0.6rem 0.8rem" }}>
                      <span style={{ fontFamily: FONT_MONO, fontSize: "0.5rem", color: activeProject.color, display: "block", textTransform: "uppercase", fontWeight: 700 }}>CAPTURE_01</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: "0.74rem", color: "rgba(255, 255, 255, 0.45)" }}>Primary Platform View</span>
                    </div>
                  </div>

                  {/* Photo 2 */}
                  <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", borderRadius: "4px", overflow: "hidden" }}>
                    <img
                      src={
                        activeProject.id === "vaidya-mithra" ? "/vaidyamithra2.jpg" :
                        activeProject.id === "namma-raitha" ? "/nammaraitha2.jpg" :
                        activeProject.id === "solar-enerlytics" ? "/solar2.jpg" :
                        activeProject.id === "smart-waste" ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" :
                        activeProject.id === "trip-tracker" ? "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80" :
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={`${activeProject.title} view 2`}
                      referrerPolicy="no-referrer"
                      style={{ width: "100%", height: "130px", objectFit: "cover", display: "block", borderBottom: "1px solid rgba(255,255,255,0.08)", filter: "grayscale(1) brightness(0.8) contrast(1.15)" }}
                    />
                    <div style={{ padding: "0.6rem 0.8rem" }}>
                      <span style={{ fontFamily: FONT_MONO, fontSize: "0.5rem", color: activeProject.color, display: "block", textTransform: "uppercase", fontWeight: 700 }}>CAPTURE_02</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: "0.74rem", color: "rgba(255, 255, 255, 0.45)" }}>Console Interface Runs</span>
                    </div>
                  </div>

                  {/* Photo 3 */}
                  <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", borderRadius: "4px", overflow: "hidden" }}>
                    <img
                      src={
                        activeProject.id === "vaidya-mithra" ? "/vaidyamithra3.jpg" :
                        activeProject.id === "namma-raitha" ? "/nammaraitha3.jpg" :
                        activeProject.id === "solar-enerlytics" ? "/solar3.jpg" :
                        activeProject.id === "smart-waste" ? "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80" :
                        activeProject.id === "trip-tracker" ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" :
                        "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={`${activeProject.title} view 3`}
                      referrerPolicy="no-referrer"
                      style={{ width: "100%", height: "130px", objectFit: "cover", display: "block", borderBottom: "1px solid rgba(255,255,255,0.08)", filter: "grayscale(1) brightness(0.8) contrast(1.15)" }}
                    />
                    <div style={{ padding: "0.6rem 0.8rem" }}>
                      <span style={{ fontFamily: FONT_MONO, fontSize: "0.5rem", color: activeProject.color, display: "block", textTransform: "uppercase", fontWeight: 700 }}>CAPTURE_03</span>
                      <span style={{ fontFamily: FONT_SANS, fontSize: "0.74rem", color: "rgba(255, 255, 255, 0.45)" }}>Verification Logs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Tech details / Specs Column */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.01)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "2.2rem",
                borderRadius: "4px",
                position: "relative",
              }}
            >
              {/* Stats widget if available */}
              {activeProject.statsValue && (
                <div>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.58rem",
                      letterSpacing: "0.15em",
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {activeProject.statsLabel}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: "3rem",
                      fontWeight: 800,
                      color: activeProject.color,
                      display: "block",
                      lineHeight: 1,
                    }}
                  >
                    {activeProject.statsValue}
                  </span>
                </div>
              )}

              {/* Core Features list */}
              <div>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.58rem",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "1rem",
                  }}
                >
                  Key Architectural Features
                </span>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyleType: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {activeProject.keyFeatures.map((feat, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: "0.85rem",
                        color: "rgba(255, 255, 255, 0.75)",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: activeProject.color }}>▪</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                {activeProject.url && (
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily: FONT_SANS,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "10px",
                      background: activeProject.color,
                      color: "#000",
                      borderRadius: "4px",
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Launch Live
                  </a>
                )}
                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      fontFamily: FONT_SANS,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "10px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "4px",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = activeProject.color;
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    View Source
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </m.div>
    );
  }

  // Row projects list rendering engine (Image 2 style)
  const renderGridSection = (title: string, color: string, projects: Project[]) => (
    <div style={{ marginBottom: "4.5rem" }}>
      {/* Small Caps Label Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "0.95rem",
            letterSpacing: "0.22em",
            color: color,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {title}
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* 2-column responsive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: "1.5rem",
        }}
      >
        {projects.map((p) => (
          <m.div
            key={p.id}
            whileHover={{ y: -6, borderColor: p.color + "99" }}
            onClick={() => {
              setActiveProject(p);
              trackClick(`Opened Project: ${p.title}`, "project", undefined, "projects");
            }}
            style={{
              background: "rgba(10, 10, 10, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "4px",
              padding: "1.8rem",
              cursor: "pointer",
              transition: "border-color 0.35s ease, transform 0.35s ease",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
            id={`project-card-${p.id}`}
          >
            {/* Top Corner Badge Line */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem", width: "100%" }}>
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "1.7rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                {p.title}
              </span>
              
              <div style={{ display: "flex", gap: "6px" }}>
                {p.categoryBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.5rem",
                      letterSpacing: "0.05em",
                      border: `1px solid ${p.color}45`,
                      color: p.color,
                      padding: "2px 6px",
                      borderRadius: "10px",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.9rem",
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.75)",
                margin: "0 0 0.4rem 0",
              }}
            >
              {p.subtitle}
            </p>

            {/* Micro Metadata tag */}
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "2rem",
                letterSpacing: "0.05em",
              }}
            >
              {p.meta}
            </span>

            {/* Column Specs Layout mimicking Image 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem", flexGrow: 1, marginTop: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "8px" }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: "0.54rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: "2px" }}>
                  CONTEXT
                </span>
                <span
                  style={{ fontFamily: FONT_SANS, fontSize: "0.78rem", lineHeight: 1.4, color: "rgba(255,255,255,0.55)" }}
                  dangerouslySetInnerHTML={{ __html: p.contextHtml }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "8px" }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: "0.54rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: "2px" }}>
                  APPROACH
                </span>
                <span
                  style={{ fontFamily: FONT_SANS, fontSize: "0.78rem", lineHeight: 1.4, color: "rgba(255,255,255,0.55)" }}
                  dangerouslySetInnerHTML={{ __html: p.approachHtml }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "8px" }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: "0.54rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: "2px" }}>
                  SYSTEM
                </span>
                <span
                  style={{ fontFamily: FONT_SANS, fontSize: "0.78rem", lineHeight: 1.4, color: "rgba(255,255,255,0.55)" }}
                  dangerouslySetInnerHTML={{ __html: p.systemHtml }}
                />
              </div>
            </div>

            {/* Hover Arrow indicator */}
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                opacity: 0.25,
                color: "#ffffff",
                fontSize: "0.8rem",
              }}
            >
              ↗
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="projects"
      style={{
        padding: isMobile ? "4rem 5vw" : "6rem 8vw",
        background: "transparent",
        position: "relative",
      }}
    >
      {/* Full-Stack & Mobile Engineering Showcase */}
      {renderGridSection("Full-Stack &amp; Mobile Engineering", "#c87eff", fullstackRows)}

      {/* Hardware & Systems Archive */}
      {renderGridSection("Systems &amp; Embedded Foundations", "#2ed4c8", hardwareRows)}

      {/* Distinction & Recognition */}
      <div style={{ marginTop: "4.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.95rem",
              letterSpacing: "0.22em",
              color: "#ffaa2e", // Gold status hue
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            DISTINCTION & RECOGNITION
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        <m.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ borderColor: "rgba(255, 170, 46, 0.45)" }}
          style={{
            background: "linear-gradient(135deg, rgba(255, 170, 46, 0.03) 0%, rgba(10, 10, 10, 0.4) 100%)",
            border: "1px solid rgba(255, 170, 46, 0.15)",
            borderRadius: "8px",
            padding: isMobile ? "2rem" : "2.5rem 3rem",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "2rem",
            position: "relative",
            transition: "border-color 0.35s ease",
            overflow: "hidden",
          }}
        >
          {/* Left indicator line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              background: "#ffaa2e",
              opacity: 0.8,
            }}
          />

          <div
            style={{
              width: "56px",
              height: "56px",
              minWidth: "56px",
              borderRadius: "50%",
              background: "rgba(255, 170, 46, 0.08)",
              border: "1px solid rgba(255, 170, 46, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(255, 170, 46, 0.05)",
            }}
          >
            <Trophy size={26} style={{ color: "#ffaa2e" }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "0.6rem" }}>
              <h3
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: isMobile ? "1.3rem" : "1.6rem",
                  fontWeight: 800,
                  color: "#fafaf8",
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Major Project Showcase
              </h3>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.54rem",
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(255, 170, 46, 0.4)",
                  color: "#ffaa2e",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                2ND PLACE AWARD
              </span>
            </div>
            
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.85rem",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.65)",
                margin: 0,
                fontWeight: 400,
              }}
            >
              Secured Second Place at the RVCE Major Project Showcase for the innovative design and execution of <strong style={{ color: "#ffffff", fontWeight: 600 }}>&ldquo;Solar Enerlytics: A Grid Integrated PV System with Weather Forecast Analysis&rdquo;</strong>.
            </p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
