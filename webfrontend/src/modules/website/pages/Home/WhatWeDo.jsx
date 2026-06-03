import React from 'react'
import { FaSearch, FaBullseye, FaMoneyBillWave, FaBrain, FaSchool, FaFemale, FaBullhorn, FaTrophy } from 'react-icons/fa'

const services = [
  {
    icon: <FaSearch />,
    title: "Talent Identification",
    desc: "Our team visits schools, colleges, sports academies, and local grounds across the country to identify exceptional sports talent and gifted players.",
  },
  {
    icon: <FaBullseye />,
    title: "Player Selection",
    desc: "Players are carefully selected based on their skill level, dedication, discipline, and future potential in sports.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Financial Support",
    desc: "We provide financial assistance to help players continue their training, access better resources, and participate in competitions.",
  },
  {
    icon: <FaBrain />,
    title: "Guidance & Mentorship",
    desc: "Selected players receive continuous guidance, mentorship, and long-term support from experienced sports professionals.",
  },
  {
    icon: <FaSchool />,
    title: "Academy & Coaching Support",
    desc: "Talented players are connected with top sports academies, qualified trainers, and professional coaches for advanced training.",
  },
  {
    icon: <FaFemale />,
    title: "Girl Player Support",
    desc: "Special initiatives are taken to support and encourage girl players, helping them participate and grow confidently in sports.",
  },
  {
    icon: <FaBullhorn />,
    title: "Social Media Promotion",
    desc: "We promote talented players and their achievements through digital and social media platforms to increase visibility and recognition.",
  },
  {
    icon: <FaTrophy />,
    title: "Sports Events & Tournaments",
    desc: "We organize sports events, tournaments, and competitions to provide players with opportunities for exposure and competitive experience.",
  },
];

const WhatWeDo = () => {
  return (
    <>
      <style>{`
        /* Bottom orange bar */
        .svc-card {
          position: relative;
          overflow: hidden;
          transition: transform .32s cubic-bezier(.16,1,.3,1),
                      box-shadow .32s ease,
                      border-color .25s ease,
                      background .25s ease;
          cursor: default;
        }
        .svc-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg,#F05A1A,#FF7D42);
          border-radius: 0 0 16px 16px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .35s cubic-bezier(.16,1,.3,1);
        }
        .svc-card:hover::after { transform: scaleX(1); }

        /* Shimmer sweep */
        .svc-card::before {
          content: '';
          position: absolute;
          top: 0; left: -80%;
          width: 60%; height: 100%;
          background: linear-gradient(120deg,transparent,rgba(255,255,255,.05),transparent);
          transform: skewX(-15deg);
          transition: left .5s ease;
          pointer-events: none;
          z-index: 1;
        }
        .svc-card:hover::before { left: 130%; }

        /* Hover state */
        .svc-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 24px 56px rgba(240,90,26,.22) !important;
          border-color: rgba(240,90,26,.6) !important;
          background: rgba(240,90,26,.06) !important;
        }

        /* Icon hover */
        .svc-icon {
          transition: transform .32s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
        }
        .svc-card:hover .svc-icon {
          transform: scale(1.15) rotate(-6deg);
          box-shadow: 0 12px 32px rgba(240,90,26,.4) !important;
        }
        .svc-card:hover .svc-icon svg,
        .svc-card:hover .svc-icon-inner { color: #fff !important; }
        .svc-card:hover .svc-title { color: #FF8C5A !important; }

        /* Glow */
        .svc-glow {
          position: absolute;
          top: -40px; right: -40px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,26,.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity .3s ease;
          pointer-events: none;
        }
        .svc-card:hover .svc-glow { opacity: 1; }

        /* Mobile scroll snap */
        .svc-scroll-wrap {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .svc-scroll-wrap::-webkit-scrollbar { display: none; }
      `}</style>

      <section className="wwd-section !py-[48px] sm:!py-[64px] lg:!py-[60px] !px-0 sm:!px-[24px] lg:!px-[32px] bg-gradient-to-br from-[#0B1E4B] via-[#0d2258] to-[#0B1E4B] overflow-hidden">
        <div className="max-w-[1240px] !mx-auto">

          {/* ── Header ── */}
          <div className="text-center !mb-[36px] sm:!mb-[48px] lg:!mb-[56px] !px-[16px] sm:!px-[0]">

            {/* Badge */}
            <div className="inline-flex items-center rounded-full !mb-[14px] sm:!mb-[18px] lg:!mb-[20px] !px-[14px] sm:!px-[20px] !py-[5px] sm:!py-[6px] bg-[rgba(240,90,26,.15)] border-[1.5px] border-[rgba(240,90,26,.45)] text-[#FF8C5A] text-[10px] sm:text-[11px] font-extrabold tracking-[2.5px] uppercase">
              Our Services
            </div>

            {/* Heading */}
            <h2
              className="text-white !m-0 !mb-[14px] sm:!mb-[16px] leading-[1] tracking-[4px]"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(38px,7vw,72px)',
              }}
            >
              What We <span className="text-[#F05A1A]">Do</span>
            </h2>

            {/* Underline */}
            <div className="w-[48px] sm:w-[56px] h-[3px] sm:h-[4px] rounded-full bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] !mx-auto" />
          </div>
          {/* Mobile scroll wrapper */}
          <div className="sm:hidden svc-scroll-wrap overflow-x-auto !pb-[16px]">
            <div className="flex !gap-[12px] !px-[16px] w-max">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="svc-card flex flex-col items-center text-center rounded-[16px] !p-[20px] bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.08)] shadow-[0_2px_16px_rgba(0,0,0,.18)] w-[220px] flex-shrink-0"
                >
                  <div className="svc-glow" />

                  {/* Icon */}
                  <div className="svc-icon flex items-center justify-center rounded-[14px] !mb-[14px] flex-shrink-0 w-[54px] h-[54px] bg-gradient-to-br from-[#1e2d5a] to-[#2a3d70] shadow-[0_4px_16px_rgba(0,0,0,.3)]">
                    <span className="svc-icon-inner text-[#F05A1A] text-[22px] flex items-center">
                      {s.icon}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="svc-title text-white font-extrabold text-[13px] leading-[1.3] tracking-[0.2px] !m-0 !mb-[8px] transition-colors duration-[250ms]">
                    {s.title}
                  </h3>

                  {/* Desc */}
                  <p className="!m-0 text-[rgba(255,255,255,.52)] text-[11.5px] leading-[1.7]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

           
          </div>

          {/* Tablet: 2-col grid */}
          <div className="hidden sm:grid lg:hidden grid-cols-2 !gap-[16px] !px-[0]">
            {services.map((s) => (
              <div
                key={s.title}
                className="svc-card flex flex-col items-center text-center rounded-[18px] !p-[24px] sm:!p-[26px] bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.08)] shadow-[0_2px_16px_rgba(0,0,0,.18)]"
              >
                <div className="svc-glow" />

                <div className="svc-icon flex items-center justify-center rounded-[16px] !mb-[18px] flex-shrink-0 w-[60px] h-[60px] bg-gradient-to-br from-[#1e2d5a] to-[#2a3d70] shadow-[0_4px_16px_rgba(0,0,0,.3)]">
                  <span className="svc-icon-inner text-[#F05A1A] text-[24px] flex items-center">
                    {s.icon}
                  </span>
                </div>

                <h3 className="svc-title text-white font-extrabold text-[14px] leading-[1.3] tracking-[0.2px] !m-0 !mb-[10px] transition-colors duration-[250ms]">
                  {s.title}
                </h3>

                <p className="!m-0 text-[rgba(255,255,255,.52)] text-[12.5px] leading-[1.75]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: 4-col grid */}
          <div className="hidden lg:grid grid-cols-4 !gap-[20px]">
            {services.map((s) => (
              <div
                key={s.title}
                className="svc-card flex flex-col items-center text-center rounded-[20px] !p-[28px] bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.08)] shadow-[0_2px_16px_rgba(0,0,0,.18)]"
              >
                <div className="svc-glow" />

                <div className="svc-icon flex items-center justify-center rounded-[18px] !mb-[22px] flex-shrink-0 w-[72px] h-[72px] bg-gradient-to-br from-[#1e2d5a] to-[#2a3d70] shadow-[0_4px_16px_rgba(0,0,0,.3)]">
                  <span className="svc-icon-inner text-[#F05A1A] text-[28px] flex items-center">
                    {s.icon}
                  </span>
                </div>

                <h3 className="svc-title text-white font-extrabold text-[15px] leading-[1.3] tracking-[0.2px] !m-0 !mb-[12px] transition-colors duration-[250ms]">
                  {s.title}
                </h3>

                <p className="!m-0 text-[rgba(255,255,255,.52)] text-[13px] leading-[1.75]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default WhatWeDo