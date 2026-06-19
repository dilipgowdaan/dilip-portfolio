import React, { useState, useEffect, useRef } from "react";
import { 
  BarChart, 
  MousePointer, 
  Clock, 
  Sparkles, 
  Database, 
  Terminal, 
  RefreshCw, 
  Trash2, 
  ChevronRight, 
  Globe, 
  Laptop, 
  Award,
  Eye,
  Settings,
  X,
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { 
  getAnalyticsData, 
  clearAnalytics, 
  ClickEvent, 
  SectionViewEvent, 
  SessionInfo,
  AnalyticsData,
  trackClick,
  getFirebaseConfig,
  saveFirebaseConfig,
  initFirebaseApp,
  subscribeToSessions,
  subscribeToClicks,
  subscribeToSectionViews
} from "../utils/analytics";

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [includeSimulated, setIncludeSimulated] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState(getAnalyticsData(true));
  const [realTimeLogs, setRealTimeLogs] = useState<string[]>([]);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(!!getFirebaseConfig());
  const [firebaseKey, setFirebaseKey] = useState<string>(
    getFirebaseConfig() ? JSON.stringify(getFirebaseConfig(), null, 2) : ""
  );
  const [selectedTab, setSelectedTab] = useState<"overview" | "clicks" | "system">("overview");

  // General simulated stats builder (used if telemetry has < 5 entries to preserve design bento charts)
  const generateSimulatedData = (): AnalyticsData => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const sessions: SessionInfo[] = [];
    const clicks: ClickEvent[] = [];
    const sectionViews: SectionViewEvent[] = [];
    const platforms = ["macOS", "Windows", "iOS", "Android", "Linux"];
    const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
    const screenSizes = ["1920x1080", "1440x900", "390x844 (Mobile)", "412x915 (Mobile)", "2560x1440"];
    const sections = ["hero", "about", "experience", "projects", "stack", "contact"];
    const clickActions = [
      { text: "Download Resume", href: "/resume.pdf", type: "link", sec: "about" },
      { text: "Contact Me (Email)", href: "mailto:dilipgoda7259447817@gmail.com", type: "link", sec: "contact" },
      { text: "GitHub", href: "https://github.com/...", type: "link", sec: "hero" },
      { text: "LinkedIn", href: "https://linkedin.com/...", type: "link", sec: "hero" },
      { text: "Namma Raitha Project", href: "#", type: "project", sec: "projects" },
      { text: "IoT Solar Tracker Project", href: "#", type: "project", sec: "projects" },
      { text: "Submit Message", href: "", type: "button", sec: "contact" },
    ];

    for (let i = 0; i < 35; i++) {
      const timeOffset = Math.random() * 7 * dayMs;
      const sessionTime = now - timeOffset;
      const sessId = `sess_${i}_${sessionTime}`;
      sessions.push({
        sessionId: sessId,
        startTime: sessionTime,
        lastActive: sessionTime + Math.random() * 600 * 1000,
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        screenSize: screenSizes[Math.floor(Math.random() * screenSizes.length)],
      });
      const visitedCount = 2 + Math.floor(Math.random() * 4);
      for (let s = 0; s < visitedCount; s++) {
        sectionViews.push({
          section: sections[s],
          timestamp: sessionTime + s * 30000,
          duration: Math.floor(10 + Math.random() * 120),
        });
      }
      if (Math.random() > 0.3) {
        const clickCount = 1 + Math.floor(Math.random() * 3);
        for (let c = 0; c < clickCount; c++) {
          const action = clickActions[Math.floor(Math.random() * clickActions.length)];
          clicks.push({
            id: `clk_${i}_${c}_${sessionTime + c * 40000}`,
            timestamp: sessionTime + c * 40000,
            elementType: action.type,
            text: action.text,
            href: action.href || undefined,
            section: action.sec,
          });
        }
      }
    }
    return { sessions, clicks, sectionViews };
  };

  // Load and refresh local analytics data
  const refreshStats = () => {
    const data = getAnalyticsData(includeSimulated);
    setAnalytics(data);
    
    // Seed system log preview feeds
    const logs: string[] = [];
    const lastClicks = [...data.clicks].slice(-8).reverse();
    lastClicks.forEach((c) => {
      const date = new Date(c.timestamp).toLocaleTimeString();
      logs.push(`[${date}] CLICK: "${c.text}" on section: [${c.section || "unknown"}]`);
    });
    data.sessions.slice(-4).forEach((s) => {
      const sDate = new Date(s.startTime).toLocaleTimeString();
      logs.push(`[${sDate}] CONNECT: Session ${s.sessionId.slice(0, 8)} (${s.platform} / ${s.browser})`);
    });
    setRealTimeLogs(logs.slice(0, 15));
  };

  // Real-time Firestore socket listener integration
  useEffect(() => {
    const fdb = initFirebaseApp();
    
    if (!fdb) {
      // Offline local tracker mode check
      refreshStats();

      const handleLiveClick = (e: Event) => {
        const click = (e as CustomEvent<ClickEvent>).detail;
        const date = new Date(click.timestamp).toLocaleTimeString();
        const logLine = `[${date}] LIVE CLICK: "${click.text}" (type: ${click.elementType})`;
        setRealTimeLogs(prev => [logLine, ...prev].slice(0, 15));
        setAnalytics(getAnalyticsData(includeSimulated));
      };

      const handleLiveSection = (e: Event) => {
        const view = (e as CustomEvent<SectionViewEvent>).detail;
        const date = new Date(view.timestamp).toLocaleTimeString();
        const logLine = `[${date}] LIVE SCROLL: Entered section [${view.section}]`;
        setRealTimeLogs(prev => [logLine, ...prev].slice(0, 15));
        setAnalytics(getAnalyticsData(includeSimulated));
      };

      window.addEventListener("dg_analytics_click", handleLiveClick);
      window.addEventListener("dg_analytics_section_view", handleLiveSection);

      return () => {
        window.removeEventListener("dg_analytics_click", handleLiveClick);
        window.removeEventListener("dg_analytics_section_view", handleLiveSection);
      };
    } else {
      // Clean Firestore Active Telemetry integration using central subscription wrappers
      setFirebaseConnected(true);
      const timeStr = new Date().toLocaleTimeString();
      setRealTimeLogs([`[${timeStr}] SYSTEM: Connected to real-time Firestore synchronization stream...`]);

      let cloudSessions: SessionInfo[] = [];
      let cloudClicks: ClickEvent[] = [];
      let cloudViews: SectionViewEvent[] = [];

      const unsubSessions = subscribeToSessions(
        (sessionsList) => {
          cloudSessions = sessionsList;
          setAnalytics({
            sessions: [...cloudSessions],
            clicks: [...cloudClicks],
            sectionViews: [...cloudViews]
          });
        },
        (addedSession) => {
          const logDate = new Date(addedSession.startTime).toLocaleTimeString();
          setRealTimeLogs(prev => [`[${logDate}] CLOUD SESSION CONNECT: ID ${addedSession.sessionId.slice(0, 8)} (${addedSession.platform}/${addedSession.browser})`, ...prev].slice(0, 15));
        }
      );

      const unsubClicks = subscribeToClicks(
        (clicksList) => {
          cloudClicks = clicksList;
          setAnalytics({
            sessions: [...cloudSessions],
            clicks: [...cloudClicks],
            sectionViews: [...cloudViews]
          });
        },
        (addedClick) => {
          const logDate = new Date(addedClick.timestamp).toLocaleTimeString();
          setRealTimeLogs(prev => [`[${logDate}] CLOUD CLICK: "${addedClick.text}" on [${addedClick.section || "global"}]`, ...prev].slice(0, 15));
        }
      );

      const unsubViews = subscribeToSectionViews(
        (viewsList) => {
          cloudViews = viewsList;
          setAnalytics({
            sessions: [...cloudSessions],
            clicks: [...cloudClicks],
            sectionViews: [...cloudViews]
          });
        },
        (addedView) => {
          const logDate = new Date(addedView.timestamp).toLocaleTimeString();
          setRealTimeLogs(prev => [`[${logDate}] CLOUD SCROLL: Entered segment [${addedView.section}]`, ...prev].slice(0, 15));
        }
      );

      return () => {
        if (unsubSessions) unsubSessions();
        if (unsubClicks) unsubClicks();
        if (unsubViews) unsubViews();
      };
    }
  }, [includeSimulated]);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your local interaction history? This does not affect active Firestore database records.")) {
      clearAnalytics();
      refreshStats();
      const timeStr = new Date().toLocaleTimeString();
      setRealTimeLogs(prev => [`[${timeStr}] SYSTEM: Reset local sandbox tracker cache successfully.`, ...prev]);
    }
  };

  const handleSimulateClick = (name: string, type: "link" | "button" | "project") => {
    trackClick(name, type, "#", "admin-simulator");
    const timeStr = new Date().toLocaleTimeString();
    setRealTimeLogs(prev => [`[${timeStr}] SIMULATOR: Clicked on element "${name}"`, ...prev].slice(0, 15));
    refreshStats();
  };

  const handleConnectFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Strip outer variable name context or wrappers if visitor pasted with export syntax
      let cleanKey = firebaseKey.trim();
      const match = cleanKey.match(/\{[\s\S]*\}/);
      if (match) {
        cleanKey = match[0];
      }
      const parsed = JSON.parse(cleanKey);
      if (parsed && parsed.apiKey && parsed.projectId) {
        saveFirebaseConfig(parsed);
        setFirebaseConnected(true);
        const timeStr = new Date().toLocaleTimeString();
        setRealTimeLogs(prev => [`[${timeStr}] SYSTEM: Arming dynamic Firebase persistence...`, ...prev]);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        alert("The pasted JSON is missing required fields like apiKey or projectId.");
      }
    } catch (err) {
      alert("Invalid JSON format. Please paste a clean, well-formed Firebase SDK config object JSON.");
    }
  };

  // Process data from database with options for visual simulation overlay
  const combinedAnalytics = {
    sessions: [
      ...analytics.sessions,
      ...(includeSimulated && analytics.sessions.length < 5 ? generateSimulatedData().sessions : [])
    ],
    clicks: [
      ...analytics.clicks,
      ...(includeSimulated && analytics.clicks.length < 10 ? generateSimulatedData().clicks : [])
    ],
    sectionViews: [
      ...analytics.sectionViews,
      ...(includeSimulated && analytics.sectionViews.length < 10 ? generateSimulatedData().sectionViews : [])
    ]
  };

  // Helper calculation metrics
  const totalSessions = combinedAnalytics.sessions.length;
  const totalClicks = combinedAnalytics.clicks.length;
  
  // Calculate average session duration
  let totalDurationSec = 0;
  combinedAnalytics.sessions.forEach(s => {
    const elapsed = Math.max(0, s.lastActive - s.startTime) / 1000;
    totalDurationSec += elapsed > 0 ? elapsed : 15;
  });
  const avgDurationMin = totalSessions > 0 ? Math.round((totalDurationSec / totalSessions) / 60 * 10) / 10 : 1.5;

  // Breakdown clicks by text/element
  const clickTallies: { [key: string]: number } = {};
  combinedAnalytics.clicks.forEach(c => {
    if (c.text) {
      clickTallies[c.text] = (clickTallies[c.text] || 0) + 1;
    }
  });
  const popularClicks = Object.entries(clickTallies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Breakdown sectional views
  const sectionVisits: { [key: string]: number } = {
    hero: 0,
    about: 0,
    experience: 0,
    projects: 0,
    stack: 0,
    contact: 0
  };
  combinedAnalytics.sectionViews.forEach(v => {
    if (sectionVisits[v.section] !== undefined) {
      sectionVisits[v.section]++;
    }
  });

  // Device context analysis
  const browserTallies: { [key: string]: number } = {};
  const platformTallies: { [key: string]: number } = {};
  combinedAnalytics.sessions.forEach(s => {
    browserTallies[s.browser] = (browserTallies[s.browser] || 0) + 1;
    platformTallies[s.platform] = (platformTallies[s.platform] || 0) + 1;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#f5f5f5",
        fontFamily: '"DM Mono", monospace',
        padding: "80px 4vw 40px 4vw",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 500,
        overflowY: "auto"
      }}
    >
      {/* Glow decorations */}
      <div style={{ position: "absolute", top: "10%", left: "15%", width: "250px", height: "250px", background: "rgba(46,212,200,0.04)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "10%", width: "300px", height: "300px", background: "rgba(200,126,255,0.04)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />

      {/* Header Panel */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)", 
          paddingBottom: "1.5rem", 
          marginBottom: "2rem" 
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "8px", height: "8px", background: "#2ed4c8", borderRadius: "50%", boxShadow: "0 0 10px #2ed4c8" }} />
            <h1 style={{ fontSize: "1.2rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "#fff" }}>
              Holographic Admin Console
            </h1>
          </div>
          <p style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.4)", marginTop: "4px" }}>
            Real-time visual monitoring node // HOSTED AT: dilipgowda.xyz/admin
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 16px",
            color: "#fff",
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(240, 80, 80, 0.15)";
            e.currentTarget.style.borderColor = "rgba(240, 80, 80, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          <X size={12} /> EXIT CONSOLE
        </button>
      </div>

      {/* Main Switchers & Tabs */}
      <div 
        style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "1rem", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "2rem"
        }}
      >
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", padding: "3px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => setSelectedTab("overview")}
            style={{
              padding: "6px 16px",
              fontSize: "0.68rem",
              background: selectedTab === "overview" ? "rgba(46,212,200,0.15)" : "transparent",
              color: selectedTab === "overview" ? "#2ed4c8" : "rgba(255,255,255,0.5)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase"
            }}
          >
            Terminal Overview
          </button>
          <button
            onClick={() => setSelectedTab("clicks")}
            style={{
              padding: "6px 16px",
              fontSize: "0.68rem",
              background: selectedTab === "clicks" ? "rgba(46,212,200,0.15)" : "transparent",
              color: selectedTab === "clicks" ? "#2ed4c8" : "rgba(255,255,255,0.5)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase"
            }}
          >
            Interactions Log
          </button>
          <button
            onClick={() => setSelectedTab("system")}
            style={{
              padding: "6px 16px",
              fontSize: "0.68rem",
              background: selectedTab === "system" ? "rgba(46,212,200,0.15)" : "transparent",
              color: selectedTab === "system" ? "#2ed4c8" : "rgba(255,255,255,0.5)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase"
            }}
          >
            Data Settings
          </button>
        </div>

        {/* Mode Toggle Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
          {/* Simulated Mode Option */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>
            <input 
              type="checkbox"
              checked={includeSimulated}
              onChange={(e) => {
                setIncludeSimulated(e.target.checked);
              }}
              style={{
                accentColor: "#2ed4c8",
                cursor: "pointer"
              }}
            />
            Include Global Simulated Traffic
          </label>

          {/* Quick Clear Button */}
          <button
            onClick={handleClear}
            style={{
              background: "rgba(240, 80, 80, 0.05)",
              border: "1px solid rgba(240, 80, 80, 0.2)",
              color: "#ff6c6c",
              padding: "5px 12px",
              fontSize: "0.65rem",
              cursor: "pointer",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Trash2 size={11} /> Reset Real Clicks
          </button>
        </div>
      </div>

      {selectedTab === "overview" && (
        <>
          {/* Key Metric Cards */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
              gap: "1.2rem",
              marginBottom: "2.5rem" 
            }}
          >
            {/* KPI 1 */}
            <div 
              style={{ 
                background: "rgba(10, 10, 10, 0.6)", 
                border: "1px solid rgba(46, 212, 200, 0.15)", 
                borderRadius: "8px", 
                padding: "1.25rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.4)" }}>
                  Total Sessions
                </span>
                <Globe size={14} style={{ color: "#2ed4c8" }} />
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
                {totalSessions}
              </div>
              <p style={{ fontSize: "0.62rem", color: "rgba(46, 212, 200, 0.8)", marginTop: "4px" }}>
                Active multi-device nodes connected
              </p>
            </div>

            {/* KPI 2 */}
            <div 
              style={{ 
                background: "rgba(10, 10, 10, 0.6)", 
                border: "1px solid rgba(200, 126, 255, 0.15)", 
                borderRadius: "8px", 
                padding: "1.25rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.4)" }}>
                  Total Clicks & Actions
                </span>
                <MousePointer size={14} style={{ color: "#c87eff" }} />
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
                {totalClicks}
              </div>
              <p style={{ fontSize: "0.62rem", color: "rgba(200, 126, 255, 0.8)", marginTop: "4px" }}>
                Links, buttons & elements targeted
              </p>
            </div>

            {/* KPI 3 */}
            <div 
              style={{ 
                background: "rgba(10, 10, 10, 0.6)", 
                border: "1px solid rgba(46, 212, 200, 0.15)", 
                borderRadius: "8px", 
                padding: "1.25rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.4)" }}>
                  Avg Session length
                </span>
                <Clock size={14} style={{ color: "#2ed4c8" }} />
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
                {avgDurationMin} min
              </div>
              <p style={{ fontSize: "0.62rem", color: "rgba(46, 212, 200, 0.8)", marginTop: "4px" }}>
                Interaction dwell threshold
              </p>
            </div>

            {/* KPI 4 */}
            <div 
              style={{ 
                background: "rgba(10, 10, 10, 0.6)", 
                border: "1px solid rgba(200, 126, 255, 0.15)", 
                borderRadius: "8px", 
                padding: "1.25rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.4)" }}>
                  Primary Contact Spark
                </span>
                <Sparkles size={14} style={{ color: "#c87eff" }} />
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "8px", textTransform: "uppercase" }}>
                {popularClicks[0]?.[0] || "None Recorded"}
              </div>
              <p style={{ fontSize: "0.62rem", color: "rgba(200, 126, 255, 0.8)", marginTop: "8px" }}>
                Most clicked: {popularClicks[0]?.[1] || 0} times
              </p>
            </div>
          </div>

          {/* Core Analytics Grid */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
              gap: "1.5rem",
              marginBottom: "2.5rem"
            }}
          >
            {/* Section visits bar chart using custom HTML CSS (clean, robust and lightweight) */}
            <div 
              style={{ 
                background: "rgba(8, 8, 8, 0.75)", 
                border: "1px solid rgba(255,255,255,0.06)", 
                borderRadius: "8px", 
                padding: "1.5rem" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Eye size={12} style={{ color: "#2ed4c8" }} /> Section Views Breakdown
                </h3>
                <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)" }}>VISITOR DWELL CHANNELS</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {Object.entries(sectionVisits).map(([section, count]) => {
                  // Find maximum count for percentage scaling
                  const maxCount = Math.max(...Object.values(sectionVisits), 1);
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={section}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", marginBottom: "4px" }}>
                        <span style={{ textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{section}</span>
                        <span style={{ color: "#2ed4c8" }}>{count} views</span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(255,255,255,0.03)", borderRadius: "3px", overflow: "hidden" }}>
                        <div 
                          style={{ 
                            height: "100%", 
                            width: `${percentage}%`, 
                            background: "linear-gradient(to right, #2ed4c8, #c87eff)", 
                            borderRadius: "3px",
                            transition: "width 0.8s ease-out" 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular specific clicks list */}
            <div 
              style={{ 
                background: "rgba(8, 8, 8, 0.75)", 
                border: "1px solid rgba(255,255,255,0.06)", 
                borderRadius: "8px", 
                padding: "1.5rem" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                  <BarChart size={12} style={{ color: "#c87eff" }} /> Top Interaction Triggers
                </h3>
                <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)" }}>ELEMENT TARGETS</span>
              </div>

              {popularClicks.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 0", color: "rgba(255,255,255,0.3)" }}>
                  <p style={{ fontSize: "0.7rem" }}>No click metrics captured in current node.</p>
                  <p style={{ fontSize: "0.6rem", marginTop: "1rem", textAlign: "center" }}>Go scroll and click around, then type /admin to view real-time log statistics.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {popularClicks.map(([text, count], idx) => {
                    const maxCount = popularClicks[0]?.[1] || 1;
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          background: "rgba(255,255,255,0.02)", 
                          border: "1px solid rgba(255,255,255,0.04)", 
                          borderRadius: "4px", 
                          padding: "8px 12px" 
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "75%" }}>
                            {text || "Generic Click"}
                          </span>
                          <span style={{ fontSize: "0.65rem", color: "#c87eff", fontWeight: "bold" }}>{count} triggers</span>
                        </div>
                        <div style={{ height: "3px", background: "rgba(255,255,255,0.02)", borderRadius: "2px" }}>
                          <div 
                            style={{ 
                              height: "100%", 
                              width: `${percentage}%`, 
                              background: "#c87eff", 
                              borderRadius: "2px" 
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Real-time event log & browser metrics */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1.4fr 0.86fr", 
              gap: "1.5rem",
              alignItems: "stretch" 
            }}
          >
            {/* Live terminal telemetry log */}
            <div 
              style={{ 
                background: "#080808", 
                border: "1px solid rgba(255,255,255,0.06)", 
                borderRadius: "8px", 
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Terminal size={12} style={{ color: "#2ed4c8" }} /> Live Telemetry Feed
                </h3>
                <span style={{ fontSize: "0.55rem", padding: "2px 6px", background: "rgba(46,212,200,0.12)", color: "#2ed4c8", borderRadius: "10px", fontWeight: "bold" }}>
                  • LIVE LISTEN ARMED
                </span>
              </div>

              {/* Log Viewport */}
              <div 
                style={{ 
                  background: "#030303", 
                  border: "1px solid rgba(255,255,255,0.03)", 
                  borderRadius: "6px", 
                  padding: "1rem", 
                  fontFamily: '"Fira Code", "JetBrains Mono", monospace', 
                  fontSize: "0.65rem", 
                  color: "rgba(255,255,255,0.85)", 
                  height: "220px", 
                  overflowY: "auto",
                  lineHeight: "1.5rem",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)"
                }}
              >
                {realTimeLogs.length === 0 ? (
                  <div style={{ color: "rgba(255,255,255,0.25)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    &gt; Listening for incoming port interaction nodes...
                  </div>
                ) : (
                  realTimeLogs.map((log, index) => {
                    let color = "rgba(255,255,255,0.5)";
                    if (log.includes("LIVE CLICK")) color = "#ffea79";
                    else if (log.includes("LIVE SCROLL")) color = "#c87eff";
                    else if (log.includes("SYSTEM")) color = "#ff6c6c";
                    else if (log.includes("CONNECT")) color = "#2ed4c8";
                    
                    return (
                      <div key={index} style={{ color, wordBreak: "break-all" }}>
                        &gt; {log}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Emulator / Tester block */}
            <div 
              style={{ 
                background: "rgba(8, 8, 8, 0.75)", 
                border: "1px solid rgba(255,255,255,0.06)", 
                borderRadius: "8px", 
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.85rem" }}>
                  <Laptop size={12} style={{ color: "#2ed4c8" }} /> Interaction Simulator
                </h3>
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", marginBottom: "1rem", lineHeight: "0.95rem" }}>
                  Trigger live testing nodes to verify telemetry logs and verify localStorage statistics updating correctly.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleSimulateClick("Resume PDF Download", "link")}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.8)",
                      padding: "8px",
                      fontSize: "0.65rem",
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.border = "1px solid rgba(46,212,200,0.5)"}
                    onMouseLeave={(e) => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)"}
                  >
                    <span>Simulate Resume Download</span>
                    <Play size={10} style={{ color: "#2ed4c8" }} />
                  </button>

                  <button
                    onClick={() => handleSimulateClick("LinkedIn Social Click", "link")}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.8)",
                      padding: "8px",
                      fontSize: "0.65rem",
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.border = "1px solid rgba(46,212,200,0.5)"}
                    onMouseLeave={(e) => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)"}
                  >
                    <span>Simulate LinkedIn Click</span>
                    <Play size={10} style={{ color: "#2ed4c8" }} />
                  </button>

                  <button
                    onClick={() => handleSimulateClick("Project: Namma Raitha View", "project")}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.8)",
                      padding: "8px",
                      fontSize: "0.65rem",
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.border = "1px solid rgba(46,212,200,0.5)"}
                    onMouseLeave={(e) => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)"}
                  >
                    <span>Simulate Project Select</span>
                    <Play size={10} style={{ color: "#2ed4c8" }} />
                  </button>
                </div>
              </div>

              {/* Status details */}
              <div 
                style={{ 
                  marginTop: "1.5rem", 
                  borderTop: "1px solid rgba(255,255,255,0.05)", 
                  paddingTop: "0.75rem", 
                  fontSize: "0.58rem", 
                  color: "rgba(255,255,255,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>SYS TIME: {new Date().toLocaleTimeString()}</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTab === "clicks" && (
        <div style={{ background: "rgba(8, 8, 8, 0.75)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
              <MousePointer size={12} style={{ color: "#c87eff" }} /> Full Micro-Click Chronological Log
            </h3>
            <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.5)" }}>
              TOTAL CAPTURED: {analytics.clicks.length}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {analytics.clicks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>
                No standard click entries in the telemetry pipeline.
              </div>
            ) : (
              [...analytics.clicks].reverse().map((clk) => {
                const dateStr = new Date(clk.timestamp).toLocaleString();
                return (
                  <div 
                    key={clk.id}
                    style={{
                      background: "rgba(255,255,255,0.01)",
                      border: "1px solid rgba(255,255,255,0.03)",
                      borderRadius: "6px",
                      padding: "10px 15px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span style={{ 
                        fontSize: "0.55rem", 
                        padding: "2px 6px", 
                        background: clk.elementType === "project" ? "rgba(200, 126, 255, 0.15)" : "rgba(46, 212, 200, 0.15)", 
                        color: clk.elementType === "project" ? "#c87eff" : "#2ed4c8", 
                        borderRadius: "3px",
                        lineHeight: "0.7rem",
                        height: "fit-content"
                      }}>
                        {clk.elementType.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#fff", fontWeight: "bold" }}>
                        {clk.text}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "12px", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)" }}>
                      {clk.section && (
                        <span>SECTION: <strong style={{ color: "rgba(255,255,255,0.7)" }}>{clk.section}</strong></span>
                      )}
                      <span>TIME: {dateStr}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {selectedTab === "system" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Setup Panel for Firebase */}
          <div style={{ background: "rgba(8, 8, 8, 0.75)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.85rem" }}>
              <Database size={12} style={{ color: "#2ed4c8" }} /> Firebase Cloud Persistence
            </h3>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", marginBottom: "1.2rem", lineHeight: "0.95rem" }}>
              Want your portfolio metrics to sync into a persistent Firestore cloud database? Enter your API string structure to activate transparent telemetry.
            </p>

            <form onSubmit={handleConnectFirebase} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", marginBottom: "4px", textTransform: "uppercase" }}>
                  CONNECTION STRING OVERLAY (API KEY OR APP ID)
                </label>
                <input 
                  type="password"
                  placeholder="e.g. AIzaSyD-...-firebase-config"
                  value={firebaseKey}
                  onChange={(e) => setFirebaseKey(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#030303",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "#fff",
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "0.68rem"
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#2ed4c8",
                  border: "none",
                  color: "#000",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                ACTIVATE TELEMETRY PORTAL
              </button>
            </form>

            {firebaseConnected ? (
              <div style={{ marginTop: "1.2rem", background: "rgba(46,212,200,0.08)", border: "1px solid rgba(46,212,200,0.3)", borderRadius: "4px", padding: "10px", display: "flex", alignItems: "start", gap: "8px" }}>
                <CheckCircle size={14} style={{ color: "#2ed4c8", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "0.65rem", color: "#2ed4c8", fontWeight: "bold" }}>CONNECTOR ENGAGED</h4>
                  <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
                    Telemetry metrics are actively transmitting to your cloud storage module.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "1.2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "4px", padding: "10px", display: "flex", alignItems: "start", gap: "8px" }}>
                <AlertCircle size={14} style={{ color: "rgba(255,255,255,0.35)", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>LOCAL CACHE ACTIVE</h4>
                  <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                    Currently utilizing high-speed sandbox cache persistence (local container storage).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Technical Debug panel */}
          <div style={{ background: "rgba(8, 8, 8, 0.75)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.85rem" }}>
              <Settings size={12} style={{ color: "#c87eff" }} /> Active Session Context
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.65rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>PORT PROTOCOL</span>
                <span>HTTPS / SPA CATCH-ALL</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>DOMAIN DEPLOY</span>
                <span style={{ color: "#2ed4c8" }}>dilipgowda.xyz</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>TRACKER REVISION</span>
                <span>v1.2.4-Holo</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>BROWSER ENGINE</span>
                <span>{navigator.userAgent.slice(0, 30)}...</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>ACTIVE DEVICE SCREEN</span>
                <span>{window.innerWidth} x {window.innerHeight}</span>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", background: "rgba(200,126,255,0.05)", border: "1px solid rgba(200,126,255,0.12)", borderRadius: "4px", padding: "10px", fontSize: "0.62rem", lineHeight: "0.95rem", color: "rgba(255,255,255,0.7)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#c87eff", fontWeight: "bold", marginBottom: "4px" }}>
                <Award size={12} /> SECURE CRYPTOGRAPHIC TOKEN
              </div>
              Your telemetry dashboard node operates inside client-authoritative headers. The path `/admin` does not expose system keys. To guard stats behind locks, add a passcode state directly into verification flow.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
