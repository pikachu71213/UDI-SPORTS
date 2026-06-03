import { useState, useEffect, useRef, useCallback } from "react";
import { HiArrowUp } from "react-icons/hi";
import { HiMiniMusicalNote } from "react-icons/hi2";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
const INJECTED_STYLES = `
  /* ── PRELOADER ── */
  @keyframes ge-bar-bounce {
    0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
    50%       { transform: scaleY(1);   opacity: 1;   }
  }
  @keyframes ge-logo-pulse {
    0%, 100% { opacity: 0.7; transform: scale(0.97); }
    50%      { opacity: 1;   transform: scale(1);    }
  }
  @keyframes ge-fade-out {
    0%   { opacity: 1; visibility: visible; }
    100% { opacity: 0; visibility: hidden;  }
  }
  @keyframes ge-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ge-ring-spin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes ge-ring-spin-rev {
    from { transform: rotate(0deg);    }
    to   { transform: rotate(-360deg); }
  }

  /* ── BACK TO TOP ── */
  @keyframes ge-fade-in-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes ge-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── MUSIC RIPPLE ── */
  @keyframes ge-ripple {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0;   }
  }
  @keyframes ge-equalizer {
    0%, 100% { height: 8px;  }
    25%      { height: 18px; }
    50%      { height: 12px; }
    75%      { height: 22px; }
  }

  /* ── APPLIED CLASSES ── */
  .ge-bar { animation: ge-bar-bounce 0.9s ease-in-out infinite; transform-origin: bottom; }
  .ge-bar-1 { animation-delay: 0s;    }
  .ge-bar-2 { animation-delay: 0.15s; }
  .ge-bar-3 { animation-delay: 0.30s; }

  .ge-logo-text {
    background: linear-gradient(90deg, #F05A1A 0%, #FFAD5C 40%, #F05A1A 80%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ge-shimmer 2s linear infinite, ge-logo-pulse 2.4s ease-in-out infinite;
    font-family: 'Bebas Neue', cursive;
  }

  .ge-ring-outer {
    animation: ge-ring-spin 2.4s linear infinite;
  }
  .ge-ring-inner {
    animation: ge-ring-spin-rev 1.8s linear infinite;
  }

  .ge-preloader-exit {
    animation: ge-fade-out 0.6s ease forwards;
  }

  .ge-fade-in-up {
    animation: ge-fade-in-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .ge-fade-in {
    animation: ge-fade-in 0.35s ease both;
  }

  .ge-btt-btn {
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  }
  .ge-btt-btn:hover {
    transform: scale(1.12) translateY(-2px);
    box-shadow: 0 12px 32px rgba(240, 90, 26, 0.5) !important;
  }
  .ge-btt-btn:active {
    transform: scale(0.96);
  }

  .ge-music-btn {
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  }
  .ge-music-btn:hover {
    transform: scale(1.1) translateY(-2px);
  }
  .ge-music-btn:active {
    transform: scale(0.94);
  }

  .ge-ripple-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid rgba(240, 90, 26, 0.5);
    animation: ge-ripple 1.8s ease-out infinite;
    pointer-events: none;
  }
  .ge-ripple-ring-2 {
    animation-delay: 0.6s;
  }

  .ge-eq-bar {
    width: 3px; border-radius: 2px;
    background: #F05A1A;
    animation: ge-equalizer 0.8s ease-in-out infinite;
  }
  .ge-eq-1 { animation-delay: 0s;    }
  .ge-eq-2 { animation-delay: 0.2s;  }
  .ge-eq-3 { animation-delay: 0.4s;  }

  /* Smooth scroll for entire page */
  html { scroll-behavior: smooth; }
`;

/* ── Loader styles so Preloader works even when used as Suspense fallback (before GlobalEnhancer mounts) ── */
const PRELOADER_STYLES = `
  @keyframes ge-bar-bounce{0%,100%{transform:scaleY(0.3);opacity:0.4}50%{transform:scaleY(1);opacity:1}}
  @keyframes ge-logo-pulse{0%,100%{opacity:0.7;transform:scale(0.97)}50%{opacity:1;transform:scale(1)}}
  @keyframes ge-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ge-ring-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes ge-ring-spin-rev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
  @keyframes ge-fade-out{0%{opacity:1;visibility:visible}100%{opacity:0;visibility:hidden}}
  .ge-bar{animation:ge-bar-bounce .9s ease-in-out infinite;transform-origin:bottom}
  .ge-bar-1{animation-delay:0s}.ge-bar-2{animation-delay:.15s}.ge-bar-3{animation-delay:.3s}
  .ge-logo-text{background:linear-gradient(90deg,#F05A1A 0%,#FFAD5C 40%,#F05A1A 80%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:ge-shimmer 2s linear infinite,ge-logo-pulse 2.4s ease-in-out infinite;font-family:'Bebas Neue',cursive}
  .ge-ring-outer{animation:ge-ring-spin 2.4s linear infinite}
  .ge-ring-inner{animation:ge-ring-spin-rev 1.8s linear infinite}
  .ge-preloader-exit{animation:ge-fade-out .6s ease forwards}
`;

/**
 * Full-page preloader: one theme per full page load (shared by Suspense fallback + GlobalEnhancer).
 * Module singleton avoids (a) two different random picks for two Preloader instances and
 * (b) React Strict Mode remount picking a second color.
 */
const PRELOADER_THEMES = [
  {
    background: "linear-gradient(135deg, #0B1E4B 0%, #152B6B 55%, #0d1a3e 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.04,
    glow: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,173,92,0.08) 35%, transparent 70%)",
    ringOuter: ["#F05A1A", "rgba(240,90,26,0.3)"],
    ringInner: ["#FFAD5C", "rgba(255,173,92,0.3)"],
    barCenter: "linear-gradient(to top, #F05A1A, #FF9D42)",
    barSide: "linear-gradient(to top, rgba(240,90,26,0.55), rgba(255,157,66,0.55))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(255,255,255,0.42)",
    dots: "rgba(240,90,26,0.65)",
  },
  {
    background: "linear-gradient(160deg, #0B1E4B 0%, #0d2258 50%, #0B1E4B 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.04,
    glow: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,173,92,0.07) 40%, transparent 72%)",
    ringOuter: ["#F05A1A", "rgba(240,90,26,0.3)"],
    ringInner: ["#FFAD5C", "rgba(255,173,92,0.3)"],
    barCenter: "linear-gradient(to top, #F05A1A, #FF9D42)",
    barSide: "linear-gradient(to top, rgba(240,90,26,0.5), rgba(255,157,66,0.5))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(255,255,255,0.42)",
    dots: "rgba(240,90,26,0.65)",
  },
  {
    background: "linear-gradient(135deg, #1e3a6e 0%, #0B1E4B 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.045,
    glow: "radial-gradient(circle, rgba(249,168,212,0.08) 0%, transparent 65%)",
    ringOuter: ["#F05A1A", "rgba(240,90,26,0.28)"],
    ringInner: ["#FFAD5C", "rgba(255,173,92,0.28)"],
    barCenter: "linear-gradient(to top, #F05A1A, #FF9D42)",
    barSide: "linear-gradient(to top, rgba(240,90,26,0.48), rgba(255,157,66,0.48))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(255,255,255,0.42)",
    dots: "rgba(240,90,26,0.65)",
  },
  {
    background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.055,
    glow: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(96,165,250,0.12) 45%, transparent 70%)",
    ringOuter: ["#F05A1A", "rgba(240,90,26,0.32)"],
    ringInner: ["#FFAD5C", "rgba(255,173,92,0.32)"],
    barCenter: "linear-gradient(to top, #F05A1A, #FF9D42)",
    barSide: "linear-gradient(to top, rgba(240,90,26,0.45), rgba(255,157,66,0.45))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(255,255,255,0.48)",
    dots: "rgba(255,255,255,0.5)",
  },
  {
    background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 45%, #60a5fa 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.07,
    glow: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 65%)",
    ringOuter: ["#ffffff", "rgba(255,255,255,0.38)"],
    ringInner: ["#0B1E4B", "rgba(11,30,75,0.35)"],
    barCenter: "linear-gradient(to top, #0B1E4B, #1e3a8a)",
    barSide: "linear-gradient(to top, rgba(11,30,75,0.45), rgba(30,58,138,0.45))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(255,255,255,0.9)",
    dots: "rgba(11,30,75,0.55)",
  },
  {
    background: "linear-gradient(135deg, #F05A1A 0%, #FF7D42 100%)",
    gridLine: "rgba(11,30,75,1)",
    gridOpacity: 0.06,
    glow: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 68%)",
    ringOuter: ["#0B1E4B", "rgba(11,30,75,0.35)"],
    ringInner: ["#ffffff", "rgba(255,255,255,0.4)"],
    barCenter: "linear-gradient(to top, #ffffff, #fef3c7)",
    barSide: "linear-gradient(to top, rgba(255,255,255,0.45), rgba(254,243,199,0.5))",
    titleUseOrangeGradient: false,
    titleGradient: "linear-gradient(90deg, #ffffff 0%, #fff7ed 45%, #ffffff 80%)",
    taglineColor: "rgba(11,30,75,0.72)",
    dots: "rgba(11,30,75,0.45)",
  },
  {
    background: "linear-gradient(90deg, #F05A1A 0%, #FF9D42 100%)",
    gridLine: "rgba(11,30,75,1)",
    gridOpacity: 0.055,
    glow: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 68%)",
    ringOuter: ["#0B1E4B", "rgba(11,30,75,0.32)"],
    ringInner: ["#ffffff", "rgba(255,255,255,0.38)"],
    barCenter: "linear-gradient(to top, #ffffff, #fffbeb)",
    barSide: "linear-gradient(to top, rgba(255,255,255,0.42), rgba(255,251,235,0.5))",
    titleUseOrangeGradient: false,
    titleGradient: "linear-gradient(90deg, #ffffff 0%, #fffbeb 45%, #ffffff 80%)",
    taglineColor: "rgba(11,30,75,0.7)",
    dots: "rgba(11,30,75,0.42)",
  },
  {
    background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.05,
    glow: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)",
    ringOuter: ["#fef3c7", "rgba(254,243,199,0.35)"],
    ringInner: ["#ffffff", "rgba(255,255,255,0.35)"],
    barCenter: "linear-gradient(to top, #fbbf24, #fef3c7)",
    barSide: "linear-gradient(to top, rgba(251,191,36,0.6), rgba(254,243,199,0.55))",
    titleUseOrangeGradient: false,
    titleGradient: "linear-gradient(90deg, #fffbeb 0%, #ffffff 40%, #fffbeb 80%)",
    taglineColor: "rgba(255,255,255,0.55)",
    dots: "rgba(255,255,255,0.7)",
  },
  {
    background: "linear-gradient(135deg, #334155 0%, #64748b 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.04,
    glow: "radial-gradient(circle, rgba(240,90,26,0.1) 0%, transparent 70%)",
    ringOuter: ["#F05A1A", "rgba(240,90,26,0.28)"],
    ringInner: ["#FFAD5C", "rgba(255,173,92,0.28)"],
    barCenter: "linear-gradient(to top, #F05A1A, #FF9D42)",
    barSide: "linear-gradient(to top, rgba(240,90,26,0.48), rgba(255,157,66,0.48))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(255,255,255,0.42)",
    dots: "rgba(240,90,26,0.62)",
  },
  {
    background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.045,
    glow: "radial-gradient(circle, rgba(196,181,253,0.15) 0%, transparent 68%)",
    ringOuter: ["#F05A1A", "rgba(240,90,26,0.28)"],
    ringInner: ["#fcd34d", "rgba(252,211,77,0.35)"],
    barCenter: "linear-gradient(to top, #F05A1A, #fbbf24)",
    barSide: "linear-gradient(to top, rgba(240,90,26,0.45), rgba(251,191,36,0.4))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(237,233,254,0.55)",
    dots: "rgba(252,211,77,0.75)",
  },
  {
    background: "linear-gradient(135deg, #831843 0%, #db2777 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.05,
    glow: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(249,168,212,0.14) 40%, transparent 70%)",
    ringOuter: ["#ffffff", "rgba(255,255,255,0.35)"],
    ringInner: ["#FBBF24", "rgba(251,191,36,0.4)"],
    barCenter: "linear-gradient(to top, #fce7f3, #ffffff)",
    barSide: "linear-gradient(to top, rgba(252,231,243,0.55), rgba(255,255,255,0.45))",
    titleUseOrangeGradient: false,
    titleGradient: "linear-gradient(90deg, #ffffff 0%, #ffe4e6 45%, #ffffff 82%)",
    taglineColor: "rgba(255,255,255,0.58)",
    dots: "rgba(255,255,255,0.65)",
  },
  {
    background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
    gridLine: "rgba(255,255,255,1)",
    gridOpacity: 0.045,
    glow: "radial-gradient(circle, rgba(167,243,208,0.14) 0%, transparent 70%)",
    ringOuter: ["#F05A1A", "rgba(240,90,26,0.28)"],
    ringInner: ["#a7f3d0", "rgba(167,243,208,0.35)"],
    barCenter: "linear-gradient(to top, #F05A1A, #34d399)",
    barSide: "linear-gradient(to top, rgba(240,90,26,0.48), rgba(52,211,153,0.42))",
    titleUseOrangeGradient: true,
    taglineColor: "rgba(236,253,245,0.55)",
    dots: "rgba(167,243,208,0.8)",
  },
];

let preloaderThemeResolved = null;

function getPreloaderTheme() {
  if (preloaderThemeResolved !== null) return preloaderThemeResolved;
  const n = PRELOADER_THEMES.length;
  let idx;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    idx = buf[0] % n;
  } else {
    idx = Math.floor(Math.random() * n);
  }
  preloaderThemeResolved = PRELOADER_THEMES[idx];
  return preloaderThemeResolved;
}

/**
 * Ref-counted scroll lock for the full-screen preloader (Suspense + main instance).
 * - Locks `<html>` + `<body>` overflow so the classic scrollbar disappears (no white track strip).
 * - `paddingRight` on `body` only, measured before lock, prevents layout jump when the lock is released.
 */
let preloaderScrollLockDepth = 0;
let savedHtmlOverflow = "";
let savedBodyOverflow = "";
let savedBodyPaddingRight = "";

function acquirePreloaderScrollLock() {
  if (preloaderScrollLockDepth === 0) {
    const gap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    savedHtmlOverflow = document.documentElement.style.overflow;
    savedBodyOverflow = document.body.style.overflow;
    savedBodyPaddingRight = document.body.style.paddingRight;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
  }
  preloaderScrollLockDepth += 1;
}

function releasePreloaderScrollLock() {
  preloaderScrollLockDepth = Math.max(0, preloaderScrollLockDepth - 1);
  if (preloaderScrollLockDepth === 0) {
    document.documentElement.style.overflow = savedHtmlOverflow;
    document.body.style.overflow = savedBodyOverflow;
    document.body.style.paddingRight = savedBodyPaddingRight;
    savedHtmlOverflow = "";
    savedBodyOverflow = "";
    savedBodyPaddingRight = "";
  }
}

/* ══════════════════════════════════════════════
   SUB-COMPONENT: Preloader (exported for use as route-loading fallback too)
══════════════════════════════════════════════ */
export function Preloader({ onDone, noTimer = false }) {
  const theme = getPreloaderTheme();
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    acquirePreloaderScrollLock();
    return () => releasePreloaderScrollLock();
  }, []);

  useEffect(() => {
    if (noTimer) return;
    const exitTimer = setTimeout(() => setExiting(true), 1600);
    const doneTimer = setTimeout(() => {
      setHidden(true);
      onDone?.();
    }, 2250);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onDone, noTimer]);

  if (hidden) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRELOADER_STYLES }} />
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${exiting ? "ge-preloader-exit" : ""}`}
      style={{
        background: theme.background,
        overscrollBehavior: "none",
        width: "100%",
        minHeight: "100%",
      }}
      aria-label="Loading"
      role="status"
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: theme.gridOpacity,
          backgroundImage:
            `repeating-linear-gradient(0deg,transparent,transparent 40px,${theme.gridLine} 40px,${theme.gridLine} 41px),` +
            `repeating-linear-gradient(90deg,transparent,transparent 40px,${theme.gridLine} 40px,${theme.gridLine} 41px)`,
        }}
      />

      {/* Glow blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 400, height: 400, borderRadius: "50%",
          background: theme.glow,
        }}
      />

      {/* ── SPINNER RINGS ── */}
      <div className="relative flex items-center justify-center mb-10" style={{ width: 100, height: 100 }}>
        {/* Outer ring */}
        <div
          className="ge-ring-outer absolute"
          style={{
            width: 100, height: 100, borderRadius: "50%",
            border: "2.5px solid transparent",
            borderTopColor: theme.ringOuter[0],
            borderRightColor: theme.ringOuter[1],
          }}
        />
        {/* Inner ring */}
        <div
          className="ge-ring-inner absolute"
          style={{
            width: 72, height: 72, borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: theme.ringInner[0],
            borderLeftColor: theme.ringInner[1],
          }}
        />
        {/* Center icon */}
        <div
          style={{
            width: 46, height: 46, borderRadius: 13,
          
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img src="/short-logo.webp" alt="UDIISA short logo" decoding="async" />
        </div>
      </div>

      {/* ── 3 ANIMATED BARS ── */}
      <div className="flex items-end gap-2 mb-8" style={{ height: 32 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`ge-bar ge-bar-${i + 1}`}
            style={{
              width: 6,
              height: 28,
              borderRadius: 4,
              background: i === 1 ? theme.barCenter : theme.barSide,
            }}
          />
        ))}
      </div>

      {/* ── BRAND TEXT ── */}
      <div className="text-center">
        <div
          className={theme.titleUseOrangeGradient ? "ge-logo-text" : undefined}
          style={{
            fontSize: 38,
            letterSpacing: 4,
            ...(theme.titleUseOrangeGradient
              ? {}
              : {
                  fontFamily: "'Bebas Neue', cursive",
                  background: theme.titleGradient,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation:
                    "ge-shimmer 2s linear infinite, ge-logo-pulse 2.4s ease-in-out infinite",
                }),
          }}
        >
          UDI SPORTS
        </div>
        <div
          style={{
            fontSize: 11, fontWeight: 700,
            color: theme.taglineColor,
            letterSpacing: "4px", textTransform: "uppercase",
            marginTop: 4, fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          NGO · India
        </div>
      </div>

      {/* ── Loading dots ── */}
      <div className="flex items-center gap-1.5 mt-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 4, height: 4, borderRadius: "50%",
              background: theme.dots,
              animation: `ge-bar-bounce 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   SUB-COMPONENT: Back To Top Button
══════════════════════════════════════════════ */
function BackToTopButton({ visible }) {
  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className="ge-btt-btn ge-fade-in-up"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 998,
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #F05A1A 0%, #FF7D42 100%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 24px rgba(240, 90, 26, 0.42), 0 2px 8px rgba(0,0,0,0.15)",
        color: "#fff",
        outline: "none",
      }}
    >
      {/* Subtle glow ring */}
      <div
        style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          border: "1.5px solid rgba(240,90,26,0.25)",
          pointerEvents: "none",
        }}
      />
      <HiArrowUp style={{ fontSize: 20, strokeWidth: 1 }} />
    </button>
  );
}
function WhatsAppButton({
  phoneNumber = "919999999999", // Apna number country code ke sath
  message = "Hello",
}) {
  const handleWhatsAppClick = useCallback(() => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  }, [phoneNumber, message]);

  return (
    <button
      onClick={handleWhatsAppClick}
      aria-label="Chat on WhatsApp"
      className="ge-music-btn ge-fade-in"
      style={{
        position: "fixed",
        bottom: 156, // Music button ke upar
        right: 28,
        zIndex: 998,
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #25D366 0%, #1EBE5D 100%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 6px 24px rgba(37, 211, 102, 0.42), 0 2px 8px rgba(0,0,0,0.15)",
        color: "#fff",
        outline: "none",
      }}
    >
      {/* Ripple Effect */}
      <div
        className="ge-ripple-ring"
        style={{
          border: "2px solid rgba(37, 211, 102, 0.5)",
        }}
      />
      <div
        className="ge-ripple-ring ge-ripple-ring-2"
        style={{
          border: "2px solid rgba(37, 211, 102, 0.35)",
        }}
      />

      <FaWhatsapp style={{ fontSize: 24 }} />

      {/* Tooltip */}
      <div
        style={{
          position: "absolute",
          right: "calc(100% + 10px)",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(37, 211, 102, 0.95)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          padding: "5px 10px",
          borderRadius: 8,
          whiteSpace: "nowrap",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.2s",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        className="ge-tooltip"
      >
        Chat on WhatsApp
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════
   SUB-COMPONENT: Music Toggle Button
══════════════════════════════════════════════ */
function MusicToggleButton({ isPlaying, onToggle, hasInteracted }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
      className="ge-music-btn ge-fade-in"
      style={{
        position: "fixed",
        bottom: 92,
        right: 28,
        zIndex: 998,
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "rgba(11, 30, 75, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          isPlaying
            ? "0 6px 28px rgba(11,30,75,0.35), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "0 4px 18px rgba(11,30,75,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
        color: "#fff",
        outline: "none",
        overflow: "visible",
      }}
    >
      {/* Ripple rings when playing */}
      {isPlaying && (
        <>
          <div className="ge-ripple-ring" />
          <div className="ge-ripple-ring ge-ripple-ring-2" />
        </>
      )}

      {/* Equalizer bars (playing state) or static note (paused) */}
      {isPlaying ? (
        <div
          className="flex items-end gap-[3px]"
          style={{ height: 22, alignItems: "flex-end" }}
          aria-hidden="true"
        >
          <div className="ge-eq-bar ge-eq-1" style={{ height: 10 }} />
          <div className="ge-eq-bar ge-eq-2" style={{ height: 18 }} />
          <div className="ge-eq-bar ge-eq-3" style={{ height: 12 }} />
        </div>
      ) : (
        <div style={{ position: "relative", opacity: hasInteracted ? 1 : 0.6 }}>
          <HiMiniMusicalNote style={{ fontSize: 20, color: "rgba(255,255,255,0.8)" }} />
          {/* Slash through note when never interacted (autoplay blocked) */}
          {!hasInteracted && (
            <div
              style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%) rotate(-45deg)",
                width: 24, height: 1.5,
                background: "rgba(240,90,26,0.8)",
                borderRadius: 2,
              }}
            />
          )}
        </div>
      )}

      {/* Tooltip */}
      <div
        style={{
          position: "absolute",
          right: "calc(100% + 10px)",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(11,30,75,0.92)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          padding: "5px 10px",
          borderRadius: 8,
          whiteSpace: "nowrap",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.2s",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        className="ge-tooltip"
      >
        {isPlaying ? "Pause Music" : "Play Music"}
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT: GlobalEnhancer
══════════════════════════════════════════════ */
export default function GlobalEnhancer({
  musicSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
}) {
  // ── STATE ──
  const [preloaderDone, setPreloaderDone]     = useState(false);
  const [showBTT,       setShowBTT]           = useState(false);
  const [isPlaying,     setIsPlaying]         = useState(false);
  const [hasInteracted, setHasInteracted]     = useState(false);

  // ── REFS ──
  const audioRef      = useRef(null);
  const scrollListRef = useRef(null);

  // ── AUDIO CLEANUP ──
  useEffect(() => {
    return () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    };
  }, []);

  // ── SCROLL LISTENER (Back To Top visibility) ──
  useEffect(() => {
    const handleScroll = () => {
      setShowBTT(window.scrollY > 300);
    };

    // Store ref so we can removeEventListener with the same function
    scrollListRef.current = handleScroll;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListRef.current);
    };
  }, []);

  // ── MUSIC TOGGLE ──
  const handleMusicToggle = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(musicSrc);
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }
  }, [isPlaying, musicSrc]);

  // ── PRELOADER DONE ──
  const handlePreloaderDone = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      {/* ── INJECT STYLES (self-contained, no tailwind.config.js changes needed) ── */}
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

      {/* ── TOOLTIP HOVER STYLE ── */}
      <style>{`
        .ge-music-btn:hover .ge-tooltip { opacity: 1 !important; }
      `}</style>

      {/* ══════════ 1. PRELOADER ══════════ */}
      {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
<WhatsAppButton
  phoneNumber="918307598050" // Yaha apna real WhatsApp number
  message="Hello Sir, I want to know more details."
/>
      {/* ══════════ 2. MUSIC TOGGLE ══════════ */}
      <MusicToggleButton
        isPlaying={isPlaying}
        onToggle={handleMusicToggle}
        hasInteracted={hasInteracted}
      />

      {/* ══════════ 3. BACK TO TOP ══════════ */}
      <BackToTopButton visible={showBTT} />
    </>
  );
}