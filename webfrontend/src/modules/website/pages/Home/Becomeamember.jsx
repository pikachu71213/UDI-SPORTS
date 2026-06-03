import React, { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaAngleDoubleRight } from 'react-icons/fa'
import becomeMemberImg from "@/assets/images/member-card-img.webp";
import becomeMemberImgMobile from "@/assets/images/become-a-member-small-screen-img.webp";
import becomeMemberBg from "@/assets/images/bg-become_A_Member.webp";
import { useNavigate } from 'react-router-dom';

const MEMBERSHIP_OPTIONS = [
  { label: 'Individual Players',  path: '/membership/individual-player'  },
  { label: 'Individual Patron',   path: '/membership/individual-patron'  },
  { label: 'Lifetime Corporate',  path: '/membership/lifetime-corporate' },
]

const BecomeAMember = () => {
  const navigate = useNavigate();
  const [dropOpen,  setDropOpen]  = useState(false)
  const [selected,  setSelected]  = useState(MEMBERSHIP_OPTIONS[0])
  const dropRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = () => {
    navigate(selected.path)
  }

  return (
    <>
      <style>{`
        @keyframes dropSlide {
          from { opacity:0; transform: translateY(-6px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .drop-list { animation: dropSlide .2s cubic-bezier(.16,1,.3,1) both; }

        .drop-item {
          transition: background .15s ease, color .15s ease;
          cursor: pointer;
        }
        .drop-item:hover { background: #EFF6FF !important; color: #1D4ED8 !important; }
        .drop-item.active-item { color: #1D4ED8 !important; font-weight: 700 !important; }

        .submit-btn {
          position: relative; overflow: hidden;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .submit-btn::after {
          content: '';
          position: absolute; top:0; left:-80%; width:60%; height:100%;
          background: linear-gradient(120deg,transparent,rgba(255,255,255,.18),transparent);
          transform: skewX(-15deg);
          transition: left .4s ease;
        }
        .submit-btn:hover::after { left: 130%; }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(29,78,216,.5) !important;
        }

        @keyframes personIn {
          from { opacity:0; transform: translateX(30px); }
          to   { opacity:1; transform: translateX(0); }
        }
        .person-img { animation: personIn .8s cubic-bezier(.16,1,.3,1) .2s both; }

        @keyframes mobileImgIn {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .mobile-person-img { animation: mobileImgIn .7s cubic-bezier(.16,1,.3,1) .1s both; }

        .chev { transition: transform .25s ease; }
        .chev.open { transform: rotate(180deg); }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .bam-card { border-radius: 18px !important; }
          .bam-inner {
            display: flex !important;
            flex-direction: column !important;
            padding: 0 !important;
          }
          .bam-left {
            order: 2 !important;
            padding: 16px 16px 22px 16px !important;
            max-width: 100% !important;
          }
          .bam-mobile-img-wrap {
            order: 1 !important;
            width: 100% !important;
            overflow: hidden !important;
            line-height: 0 !important;
          }
          .bam-mobile-img-wrap img {
            width: 100% !important;
            height: auto !important;
            display: block !important;
            object-fit: cover !important;
            object-position: top center !important;
            max-height: 220px !important;
          }
          .bam-form-row {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .bam-dropdown-btn {
            border-radius: 10px !important;
            border-right: 1px solid #e5e7eb !important;
          }
          .submit-btn {
            border-radius: 10px !important;
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <section className="!py-[44px] sm:!py-[48px] lg:!py-[64px] !px-[12px] sm:!px-[24px] lg:!px-[10px]">
        <div className="!max-w-[1100px] !mx-auto">

          {/* ── Card ── */}
          <div
            className="bam-card rounded-xl max-md:![background:_linear-gradient(54.51deg,_#20569C_3.18%,_#7CA6B1_107.73%)] bg-center bg-no-repeat [background-size:_100%_100%]"
            style={{ backgroundImage: `url(${becomeMemberBg})` }}
          >
            <div className="bam-inner grid grid-cols-1 md:grid-cols-2 md:!p-[0px_2px_85px_20px]">

              {/* ── Mobile Image ── */}
              <div className="block md:!hidden">
                <img
                  src={becomeMemberImgMobile}
                  alt="Become a Member"
                  loading="lazy"
                  className="w-full"
                />
              </div>

              {/* ── Left Content ── */}
              <div
                className="bam-left !relative !z-10 !flex !flex-col !justify-center"
                style={{ padding: '0px 40px 20px 40px', maxWidth: 520, flex: '1 1 auto' }}
              >
                <h2
                  className="!m-0 !mb-3 sm:!mb-4"
                  style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: 'clamp(32px,5vw,58px)',
                    letterSpacing: 3,
                    lineHeight: 1.05,
                    color: '#fff',
                  }}
                >
                  Become A Member
                </h2>

                <p
                  className="!mt-0 !mb-4 sm:!mb-7"
                  style={{
                    fontSize: 'clamp(12px,1.4vw,14.5px)',
                    color: 'rgba(255,255,255,.72)',
                    lineHeight: 1.75,
                    maxWidth: 400,
                  }}
                >
                  Join our growing family of sports enthusiasts, patrons, and champions.
                  Your membership helps us reach more Sports people and change more lives across India.
                </p>

                {/* Dropdown + Submit */}
                <div className="bam-form-row !flex !items-stretch !gap-0" style={{ maxWidth: 420 }}>

                  {/* Dropdown */}
                  <div className="!relative !flex-1" ref={dropRef}>
                    <button
                      onClick={() => setDropOpen(o => !o)}
                      className="bam-dropdown-btn !w-full !flex !items-center !justify-between !border-0 !cursor-pointer !outline-none"
                      style={{
                        padding: '13px 18px',
                        background: '#fff',
                        borderRadius: '12px 0 0 12px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        borderRight: '1px solid #e5e7eb',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selected.label}
                      </span>
                      <FaChevronDown
                        className={`chev ${dropOpen ? 'open' : ''}`}
                        style={{ fontSize: 12, marginLeft: 8, flexShrink: 0, color: '#6B7280' }}
                      />
                    </button>

                    {/* Dropdown list */}
                    {dropOpen && (
                      <ul
                        className="drop-list !absolute !left-0 !right-0 !top-[calc(100%+6px)] !m-0 !p-[2px] !list-none !z-50"
                        style={{
                          background: '#fff',
                          borderRadius: 12,
                          boxShadow: '0 8px 30px rgba(0,0,0,0.13)',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        {MEMBERSHIP_OPTIONS.map(opt => (
                          <li
                            key={opt.path}
                            className={`drop-item ${selected.path === opt.path ? 'active-item' : ''}`}
                            onClick={() => { setSelected(opt); setDropOpen(false) }}
                            style={{
                              padding: '10px 14px',
                              borderRadius: 8,
                              fontSize: 13.5,
                              fontWeight: selected.path === opt.path ? 700 : 500,
                              color: selected.path === opt.path ? '#1D4ED8' : '#374151',
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            {/* Active dot */}
                            <span style={{
                              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                              background: selected.path === opt.path ? '#1D4ED8' : 'transparent',
                              border: selected.path === opt.path ? 'none' : '1.5px solid #D1D5DB',
                              transition: 'background .15s',
                            }} />
                            {opt.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    className="submit-btn !flex !items-center !gap-2 !border-0 !cursor-pointer max-sm:mt-4 !flex-shrink-0"
                    style={{
                      padding: '13px 22px',
                      background: '#1D4ED8',
                      borderRadius: '0 12px 12px 0',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      boxShadow: '0 4px 16px rgba(29,78,216,.35)',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={handleSubmit}
                  >
                    Join Now
                    <FaAngleDoubleRight style={{ fontSize: 13 }} />
                  </button>
                </div>
              </div>

              {/* ── Desktop Right Image ── */}
              <div className="hidden md:flex items-end justify-center">
                <img
                  src={becomeMemberImg}
                  alt="Member"
                  loading="lazy"
                  className="person-img w-full max-h-[432px] !-mb-4 h-[104%]"
                />
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default BecomeAMember