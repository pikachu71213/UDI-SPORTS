import React from 'react'
import { FaStar, FaUserCircle } from 'react-icons/fa'
import { FaQuoteLeft } from 'react-icons/fa6'
import suniljalan from "@/assets/images/sunil-jalan.webp"

const Leadership = () => {
  return (
    <>
      <style>{`
        /* Gold card glow */
        @keyframes goldPulse {
          0%, 100% { box-shadow: 0 0 24px 4px rgba(234,179,8,.35), 0 0 60px 8px rgba(234,179,8,.12); }
          50%       { box-shadow: 0 0 36px 8px rgba(234,179,8,.55), 0 0 80px 16px rgba(234,179,8,.22); }
        }
        .gold-card { animation: goldPulse 3s ease-in-out infinite; }

        /* Quote icon bounce */
        @keyframes quoteBounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .quote-icon { animation: quoteBounce 3s ease-in-out infinite; }

        /* Corner brackets */
        .corner { position: absolute; width: 18px; height: 18px; border-color: #F59E0B; border-style: solid; }
        .corner-tl { top: 10px; left: 10px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 10px; right: 10px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 10px; left: 10px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; }
      `}</style>

      <section className="leadership-section !py-[48px] sm:!py-[54px] lg:!py-[60px] !px-[16px] sm:!px-[24px] lg:!px-[32px] bg-gradient-to-br from-[#0B1E4B] via-[#0f2560] to-[#0B1E4B]">
        <div className="w-full max-w-[1280px] !mx-auto">

          <div className="flex flex-col lg:flex-row items-center !gap-[36px] sm:!gap-[48px] lg:!gap-[64px]">

            {/* ══ LEFT — Gold Leadership Card ══ */}
            <div className="flex-shrink-0 flex justify-center w-full sm:w-[60%] lg:w-[34%]">
              <div className="gold-card relative rounded-[18px] sm:rounded-[20px] overflow-hidden w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[370px] h-[340px] sm:h-[400px] lg:h-[440px] border-2 border-[#F59E0B] bg-gradient-to-br from-[#1e3a6e] to-[#0B1E4B]">

                {/* Corner brackets */}
                <div className="corner corner-tl" />
                <div className="corner corner-tr" />
                <div className="corner corner-bl" />
                <div className="corner corner-br" />

                {/* Leadership badge top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex items-center !gap-[5px] rounded-b-[10px] !px-[12px] sm:!px-[14px] !py-[4px] sm:!py-[5px] bg-gradient-to-r from-[#B45309] via-[#F59E0B] to-[#B45309] text-white text-[9px] sm:text-[10px] font-extrabold tracking-[2.5px] uppercase whitespace-nowrap">
                  <FaStar className="text-[7px] sm:text-[8px]" />
                  Leadership
                  <FaStar className="text-[7px] sm:text-[8px]" />
                </div>

                {/* Photo */}
                <img
                  src={suniljalan}
                  alt="Sunil Jalan"
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />

                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[rgba(11,30,75,.85)] to-transparent" />
              </div>
            </div>

            {/* ══ RIGHT — Content ══ */}
            <div className="flex-1 w-full lg:w-[66%]">

              {/* "Our Leadership" pill */}
              <div className="inline-flex items-center rounded-full bg-[rgba(255,255,255,.08)] border border-[rgba(255,255,255,.14)] text-[rgba(255,255,255,.7)] !px-[14px] sm:!px-[18px] !py-[5px] sm:!py-[6px] text-[10px] sm:text-[11px] font-extrabold tracking-[2.5px] uppercase !mb-[14px] sm:!mb-[18px] lg:!mb-[20px]">
                Our Leadership
              </div>

              {/* Quote icon */}
              <div className="quote-icon !mb-[10px] sm:!mb-[12px] lg:!mb-[14px] text-[#F05A1A] text-[22px] sm:text-[26px] lg:text-[28px]">
                <FaQuoteLeft />
              </div>

              {/* Name */}
              <h2
                className="text-white !m-0 !mb-[10px] sm:!mb-[12px] leading-[1] tracking-[3px]"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: "clamp(28px, 5vw, 52px)",
                }}
              >
                Mr. Sunil Jalan
              </h2>

              {/* Orange underline */}
              <div className="w-[44px] sm:w-[52px] h-[3px] sm:h-[4px] rounded-full bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] !mb-[16px] sm:!mb-[20px] lg:!mb-[22px]" />

              {/* Description */}
              <p className="text-[rgba(255,255,255,.7)] !m-0 !mb-[0px] w-full leading-[1.8] sm:leading-[1.85] text-[clamp(13px,1.5vw,15.5px)]">
                   He is also the Co-Founder and Chairman of A-One Steels India Ltd. He is proactive in providing assistance to talented and gifted players in a recognized manner at all levels in the sports mission. He lends his expertise to each significant aspect of managing the Association, including strategy, operations, and finance objectives. He is responsible for the successful leadership and management of the Association, which is registered under Section 8 of the Companies Act. He implements comprehensive plans for sports development, enhances the organizational culture, and ensures a safe working environment within the sports ecosystem, with the aim of creating future champions in sports.
              </p>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Leadership