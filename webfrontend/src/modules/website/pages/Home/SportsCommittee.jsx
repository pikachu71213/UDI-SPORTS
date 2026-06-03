import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { BsStarFill } from 'react-icons/bs'
import { getPublicPlayers } from '../../../../shared/services/publicApi'

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="sc-card !flex !flex-col !items-center !text-center !rounded-[20px] !bg-white"
    style={{
      padding: 'clamp(14px,2vw,28px) clamp(10px,1.5vw,20px)',
      boxShadow: '0 4px 20px rgba(11,30,75,.07)',
      border: '1px solid #e8ecf4',
    }}
  >
    {/* Avatar circle */}
    <div className="sc-skel" style={{
      width: 'clamp(56px,8vw,80px)', height: 'clamp(56px,8vw,80px)',
      borderRadius: '50%', marginBottom: 12, flexShrink: 0,
    }} />
    {/* Name */}
    <div className="sc-skel" style={{ width: '70%', height: 12, borderRadius: 6, marginBottom: 8 }} />
    {/* Role */}
    <div className="sc-skel" style={{ width: '55%', height: 10, borderRadius: 6, marginBottom: 14 }} />
    {/* Badge */}
    <div className="sc-skel" style={{ width: 80, height: 22, borderRadius: 999 }} />
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const SportsCommittee = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    getPublicPlayers()
      .then((data) => {
        if (cancelled) return
        const normalized = Array.isArray(data)
          ? data.map((player, idx) => ({
              id: player.id ?? `${idx}`,
              name: player.name || 'Player',
              role: player.role || `${player.sport || 'Sports'} Player`,
              img: player.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name || 'Player')}&background=F05A1A&color=fff&size=200`,
            }))
          : []
        setPlayers(normalized)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load players')
          setPlayers([])
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return (
    <>
      <style>{`
        @keyframes scSkelShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .sc-skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 1200px 100%;
          animation: scSkelShimmer 1.4s ease-in-out infinite;
        }

        .sc-swiper .swiper-pagination { bottom: 0 !important; }
        .sc-swiper .swiper-pagination-bullet {
          width: 6px; height: 6px; background: #cbd5e1; opacity: 1;
          transition: all .25s ease;
        }
        .sc-swiper .swiper-pagination-bullet-active {
          background: #F05A1A; width: 20px; border-radius: 4px;
        }

        .sc-card {
          transition: transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease, border-color .25s ease;
          cursor: default; position: relative; overflow: hidden;
        }
        .sc-card::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg,#F05A1A,#FF7D42);
          border-radius: 0 0 20px 20px;
          transform: scaleX(0); transform-origin: left;
          transition: transform .3s cubic-bezier(.16,1,.3,1);
        }
        .sc-card:hover::after { transform: scaleX(1); }
        .sc-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 44px rgba(11,30,75,.12) !important;
          border-color: rgba(240,90,26,.22) !important;
        }

        @keyframes ringPulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(240,90,26,.18), 0 0 0 6px rgba(240,90,26,.06); }
          50%      { box-shadow: 0 0 0 5px rgba(240,90,26,.28), 0 0 0 9px rgba(240,90,26,.1); }
        }
        .sc-photo-ring { animation: ringPulse 3s ease-in-out infinite; }
        .sc-photo { transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .sc-card:hover .sc-photo { transform: scale(1.08); }

        .sc-badge { transition: transform .3s ease, box-shadow .3s ease; }
        .sc-card:hover .sc-badge {
          transform: scale(1.05);
          box-shadow: 0 5px 14px rgba(240,90,26,.35) !important;
        }

        .sc-name { position: relative; display: inline-block; }
        .sc-name::after {
          content: ''; position: absolute;
          bottom: -2px; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px;
          background: linear-gradient(90deg,#F05A1A,#FF7D42);
          border-radius: 2px; transition: width .3s ease;
        }
        .sc-card:hover .sc-name::after { width: 100%; }
      `}</style>

      <section
        className="sc-section"
        style={{
          background: 'linear-gradient(160deg,#EEF2FF 0%,#F4F6FB 50%,#EEF2FF 100%)',
          padding: 'clamp(24px,5vw,60px) clamp(12px,3vw,32px)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(16px,3vw,44px)' }}>
            <div
              className="inline-flex items-center !rounded-full"
              style={{
                padding: '4px 14px',
                border: '1.5px solid rgba(240,90,26,.4)',
                background: 'rgba(240,90,26,.05)',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '2.5px', textTransform: 'uppercase',
                color: '#F05A1A',
                marginBottom: 'clamp(6px,1.2vw,14px)',
                display: 'inline-flex',
              }}
            >
              Sports Division
            </div>

            <h2
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(26px,6vw,62px)',
                letterSpacing: 3, lineHeight: 1.05,
                color: '#0B1E4B', margin: 0,
                marginBottom: 'clamp(6px,1vw,10px)',
              }}
            >
              Talented <span style={{ color: '#F05A1A' }}>Players</span> Of UDIISA
            </h2>

            <div style={{
              width: 36, height: 3, borderRadius: 2,
              background: 'linear-gradient(90deg,#F05A1A,#FF7D42)',
              margin: '0 auto',
            }} />
          </div>

          {/* ── Swiper — skeleton slides shown while loading ── */}
          <Swiper
            className="sc-swiper"
            style={{ paddingBottom: 'clamp(28px,4vw,40px)' }}
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={!loading && players.length > 1
              ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }
              : false
            }
            loop={!loading && players.length > 1}
            breakpoints={{
              0:    { slidesPerView: 2, spaceBetween: 8  },
              480:  { slidesPerView: 2, spaceBetween: 10 },
              640:  { slidesPerView: 3, spaceBetween: 12 },
              768:  { slidesPerView: 3, spaceBetween: 14 },
              1024: { slidesPerView: 4, spaceBetween: 16 },
              1280: { slidesPerView: 5, spaceBetween: 18 },
            }}
          >
            {/* ── Skeleton slides ── */}
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <SwiperSlide key={`skel-${i}`}>
                <SkeletonCard />
              </SwiperSlide>
            ))}

            {/* ── Real player slides ── */}
            {!loading && players.map((member) => (
              <SwiperSlide key={member.id}>
                <div
                  className="sc-card !flex !flex-col !items-center !text-center !rounded-[18px] sm:!rounded-[20px] !bg-white"
                  style={{
                    padding: 'clamp(14px,2vw,28px) clamp(8px,1.5vw,18px)',
                    boxShadow: '0 4px 20px rgba(11,30,75,.07)',
                    border: '1px solid #e8ecf4',
                  }}
                >
                  {/* Photo */}
                  <div
                    className="sc-photo-ring !rounded-full !overflow-hidden !flex-shrink-0"
                    style={{
                      width: 'clamp(54px,7vw,78px)',
                      height: 'clamp(54px,7vw,78px)',
                      marginBottom: 'clamp(8px,1.2vw,14px)',
                    }}
                  >
                    <img
                      src={member.img}
                      alt={member.name}
                      loading="lazy"
                      draggable={false}
                      className="sc-photo !w-full !h-full !object-cover !object-top"
                      style={{ userSelect: 'none', WebkitUserDrag: 'none', pointerEvents: 'none' }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F05A1A&color=fff&size=200`
                      }}
                    />
                  </div>

                  {/* Name */}
                  <h3
                    style={{
                      margin: 0, marginBottom: 3,
                      fontSize: 'clamp(11px,1.3vw,13.5px)',
                      fontWeight: 800, color: '#0B1E4B', lineHeight: 1.3,
                    }}
                  >
                    <span className="sc-name">{member.name}</span>
                  </h3>

                  {/* Role */}
                  <p style={{
                    margin: 0,
                    marginBottom: 'clamp(8px,1.2vw,14px)',
                    fontSize: 'clamp(10px,1.1vw,11.5px)',
                    color: '#64748b', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', maxWidth: '100%',
                  }}>
                    {member.role}
                  </p>

                  {/* Badge */}
                  <div
                    className="sc-badge !inline-flex !items-center !gap-1 !rounded-full"
                    style={{
                      padding: '3px 8px',
                      background: 'rgba(240,90,26,.08)',
                      border: '1.5px solid rgba(240,90,26,.3)',
                      fontSize: 'clamp(7px,0.9vw,8.5px)',
                      fontWeight: 800, color: '#F05A1A',
                      letterSpacing: '1.2px', textTransform: 'uppercase',
                    }}
                  >
                    <BsStarFill style={{ fontSize: 7 }} />
                    Sports Player
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ── States ── */}
          {!loading && error && (
            <div style={{ textAlign: 'center', color: '#b91c1c', fontSize: 13, marginTop: 6 }}>
              {error}
            </div>
          )}
          {!loading && !error && players.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 6 }}>
              No players available.
            </div>
          )}

        </div>
      </section>
    </>
  )
}

export default SportsCommittee