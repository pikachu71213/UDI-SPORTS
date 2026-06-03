import React, { useEffect, useMemo, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { getPublicCommittees } from '@/shared/services/publicApi'

const getInitials = (name = 'Member') => {
  const parts = String(name || 'Member').trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return (parts[0] || 'M').slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const toInlineAvatar = (name = 'Member') => {
  const initials = getInitials(name)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F05A1A"/><stop offset="100%" stop-color="#FF7D42"/></linearGradient></defs><rect width="300" height="360" fill="url(#g)"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="92" font-weight="700" fill="#ffffff">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/* ── Skeleton Card ── */
const SkeletonCard = ({ size }) => {
  const isLg = size === 'lg'
  return (
    <div
      className="flex flex-col items-center text-center bg-white rounded-[16px] sm:rounded-[20px] border border-slate-100 shadow-[0_4px_18px_rgba(11,30,75,.07)] overflow-hidden"
      style={{ padding: isLg ? 'clamp(10px,1.5vw,16px)' : 'clamp(8px,1.2vw,12px)' }}
    >
      {/* Photo skeleton */}
      <div
        className="w-full rounded-[10px] sm:rounded-[14px] skeleton-shimmer"
        style={{
          aspectRatio: '3/3.6',
          marginBottom: isLg ? 'clamp(8px,1.2vw,14px)' : 'clamp(6px,1vw,10px)',
        }}
      />
      {/* Name skeleton */}
      <div
        className="skeleton-shimmer rounded-[6px]"
        style={{
          width: '70%',
          height: isLg ? 14 : 12,
          marginBottom: isLg ? 8 : 6,
        }}
      />
      {/* Role badge skeleton */}
      <div
        className="skeleton-shimmer rounded-full"
        style={{
          width: '50%',
          height: isLg ? 22 : 18,
        }}
      />
    </div>
  )
}

/* ── Member Card ── */
const MemberCard = ({ m, size }) => {
  const isLg = size === 'lg'
  return (
    <div className="mc-card-wrap">
      <div
        className="mc-card flex flex-col items-center text-center bg-white rounded-[16px] sm:rounded-[20px] border border-slate-100 shadow-[0_4px_18px_rgba(11,30,75,.07)] overflow-hidden"
        style={{ padding: isLg ? 'clamp(10px,1.5vw,16px)' : 'clamp(8px,1.2vw,12px)' }}
      >
        {/* Photo */}
        <div
          className="w-full overflow-hidden rounded-[10px] sm:rounded-[14px] border border-[#edf0f7] shadow-[0_2px_10px_rgba(11,30,75,.07)]"
          style={{
            aspectRatio: '3/3.6',
            marginBottom: isLg ? 'clamp(8px,1.2vw,14px)' : 'clamp(6px,1vw,10px)',
          }}
        >
          <img
            src={m.img}
            alt={m.name}
            loading="lazy"
            className="mc-photo w-full h-full object-cover object-top"
            onError={(e) => {
              if (e.currentTarget.dataset.fallbackApplied === '1') return
              e.currentTarget.dataset.fallbackApplied = '1'
              e.currentTarget.src = toInlineAvatar(m.name)
            }}
          />
        </div>

        {/* Name */}
        <h3
          className="text-[#0B1E4B] font-extrabold leading-[1.2] !m-0 w-full"
          style={{
            fontSize: isLg ? 'clamp(11px,1.4vw,15px)' : 'clamp(10px,1.2vw,13px)',
            marginBottom: isLg ? 6 : 4,
          }}
        >
          <span className="mc-name-line truncate">{m.name}</span>
        </h3>

        {/* Role badge */}
        <span
          className={`inline-flex items-center rounded-full font-extrabold capitalize ${
            m.isOrange
              ? 'bg-[rgba(240,90,26,.1)] text-[#F05A1A] border border-[rgba(240,90,26,.22)]'
              : 'bg-[rgba(100,116,139,.07)] text-slate-500 border border-[rgba(100,116,139,.18)]'
          }`}
          style={{
            fontSize: isLg ? 'clamp(8px,0.9vw,11px)' : 'clamp(7.5px,0.8vw,10px)',
            padding: isLg ? '3px 10px' : '2px 8px',
            letterSpacing: '0.2px',
          }}
        >
          {m.role}
        </span>
      </div>
    </div>
  )
}

/* ── Main Component ── */
const ManagingCommittee = () => {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [committeeSlug, setCommitteeSlug] = useState('managing-community')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadManagingCommittee = async () => {
      setLoading(true)
      try {
        const data = await getPublicCommittees()
        if (!active) return

        const committees = Array.isArray(data) ? data : []
        const managingCommittee =
          committees.find((c) => c.slug === 'managing-community') ||
          committees.find((c) => String(c?.label || '').toLowerCase().includes('managing')) ||
          committees[0]

        if (!managingCommittee) { setMembers([]); return }

        setCommitteeSlug(managingCommittee.slug || 'managing-community')
        const mappedMembers = Array.isArray(managingCommittee.members)
          ? managingCommittee.members.map((m, index) => {
              const role = m.role || 'Member'
              const roleLower = role.toLowerCase()
              // Top 3 get orange badge (chairman / president / first 3 by index)
              const isOrange =
                roleLower.includes('chairman') ||
                roleLower.includes('president') ||
                index < 3
              return {
                id: m._id || `${m.name}-${index}`,
                name: m.name || 'Member',
                role,
                img:
                  m.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    m.name || 'Member'
                  )}&background=F05A1A&color=fff&size=300`,
                isOrange,
              }
            })
          : []

        setMembers(mappedMembers)
      } catch {
        if (active) setMembers([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadManagingCommittee()
    return () => { active = false }
  }, [])

  // ── Show 6 members: top 3 + bottom 3 ──
  const visibleMembers = useMemo(() => members.slice(0, 6), [members])
  const topThree       = visibleMembers.slice(0, 3)
  const bottomThree    = visibleMembers.slice(3, 6)

  /* Connector line between rows */
  const Connector = () => (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto', padding: '10px 0 6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: 'clamp(200px, 40%, 400px)' }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(240,90,26,.2))' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F05A1A', opacity: .4 }} />
        <div style={{ flex: 1, height: 1, background: 'rgba(240,90,26,.15)' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F05A1A', opacity: .4 }} />
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(240,90,26,.2), transparent)' }} />
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        /* Skeleton shimmer */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf5 50%, #f1f5f9 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        /* Card lift */
        .mc-card {
          transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
          cursor: default;
        }
        .mc-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 24px 56px rgba(11,30,75,.14) !important;
        }

        /* Photo zoom */
        .mc-photo { transition: transform .4s cubic-bezier(.16,1,.3,1); }
        .mc-card:hover .mc-photo { transform: scale(1.06); }

        /* Name underline */
        .mc-name-line { position: relative; display: inline-block; }
        .mc-name-line::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 2px;
          background: linear-gradient(90deg,#F05A1A,#FF7D42);
          border-radius: 2px;
          transition: width .3s ease;
        }
        .mc-card:hover .mc-name-line::after { width: 100%; }

        /* View All button */
        .view-btn {
          position: relative; overflow: hidden;
          transition: all .28s cubic-bezier(.16,1,.3,1);
        }
        .view-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg,#1e40af,#2563EB);
          opacity: 0;
          transition: opacity .28s ease;
          z-index: 0;
        }
        .view-btn:hover::before { opacity: 1; }
        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(37,99,235,.4) !important;
        }
        .view-btn span, .view-btn svg { position: relative; z-index: 1; }
        .btn-arrow { transition: transform .25s ease; }
        .view-btn:hover .btn-arrow { transform: translateX(4px); }

        /* ── Layout: Top 3 ── */
        .mc-top-row {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .mc-top-row .mc-card-wrap {
          width: clamp(130px, 20vw, 200px);
        }

        /* ── Layout: Bottom 3 ── */
        .mc-bottom-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
        }
        .mc-bottom-row .mc-card-wrap {
          width: clamp(120px, 18vw, 185px);
        }

        /* ── Skeleton rows mirror real layout ── */
        .mc-skel-top {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .mc-skel-top .mc-skel-wrap {
          width: clamp(130px, 20vw, 200px);
        }
        .mc-skel-bottom {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
        }
        .mc-skel-bottom .mc-skel-wrap {
          width: clamp(120px, 18vw, 185px);
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .mc-top-row,
          .mc-skel-top { gap: 8px; }

          .mc-top-row .mc-card-wrap,
          .mc-skel-top .mc-skel-wrap { width: calc(33.33% - 6px); }

          .mc-bottom-row,
          .mc-skel-bottom { gap: 8px; flex-wrap: nowrap; }

          .mc-bottom-row .mc-card-wrap,
          .mc-skel-bottom .mc-skel-wrap { width: calc(33.33% - 6px); }
        }

        /* ── Tablet ── */
        @media (min-width: 481px) and (max-width: 768px) {
          .mc-top-row .mc-card-wrap,
          .mc-skel-top .mc-skel-wrap { width: clamp(120px, 26vw, 180px); }

          .mc-bottom-row .mc-card-wrap,
          .mc-skel-bottom .mc-skel-wrap { width: clamp(110px, 24vw, 165px); }
        }
      `}</style>

      <section className="bg-white !py-[48px] sm:!py-[50px] lg:!py-[66px] !px-[16px] sm:!px-[24px] lg:!px-[32px] !border-0">
        <div className="max-w-[1100px] !mx-auto">

          {/* ── Header ── */}
          <div className="text-center !mb-[32px] sm:!mb-[40px] lg:!mb-[52px]">
            <div className="inline-flex items-center rounded-full !mb-[12px] !px-[16px] !py-[5px] bg-[rgba(240,90,26,.12)] border-[1.5px] border-[rgba(240,90,26,.4)] text-[#F05A1A] text-[10px] sm:text-[11px] font-extrabold tracking-[2.5px] uppercase">
              Our Committee
            </div>
            <h2
              className="text-[#0B1E4B] !m-0 leading-[1.05]"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(30px,6vw,62px)', letterSpacing: 'clamp(2px,0.5vw,4px)' }}
            >
              Managing{' '}
              <span className="text-[#F05A1A]">Committee</span> of UDIISA
            </h2>
            <p className="!mt-[10px] !mb-0 text-slate-400 text-[13px] sm:text-[14px] font-medium max-w-[460px] !mx-auto leading-relaxed">
              The dedicated leaders steering our mission forward
            </p>
          </div>

          {/* ── Skeleton Loading ── */}
          {loading && (
            <div className="!mb-[28px] sm:!mb-[36px] lg:!mb-[44px]">
              {/* Top 3 skeletons */}
              <div className="mc-skel-top">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="mc-skel-wrap">
                    <SkeletonCard size="lg" />
                  </div>
                ))}
              </div>

              {/* Connector */}
              <Connector />

              {/* Bottom 3 skeletons */}
              <div className="mc-skel-bottom">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="mc-skel-wrap">
                    <SkeletonCard size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 6-Member Layout (3 + 3) ── */}
          {!loading && visibleMembers.length > 0 && (
            <div className="!mb-[28px] sm:!mb-[36px] lg:!mb-[44px]">

              {/* Top Row — 3 large cards */}
              <div className="mc-top-row">
                {topThree.map((m) => (
                  <MemberCard key={m.id} m={m} size="lg" />
                ))}
              </div>

              {/* Connector */}
              {bottomThree.length > 0 && <Connector />}

              {/* Bottom Row — 3 small cards */}
              {bottomThree.length > 0 && (
                <div className="mc-bottom-row">
                  {bottomThree.map((m) => (
                    <MemberCard key={m.id} m={m} size="sm" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && visibleMembers.length === 0 && (
            <div className="text-center text-slate-400 text-[14px] font-semibold !py-10">
              No committee members available.
            </div>
          )}

          {/* ── View All Button ── */}
          <div className="flex justify-center">
            <button
              className="view-btn flex items-center !gap-[8px] sm:!gap-[10px] rounded-[12px] sm:rounded-[14px] border-0 cursor-pointer !px-[24px] sm:!px-[30px] !py-[11px] sm:!py-[13px] bg-[#2563EB] text-white text-[12.5px] sm:text-[13.5px] font-extrabold shadow-[0_6px_20px_rgba(37,99,235,.3)] tracking-[0.3px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              onClick={() => navigate(`/committee#${committeeSlug}`)}
            >
              <span>View All Members</span>
              <FaArrowRight className="btn-arrow text-[11px] sm:text-[12px]" />
            </button>
          </div>

        </div>
      </section>
    </>
  )
}

export default ManagingCommittee