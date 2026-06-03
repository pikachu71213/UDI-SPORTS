import React from 'react'
import { FaSearch, FaHandHoldingHeart, FaGraduationCap, FaArrowRight } from 'react-icons/fa'
import aboutImage from "@/assets/images/about2.jpeg"
import { useNavigate } from 'react-router-dom'
import { BsStarFill } from 'react-icons/bs'

// ── Real sports images (Unsplash free-to-use links) ──────────────────────────
const CRICKET_IMG  = "https://i.ibb.co/mm2xkBk/139f2add-a331-4745-ada6-d8b2b2177d93.jpg"
const FOOTBALL_IMG = "https://i.ibb.co/FbthLdKg/67abc23f-e125-4439-aad4-fb2575fcc7c4.jpg"

const features = [
  {
    icon: <FaSearch />,
    title: 'Talent Identification',
    desc: 'Grassroots scouting across 28 states to discover hidden gems.',
  },
  {
    icon: <FaHandHoldingHeart />,
    title: 'Holistic Support',
    desc: 'Financial, mental and technical support for selected Players.',
  },
  {
    icon: <FaGraduationCap />,
    title: 'Academy Placements',
    desc: 'Direct placement in top sports academies nationwide.',
  },
]

const AboutUs = () => {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        /* ── image card ── */
        .img-card {
          transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s ease;
          position: relative; overflow: hidden;
        }
        .img-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 24px 56px rgba(11,30,75,.18) !important; }
        .img-card img { transition: transform .5s ease; }
        .img-card:hover img { transform: scale(1.06); }

        /* ── sport label chip on image ── */
        .sport-chip {
          position: absolute; bottom: 10px; left: 10px; z-index: 2;
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 11px; border-radius: 999px;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(6px);
          font-size: 10px; font-weight: 800; letter-spacing: .8px;
          color: #0B1E4B; text-transform: uppercase;
          box-shadow: 0 2px 10px rgba(11,30,75,.15);
        }
        .sport-chip .chip-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg,#F05A1A,#FF7D42);
        }

        /* ── image overlay gradient ── */
        .img-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, transparent 55%, rgba(11,30,75,.28) 100%);
        }

        /* ── feature card ── */
        .feat-card { transition: all .28s ease; }
        .feat-card:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 32px rgba(240,90,26,.13);
          border-color: rgba(240,90,26,.25) !important;
        }
        .feat-card:hover .feat-icon-wrap {
          background: linear-gradient(135deg,#F05A1A,#FF7D42) !important;
        }
        .feat-card:hover .feat-icon-wrap svg { color: #fff !important; }

        /* ── badge float ── */
        @keyframes badgePop {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        .review-badge { animation: badgePop 3.5s ease-in-out infinite; }

        /* ── stat badge ── */
        @keyframes statFloat {
          0%,100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-8px) rotate(-2deg); }
        }
        .stat-badge { animation: statFloat 4s ease-in-out infinite; }

        /* ── accent line ── */
        .title-underline {
          display: block; width: 52px; height: 4px; border-radius: 2px;
          background: linear-gradient(90deg,#F05A1A,#FF7D42);
        }

        /* ── view-all button ── */
        .sms-view-all {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 32px; border-radius: 14px;
          font-size: 13px; font-weight: 800; letter-spacing: .5px;
          color: #fff; cursor: pointer;
          background: linear-gradient(135deg, #0B1E4B 0%, #1a3580 100%);
          border: none;
          box-shadow: 0 8px 24px rgba(11,30,75,.22);
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sms-view-all:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(11,30,75,.3);
          background: linear-gradient(135deg,#F05A1A,#FF7D42);
        }
        .sms-view-all:hover .arrow-icon { transform: translateX(4px); }
        .arrow-icon { transition: transform .25s; }

        /* ── decorative corner dots ── */
        .corner-dots {
          position: absolute; width: 80px; height: 80px;
          background-image: radial-gradient(circle, rgba(240,90,26,.35) 1.5px, transparent 1.5px);
          background-size: 10px 10px;
          pointer-events: none;
        }

        .aspect-4-3 { aspect-ratio: 4/3; }
        .aspect-tall { aspect-ratio: 3/4; }
      `}</style>

      <section
        className="about-section overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #f0f4ff 0%, #ffffff 45%, #fff8f4 100%)",
          padding: "72px 16px",
          position: "relative",
        }}
      >

        <div className="w-full max-w-[1280px] !mx-auto" style={{ position: "relative" }}>
          <div className="flex flex-col lg:flex-row items-center !gap-[48px] lg:!gap-[72px]">

            {/* ══ LEFT — Image Stack ══ */}
            <div
              className="w-full sm:w-[82%] lg:w-[48%] !mx-auto lg:!mx-0 flex-shrink-0"
              style={{ position: "relative" }}
            >
              {/* Corner dots top-left */}
              <div className="corner-dots" style={{ top: -16, left: -16 }} />
              {/* Corner dots bottom-right */}
              <div className="corner-dots" style={{ bottom: -16, right: -16 }} />

              <div className="grid grid-cols-2 !gap-[14px] sm:!gap-[18px]" style={{ alignItems: "center" }}>

                {/* LEFT COLUMN — cricket + football stacked */}
                <div className="flex flex-col !gap-[14px] sm:!gap-[18px]">

                  {/* Cricket */}
                  <div
                    className="img-card rounded-[16px] sm:rounded-[20px] shadow-[0_8px_32px_rgba(11,30,75,.12)] aspect-4-3"
                    style={{ border: "2px solid rgba(255,255,255,0.9)" }}
                  >
                    <img
                      src={CRICKET_IMG}
                      alt="Cricket player"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="img-overlay" />
                    <div className="sport-chip">
                      <span className="chip-dot" />
                      Cricket
                    </div>
                  </div>

                  {/* Football */}
                  <div
                    className="img-card rounded-[16px] sm:rounded-[20px] shadow-[0_8px_32px_rgba(11,30,75,.12)] aspect-4-3"
                    style={{ border: "2px solid rgba(255,255,255,0.9)" }}
                  >
                    <img
                      src={FOOTBALL_IMG}
                      alt="Football player"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="img-overlay" />
                    <div className="sport-chip">
                      <span className="chip-dot" />
                      Football
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN — original about image tall + badges */}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>

                  <div
                    className="img-card rounded-[16px] sm:rounded-[20px] shadow-[0_12px_40px_rgba(11,30,75,.15)] aspect-tall"
                    style={{ border: "2px solid rgba(255,255,255,0.9)" }}
                  >
                    <img
                      src={aboutImage}
                      alt="UDIISA team"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover  object-top"
                    />
                    <div className="img-overlay" />
                    <div className="sport-chip">
                      <span className="chip-dot" />
                      UDIISA
                    </div>

                  </div>
                    {/* Review badge — floats over right image */}
                    <div
                      className="review-badge"
                      style={{
                        position: "absolute", bottom: "12%", left: -14,
                        background: "#fff",
                        borderRadius: 16,
                        boxShadow: "0 8px 32px rgba(11,30,75,.16)",
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 16px",
                        minWidth: 148,
                        border: "1.5px solid rgba(240,90,26,.12)",
                        zIndex: 3,
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                        background: "linear-gradient(135deg,#F05A1A,#FF7D42)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ color: "#94a3b8", fontWeight: 700, fontSize: 10, letterSpacing: ".5px", marginBottom: 2 }}>User Review</div>
                        <div style={{ color: "#0B1E4B", fontWeight: 900, fontSize: 22, lineHeight: 1, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>650+</div>
                      </div>
                    </div>
                </div>

              </div>
            </div>

            {/* ══ RIGHT — Content ══ */}
            <div className="flex-1 w-full">

              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "6px 16px", borderRadius: 999,
                background: "rgba(240,90,26,.08)",
                border: "1px solid rgba(240,90,26,.25)",
                color: "#F05A1A",
                fontSize: 11, fontWeight: 800, letterSpacing: "2px",
                textTransform: "uppercase", marginBottom: 18,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F05A1A" }} />
                About Us
              </div>

              {/* Heading */}
              <h2
                className="text-[#0B1E4B] !m-0 leading-[1.05] tracking-[2px]"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: "clamp(32px, 5vw, 54px)",
                }}
              >
                Where Talent Meets{' '}
                <span style={{
                  background: "linear-gradient(90deg,#F05A1A,#FF7D42)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Opportunity
                </span>
              </h2>

              {/* Underline */}
              <span className="title-underline !mt-[12px] !mb-[20px]" style={{ display: "block" }} />

              {/* Description */}
              <p style={{
                color: "#475569", margin: "0 0 28px",
                maxWidth: 520, lineHeight: 1.75,
                fontSize: "clamp(13px,1.5vw,15px)",
                fontWeight: 500,
              }}>
                UDIISA works at the grassroots level to discover hidden sporting
                talent and provide structured support including coaching, mentorship,
                financial assistance, and academy placements. Our mission is to
                bridge the gap between talent and opportunity, ensuring that no
                player's dream goes unnoticed or unsupported.
              </p>

              {/* Feature Cards */}
              <div className="flex flex-col !gap-[10px] sm:!gap-[12px]">
                {features.map((f, i) => (
                  <div
                    key={f.title}
                    className="feat-card"
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      background: "#fff",
                      borderRadius: 16,
                      border: "1.5px solid #f0f4ff",
                      padding: "14px 18px",
                      cursor: "default",
                      boxShadow: "0 2px 16px rgba(11,30,75,.06)",
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="feat-icon-wrap"
                      style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: "rgba(240,90,26,.09)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all .28s ease",
                      }}
                    >
                      <span style={{ color: "#F05A1A", fontSize: 17 }}>{f.icon}</span>
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#0B1E4B", fontWeight: 800, fontSize: 14, marginBottom: 3, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                        {f.title}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 12.5, lineHeight: 1.55 }}>
                        {f.desc}
                      </div>
                    </div>

                    {/* Right arrow indicator */}
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: "rgba(240,90,26,.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#F05A1A", fontSize: 11,
                    }}>
                      →
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              <div style={{ marginTop: 28 }}>
                <button className="sms-view-all" onClick={() => navigate('/about-us')}>
                  <BsStarFill style={{ fontSize: 13 }} />
                  View More
                  <FaArrowRight className="arrow-icon" style={{ fontSize: 12 }} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default AboutUs