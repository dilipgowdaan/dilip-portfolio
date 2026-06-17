import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, m } from "motion/react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/useMediaQuery";
import { scrollToSection } from "../hooks/useHashScroll";

export function Header() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".hologram-interface") as HTMLElement | null;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { label: "About", href: "/about", section: "about" },
    { label: "Experience", href: "/experience", section: "experience" },
    { label: "Projects", href: "/projects", section: "projects" },
    { label: "Stack", href: "/stack", section: "stack" },
    { label: "Contact", href: "/contact", section: "contact" },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent, section: string, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(section);
    history.pushState(null, "", href);
  }, []);

  return (
    <>
      <m.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "1rem 6vw" : "1.25rem 8vw",
          background: scrolled 
            ? "rgba(5, 5, 5, 0.45)" 
            : "linear-gradient(to bottom, rgba(5, 5, 5, 0.8) 0%, rgba(5, 5, 5, 0) 100%)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid transparent",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Name / Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("hero");
            history.pushState(null, "", "/");
          }}
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: isMobile ? "0.68rem" : "0.78rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#fafaf8",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          DILIP KUMAR A N
        </a>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.section, item.href)}
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.45)",
                  textDecoration: "none",
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  borderRadius: "4px",
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "#fafaf8";
                  target.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = "rgba(255, 255, 255, 0.45)";
                  target.style.background = "transparent";
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile Hamburger Toggle */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "4px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fafaf8",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        )}
      </m.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <m.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              background: "rgba(6, 6, 6, 0.95)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 390,
              display: "flex",
              flexDirection: "column",
              padding: "80px 6vw 2.5rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {navItems.map((item, i) => (
                <m.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  onClick={(e) => handleNavClick(e, item.section, item.href)}
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "0.83rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    padding: "1rem 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "block",
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </m.a>
              ))}
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
