import { Github, Linkedin, Mail, FileDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import React, { useRef, useCallback, useState, useEffect } from "react";
import { useIsMobile, useIsTouchDevice } from "../hooks/useMediaQuery";
import { scrollToSection } from "../hooks/useHashScroll";

const CONTACT_EMAIL = "contact@dilipgowda.xyz";

export function Hero() {
  const isMobile = useIsMobile();
  const isTouchDevice = useIsTouchDevice();
  const layerText = useRef<HTMLDivElement>(null);
  const layerPhoto = useRef<HTMLDivElement>(null);
  const layerPills = useRef<HTMLDivElement>(null);
  const pendingRaf = useRef(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [workOpen, setWorkOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);
  const workTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false);

  const [avatarSrc, setAvatarSrc] = useState("/profile.jpg");
  const [imgFailed, setImgFailed] = useState(false);

  const handleAvatarError = () => {
    if (avatarSrc === "/profile.jpg") {
      setAvatarSrc("/icons/profile.jpg");
    } else {
      setImgFailed(true);
    }
  };

  const [typewriterText, setTypewriterText] = useState("");
  const fullSubtitle = "Electronics and Embedded Systems Engineer";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullSubtitle.length) {
        setTypewriterText(fullSubtitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  const openWork = useCallback(() => {
    if (workTimerRef.current) clearTimeout(workTimerRef.current);
    setWorkOpen(true);
  }, []);

  const scheduleCloseWork = useCallback(() => {
    workTimerRef.current = setTimeout(() => setWorkOpen(false), 140);
  }, []);

  useEffect(() => {
    if (!workOpen) return;
    const handler = (e: MouseEvent) => {
      if (workRef.current && !workRef.current.contains(e.target as Node)) {
        setWorkOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [workOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  const showToast = useCallback((msg: string, duration = 1600) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), duration);
  }, []);

  const copyEmailToClipboard = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        showToast("Email copied to clipboard!");
      } else {
        showToast(CONTACT_EMAIL);
      }
    } catch {
      showToast(CONTACT_EMAIL, 1800);
    }
  }, [showToast]);

  const handleResumeDownload = useCallback(() => {
    showToast("Downloading CV...");
    const link = document.createElement("a");
    link.href = "/Dilip_Kumar_CV.pdf";
    link.setAttribute("download", "Dilip_Kumar_CV.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }, [showToast]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (pendingRaf.current) return;
    const cx = e.clientX,
      cy = e.clientY;
    pendingRaf.current = requestAnimationFrame(() => {
      pendingRaf.current = 0;
      const W = window.innerWidth,
        H = window.innerHeight;
      const x = (cx / W - 0.5) * 2;
      const y = (cy / H - 0.5) * 2;
      if (layerText.current)
        layerText.current.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
      if (layerPhoto.current)
        layerPhoto.current.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg) translate(${x * 12}px, ${y * 8}px)`;
      if (layerPills.current)
        layerPills.current.style.transform = `translate(${x * 14}px, ${y * 9}px)`;
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    [layerText, layerPhoto, layerPills].forEach((r) => {
      if (r.current) {
        r.current.style.transform = "none";
        r.current.style.transition =
          "transform 0.9s cubic-bezier(0.23,1,0.32,1)";
      }
    });
  }, []);

  const onMouseEnterSection = useCallback(() => {
    [layerText, layerPhoto, layerPills].forEach((r) => {
      if (r.current) r.current.style.transition = "transform 0.08s ease-out";
    });
  }, []);

  return (
    <section
      id="hero"
      onMouseMove={isTouchDevice ? undefined : onMouseMove}
      onMouseLeave={isTouchDevice ? undefined : onMouseLeave}
      onMouseEnter={isTouchDevice ? undefined : onMouseEnterSection}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "0 5.5vw" : "0 8.5vw",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
          gap: isMobile ? "2.5rem" : "4vw",
          alignItems: "center",
          paddingTop: isMobile ? "70px" : "80px",
          marginTop: isMobile ? "0" : "-5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div ref={layerText} style={{ willChange: "transform" }}>
          {/* Availability Badge */}
          <m.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              marginBottom: "1.5rem",
              width: "fit-content",
            }}
          >
            <span style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
              <span style={{
                animation: "pulse 2s infinite",
                position: "absolute",
                display: "inline-flex",
                height: "100%",
                width: "100%",
                borderRadius: "50%",
                background: "#ffffff",
                opacity: 0.75,
              }} />
              <span style={{
                position: "relative",
                display: "inline-flex",
                borderRadius: "50%",
                height: "8px",
                width: "8px",
                background: "#fafaf8",
              }} />
            </span>
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "0.58rem",
                letterSpacing: "0.15em",
                color: "rgba(255, 255, 255, 0.85)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Available for Software &amp; Embedded Roles
            </span>
          </m.div>

          <div
            style={{
              overflow: "visible",
              marginBottom: "1.5rem",
            }}
          >
            <m.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.45,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: '"Editorial New", "Playfair Display", Georgia, serif',
                fontSize: isMobile
                  ? "clamp(2.4rem, 7.2vw, 4.2rem)"
                  : "clamp(3.8rem, 6.4vw, 5.2rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "0.01em",
                color: "#fafaf8",
                margin: 0,
                display: "block",
                whiteSpace: "nowrap",
              }}
            >
              Dilip Kumar A N
            </m.h1>
          </div>

          {/* Typewriter Subtitle */}
          <div style={{ overflow: "hidden", minHeight: "2.5rem", marginBottom: "1.5rem" }}>
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: isMobile ? "0.95rem" : "1.15rem",
                color: "rgba(255, 255, 255, 0.85)",
                margin: 0,
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              {typewriterText}
              <span className="blink-cursor" style={{ marginLeft: "4px", color: "rgba(255,255,255,0.75)" }}>|</span>
            </m.p>
          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "1.2rem" : "2.5rem",
              marginBottom: isMobile ? "1.8rem" : "2.2rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.3rem",
                }}
              >
                Focus
              </p>
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.85rem",
                  color: "#e8e0d0",
                  lineHeight: 1.4,
                }}
              >
                Electronics &amp; Communication Engineer
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.3rem",
                }}
              >
                Specialty
              </p>
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: "0.85rem",
                  color: "#e8e0d0",
                  lineHeight: 1.4,
                }}
              >
                IoT Solutions, RTL Coding &amp; Full Stack Web Designer
              </p>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "0.65rem",
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait">
              {toastMessage && (
                <m.div
                  key={toastMessage}
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    left: 0,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.78rem",
                    color: "#4ade80",
                    border: "1px solid rgba(74,222,128,0.35)",
                    background: "rgba(74,222,128,0.06)",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                    pointerEvents: "none",
                  }}
                >
                  {toastMessage}
                </m.div>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {[
                {
                  href: `mailto:${CONTACT_EMAIL}`,
                  icon: <Mail size={15} />,
                  label: "Email",
                },
                {
                  href: "https://github.com/dilipgowdaan",
                  icon: <Github size={15} />,
                  label: "GitHub",
                },
                {
                  href: "https://linkedin.com/in/dilipkumaran",
                  icon: <Linkedin size={15} />,
                  label: "LinkedIn",
                },
              ].map(({ href, icon, label }) => (
                <m.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  onClick={
                    href.startsWith("mailto:")
                      ? (e) => {
                          e.preventDefault();
                          void copyEmailToClipboard();
                        }
                      : undefined
                  }
                  whileHover={{ y: -2 }}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.65)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#e8e0d0";
                    el.style.color = "#e8e0d0";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "rgba(255,255,255,0.65)";
                  }}
                >
                  {icon}
                </m.a>
              ))}

              {!isMobile && (
                <m.button
                  onClick={handleResumeDownload}
                  whileHover={{ y: -2 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    height: "38px",
                    padding: "0 18px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#e8e0d0",
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "0.58rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "border 0.2s, background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#4ade80";
                    el.style.color = "#4ade80";
                    el.style.background = "rgba(74,222,128,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "#e8e0d0";
                    el.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <FileDown size={11} />
                  <span>Request CV</span>
                </m.button>
              )}
            </div>

            {isMobile && (
              <m.button
                onClick={handleResumeDownload}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  height: "38px",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#e8e0d0",
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: "0.25rem",
                  cursor: "auto",
                }}
              >
                <FileDown size={11} />
                <span>Request CV</span>
              </m.button>
            )}
          </m.div>
        </div>

        {/* RIGHT - portrait holographic container with glowing circles */}
        <div
          ref={layerPhoto}
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            willChange: "transform",
          }}
        >
          <div
            style={{
              position: "relative",
              width: isMobile ? "240px" : "300px",
              height: isMobile ? "240px" : "300px",
              borderRadius: "50%",
              border: "1px dashed rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle, rgba(255,255,255,0.01) 0%, transparent 70%)",
            }}
          >
            <m.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: "-15px",
                borderRadius: "50%",
                border: "1px dotted rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />
            <m.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: "15px",
                borderRadius: "50%",
                border: "1px dashed rgba(255,255,255,0.04)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                width: isMobile ? "180px" : "220px",
                height: isMobile ? "180px" : "220px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(10, 10, 10, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(255,255,255,0.03)",
                position: "relative",
              }}
            >
              {!imgFailed ? (
                <img
                  src={avatarSrc}
                  alt="Dilip Kumar A N"
                  onError={handleAvatarError}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  style={{
                    fontFamily: '"Editorial New", "Playfair Display", Georgia, serif',
                    fontSize: isMobile ? "2.5rem" : "3.2rem",
                    fontWeight: 100,
                    color: "rgba(255, 255, 255, 0.25)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  DKA
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
