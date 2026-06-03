import React, { useState } from 'react'
import { FaArrowRight, FaTimes } from 'react-icons/fa'
import suniljalan from "@/assets/images/satishkumarjain.webp"
import sanjaybhardwaj from "@/assets/images/sanjay-bhardwaj.webp"
import santParkash from "@/assets/images/sant prakash.webp"

const chairmen = [
  {
    name: 'Mr. satish kumar jain',
    role: 'Advisory Board Chairman',
    roleBadge: 'Chairman',
    desc: 'Whole time Chairman, Advisory Board. UDIISA.',
    img: suniljalan,
    modalTitle: 'Whole time Chairman, Advisory Board. UDIISA.',
    modalContent: [
      'Mr. Satish Kumar Jain, aged 76 years, is a prominent and proactive personality who transformed his vision into quality construction work by implementing the latest techniques and developing large-scale buildings into reality at project sites. He has instilled strong values of ethical leadership, responsible decision-making, and a culture of healthy governance. He firmly believes in the theory of Karma and hard work and continues to apply his wisdom and vision in all his endeavors. A devoted follower of Jainism, he is deeply committed to nurturing excellence among talented and gifted sports players. He also dedicates his hard-earned resources to noble causes and charitable activities for the betterment of society.',
    ],
  },
  {
    name: 'Mr. Justice Sant Parkash',
    role: 'Advisory Board Vice Chair Person',
    roleBadge: 'Vice Chair Person',
    desc: 'Whole time Vice Chair Person, Advisory Board. UDIISA.',
    img: santParkash,
    modalTitle: 'Whole time Vice Chair Person, Advisory Board. UDIISA.',
    modalContent: [
      'UDIISA\'s initiatives in identifying and nurturing sporting talent across India are highly commendable. With passion, dedication, and integrity, the team is providing valuable support to deserving players, especially from underprivileged backgrounds. Their efforts are strengthening the sports ecosystem and creating equal opportunities for growth. With a forward-looking vision aligned with national development, UDIISA is playing a vital role in shaping future champions and bringing pride to the nation.',
    ],
  },
  {
    name: 'Mr. Sanjay Bhardwaj',
    role: 'Sports Chancellor',
    roleBadge: 'Chancellor',
    desc: 'Sports Development, Program Coordination, and Grassroots Sports Initiatives',
    img: sanjaybhardwaj,
    modalTitle: 'Sports Development, Program Coordination, and Grassroots Sports Initiatives',
    modalContent: [
      'Cricket has become a passion for both men and women, with many talented players starting their journey from the grassroots level and working hard to reach higher levels of the game. Dr. Sanjay Bhardwaj is a respected cricket mentor who dedicated his life to developing young talent. He earned a Ph.D. in Physical Education from the National Institute of Sports (NIS) and the highest coaching certification, Level 3 (Level C), from BCCI. He began coaching in Delhi schools and later established LB Shastri Cricket Academy in Bhopal. Many players, including Gautam Gambhir and Nitish Rana, have benefited from his mentorship.',
    ],
  },
]

const AdvisoryBoard = () => {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <style>{`
        .chair-card { transition: transform .3s ease, box-shadow .3s ease; }
        .chair-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 56px rgba(11,30,75,.14) !important;
        }

        .show-btn { transition: all .25s ease; position: relative; overflow: hidden; }
        .show-btn:hover {
          background: #0B1E4B !important;
          color: #fff !important;
          border-color: #0B1E4B !important;
        }
        .show-btn:hover .btn-arrow { transform: translateX(4px); }
        .btn-arrow { transition: transform .25s ease; }

        @keyframes ringPulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(240,90,26,.2), 0 0 0 8px rgba(240,90,26,.07); }
          50%      { box-shadow: 0 0 0 6px rgba(240,90,26,.3), 0 0 0 12px rgba(240,90,26,.1); }
        }
        .photo-ring { animation: ringPulse 3s ease-in-out infinite; }

        @keyframes modalIn {
          from { opacity:0; transform: scale(.94) translateY(16px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .modal-box { animation: modalIn .28s cubic-bezier(.16,1,.3,1) both; }

        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        .modal-overlay { animation: overlayIn .2s ease both; }

        .close-btn { transition: all .22s ease; }
        .close-btn:hover {
          background: #0B1E4B !important;
          color: #fff !important;
          transform: rotate(90deg);
        }
      `}</style>

      {/* ══ SECTION ══ */}
      <section className="advisory-section bg-white !py-[48px] sm:!py-[54px] lg:!py-[60px] !px-[16px] sm:!px-[24px] lg:!px-[32px]">
        <div className="w-full max-w-[1280px] !mx-auto">

          {/* ── Header ── */}
          <div className="text-center !mb-[36px] sm:!mb-[48px] lg:!mb-[56px]">

            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-[rgba(240,90,26,.4)] bg-[rgba(240,90,26,.05)] text-[#F05A1A] !px-[14px] sm:!px-[18px] !py-[5px] sm:!py-[6px] text-[10px] sm:text-[11px] font-extrabold tracking-[2.5px] uppercase !mb-[14px] sm:!mb-[18px] lg:!mb-[20px]">
              Advisory Board
            </div>

            {/* Heading */}
            <h2
              className="text-[#0B1E4B] !m-0 !mb-[10px] sm:!mb-[12px] leading-[1.05] tracking-[3px]"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(32px,6vw,58px)',
              }}
            >
              Board Of Advisory{' '}
              <span className="text-[#F05A1A]">Committee</span>
            </h2>

            {/* Underline */}
            <div className="w-[44px] sm:w-[52px] h-[3px] sm:h-[4px] rounded-full bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] !mx-auto !mb-[12px] sm:!mb-[16px]" />

            {/* Subtitle */}
            <p className="text-slate-500 !m-0 text-[13.5px] sm:text-[15px] leading-[1.7] max-w-[480px] !mx-auto">
              Distinguished leaders guiding our mission with wisdom and expertise.
            </p>
          </div>

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 !gap-[16px] sm:!gap-[20px] lg:!gap-[28px]">
            {chairmen.map((c) => (
              <div
                key={c.name}
                className="chair-card flex flex-col items-center text-center rounded-[18px] sm:rounded-[20px] bg-white border border-slate-100 shadow-[0_4px_24px_rgba(11,30,75,.08)] !px-[20px] sm:!px-[28px] lg:!px--[36px] !py-[28px] sm:!py-[36px] lg:!py-[40px]"
              >
                {/* Photo */}
                <div className="relative !mb-[28px] sm:!mb-[32px] lg:!mb-[36px]">
                  <div className="photo-ring rounded-full overflow-hidden w-[110px] h-[110px] sm:w-[128px] sm:h-[128px] lg:w-[140px] lg:h-[140px]">
                    <img
                      src={c.img}
                      alt={c.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Role badge on photo */}
                  <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] text-white !px-[10px] sm:!px-[14px] !py-[3px] sm:!py-[4px] text-[9.5px] sm:text-[10.5px] font-extrabold">
                    {c.roleBadge}
                  </div>
                </div>

                {/* Name */}
                <h3
                  className="text-[#0B1E4B] !mt-[6px] sm:!mt-[8px] !mb-[4px] sm:!mb-[6px] leading-none tracking-[2.5px]"
                  style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: 'clamp(22px,3vw,28px)',
                  }}
                >
                  {c.name}
                </h3>

                {/* Role label */}
                <p className="text-slate-400 font-extrabold text-[9.5px] sm:text-[10.5px] tracking-[2px] uppercase !m-0 !mb-[10px] sm:!mb-[14px]">
                  {c.role}
                </p>

                {/* Desc */}
                <p className="text-slate-600 text-[13px] sm:text-[14px] leading-[1.75] !m-0 !mb-[18px] sm:!mb-[22px] lg:!mb-[24px] max-w-[300px]">
                  {c.desc}
                </p>

                {/* Button */}
                <button
                  className="show-btn flex items-center !gap-[7px] sm:!gap-[8px] rounded-full border-[1.5px] border-[#0B1E4B] bg-transparent text-[#0B1E4B] !px-[20px] sm:!px-[26px] !py-[9px] sm:!py-[11px] text-[12.5px] sm:text-[13.5px] font-extrabold cursor-pointer transition-all duration-[250ms]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onClick={() => setSelected(c)}
                >
                  Show More
                  <FaArrowRight className="btn-arrow text-[11px] sm:text-[12px]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MODAL POPUP ══ */}
      {selected && (
        <div
          className="modal-overlay fixed inset-0 z-[999] flex items-center justify-center !px-[12px] sm:!px-[16px] bg-[rgba(11,30,75,.65)] backdrop-blur-[6px]"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-box relative bg-white rounded-[18px] sm:rounded-[22px] w-full max-w-[360px] sm:max-w-[560px] lg:max-w-[700px] overflow-hidden shadow-[0_32px_80px_rgba(11,30,75,.3)]"
            onClick={e => e.stopPropagation()}
          >

            {/* ── Mobile layout: stacked ── */}
            <div className="flex flex-col sm:flex-row">

              {/* Left dark panel */}
              <div className="flex-shrink-0 flex flex-row sm:flex-col items-center justify-center !gap-[12px] sm:!gap-[0] bg-gradient-to-br from-[#1e3a6e] to-[#0B1E4B] !px-[20px] sm:!px-[24px] !py-[20px] sm:!py-[40px] sm:w-[190px]">

                <div className="photo-ring rounded-full overflow-hidden w-[64px] h-[64px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] flex-shrink-0 sm:!mb-[16px]">
                  <img
                    src={selected.img}
                    alt={selected.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="text-left sm:text-center">
                  <h4
                    className="text-white !m-0 !mb-[3px] sm:!mb-[4px] leading-snug tracking-[2px]"
                    style={{
                      fontFamily: "'Bebas Neue', cursive",
                      fontSize: 'clamp(16px,3vw,20px)',
                    }}
                  >
                    {selected.name}
                  </h4>
                  <p className="text-[rgba(255,255,255,.5)] !m-0 font-extrabold text-[8px] sm:text-[9px] tracking-[1.5px] uppercase leading-[1.6]">
                    {selected.role}
                  </p>
                </div>
              </div>

              {/* Right content */}
              <div className="flex-1 overflow-y-auto max-h-[55vh] sm:max-h-[80vh] !px-[18px] sm:!px-[28px] lg:!px-[36px] !py-[20px] sm:!py-[28px] lg:!py-[32px] !pr-[18px] sm:!pr-[40px] lg:!pr-[48px]">
                <h3 className="text-[#0B1E4B] font-extrabold !m-0 !mb-[12px] sm:!mb-[16px] lg:!mb-[20px] leading-[1.3] text-[16px] sm:text-[19px] lg:text-[22px]">
                  {selected.modalTitle}
                </h3>
                {selected.modalContent.map((para, i) => (
                  <p
                    key={i}
                    className="text-slate-500 !m-0 !mb-[12px] sm:!mb-[16px] text-[12.5px] sm:text-[14px] leading-[1.8] sm:leading-[1.85] last:!mb-[0]"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Close button */}
            <button
              className="close-btn absolute top-[10px] right-[10px] sm:top-[12px] sm:right-[12px] flex items-center justify-center rounded-full border-0 cursor-pointer bg-slate-100 text-slate-500 w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]"
              onClick={() => setSelected(null)}
            >
              <FaTimes className="text-[11px] sm:text-[13px]" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AdvisoryBoard