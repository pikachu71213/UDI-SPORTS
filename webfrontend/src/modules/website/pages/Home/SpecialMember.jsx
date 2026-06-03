import { useState, useEffect, useMemo } from "react";
import { BsStarFill } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getPublicSpecialMembers } from "../../../../shared/services/publicApi";

const EMPTY_GROUPS = {
  bodyCorporate: [],
  diamond: [],
  gold: [],
  silver: [],
  dignitaries: [],
  celebrity: [],
  
};

// ─── Themes ───────────────────────────────────────────────────────────────────
const TABS = [

    
  {
    key: "bodyCorporate", label: "Corporate Members", emoji: "🏢",
    tabActiveBg: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
    tabActiveBorder: "#34d399", tabActiveText: "#fff",
    tabActiveShadow: "0 8px 28px rgba(5,150,105,0.35)",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #ecfdf5 60%, #d1fae5 100%)",
    cardBorder: "#6ee7b7",
    cardShadow: "0 20px 60px rgba(5,150,105,0.13), 0 4px 20px rgba(5,150,105,0.08)",
    cardTopBar: "linear-gradient(90deg, #064e3b, #059669, #34d399)",
    ringGrad: "conic-gradient(from 0deg, #064e3b, #34d399, #d1fae5, #34d399, #064e3b)",
    accentColor: "#059669", accentLight: "#d1fae5",
    badgeBg: "linear-gradient(135deg, #d1fae5, #ecfdf5)", badgeBorder: "#6ee7b7", badgeText: "#064e3b",
    verifiedBg: "linear-gradient(135deg, #064e3b, #059669)", companyColor: "#059669",
    dotActive: "#059669", dotShadow: "rgba(5,150,105,0.4)",
  },


  {
    key: "diamond", label: "Diamond", emoji: "💎",
    tabActiveBg: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
    tabActiveBorder: "#3b82f6", tabActiveText: "#fff",
    tabActiveShadow: "0 8px 28px rgba(37,99,235,0.35)",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #eff6ff 60%, #dbeafe 100%)",
    cardBorder: "#bfdbfe",
    cardShadow: "0 20px 60px rgba(37,99,235,0.13), 0 4px 20px rgba(37,99,235,0.08)",
    cardTopBar: "linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa)",
    ringGrad: "conic-gradient(from 0deg, #1d4ed8, #60a5fa, #bfdbfe, #60a5fa, #1d4ed8)",
    accentColor: "#2563eb", accentLight: "#dbeafe",
    badgeBg: "linear-gradient(135deg, #dbeafe, #eff6ff)", badgeBorder: "#93c5fd", badgeText: "#1e40af",
    verifiedBg: "linear-gradient(135deg, #1e3a8a, #2563eb)", companyColor: "#2563eb",
    dotActive: "#2563eb", dotShadow: "rgba(37,99,235,0.4)",
  },
  {
    key: "gold", label: "Gold", emoji: "🥇",
    tabActiveBg: "linear-gradient(135deg, #92400e 0%, #d97706 100%)",
    tabActiveBorder: "#f59e0b", tabActiveText: "#fff",
    tabActiveShadow: "0 8px 28px rgba(217,119,6,0.35)",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #fffbeb 60%, #fef3c7 100%)",
    cardBorder: "#fcd34d",
    cardShadow: "0 20px 60px rgba(217,119,6,0.13), 0 4px 20px rgba(217,119,6,0.08)",
    cardTopBar: "linear-gradient(90deg, #92400e, #d97706, #fbbf24)",
    ringGrad: "conic-gradient(from 0deg, #92400e, #fbbf24, #fef3c7, #fbbf24, #92400e)",
    accentColor: "#d97706", accentLight: "#fef3c7",
    badgeBg: "linear-gradient(135deg, #fef3c7, #fffbeb)", badgeBorder: "#fcd34d", badgeText: "#92400e",
    verifiedBg: "linear-gradient(135deg, #92400e, #d97706)", companyColor: "#d97706",
    dotActive: "#d97706", dotShadow: "rgba(217,119,6,0.4)",
  },
  {
    key: "silver", label: "Silver", emoji: "🥈",
    tabActiveBg: "linear-gradient(135deg, #334155 0%, #64748b 100%)",
    tabActiveBorder: "#94a3b8", tabActiveText: "#fff",
    tabActiveShadow: "0 8px 28px rgba(100,116,139,0.3)",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
    cardBorder: "#cbd5e1",
    cardShadow: "0 20px 60px rgba(100,116,139,0.1), 0 4px 20px rgba(100,116,139,0.06)",
    cardTopBar: "linear-gradient(90deg, #334155, #64748b, #94a3b8)",
    ringGrad: "conic-gradient(from 0deg, #334155, #94a3b8, #e2e8f0, #94a3b8, #334155)",
    accentColor: "#64748b", accentLight: "#f1f5f9",
    badgeBg: "linear-gradient(135deg, #f1f5f9, #f8fafc)", badgeBorder: "#cbd5e1", badgeText: "#334155",
    verifiedBg: "linear-gradient(135deg, #334155, #64748b)", companyColor: "#475569",
    dotActive: "#64748b", dotShadow: "rgba(100,116,139,0.35)",
  },

  {
    // ── NEW: Celebrity tab ─────────────────────────────────────────────────
    key: "celebrity", label: "Celebrity", emoji: "🌟",
    tabActiveBg: "linear-gradient(135deg, #831843 0%, #db2777 100%)",
    tabActiveBorder: "#f9a8d4", tabActiveText: "#fff",
    tabActiveShadow: "0 8px 28px rgba(219,39,119,0.38)",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #fdf2f8 60%, #fce7f3 100%)",
    cardBorder: "#f9a8d4",
    cardShadow: "0 20px 60px rgba(219,39,119,0.14), 0 4px 20px rgba(219,39,119,0.08)",
    cardTopBar: "linear-gradient(90deg, #831843, #db2777, #f472b6)",
    ringGrad: "conic-gradient(from 0deg, #831843, #f472b6, #fce7f3, #f472b6, #831843)",
    accentColor: "#db2777", accentLight: "#fce7f3",
    badgeBg: "linear-gradient(135deg, #fce7f3, #fdf2f8)", badgeBorder: "#f9a8d4", badgeText: "#831843",
    verifiedBg: "linear-gradient(135deg, #831843, #db2777)", companyColor: "#db2777",
    dotActive: "#db2777", dotShadow: "rgba(219,39,119,0.42)",
    // extra celebrity-specific
    spotlight: true,
  },

  {
    key: "dignitaries", label: "Dignitaries", emoji: "🎖️",
    tabActiveBg: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
    tabActiveBorder: "#a78bfa", tabActiveText: "#fff",
    tabActiveShadow: "0 8px 28px rgba(124,58,237,0.35)",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #f5f3ff 60%, #ede9fe 100%)",
    cardBorder: "#c4b5fd",
    cardShadow: "0 20px 60px rgba(124,58,237,0.13), 0 4px 20px rgba(124,58,237,0.08)",
    cardTopBar: "linear-gradient(90deg, #4c1d95, #7c3aed, #a78bfa)",
    ringGrad: "conic-gradient(from 0deg, #4c1d95, #a78bfa, #ede9fe, #a78bfa, #4c1d95)",
    accentColor: "#7c3aed", accentLight: "#ede9fe",
    badgeBg: "linear-gradient(135deg, #ede9fe, #f5f3ff)", badgeBorder: "#c4b5fd", badgeText: "#4c1d95",
    verifiedBg: "linear-gradient(135deg, #4c1d95, #7c3aed)", companyColor: "#7c3aed",
    dotActive: "#7c3aed", dotShadow: "rgba(124,58,237,0.4)",
  },

];

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard({ isCenter }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      display: "flex", flexDirection: "column", alignItems: "center",
      border: "1.5px solid #f0f4f8", overflow: "hidden",
      height: "100%", width: "100%",
    }}>
      <div className="skel-shine" style={{ width: "100%", height: isCenter ? 5 : 3, flexShrink: 0 }} />
      <div style={{
        padding: isCenter ? "20px 16px 18px" : "14px 12px 14px",
        display: "flex", flexDirection: "column", alignItems: "center",
        width: "100%", flex: 1, boxSizing: "border-box", gap: 10,
      }}>
        <div className="skel-shine" style={{ width: 90, height: 20, borderRadius: 999 }} />
        <div className="skel-shine" style={{
          width: isCenter ? 90 : 72, height: isCenter ? 90 : 72,
          borderRadius: "50%", flexShrink: 0,
        }} />
        <div className="skel-shine" style={{ width: "60%", height: 13, borderRadius: 8 }} />
        <div className="skel-shine" style={{ width: "45%", height: 10, borderRadius: 8 }} />
        <div className="skel-shine" style={{ width: "35%", height: 9, borderRadius: 8 }} />
      </div>
    </div>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────────────────
function TabButton({ tab, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        padding: "8px 14px",
        borderRadius: 12,
        border: `1.5px solid ${isActive ? tab.tabActiveBorder : "#e2e8f0"}`,
        background: isActive ? tab.tabActiveBg : "#fff",
        color: isActive ? tab.tabActiveText : "#64748b",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: isActive ? tab.tabActiveShadow : "0 2px 8px rgba(0,0,0,0.05)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transform: isActive ? "translateY(-2px)" : "translateY(0)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {isActive && (
        <div style={{
          position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          animation: "tabShimmer 2.5s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}
      <span style={{ fontSize: 14 }}>{tab.emoji}</span>
      <span style={{ position: "relative", zIndex: 1 }}>{tab.label}</span>
     
    </button>
  );
}

// ─── Member Card ───────────────────────────────────────────────────────────────
function MemberCard({ member, isCenter, theme }) {
  if (!member) return null;

  const isCelebrity = theme.key === "celebrity";

  return (
    <div style={{
      background: isCenter ? theme.cardBg : "#fff",
      borderRadius: 20,
      display: "flex", flexDirection: "column", alignItems: "center",
      transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: isCenter ? "scale(1.04)" : "scale(0.93)",
      opacity: isCenter ? 1 : 0.6,
      boxShadow: isCenter ? theme.cardShadow : "0 4px 20px rgba(0,0,0,0.05)",
      border: `1.5px solid ${isCenter ? theme.cardBorder : "#f0f4f8"}`,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      height: "100%",
      userSelect: "none",
    }}>
      {/* Top bar */}
      <div style={{
        width: "100%", height: isCenter ? 5 : 3, flexShrink: 0,
        background: isCenter ? theme.cardTopBar : "#f1f5f9",
      }} />

      {/* Celebrity spotlight glow behind card */}
      {isCelebrity && isCenter && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "55%",
          background: "linear-gradient(180deg, rgba(249,168,212,0.18) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />
      )}

      <div style={{
        padding: isCenter ? "20px 16px 18px" : "14px 12px 14px",
        display: "flex", flexDirection: "column", alignItems: "center",
        width: "100%", flex: 1, boxSizing: "border-box",
        position: "relative", zIndex: 1,
      }}>
        {isCenter && (
          <div style={{
            position: "absolute", top: -25, right: -25, width: 130, height: 130,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.accentLight}90 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
        )}

        {/* BADGE */}
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 12px", borderRadius: 999,
          background: isCenter ? theme.badgeBg : "#f8faff",
          border: `1px solid ${isCenter ? theme.badgeBorder : "#e8ecf4"}`,
          color: isCenter ? theme.badgeText : "#94a3b8",
          fontSize: 8, fontWeight: 800, letterSpacing: "1.8px",
          textTransform: "uppercase", marginBottom: 14,
          position: "relative", zIndex: 1,
        }}>
          <span style={{ fontSize: 10 }}>{theme.emoji}</span>
          {theme.label}
        </div>

        {/* PHOTO */}
        <div style={{ position: "relative", marginBottom: 12, zIndex: 1 }}>
          {/* Celebrity: star sparkles around ring */}
          {isCelebrity && isCenter && (
            <>
              {[0, 72, 144, 216, 288].map((deg, idx) => (
                <div key={idx} style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  width: 8, height: 8,
                  marginTop: -4, marginLeft: -4,
                  transform: `rotate(${deg}deg) translateY(-58px)`,
                  fontSize: 10,
                  lineHeight: 1,
                  animation: `starPulse ${1.6 + idx * 0.18}s ease-in-out infinite alternate`,
                  pointerEvents: "none",
                  zIndex: 3,
                }}>⭐</div>
              ))}
            </>
          )}

          <div style={{
            width: isCenter ? 90 : 74,
            height: isCenter ? 90 : 74,
            borderRadius: "50%", padding: 3,
            background: isCenter ? theme.ringGrad : "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
            flexShrink: 0,
          }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              overflow: "hidden", border: "3px solid #fff", background: "#fff",
            }}>
              <img
                src={member.photo}
                alt={member.name}
                loading="lazy"
                draggable={false}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  objectPosition: "top", userSelect: "none",
                  WebkitUserDrag: "none", pointerEvents: "none",
                }}
                onError={e => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f1f5f9&color=475569&size=200&bold=true`;
                }}
              />
            </div>
          </div>

          {isCenter && (
            <div style={{
              position: "absolute", inset: -5, borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.accentLight} 0%, transparent 65%)`,
              zIndex: -1, animation: "haloBreath 3s ease-in-out infinite",
            }} />
          )}

          {/* Verified badge — star icon for celebrity */}
          {isCenter && (
            <div style={{
              position: "absolute", bottom: 2, right: 2,
              width: 20, height: 20, borderRadius: "50%",
              background: theme.verifiedBg, border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 2px 8px ${theme.accentColor}50`,
              fontSize: isCelebrity ? 10 : undefined,
            }}>
              {isCelebrity ? (
                <span style={{ lineHeight: 1 }}>⭐</span>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="#fff" strokeWidth="2.5" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* NAME */}
        <div style={{
          fontSize: isCenter ? 15 : 12, fontWeight: 800,
          color: "#0f172a", textAlign: "center",
          letterSpacing: "-0.3px", marginBottom: 4,
          position: "relative", zIndex: 1,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1.2, userSelect: "none",
        }}>
          {member.name}
        </div>

        {/* COMPANY */}
        <div style={{
          fontSize: 10, fontWeight: 700,
          color: isCenter ? theme.companyColor : "#F05A1A",
          textAlign: "center", marginBottom: 3,
          position: "relative", zIndex: 1,
          maxWidth: "100%", overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
          userSelect: "none",
        }}>
          {member.company}
        </div>

        {/* ROLE */}
        <div style={{
          fontSize: 9, fontWeight: 600, color: "#94a3b8",
          textAlign: "center", marginBottom: 14,
          textTransform: "uppercase", letterSpacing: "1.3px",
          position: "relative", zIndex: 1, userSelect: "none",
        }}>
          {member.role}
        </div>

        <div style={{
          width: isCenter ? "50%" : "30%", height: 2, borderRadius: 999,
          background: isCenter
            ? `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`
            : "linear-gradient(90deg, transparent, #e2e8f0, transparent)",
          position: "relative", zIndex: 1,
        }} />
      </div>
    </div>
  );
}

// Tallest card slot (center / active). Side cards scale down inside this — fixed height avoids layout shift on autoplay.
const SLIDER_CARD_SLOT_PX = 280;

// Nav chevrons (text glyphs sit off-center in many fonts; SVG + flex centers reliably)
function NavChevronLeft({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function NavChevronRight({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const navArrowBtnBase = {
  width: 40,
  height: 40,
  borderRadius: 12,
  border: "1.5px solid #e2e8f0",
  background: "#fff",
  color: "#64748b",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  transition: "all 0.25s ease",
  userSelect: "none",
  padding: 0,
  lineHeight: 0,
  flexShrink: 0,
};

// ─── Swiper Slider Section ─────────────────────────────────────────────────────
function SwiperSliderSection({ members, theme, activeTab }) {
  const total = members.length;
  const [swiper, setSwiper] = useState(null);

  const paginationStyle = `
    .sms-swiper-${activeTab} .swiper-pagination-bullet-active {
      background: ${theme.dotActive} !important;
      box-shadow: 0 0 8px ${theme.dotShadow};
    }
  `;

  return (
    <>
      <style>{paginationStyle}</style>
      <div style={{ position: "relative" }}>
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
          className={`sms-swiper sms-swiper-${activeTab}`}
          centeredSlides
          loop={total > 3}
          rewind={total > 1 && total <= 3}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          autoplay={
            total > 1
              ? {
                  delay: 2500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          grabCursor={false}
          simulateTouch
          onSwiper={setSwiper}
          breakpoints={{
            0:    { slidesPerView: 1.2, spaceBetween: 10 },
            400:  { slidesPerView: 1.6, spaceBetween: 12 },
            560:  { slidesPerView: 2.2, spaceBetween: 14 },
            768:  { slidesPerView: 2.8, spaceBetween: 16 },
            1024: { slidesPerView: 3.4, spaceBetween: 18 },
            1200: { slidesPerView: 3.8, spaceBetween: 20 },
          }}
          style={{ userSelect: "none" }}
        >
          {members.map((member, i) => (
            <SwiperSlide key={member.id || i}>
              {({ isActive }) => (
                <div style={{
                  width: "100%",
                  height: SLIDER_CARD_SLOT_PX,
                  minHeight: SLIDER_CARD_SLOT_PX,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  margin: "0 auto",
                }}>
                  <div style={{ width: "100%", transition: "all 0.45s cubic-bezier(0.34,1.2,0.64,1)" }}>
                    <MemberCard member={member} isCenter={isActive} theme={theme} />
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nav Arrows */}
        {total > 1 && (
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            gap: 12, marginTop: 2, marginBottom: 6,
          }}>
            <button
              type="button"
              aria-label="Previous slide"
              style={navArrowBtnBase}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.background = theme.tabActiveBg;
                t.style.color = "#fff";
                t.style.borderColor = theme.tabActiveBorder;
                t.style.boxShadow = theme.tabActiveShadow;
                t.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.background = "#fff";
                t.style.color = "#64748b";
                t.style.borderColor = "#e2e8f0";
                t.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                t.style.transform = "scale(1)";
              }}
              onClick={() => swiper?.slidePrev()}
            >
              <NavChevronLeft />
            </button>

            <button
              type="button"
              aria-label="Next slide"
              style={navArrowBtnBase}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.background = theme.tabActiveBg;
                t.style.color = "#fff";
                t.style.borderColor = theme.tabActiveBorder;
                t.style.boxShadow = theme.tabActiveShadow;
                t.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.background = "#fff";
                t.style.color = "#64748b";
                t.style.borderColor = "#e2e8f0";
                t.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
                t.style.transform = "scale(1)";
              }}
              onClick={() => swiper?.slideNext()}
            >
              <NavChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function SpecialMembersSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bodyCorporate");
  const [memberGroups, setMemberGroups] = useState(EMPTY_GROUPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPublicSpecialMembers()
      .then((list) => {
        if (cancelled) return;
        const groups = {
          bodyCorporate: [], diamond: [], gold: [], silver: [],
          dignitaries: [], celebrity: [],
        };
        const items = Array.isArray(list) ? list : [];
        items.forEach((item) => {
          const categoryRaw = String(
            item.membershipCategory || item.membershipType || ""
          ).toLowerCase();
          let key = "silver";
          if (categoryRaw.includes("corporate") || categoryRaw.includes("body"))    key = "bodyCorporate";
          else if      (categoryRaw.includes("diamond"))                                       key = "diamond";
          else if (categoryRaw.includes("gold"))                                          key = "gold";
          else if (categoryRaw.includes("dignitar"))                                      key = "dignitaries";
          else if (categoryRaw.includes("celebrit"))                                      key = "celebrity";
          

          groups[key].push({
            id:      item.id || `${key}-${Math.random()}`,
            name:    item.name || "Member",
            company: item.companyName || "",
            role:    item.designation || "Member",
            photo:   item.img ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Member")}&background=f1f5f9&color=475569&size=200&bold=true`,
          });
        });
        setMemberGroups(groups);
      })
      .catch(() => { if (!cancelled) setMemberGroups(EMPTY_GROUPS); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const tabConfig = useMemo(
    () => TABS.map((tab) => ({ ...tab, count: memberGroups[tab.key]?.length || 0 })),
    [memberGroups]
  );

  const theme = tabConfig.find((t) => t.key === activeTab) || tabConfig[0];
  const members = memberGroups[activeTab] || [];
  const total = members.length;

  useEffect(() => {
    if (loading || total > 0) return;
    const fallback = tabConfig.find((tab) => (memberGroups[tab.key] || []).length > 0);
    if (fallback && fallback.key !== activeTab) setActiveTab(fallback.key);
  }, [activeTab, loading, memberGroups, tabConfig, total]);

  return (
    <section style={{
      background: "linear-gradient(170deg, #f8faff 0%, #ffffff 50%, #fff8f4 100%)",
      padding: "clamp(48px, 8vw, 100px) 0 clamp(36px, 6vw, 80px)",
      position: "relative", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      border: "none", outline: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');

        @keyframes tabShimmer {
          0%   { left: -100%; }
          60%, 100% { left: 200%; }
        }
        @keyframes haloBreath {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes headReveal {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes skelShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes starPulse {
          from { opacity: 0.4; transform: rotate(var(--r, 0deg)) translateY(-58px) scale(0.85); }
          to   { opacity: 1;   transform: rotate(var(--r, 0deg)) translateY(-58px) scale(1.2); }
        }
        .skel-shine {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 1200px 100%;
          animation: skelShimmer 1.4s ease-in-out infinite;
        }

        /* ── Tab scroll bar ── */
        .sms-tabs-row {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          gap: 8px;
          padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          justify-content: flex-start;
        }
        .sms-tabs-row::-webkit-scrollbar { display: none; }

        @media (min-width: 640px) {
          .sms-tabs-row {
            justify-content: center;
            flex-wrap: wrap;
            overflow-x: visible;
          }
        }

        /* ── Swiper ── */
        .sms-swiper {
          padding: 16px 0 44px !important;
          overflow: visible !important;
        }
        .sms-swiper .swiper-slide {
          transition: all 0.45s cubic-bezier(0.34,1.2,0.64,1);
          height: auto;
          min-height: ${SLIDER_CARD_SLOT_PX}px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .sms-swiper .swiper-slide-active { z-index: 2; }
        .sms-swiper .swiper-pagination   { bottom: 10px !important; }
        .sms-swiper .swiper-pagination-bullet {
          width: 6px; height: 5px; border-radius: 999px;
          background: #e2e8f0; opacity: 1;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sms-swiper .swiper-pagination-bullet-active { width: 24px; }
        .sms-swiper .swiper-button-prev,
        .sms-swiper .swiper-button-next { display: none; }

        /* ── Skeleton row responsive ── */
        .skel-row {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; padding: 16px 0 44px;
        }
        .skel-item { flex-shrink: 0; }
        .skel-hide-far  { display: none; }
        .skel-hide-side { display: none; }

        @media (min-width: 560px)  { .skel-hide-side { display: block !important; } }
        @media (min-width: 900px)  { .skel-hide-far  { display: block !important; } }

        /* Disable drag */
        .sms-swiper img,
        .sms-swiper .swiper-slide {
          -webkit-user-drag: none;
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>

      {/* Background decorations */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
        backgroundSize: "30px 30px", opacity: 0.3,
      }} />
      <div style={{
        position: "absolute", top: -100, right: -80, width: 400, height: 400,
        borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(240,90,26,0.05) 0%, transparent 65%)",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 300, height: 300,
        borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(11,30,75,0.04) 0%, transparent 65%)",
      }} />

      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 clamp(14px, 4vw, 24px)",
        position: "relative",
      }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: "center", marginBottom: "clamp(24px, 4vw, 44px)", animation: "headReveal 0.7s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 16px", borderRadius: 999,
            background: "linear-gradient(135deg, rgba(240,90,26,0.08), rgba(255,173,92,0.08))",
            border: "1px solid rgba(240,90,26,0.18)",
            color: "#F05A1A",
            fontSize: "clamp(9px, 2vw, 11px)",
            fontWeight: 700, letterSpacing: "2.2px",
            textTransform: "uppercase",
            marginBottom: "clamp(10px, 2vw, 18px)",
          }}>
            <HiSparkles style={{ fontSize: 12 }} />
            Our Distinguished Members
          </div>

          <h2 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "clamp(28px, 6.5vw, 58px)",
            letterSpacing: "clamp(1px, .4vw, 3px)",
            lineHeight: 1, color: "#0B1E4B",
            margin: "0 0 clamp(8px, 1.5vw, 14px)",
          }}>
            SPECIAL{" "}
            <span style={{
              background: "linear-gradient(90deg, #F05A1A, #FF9D42)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {theme.label} MEMBERS
            </span>
            {" "}OF UDIISA
          </h2>

          <p style={{
            fontSize: "clamp(12px, 2.2vw, 15px)",
            color: "#64748b",
            maxWidth: 460, margin: "0 auto",
            lineHeight: 1.75, fontWeight: 500,
          }}>
            Visionary leaders and dedicated patrons who champion the cause of sports in India
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ marginBottom: "clamp(20px, 4vw, 44px)", animation: "headReveal 0.7s 0.1s ease both" }}>
          <div className="sms-tabs-row">
            {tabConfig.map(tab => (
              <TabButton
                key={tab.key}
                tab={tab}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>
        </div>

        {/* ── SKELETON ── */}
        {loading && (
          <div className="skel-row">
            <div className="skel-item skel-hide-far" style={{ width: 170, height: 235 }}>
              <SkeletonCard isCenter={false} />
            </div>
            <div className="skel-item skel-hide-side" style={{ width: 190, height: 245 }}>
              <SkeletonCard isCenter={false} />
            </div>
            <div className="skel-item" style={{ width: 220, height: 272 }}>
              <SkeletonCard isCenter />
            </div>
            <div className="skel-item skel-hide-side" style={{ width: 190, height: 245 }}>
              <SkeletonCard isCenter={false} />
            </div>
            <div className="skel-item skel-hide-far" style={{ width: 170, height: 235 }}>
              <SkeletonCard isCenter={false} />
            </div>
          </div>
        )}

        {/* ── SLIDER ── */}
        {!loading && total > 0 && (
          <SwiperSliderSection key={activeTab} members={members} theme={theme} activeTab={activeTab} />
        )}

        {/* ── EMPTY ── */}
        {!loading && total === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 0",
            color: "#94a3b8", fontSize: 14, fontWeight: 600,
          }}>
            No members found for this category.
          </div>
        )}

        {/* ── VIEW ALL ── */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(8px, 2vw, 16px)" }}>
          <button
            onClick={() => navigate("/members/special-members")}
            style={{
              display: "inline-flex", alignItems: "center",
              gap: "clamp(6px, 1.5vw, 10px)",
              padding: "clamp(10px, 2vw, 14px) clamp(22px, 4vw, 38px)",
              borderRadius: 14, background: theme.tabActiveBg,
              border: "none", color: "#fff",
              fontSize: "clamp(10px, 2vw, 13px)",
              fontWeight: 800, letterSpacing: "0.8px",
              textTransform: "uppercase", cursor: "pointer",
              boxShadow: theme.tabActiveShadow,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              userSelect: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >
            <BsStarFill style={{ fontSize: 12 }} />
            View All {theme.label} Members
            <FaArrowRight style={{ fontSize: 11 }} />
          </button>
        </div>

      </div>
    </section>
  );
}