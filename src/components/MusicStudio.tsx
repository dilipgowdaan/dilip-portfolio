import React, { useState, useEffect, useRef, useMemo } from "react";
import { m } from "motion/react";
import { ArrowLeft, Play, Pause, Music } from "lucide-react";
import { useIsMobile } from "../hooks/useMediaQuery";
import ParticleCanvas from "./ParticleCanvas";

const FONT_SERIF = '"Playfair Display", Georgia, serif';
const FONT_MONO = '"DM Mono", monospace';
const FONT_SANS = '"DM Sans", sans-serif';

export interface AudioTrack {
  id: string;
  title: string;
  src: string;
  isSample?: boolean;
}

const FALLBACK_SAMPLE_TRACK: AudioTrack = {
  id: "sample-preview",
  title: "Sample BGM (Preview)",
  src: "/music/sample_bgm.mp3",
  isSample: true,
};

interface MusicStudioProps {
  onBack: () => void;
}

export function MusicStudio({ onBack }: MusicStudioProps) {
  const isMobile = useIsMobile();
  const [manifestTracks, setManifestTracks] = useState<AudioTrack[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-discover any audio files in /public/music/ using Vite glob
  const discoveredTracks = useMemo<AudioTrack[]>(() => {
    try {
      const globModules = import.meta.glob<{ default?: string } | string>(
        "/public/music/*.{mp3,wav,ogg,m4a,aac,MP3,WAV}",
        { eager: true }
      );

      const items: AudioTrack[] = Object.keys(globModules).map((filePath) => {
        const rawFileName = filePath.split("/").pop() || "";
        const cleanTitle = rawFileName
          .replace(/\.[^/.]+$/, "") // strip extension
          .replace(/[_-]/g, " ") // replace underscores/dashes with spaces
          .trim();
        const src = filePath.replace(/^\/public/, "");
        const isSample = rawFileName.toLowerCase().includes("sample");

        return {
          id: filePath,
          title: cleanTitle,
          src,
          isSample,
        };
      });

      return items;
    } catch {
      return [];
    }
  }, []);

  // Also fetch /music/manifest.json if provided
  useEffect(() => {
    fetch("/music/manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error("No manifest");
        return res.json();
      })
      .then((data: AudioTrack[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setManifestTracks(data);
        }
      })
      .catch(() => {});
  }, []);

  // Compute final tracks:
  // If user puts real MP3 files (non-sample), the preview example sample track automatically vanishes!
  const tracks = useMemo<AudioTrack[]>(() => {
    const combinedMap = new Map<string, AudioTrack>();

    discoveredTracks.forEach((t) => combinedMap.set(t.src, t));
    manifestTracks.forEach((t) => combinedMap.set(t.src, t));

    const all = Array.from(combinedMap.values());
    if (all.length === 0) {
      return [FALLBACK_SAMPLE_TRACK];
    }

    const realTracks = all.filter((t) => !t.isSample);
    return realTracks.length > 0 ? realTracks : all;
  }, [discoveredTracks, manifestTracks]);

  // Global audio element event listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const togglePlay = (index: number) => {
    const track = tracks[index];
    if (!track) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    if (activeTrackIndex === index) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      setActiveTrackIndex(index);
      audio.src = track.src;
      audio.load();
      setCurrentTime(0);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (activeTrackIndex !== index || !audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <m.div
      key="music-studio"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#050505",
        zIndex: 9999,
        overflowY: "auto",
        padding: isMobile ? "6rem 1.25rem 5rem" : "7.5rem 8vw 6rem",
        color: "#fafaf8",
      }}
      id="music-studio-view"
    >
      <ParticleCanvas />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          margin: "0 auto",
          paddingTop: isMobile ? "0.5rem" : "1rem",
        }}
      >
        {/* Top Proper Back Button */}
        <div style={{ marginBottom: "2.5rem" }}>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "6px",
              color: "#fafaf8",
              fontFamily: FONT_MONO,
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              padding: "9px 16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200, 126, 255, 0.15)";
              e.currentTarget.style.borderColor = "#c87eff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }}
          >
            <ArrowLeft size={16} />
            <span>← RETURN TO PORTFOLIO</span>
          </button>
        </div>

        {/* Section Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              color: "#c87eff",
              marginBottom: "0.6rem",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            // MUSIC &amp; BGMS
          </div>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: isMobile ? "2.2rem" : "3.2rem",
              fontWeight: 800,
              color: "#fafaf8",
              margin: "0 0 0.8rem 0",
              lineHeight: 1.15,
            }}
          >
            Music &amp; Instrumental Tracks
          </h1>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: isMobile ? "0.95rem" : "1.1rem",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
            }}
          >
            Recreation of some of the favorite BGMs.
          </p>
        </div>

        {/* Track List: Transparent with Line-like Style */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tracks.map((track, idx) => {
            const isThisTrackActive = activeTrackIndex === idx;
            const isThisPlaying = isThisTrackActive && isPlaying;
            const progress =
              isThisTrackActive && duration > 0 ? (currentTime / duration) * 100 : 0;

            return (
              <m.div
                key={track.id || track.src}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                style={{
                  position: "relative",
                  background: isThisPlaying
                    ? "rgba(200, 126, 255, 0.03)"
                    : "rgba(255, 255, 255, 0.015)",
                  border: isThisPlaying
                    ? "1px solid rgba(200, 126, 255, 0.45)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: isMobile ? "1.1rem 1.25rem" : "1.35rem 1.75rem",
                  transition: "all 0.25s ease",
                  overflow: "hidden",
                }}
              >
                {/* Active track left indicator accent line */}
                {isThisPlaying && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      background: "#c87eff",
                    }}
                  />
                )}

                {/* Track Row: File/Track Name & Embedded Play/Pause Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isThisPlaying
                          ? "rgba(200, 126, 255, 0.15)"
                          : "rgba(255, 255, 255, 0.04)",
                        border: isThisPlaying
                          ? "1px solid #c87eff"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isThisPlaying ? "#c87eff" : "rgba(255, 255, 255, 0.5)",
                        flexShrink: 0,
                      }}
                    >
                      <Music size={16} />
                    </div>

                    <div style={{ overflow: "hidden" }}>
                      <h3
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: isMobile ? "1.1rem" : "1.35rem",
                          fontWeight: 700,
                          color: "#fafaf8",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {track.title}
                      </h3>
                      {track.isSample && (
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: "0.62rem",
                            letterSpacing: "0.08em",
                            color: "#c87eff",
                            opacity: 0.8,
                          }}
                        >
                          [Example Preview Track]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Play / Pause Round Trigger Button */}
                  <button
                    onClick={() => togglePlay(idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? "40px" : "44px",
                      height: isMobile ? "40px" : "44px",
                      borderRadius: "50%",
                      background: isThisPlaying ? "#c87eff" : "rgba(255, 255, 255, 0.06)",
                      border: isThisPlaying
                        ? "1px solid #c87eff"
                        : "1px solid rgba(255, 255, 255, 0.16)",
                      color: isThisPlaying ? "#050505" : "#fafaf8",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      flexShrink: 0,
                    }}
                    title={isThisPlaying ? "Pause" : "Play"}
                    onMouseEnter={(e) => {
                      if (!isThisPlaying) {
                        e.currentTarget.style.background = "rgba(200, 126, 255, 0.2)";
                        e.currentTarget.style.borderColor = "#c87eff";
                        e.currentTarget.style.color = "#c87eff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isThisPlaying) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.16)";
                        e.currentTarget.style.color = "#fafaf8";
                      }
                    }}
                  >
                    {isThisPlaying ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} style={{ marginLeft: "2px" }} />
                    )}
                  </button>
                </div>

                {/* Embedded Progress Line (click to seek) */}
                <div
                  onClick={(e) => (isThisTrackActive ? handleSeek(e, idx) : togglePlay(idx))}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  title="Click to seek"
                >
                  {/* Track base line */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "3px",
                      background: "rgba(255, 255, 255, 0.08)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Active Elapsed Line */}
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #6366f1 0%, #c87eff 100%)",
                        transition: isThisPlaying ? "width 0.1s linear" : "width 0.2s ease",
                      }}
                    />
                  </div>

                  {/* Scrubber Knob on active track */}
                  {isThisTrackActive && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${progress}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#fafaf8",
                        border: "2px solid #c87eff",
                        boxShadow: "0 0 6px rgba(200, 126, 255, 0.6)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>

                {/* Bottom Line: Time Indicator */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: FONT_MONO,
                    fontSize: "0.68rem",
                    color: "rgba(255, 255, 255, 0.4)",
                    marginTop: "0.25rem",
                  }}
                >
                  <span>{isThisTrackActive ? formatTime(currentTime) : "00:00"}</span>
                  <span>
                    {isThisTrackActive && duration > 0 ? formatTime(duration) : "--:--"}
                  </span>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </m.div>
  );
}
