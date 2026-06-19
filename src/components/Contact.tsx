import React, { useState, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { Mail, Github, Linkedin, MapPin, FileDown, Send } from "lucide-react";
import { useIsMobile } from "../hooks/useMediaQuery";
import emailjs from "@emailjs/browser";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

export function Contact() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  
  // States for copy/download
  const [copyToastMessage, setCopyToastMessage] = useState<string | null>(null);
  const [downloadToastMessage, setDownloadToastMessage] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const copyEmailToClipboard = async (emailStr = "dilipgowda7259@gmail.com") => {
    try {
      await globalThis.navigator.clipboard.writeText(emailStr);
      setCopyToastMessage("Copied!");
      setTimeout(() => setCopyToastMessage(null), 1600);
    } catch {
      setCopyToastMessage("Could not copy");
      setTimeout(() => setCopyToastMessage(null), 1800);
    }
  };

  const handleResumeDownload = () => {
    setDownloadToastMessage("Downloading...");
    setTimeout(() => setDownloadToastMessage(null), 2000);
    const link = document.createElement("a");
    link.href = "/Dilip_Kumar_CV.pdf";
    link.setAttribute("download", "Dilip_Kumar_CV.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("error");
      setFormMessage("Please fill out all fields.");
      setTimeout(() => {
        setFormStatus("idle");
        setFormMessage("");
      }, 3000);
      return;
    }

    setFormStatus("sending");
    
    // Using hardcoded keys to prevent build compilation warnings in this environment
    const serviceId = 'service_bvptl1g'; 
    const templateId = 'template_q9d2t3t';
    const publicKey = 'jMeHyyiKaYCLnBG4o';

    emailjs.send(
      serviceId,
      templateId,
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        reply_to: formData.email,
      },
      publicKey
    )
    .then((result) => {
      setFormStatus("success");
      setFormMessage("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => {
        setFormStatus("idle");
        setFormMessage("");
      }, 5000);
    })
    .catch((error) => {
      console.error(error);
      setFormStatus("error");
      setFormMessage("Failed to send message. Please try again or email me at contact@dilipgowda.xyz");
      setTimeout(() => {
        setFormStatus("idle");
        setFormMessage("");
      }, 5000);
    });
  };

  const links = [
    {
      label: "Resume CV",
      value: "Dilip_Kumar_CV.pdf",
      href: "/Dilip_Kumar_CV.pdf",
      icon: <FileDown size={14} />,
      download: "Dilip_Kumar_CV.pdf",
    },
    {
      label: "Personal Email",
      value: "dilipgowda7259@gmail.com",
      href: "mailto:dilipgowda7259@gmail.com",
      icon: <Mail size={14} />,
    },
    {
      label: "Domain Email",
      value: "contact@dilipgowda.xyz",
      href: "mailto:contact@dilipgowda.xyz",
      icon: <Mail size={14} />,
    },
    {
      label: "GitHub",
      value: "github.com/dilipgowdaan",
      href: "https://github.com/dilipgowdaan",
      icon: <Github size={14} />,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/dilipkumaran",
      href: "https://linkedin.com/in/dilipkumaran",
      icon: <Linkedin size={14} />,
    },
    {
      label: "Location",
      value: "Bangalore, India",
      href: "https://maps.google.com/?q=Bangalore,India",
      icon: <MapPin size={14} />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        position: "relative",
        background: "transparent",
        padding: isMobile ? "4rem 5vw" : "6rem 8vw 4rem",
      }}
    >
      <div>
        <div style={{ marginBottom: isMobile ? "2.5rem" : "4rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
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
              CONTACT
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
                  ? "clamp(1.6rem, 5vw, 3rem)"
                  : "clamp(2.4rem, 4vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "0.01em",
                color: "#fafaf8",
                margin: 0,
              }}
            >
              Let's build together.
            </m.h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
            gap: isMobile ? "2.5rem" : "4rem",
            alignItems: "stretch",
          }}
        >
          {/* Transparent Contact Form Card with Rounded Corners and Thin Outline */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: isMobile ? "1.8rem 1.4rem" : "2.5rem",
              position: "relative",
              overflow: "visible",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Decortative low-opacity envelope outline in the corner */}
            <div
              style={{
                position: "absolute",
                top: "2.5rem",
                right: "2.2rem",
                opacity: 0.04,
                color: "#ffffff",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h3
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: isMobile ? "1.4rem" : "1.8rem",
                  fontWeight: 700,
                  color: "#fafaf8",
                  margin: "0 0 0.5rem 0",
                  letterSpacing: "-0.01em",
                }}
              >
                Let's Connect
              </h3>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: isMobile ? "0.85rem" : "0.95rem",
                  color: "rgba(255,255,255,0.45)",
                  margin: "0 0 2rem 0",
                  lineHeight: 1.5,
                }}
              >
                Fill out the form below and I'll get back to you promptly.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.2rem" }}>
                  {/* Name field */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label
                      htmlFor="form-name"
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        color: "rgba(255, 255, 255, 0.45)",
                        textTransform: "uppercase",
                      }}
                    >
                      Your Name
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((pw) => ({ ...pw, name: e.target.value }))}
                      disabled={formStatus === "sending" || formStatus === "success"}
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: "0.9rem",
                        color: "#fafaf8",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
                        e.target.style.background = "rgba(255, 255, 255, 0.04)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        e.target.style.background = "rgba(255, 255, 255, 0.02)";
                      }}
                    />
                  </div>

                  {/* Email field */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label
                      htmlFor="form-email"
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        color: "rgba(255, 255, 255, 0.45)",
                        textTransform: "uppercase",
                      }}
                    >
                      Your Email
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((pw) => ({ ...pw, email: e.target.value }))}
                      disabled={formStatus === "sending" || formStatus === "success"}
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: "0.9rem",
                        color: "#fafaf8",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
                        e.target.style.background = "rgba(255, 255, 255, 0.04)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        e.target.style.background = "rgba(255, 255, 255, 0.02)";
                      }}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label
                    htmlFor="form-message"
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.68rem",
                      letterSpacing: "0.1em",
                      color: "rgba(255, 255, 255, 0.45)",
                      textTransform: "uppercase",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="form-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((pw) => ({ ...pw, message: e.target.value }))}
                    disabled={formStatus === "sending" || formStatus === "success"}
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: "0.9rem",
                      color: "#fafaf8",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      outline: "none",
                      resize: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.25)";
                      e.target.style.background = "rgba(255, 255, 255, 0.04)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.target.style.background = "rgba(255, 255, 255, 0.02)";
                    }}
                  />
                </div>

                {/* Submit Feedback */}
                <AnimatePresence mode="wait">
                  {formMessage && (
                    <m.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: "0.85rem",
                        margin: 0,
                        color: formStatus === "success" ? "#4ade80" : "#f87171",
                      }}
                    >
                      {formMessage}
                    </m.p>
                  )}
                </AnimatePresence>

                {/* Send Button */}
                <m.button
                  type="submit"
                  disabled={formStatus === "sending" || formStatus === "success"}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "#6366f1",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontFamily: FONT_SANS,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "0.5rem",
                    transition: "all 0.25s ease",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    alignSelf: isMobile ? "stretch" : "flex-start",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#5053e1";
                    el.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.45)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#6366f1";
                    el.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
                  }}
                >
                  <Send size={15} />
                  <span>
                    {formStatus === "sending" ? "Sending..." : formStatus === "success" ? "Sent!" : "Send Message"}
                  </span>
                </m.button>
              </form>
            </div>
          </m.div>

          {/* Contact Details Links column */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              {/* Telemetry Badge */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "4px",
                  marginBottom: "2rem",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    boxShadow: "0 0 8px #ffffff",
                    animation: "pulse 2s infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase",
                  }}
                >
                  Optimizing: Telemetry • Not: Wrappers
                </span>
              </m.div>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "400px",
                  textAlign: "justify",
                  textJustify: "inter-word",
                  margin: "0 0 2rem 0",
                }}
              >
                Focused on low-level systems execution. I am not currently seeking recruiter pipelines,
                but if you have an intricate bare-metal hardware problem, a complex telemetry challenge,
                or want to talk shop regarding RISC-V ISA, Verilog simulation timing, or low-overhead protocols,
                I am always ready to collaborate.
              </m.p>
            </div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: "0" }}
            >
              {links.map(({ label, value, href, icon }, i) => (
                <m.a
                  key={i}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ x: 4 }}
                  onClick={
                    label.includes("Email")
                      ? (e) => {
                          e.preventDefault();
                          void copyEmailToClipboard(value);
                        }
                      : label.includes("Resume")
                        ? (e) => {
                            e.preventDefault();
                            handleResumeDownload();
                          }
                        : undefined
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderBottomColor = "rgba(255,255,255,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderBottomColor = "rgba(255,255,255,0.05)";
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.4)", width: "16px" }}>
                    {icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.58rem",
                        letterSpacing: "0.15em",
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase",
                        marginBottom: "2px",
                      }}
                    >
                      {label}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.5)",
                          margin: 0,
                        }}
                      >
                        {value}
                      </p>
                      {(label.includes("Email") || label.includes("Resume")) && (
                        <AnimatePresence mode="wait">
                          {(label.includes("Email")
                            ? copyToastMessage
                            : downloadToastMessage) && (
                            <m.p
                              key={label.includes("Email") ? copyToastMessage! : downloadToastMessage!}
                              initial={{ opacity: 0, x: -6, scale: 0.98 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -4, scale: 0.98 }}
                              transition={{
                                duration: 0.75,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: "0.78rem",
                                color: "#fafaf8",
                                border: "1px solid rgba(255,255,255,0.35)",
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: "999px",
                                padding: "4px 10px",
                                whiteSpace: "nowrap",
                                margin: 0,
                              }}
                            >
                              {label === "Email" ? copyToastMessage : downloadToastMessage}
                            </m.p>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "0.7rem",
                    }}
                  >
                    ↗
                  </span>
                </m.a>
              ))}
            </m.div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: isMobile ? "5rem" : "8rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Dilip Kumar A N. All rights reserved. • Built with precision
          </span>
        </div>
      </div>
    </section>
  );
}
