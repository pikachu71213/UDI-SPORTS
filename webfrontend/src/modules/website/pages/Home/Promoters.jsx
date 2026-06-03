import React from 'react'
import { BsStarFill } from 'react-icons/bs'
import chanderkanta from "@/assets/images/chander-kanta.webp"
import lakshaya     from "@/assets/images/lakshaya.webp"
import udita        from "@/assets/images/udita.webp"

const promoters = [
  { id: 1, name: 'Smt. Chander Kanta', role: 'Senior  Promoter', img: chanderkanta },
  { id: 2, name: 'Mr. Lakshaya',      role: 'Young Promoter',  img: lakshaya     },
  { id: 3, name: 'Miss Udita',        role: 'Young Promoter', img: udita        },
]

const Promoters = () => {
  return (
    <>
      <style>{`
        /* Card lift */
        .promo-card {
          transition: transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease;
          cursor: default;
        }
        .promo-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 24px 56px rgba(11,30,75,.13) !important;
        }

        /* Photo zoom */
        .promo-photo { transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .promo-card:hover .promo-photo { transform: scale(1.06); }

        /* Overlay intensify */
        .promo-overlay { transition: opacity .3s ease; opacity: 0.45; }
        .promo-card:hover .promo-overlay { opacity: 0.65; }

        /* Badge scale */
        .promo-badge { transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease; }
        .promo-card:hover .promo-badge {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(240,90,26,.45) !important;
        }

        /* Name underline */
        .promo-name { position: relative; display: inline-block; }
        .promo-name::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg,#F05A1A,#FF7D42);
          border-radius: 2px;
          transition: width .3s ease;
        }
        .promo-card:hover .promo-name::after { width: 100%; }

        /* Mobile: side-by-side 2 cards */
        @media (max-width: 639px) {
          .promo-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          /* 3rd card: full width centered */
          .promo-grid > *:last-child:nth-child(odd) {
            grid-column: 1 / -1 !important;
            max-width: 54% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            width: 100% !important;
          }
        }
      `}</style>

      <section className="promoters-section bg-white !py-[24px] sm:!py-[54px] lg:!py-[60px] !px-[10px] sm:!px-[24px] lg:!px-[32px]">
        <div className="max-w-[1100px] !mx-auto">

          {/* ── Header ── */}
          <div className="text-center !mb-[16px] sm:!mb-[36px] lg:!mb-[48px]">

            {/* Badge */}
            <div className="inline-flex items-center rounded-full !mb-[8px] sm:!mb-[16px] lg:!mb-[20px] !px-[10px] sm:!px-[18px] !py-[4px] sm:!py-[6px] border-[1.5px] border-[rgba(240,90,26,.4)] bg-[rgba(240,90,26,.05)] text-[#F05A1A] text-[9px] sm:text-[11px] font-extrabold tracking-[2px] sm:tracking-[2.5px] uppercase">
              Our Promoters
            </div>

            {/* Heading */}
            <h2
              className="text-[#0B1E4B] !m-0 !mb-[8px] sm:!mb-[12px] leading-[1.05] tracking-[2px] sm:tracking-[3px]"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(26px,6vw,62px)',
              }}
            >
              Champions{' '}
              <span className="text-[#F05A1A]">Behind</span>{' '}
              Champions
            </h2>

            {/* Underline */}
            <div className="w-[36px] sm:w-[52px] h-[3px] sm:h-[4px] rounded-full bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] !mx-auto" />
          </div>

          {/* ── Cards Grid ── */}
          {/* Mobile: 2-col (3rd centered) | sm: 2-col | lg: 3-col */}
          <div className="promo-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 !gap-[10px] sm:!gap-[18px] lg:!gap-[24px]">
            {promoters.map((p) => (
              <div
                key={p.id}
                className="promo-card rounded-[12px] sm:rounded-[20px] overflow-hidden bg-white shadow-[0_4px_20px_rgba(11,30,75,.08)] border border-[#f1f5f9]"
              >
                {/* ── Photo Area ── */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '4/3.2' }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="promo-photo w-full h-full object-cover object-top"
                  />

                  {/* Bottom fade overlay */}
                  <div className="promo-overlay absolute inset-0 bg-gradient-to-t from-[rgba(11,30,75,.55)] via-transparent to-transparent" />

                  {/* Promoter badge — top left */}
                  <div className="promo-badge absolute top-[8px] sm:top-[12px] lg:top-[14px] left-[8px] sm:left-[12px] lg:left-[14px] flex items-center !gap-[4px] sm:!gap-[6px] rounded-full !px-[7px] sm:!px-[12px] lg:!px-[14px] !py-[3px] sm:!py-[5px] lg:!py-[6px] bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] text-white text-[8.5px] sm:text-[11px] lg:text-[11.5px] font-extrabold tracking-[0.3px] shadow-[0_4px_14px_rgba(240,90,26,.38)]">
                    <BsStarFill className="text-[#FFE4B5] text-[6px] sm:text-[8px] lg:text-[9px]" />
                    Promoter
                  </div>
                </div>

                {/* ── Info Area ── */}
                <div className="!px-[9px] sm:!px-[18px] lg:!px-[20px] !py-[8px] sm:!py-[14px] lg:!py-[16px]">
                  <h3 className="text-[#0B1E4B] font-extrabold leading-[1.3] !m-0 !mb-[3px] sm:!mb-[5px] text-[11.5px] sm:text-[15.5px] lg:text-[17px]">
                    <span className="promo-name">{p.name}</span>
                  </h3>
                  <p className="!m-0 text-[#F05A1A] font-semibold tracking-[0.2px] text-[10px] sm:text-[12.5px] lg:text-[13px]">
                    {p.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default Promoters