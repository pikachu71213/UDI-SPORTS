import React from 'react'

/**
 * PageHero — Reusable Hero Banner Component
 *
 * Props:
 * @param {string}  badge        - Top pill text         e.g. "OUR COMMUNITY"
 * @param {string}  heading      - White heading word    e.g. "MEMBER"
 * @param {string}  highlight    - Orange word           e.g. "DIRECTORY"
 * @param {string}  description  - Subtext               e.g. "Meet the people..."
 * @param {string}  bgImage      - Background image URL
 * @param {boolean} headingFirst - true = heading + highlight | false = highlight + heading

 */

const PageHero = ({
  badge       = 'OUR Committee',
  heading     = 'MEMBER',
  highlight   = 'DIRECTORY',
  description = 'Meet the people who make SportForce possible',
  bgImage     = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=85&fit=crop',
  headingFirst = true,
}) => {
  return (
    <section className="relative overflow-hidden min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] flex flex-col">

      {/* ── Shimmer top border ── */}
      <div
        className="relative z-10 h-[3px] w-full flex-shrink-0"
        style={{
          background: 'linear-gradient(90deg,#F05A1A,#FFAD5C,#F05A1A,#FFAD5C)',
          backgroundSize: '300% 100%',
          animation: 'shimmer 3s linear infinite',
        }}
      />

      {/* ── Background Image ── */}
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      />

      {/* ── Dark Blue Overlay ── */}
      <div className="absolute inset-0 bg-[#0B1E4B]/80" />

      {/* ── Grid texture ── */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(255,255,255,.04) 50px,rgba(255,255,255,.04) 51px),
            repeating-linear-gradient(90deg,transparent,transparent 50px,rgba(255,255,255,.04) 50px,rgba(255,255,255,.04) 51px)
          `,
        }}
      />

      {/* ── Orange glow blobs ── */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#F05A1A]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#F05A1A]/10 blur-3xl pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-1 px-4 py-14 sm:py-16 lg:py-20">

        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-[rgba(240,90,26,0.5)] bg-[rgba(11,30,75,0.6)] backdrop-blur-sm !px-5 !py-1.5 !mb-5">
          <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#FFAB7A]">
            {badge}
          </span>
        </div>

        {/* Heading */}
        <h1
          className="m-0 !mb-4 text-white leading-none tracking-[3px]"
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 'clamp(36px, 7vw, 68px)',
          }}
        >
          {headingFirst ? (
            <>
              {heading}{' '}
              <span className="text-[#F05A1A]">{highlight}</span>
            </>
          ) : (
            <>
              <span className="text-[#F05A1A]">{highlight}</span>{' '}
              {heading}
            </>
          )}
        </h1>

        {/* Orange underline */}
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] !mb-4" />

        {/* Description */}
        {description && (
          <p className="m-0 text-white/60 text-sm sm:text-base leading-relaxed max-w-lg">
            {description}
          </p>
        )}
      </div>

      {/* ── Shimmer keyframe (injected once) ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  )
}

export default PageHero