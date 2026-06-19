import { useEffect } from "react";
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  Firestore, 
  query, 
  orderBy, 
  limit,
  updateDoc
} from "firebase/firestore";

export interface ClickEvent {
  id: string;
  timestamp: number;
  elementType: "link" | "button" | "project" | "other" | string;
  text: string;
  href?: string;
  section?: string;
}

export interface SectionViewEvent {
  section: string;
  timestamp: number;
  duration: number; // in seconds
}

export interface SessionInfo {
  sessionId: string;
  startTime: number;
  lastActive: number;
  browser: string;
  platform: string;
  screenSize: string;
}

export interface AnalyticsData {
  sessions: SessionInfo[];
  clicks: ClickEvent[];
  sectionViews: SectionViewEvent[];
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

const STORAGE_KEY = "dg_portfolio_analytics_data_v1";
const FB_CONFIG_KEY = "dg_portfolio_firebase_credentials_v1";

// Simple helper to get initial simulated stats so the dashboard has rich, realistic charts
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

  for (let i = 0; i < 45; i++) {
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

  sessions.sort((a, b) => a.startTime - b.startTime);
  clicks.sort((a, b) => a.timestamp - b.timestamp);
  sectionViews.sort((a, b) => a.timestamp - b.timestamp);

  return { sessions, clicks, sectionViews };
};

// -------------------------------------------------------------
// Firebase Init & Credentials Resolution
// -------------------------------------------------------------
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Fetch custom configuration from environment variables or localStorage
export const getFirebaseConfig = (): FirebaseConfig | null => {
  // 1. Try checking dynamic credentials entered on the Admin panel
  try {
    const saved = localStorage.getItem(FB_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed as FirebaseConfig;
      }
    }
  } catch (e) {
    console.error("Failed to read dynamic Firebase config from storage:", e);
  }

  // 2. Try clean fallback to environment variables
  const env = (import.meta as any).env || {};
  const envKey = env.VITE_FIREBASE_API_KEY;
  const envProj = env.VITE_FIREBASE_PROJECT_ID;
  if (envKey && envProj) {
    return {
      apiKey: envKey,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${envProj}.firebaseapp.com`,
      projectId: envProj,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${envProj}.appspot.com`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: env.VITE_FIREBASE_APP_ID || "",
    };
  }

  return null;
};

// Save a newly entered config from the Admin settings dashboard
export const saveFirebaseConfig = (config: FirebaseConfig | null) => {
  if (!config) {
    localStorage.removeItem(FB_CONFIG_KEY);
    return;
  }
  localStorage.setItem(FB_CONFIG_KEY, JSON.stringify(config));
};

let db: Firestore | null = null;

export const initFirebaseApp = (): Firestore | null => {
  if (db) return db;
  
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    let app: FirebaseApp;
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    return db;
  } catch (e) {
    console.error("Firebase init crash:", e);
    return null;
  }
};

// Handle error diagnostics in compliance with secure Firebase guide specs
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: false,
      isAnonymous: true,
    },
    operationType,
    path
  };
  console.error('[REAL FIRESTORE DEBUG ERROR]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// Core Business Helpers
// -------------------------------------------------------------

export const getLocalAnalyticsData = (includeSimulated = false): AnalyticsData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: AnalyticsData = { sessions: [], clicks: [], sectionViews: [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const data = JSON.parse(raw) as AnalyticsData;
    
    if (!data.clicks) data.clicks = [];
    if (!data.sessions) data.sessions = [];
    if (!data.sectionViews) data.sectionViews = [];

    return data;
  } catch (error) {
    console.error("Analytics local read error:", error);
    return { sessions: [], clicks: [], sectionViews: [] };
  }
};

export const saveLocalAnalyticsData = (data: AnalyticsData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Analytics local save error:", error);
  }
};

// Return a unified or real database-driven data layout
export const getAnalyticsData = (includeSimulated = false): AnalyticsData => {
  // Default fallback
  return getLocalAnalyticsData(includeSimulated);
};

export const trackClick = async (text: string, type: ClickEvent["elementType"] = "other", href?: string, section?: string) => {
  const nowRaw = Date.now();
  const event: ClickEvent = {
    id: `clk_${nowRaw}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: nowRaw,
    elementType: type,
    text,
    href: href || "",
    section: section || "global",
  };

  // 1. Save locally
  const localData = getLocalAnalyticsData(false);
  localData.clicks.push(event);
  saveLocalAnalyticsData(localData);

  // 2. Dispatch for live local listening UI elements
  window.dispatchEvent(new CustomEvent("dg_analytics_click", { detail: event }));

  // 3. Sync to real Firestore if configured
  const fdb = initFirebaseApp();
  if (fdb) {
    const path = `clicks/${event.id}`;
    try {
      await setDoc(doc(fdb, "clicks", event.id), {
        id: event.id,
        timestamp: event.timestamp,
        elementType: event.elementType,
        text: event.text,
        href: event.href || "",
        section: event.section,
        createdAt: new Date()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
};

export const trackSectionView = async (section: string) => {
  const nowRaw = Date.now();
  const event: SectionViewEvent = {
    section,
    timestamp: nowRaw,
    duration: 5,
  };

  // Update local session heartbeat
  const localData = getLocalAnalyticsData(false);
  const currentSessId = sessionStorage.getItem("dg_active_session_id");
  if (currentSessId) {
    const session = localData.sessions.find(s => s.sessionId === currentSessId);
    if (session) {
      session.lastActive = nowRaw;
    }
  }
  localData.sectionViews.push(event);
  saveLocalAnalyticsData(localData);

  // Dispatch live hook
  window.dispatchEvent(new CustomEvent("dg_analytics_section_view", { detail: event }));

  // Sync to Firestore
  const fdb = initFirebaseApp();
  if (fdb) {
    // 1. Add view transaction
    const viewId = `vw_${nowRaw}_${Math.random().toString(36).substring(2, 6)}`;
    const pathView = `sectionViews/${viewId}`;
    try {
      await setDoc(doc(fdb, "sectionViews", viewId), {
        section,
        timestamp: nowRaw,
        duration: 5,
        createdAt: new Date()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, pathView);
    }

    // 2. Update parent session state heartbeat in cloud
    if (currentSessId) {
      const pathSess = `sessions/${currentSessId}`;
      try {
        await updateDoc(doc(fdb, "sessions", currentSessId), {
          lastActive: nowRaw
        });
      } catch (err) {
        // Safe check in case document is not fully indexed yet - fallback write
        try {
          await setDoc(doc(fdb, "sessions", currentSessId), {
            sessionId: currentSessId,
            lastActive: nowRaw
          }, { merge: true });
        } catch (_) {}
      }
    }
  }
};

export const clearAnalytics = () => {
  const fresh: AnalyticsData = {
    sessions: [],
    clicks: [],
    sectionViews: []
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
};

export const initAnalyticsTracker = () => {
  if (typeof window === "undefined") return;

  let sessId = sessionStorage.getItem("dg_active_session_id");
  const now = Date.now();
  
  // Set up active browser details
  const ua = navigator.userAgent;
  let browser = "Other";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edge")) browser = "Edge";

  let platform = "Other";
  if (ua.includes("Macintosh")) platform = "macOS";
  else if (ua.includes("Windows")) platform = "Windows";
  else if (ua.includes("iPhone") || ua.includes("iPad")) platform = "iOS";
  else if (ua.includes("Android")) platform = "Android";
  else if (ua.includes("Linux")) platform = "Linux";

  const size = `${window.innerWidth}x${window.innerHeight}`;

  if (!sessId) {
    sessId = `sess_${now}_${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem("dg_active_session_id", sessId);

    const localData = getLocalAnalyticsData(false);
    const sessionObj: SessionInfo = {
      sessionId: sessId,
      startTime: now,
      lastActive: now,
      browser,
      platform,
      screenSize: size,
    };
    localData.sessions.push(sessionObj);
    saveLocalAnalyticsData(localData);

    // Sync creating new session to Firestore
    const fdb = initFirebaseApp();
    if (fdb) {
      const path = `sessions/${sessId}`;
      setDoc(doc(fdb, "sessions", sessId), {
        ...sessionObj,
        createdAt: new Date(),
      }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, path);
      });
    }
  } else {
    // Pulse dynamic session updates
    const localData = getLocalAnalyticsData(false);
    const session = localData.sessions.find(s => s.sessionId === sessId);
    if (session) {
      session.lastActive = now;
      saveLocalAnalyticsData(localData);
    }

    const fdb = initFirebaseApp();
    if (fdb) {
      setDoc(doc(fdb, "sessions", sessId), {
        lastActive: now,
        browser,
        platform,
        screenSize: size
      }, { merge: true }).catch(() => {});
    }
  }

  // Intercept document click
  const handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const clickable = target.closest("a, button, [role='button']");
    if (!clickable) return;

    const text = clickable.textContent?.trim() || clickable.getAttribute("aria-label") || clickable.getAttribute("title") || "Interacted Element";
    const href = clickable.getAttribute("href") || undefined;
    
    if (window.location.pathname.startsWith("/admin")) return;
    
    let section: string | undefined;
    const parentSection = clickable.closest("section, [id]");
    if (parentSection) {
      section = parentSection.id;
    }

    let isProjectClick = false;
    if (clickable.closest(".project-card") || clickable.getAttribute("data-project-id") || text.toLowerCase().includes("project")) {
      isProjectClick = true;
    }

    trackClick(
      text.length > 50 ? text.slice(0, 47) + "..." : text,
      isProjectClick ? "project" : clickable.tagName.toLowerCase() === "a" ? "link" : "button",
      href,
      section
    );
  };

  document.addEventListener("click", handleGlobalClick, { passive: true });
  return () => {
    document.removeEventListener("click", handleGlobalClick);
  };
};

export const subscribeToSessions = (
  onData: (sessions: SessionInfo[]) => void,
  onAdded: (session: SessionInfo) => void
): (() => void) | null => {
  const fdb = initFirebaseApp();
  if (!fdb) return null;
  return onSnapshot(collection(fdb, "sessions"), (snapshot) => {
    const list: SessionInfo[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        sessionId: doc.id,
        startTime: data.startTime || Date.now(),
        lastActive: data.lastActive || Date.now(),
        browser: data.browser || "Other",
        platform: data.platform || "Other",
        screenSize: data.screenSize || "1440x900",
      });
    });
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        onAdded({
          sessionId: change.doc.id,
          startTime: data.startTime || Date.now(),
          lastActive: data.lastActive || Date.now(),
          browser: data.browser || "Other",
          platform: data.platform || "Other",
          screenSize: data.screenSize || "1440x900",
        });
      }
    });
    onData(list);
  }, (err) => {
    console.error("Firestore sessions subscription err", err);
  });
};

export const subscribeToClicks = (
  onData: (clicks: ClickEvent[]) => void,
  onAdded: (click: ClickEvent) => void
): (() => void) | null => {
  const fdb = initFirebaseApp();
  if (!fdb) return null;
  return onSnapshot(collection(fdb, "clicks"), (snapshot) => {
    const list: ClickEvent[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: doc.id,
        timestamp: data.timestamp || Date.now(),
        elementType: data.elementType || "other",
        text: data.text || "Action Item",
        href: data.href,
        section: data.section,
      });
    });
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        onAdded({
          id: change.doc.id,
          timestamp: data.timestamp || Date.now(),
          elementType: data.elementType || "other",
          text: data.text || "Action Item",
          href: data.href,
          section: data.section,
        });
      }
    });
    list.sort((a, b) => a.timestamp - b.timestamp);
    onData(list);
  }, (err) => {
    console.error("Firestore clicks subscription err", err);
  });
};

export const subscribeToSectionViews = (
  onData: (views: SectionViewEvent[]) => void,
  onAdded: (view: SectionViewEvent) => void
): (() => void) | null => {
  const fdb = initFirebaseApp();
  if (!fdb) return null;
  return onSnapshot(collection(fdb, "sectionViews"), (snapshot) => {
    const list: SectionViewEvent[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        section: data.section || "global",
        timestamp: data.timestamp || Date.now(),
        duration: data.duration || 5,
      });
    });
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        onAdded({
          section: data.section || "global",
          timestamp: data.timestamp || Date.now(),
          duration: data.duration || 5,
        });
      }
    });
    list.sort((a, b) => a.timestamp - b.timestamp);
    onData(list);
  }, (err) => {
    console.error("Firestore sectionViews subscription err", err);
  });
};

