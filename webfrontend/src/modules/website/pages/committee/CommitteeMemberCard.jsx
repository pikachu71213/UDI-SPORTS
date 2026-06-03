// CommitteeMemberCard.jsx
// Design: Circular image with navy ring border, name + role below
// Hover: image gently zooms in (scale up), no overlay, no social icons
// Fully responsive

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const toInlineAvatar = (name = "Member") => {
  const initials = getInitials(String(name || "Member"))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F05A1A"/><stop offset="100%" stop-color="#FF7D42"/></linearGradient></defs><rect width="320" height="320" fill="url(#g)"/><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="110" font-weight="700" fill="#ffffff">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const AVATAR_GRAD = {
  orange: "from-[#F05A1A] to-[#FF7D42]",
  purple: "from-[#7C3AED] to-[#A855F7]",
  blue:   "from-[#0EA5E9] to-[#38BDF8]",
  green:  "from-[#10B981] to-[#34D399]",
  amber:  "from-[#F59E0B] to-[#FBBF24]",
  red:    "from-[#EF4444] to-[#F87171]",
  indigo: "from-[#6366F1] to-[#818CF8]",
  teal:   "from-[#14B8A6] to-[#2DD4BF]",
  lime:   "from-[#84CC16] to-[#A3E635]",
}

const RING_COLOR = {
  orange: "#F05A1A",
  purple: "#7C3AED",
  blue:   "#0EA5E9",
  green:  "#10B981",
  amber:  "#F59E0B",
  red:    "#EF4444",
  indigo: "#6366F1",
  teal:   "#14B8A6",
  lime:   "#84CC16",
}

export default function CommitteeMemberCard({ member, variant = "orange", index = 0 }) {
  const grad      = AVATAR_GRAD[variant] || AVATAR_GRAD.orange
  const ringColor = RING_COLOR[variant]  || RING_COLOR.orange

  return (
    <>
      <style>{`
        @keyframes cardFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .mc-item { animation: cardFadeUp .5s cubic-bezier(.16,1,.3,1) both; }

        /* Ring border animates on hover */
        .mc-ring {
          transition: box-shadow .35s ease, transform .35s cubic-bezier(.16,1,.3,1);
        }
        .mc-item:hover .mc-ring {
          transform: scale(1.04);
        }

        /* Image zooms out (scales down from zoomed-in base) */
        .mc-img {
          transition: transform .5s cubic-bezier(.16,1,.3,1);
          transform: scale(1.08);
        }
        .mc-item:hover .mc-img {
          transform: scale(1.0);
        }

        /* Name underline on hover */
        .mc-name {
          position: relative;
          display: inline-block;
        }
        .mc-name::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 2px;
          border-radius: 2px;
          transition: width .3s ease;
        }
        .mc-item:hover .mc-name::after { width: 60%; }
      `}</style>

      <div
        className="mc-item flex flex-col items-center text-center gap-3 sm:gap-4 cursor-default"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* ── Circular image with double ring ── */}
        <div
          className="mc-ring relative rounded-full flex-shrink-0"
          style={{
            // Outer gap ring then accent ring
            boxShadow: `0 0 0 3px #fff, 0 0 0 5px ${ringColor}55, 0 12px 40px rgba(0,0,0,.14)`,
            width:  "clamp(110px, 18vw, 170px)",
            height: "clamp(110px, 18vw, 170px)",
          }}
        >
          {/* Inner circle clip */}
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="mc-img w-full h-full object-cover object-top"
                onError={(e) => {
                  if (e.currentTarget.dataset.fallbackApplied === "1") return
                  e.currentTarget.dataset.fallbackApplied = "1"
                  e.currentTarget.src = toInlineAvatar(member.name)
                }}
              />
            ) : (
              <div className={`mc-img w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br ${grad}`}>
                <span className="text-white font-black font-[Plus_Jakarta_Sans] select-none"
                  style={{ fontSize: "clamp(22px, 4vw, 40px)" }}>
                  {getInitials(member.name)}
                </span>
              </div>
            )}
          </div>

          {/* Hover: rotating accent ring overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-0 transition-opacity duration-300 mc-item-hover-ring"
            style={{ boxShadow: `0 0 0 3px ${ringColor}` }}
          />
        </div>

        {/* ── Name & Role ── */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
          <h4
            className="mc-name !m-0 font-bold text-[#0B1E4B] font-[Plus_Jakarta_Sans] leading-snug"
            style={{ fontSize: "clamp(13px, 2vw, 18px)" }}
          >
            {member.name}
          </h4>
          <p
            className="!m-0 text-slate-500 font-medium font-[Plus_Jakarta_Sans]"
            style={{ fontSize: "clamp(11px, 1.4vw, 14px)" }}
          >
            {member.role}
          </p>
          {member.company && (
            <p
              className="!m-0 text-slate-400 font-[Plus_Jakarta_Sans]"
              style={{ fontSize: "clamp(10px, 1.2vw, 12px)" }}
            >
              {member.company}
            </p>
          )}
        </div>
      </div>

      <style>{`
        .mc-item:hover .mc-item-hover-ring { opacity: 1; }
        .mc-name::after { background: ${ringColor}; }
      `}</style>
    </>
  )
}