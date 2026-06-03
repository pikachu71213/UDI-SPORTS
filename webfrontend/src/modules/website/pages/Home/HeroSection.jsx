import React from "react";
import { FaUsers, FaMedal } from "react-icons/fa";
import { MdGroups, MdVolunteerActivism, MdContactMail } from "react-icons/md";
import { IoFlash } from "react-icons/io5";

const HeroSection = () => {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden min-h-[85vh]"
      id="home"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        /* ── Entry animations ── */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBadgeIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.90); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heroTitleWord {
          from { opacity: 0; transform: translateY(52px) skewY(5deg); }
          to   { opacity: 1; transform: translateY(0) skewY(0deg); }
        }
        @keyframes heroLineGrow {
          from { width: 0; opacity: 0; }
          to   { width: 80px; opacity: 1; }
        }
        @keyframes heroStatPop {
          0%   { transform: scale(0.60); opacity: 0; }
          65%  { transform: scale(1.12); }
          100% { transform: scale(1);   opacity: 1; }
        }

        /* ── Floating glow orbs ── */
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(18px,-24px) scale(1.07); }
          66%     { transform: translate(-14px,16px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(-22px,18px) scale(1.05); }
          70%     { transform: translate(16px,-12px) scale(0.97); }
        }

        /* ── Animated grid drift ── */
        @keyframes gridDrift {
          0%   { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        /* ── Shine sweep on buttons ── */
        @keyframes shineSweep {
          0%   { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(280%)  skewX(-15deg); }
        }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 45%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent);
          transform: translateX(-120%) skewX(-15deg);
        }
        .btn-shine:hover::after { animation: shineSweep 0.6s ease forwards; }
        .btn-primary:hover  {
          transform: translateY(-3px);
          box-shadow: 0 18px 50px rgba(240,90,26,.65) !important;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,.14) !important;
          border-color: rgba(255,255,255,.6) !important;
          transform: translateY(-3px);
        }

        /* ── Staggered class delays ── */
        .h-badge  { animation: heroBadgeIn  .72s cubic-bezier(.16,1,.3,1) .05s  both; }
        .h-word1  { animation: heroTitleWord .72s cubic-bezier(.16,1,.3,1) .20s  both; display: inline-block; }
        .h-word2  { animation: heroTitleWord .72s cubic-bezier(.16,1,.3,1) .32s  both; display: inline-block; }
        .h-word3  { animation: heroTitleWord .72s cubic-bezier(.16,1,.3,1) .44s  both; display: inline-block; }
        .h-word4  { animation: heroTitleWord .72s cubic-bezier(.16,1,.3,1) .52s  both; display: inline-block; }
        .h-line   { animation: heroLineGrow  .90s cubic-bezier(.16,1,.3,1) .62s  both; }
        .h-desc   { animation: heroFadeUp    .80s cubic-bezier(.16,1,.3,1) .68s  both; }
        .h-btns   { animation: heroFadeUp    .80s cubic-bezier(.16,1,.3,1) .80s  both; }
        .h-stats  { animation: heroFadeUp    .80s cubic-bezier(.16,1,.3,1) .92s  both; }

        .stat-0 .stat-num { animation: heroStatPop .55s cubic-bezier(.34,1.56,.64,1) 1.04s both; }
        .stat-1 .stat-num { animation: heroStatPop .55s cubic-bezier(.34,1.56,.64,1) 1.16s both; }
        .stat-2 .stat-num { animation: heroStatPop .55s cubic-bezier(.34,1.56,.64,1) 1.28s both; }

        /* ── Animated grid bg ── */
        .hero-grid-anim {
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridDrift 14s linear infinite;
        }
        /* ── Diagonal stripes overlay ── */
        .hero-stripes {
          background-image: repeating-linear-gradient(
            -55deg,
            transparent, transparent 24px,
            rgba(240,90,26,.032) 24px, rgba(240,90,26,.032) 25px
          );
        }

        @media (max-width: 480px) {
          .hero-btns { flex-direction: column; align-items: stretch; }
          .hero-btns a { justify-content: center; }
        }
      `}</style>

      {/* ── Background image ── */}
      <img
        className="absolute inset-0 w-full h-full object-cover object-top"
        src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=85&fit=crop"
        alt="Sports"
        fetchPriority="high"
        decoding="async"
      />

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(6,18,52,0.96)] via-[rgba(11,30,75,0.80)] to-[rgba(21,43,107,0.90)]" />

      {/* ── Animated grid ── */}
      <div className="hero-grid-anim absolute inset-0 pointer-events-none" />

      {/* ── Diagonal stripes ── */}
      <div className="hero-stripes absolute inset-0 pointer-events-none" />

      {/* ── Floating orb 1 (orange) ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "14%", right: "10%",
          width: "clamp(200px,30vw,480px)", height: "clamp(200px,30vw,480px)",
          background: "radial-gradient(circle, rgba(240,90,26,.18) 0%, transparent 68%)",
          animation: "orbFloat1 9s ease-in-out infinite",
        }}
      />

      {/* ── Floating orb 2 (blue) ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: "6%", left: "4%",
          width: "clamp(140px,22vw,340px)", height: "clamp(140px,22vw,340px)",
          background: "radial-gradient(circle, rgba(59,130,246,.11) 0%, transparent 68%)",
          animation: "orbFloat2 11s ease-in-out infinite",
        }}
      />

      {/* ── Decorative rings (top-left) ── */}
      <div className="absolute pointer-events-none" style={{ top: -60, left: -60, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(240,90,26,.09)" }} />
      <div className="absolute pointer-events-none" style={{ top: -30, left: -30, width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(240,90,26,.05)" }} />

      {/* ── Content ── */}
      <div
        className="relative z-10 text-center w-full flex flex-col items-center"
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "clamp(90px,12vw,120px) clamp(16px,4vw,24px) clamp(48px,6vw,80px)",
        }}
      >

        {/* ── Static Badge ── */}
        <div className="h-badge inline-flex items-center gap-[8px] rounded-full px-[16px] sm:px-[22px] py-[8px] sm:py-[9px] mb-[22px] sm:mb-[32px] border border-[rgba(240,90,26,.40)] bg-[rgba(240,90,26,.12)] backdrop-blur-[6px] select-none">
          <IoFlash className="text-[#FFAB7A] text-[12px] sm:text-[14px] flex-shrink-0" />
          <span className="text-[#FFAB7A] text-[10px] sm:text-[12px] font-extrabold tracking-[2px] uppercase whitespace-nowrap">
            India's Premier Sports NGO
          </span>
        </div>

        {/* ── Heading — word-by-word stagger ── */}
        <h1
          className="text-white m-0 mb-[6px] leading-[0.92] tracking-[3px] sm:tracking-[5px]"
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: "clamp(46px,9.5vw,104px)",
            overflow: "hidden",
          }}
        >
          <span className="h-word1">UNITED&nbsp;</span>
          <span className="h-word2">FOR&nbsp;</span>
          <span className="h-word3" style={{ color: "transparent", WebkitTextStroke: "2px #F05A1A" }}>
            DYNAMIC
          </span>
          <br />
          <span
            className="h-word4"
            style={{
              background: "linear-gradient(90deg,#FF9D42 0%,#F05A1A 55%,#FF7D42 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            iNDIA
          </span>
        </h1>

        {/* ── Animated accent line ── */}
        <div
          className="h-line mb-[20px] sm:mb-[28px]"
          style={{
            height: 3,
            borderRadius: 99,
            background: "linear-gradient(90deg,#F05A1A,#FFAD5C,#F05A1A)",
          }}
        />

        {/* ── Description ── */}
        <p
          className="h-desc m-0 mb-[32px] sm:mb-[44px]"
          style={{
            maxWidth: "clamp(300px,55vw,580px)",
            fontSize: "clamp(13px,2vw,17px)",
            color: "rgba(255,255,255,.62)",
            lineHeight: 1.82,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          An unleashing dream ecosystem where talented players in sports
          will achieve their goal at the level of National &amp; International.
        </p>

        {/* ── CTA Buttons ── */}
        <div className="h-btns hero-btns flex justify-center flex-wrap gap-[10px] sm:gap-[14px] mb-[36px] sm:mb-[52px] lg:mb-[64px] w-full sm:w-auto">
          <a
            href="/membership/individual-patron"
            className="btn-shine btn-primary flex items-center no-underline transition-all duration-[280ms] gap-[8px] sm:gap-[10px]"
            style={{
              padding: "clamp(11px,2vw,15px) clamp(22px,4vw,36px)",
              borderRadius: 14,
              fontSize: "clamp(13px,1.8vw,15px)",
              fontWeight: 800,
              color: "#fff",
              background: "linear-gradient(135deg,#F05A1A 0%,#FF7D42 100%)",
              boxShadow: "0 8px 32px rgba(240,90,26,.44)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: "none",
            }}
          >
            <MdContactMail style={{ fontSize: "clamp(17px,2.5vw,20px)", flexShrink: 0 }} />
            Become a Member
          </a>

          <a
            href="/donate-now"
            className="btn-shine btn-secondary flex items-center no-underline transition-all duration-[280ms] gap-[8px] sm:gap-[10px]"
            style={{
              padding: "clamp(11px,2vw,15px) clamp(22px,4vw,36px)",
              borderRadius: 14,
              fontSize: "clamp(13px,1.8vw,15px)",
              fontWeight: 700,
              color: "#fff",
              border: "2px solid rgba(255,255,255,.30)",
              background: "rgba(255,255,255,.07)",
              backdropFilter: "blur(8px)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textDecoration: "none",
            }}
          >
            <MdVolunteerActivism style={{ fontSize: "clamp(17px,2.5vw,20px)", flexShrink: 0 }} />
            Contribute Now
          </a>
        </div>

        {/* ── Stats Bar ── */}
        <div
          className="h-stats flex justify-center items-center flex-wrap w-full"
          style={{
            maxWidth: "clamp(300px,70vw,620px)",
            padding: "clamp(16px,3vw,28px) clamp(20px,5vw,52px)",
            background: "rgba(255,255,255,.07)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: "clamp(16px,3vw,24px)",
            boxShadow: "0 8px 40px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.08)",
          }}
        >
          {[
            { icon: <FaUsers />,  num: "5,000+", lbl: "Players"    },
            { icon: <MdGroups />, num: "28",     lbl: "States"     },
            { icon: <FaMedal />,  num: "200+",   lbl: "Medals Won" },
          ].map((s, i) => (
            <React.Fragment key={s.lbl}>
              <div className={`text-center stat-${i}`} style={{ padding: "0 clamp(6px,2vw,0px)" }}>
                <div
                  className="flex justify-center mb-[5px] sm:mb-[7px] text-[#FF9D42]"
                  style={{ fontSize: "clamp(15px,2.5vw,20px)" }}
                >
                  {s.icon}
                </div>
                <div
                  className="stat-num text-white"
                  style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: "clamp(28px,5vw,40px)",
                    letterSpacing: 2,
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>
                <div
                  className="font-semibold mt-[4px] sm:mt-[6px] uppercase tracking-[1.5px]"
                  style={{
                    fontSize: "clamp(8px,1.2vw,10px)",
                    color: "rgba(255,255,255,.45)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {s.lbl}
                </div>
              </div>

              {i < 2 && (
                <div style={{
                  margin: "0 clamp(14px,3vw,36px)",
                  flexShrink: 0, width: 1,
                  height: "clamp(40px,5vw,54px)",
                  background: "linear-gradient(180deg, transparent, rgba(255,255,255,.18), transparent)",
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;