// CommitteeSection.jsx
// Heading: "Our [COMMITTEE] Members" style matching provided image
// Cards: circular, responsive grid, no overlay/social
// Small screen: smaller font, less padding/gap

import CommitteeMemberCard from "./CommitteeMemberCard"

const ACCENT_TEXT = {
  orange: "text-[#F05A1A]",
  purple: "text-[#7C3AED]",
  blue:   "text-[#0EA5E9]",
  green:  "text-[#10B981]",
  amber:  "text-[#F59E0B]",
  red:    "text-[#EF4444]",
  indigo: "text-[#6366F1]",
  teal:   "text-[#14B8A6]",
  lime:   "text-[#84CC16]",
}

const ACCENT_BG = {
  orange: "bg-[#F05A1A]",
  purple: "bg-[#7C3AED]",
  blue:   "bg-[#0EA5E9]",
  green:  "bg-[#10B981]",
  amber:  "bg-[#F59E0B]",
  red:    "bg-[#EF4444]",
  indigo: "bg-[#6366F1]",
  teal:   "bg-[#14B8A6]",
  lime:   "bg-[#84CC16]",
}

const BADGE_CLS = {
  orange: "text-[#F05A1A] border-[rgba(240,90,26,.35)] bg-[rgba(240,90,26,.06)]",
  purple: "text-[#7C3AED] border-[rgba(124,58,237,.35)] bg-[rgba(124,58,237,.06)]",
  blue:   "text-[#0EA5E9] border-[rgba(14,165,233,.35)]  bg-[rgba(14,165,233,.06)]",
  green:  "text-[#10B981] border-[rgba(16,185,129,.35)]  bg-[rgba(16,185,129,.06)]",
  amber:  "text-[#F59E0B] border-[rgba(245,158,11,.35)]  bg-[rgba(245,158,11,.06)]",
  red:    "text-[#EF4444] border-[rgba(239,68,68,.35)]   bg-[rgba(239,68,68,.06)]",
  indigo: "text-[#6366F1] border-[rgba(99,102,241,.35)]  bg-[rgba(99,102,241,.06)]",
  teal:   "text-[#14B8A6] border-[rgba(20,184,166,.35)]  bg-[rgba(20,184,166,.06)]",
  lime:   "text-[#84CC16] border-[rgba(132,204,22,.35)]  bg-[rgba(132,204,22,.06)]",
}

export default function CommitteeSection({ committee }) {
  const { slug, label, icon, role, description, cardVariant, members } = committee

  const accentText = ACCENT_TEXT[cardVariant] || ACCENT_TEXT.orange
  const accentBg   = ACCENT_BG[cardVariant]   || ACCENT_BG.orange
  const badgeCls   = BADGE_CLS[cardVariant]   || BADGE_CLS.orange

  // Heading split: "Our [LABEL] Members"
  // e.g. label="Managing Community" → "Our Managing Community Members"
  // We highlight the label portion in accent color

  return (
    <section
      id={slug}
      className="scroll-mt-[90px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_32px_rgba(11,30,75,.07)]"
    >
      {/* ════════════════════════════════
          HEADING BLOCK
      ════════════════════════════════ */}
      <div className="flex flex-col items-center text-center !px-4 sm:!px-8 !pt-8 sm:!pt-12 !pb-6 sm:!pb-8 relative overflow-hidden">

        {/* Soft radial bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(240,90,26,.04), transparent)" }}
        />

        {/* Division badge — like image top badge */}
        <div className={`relative z-10 inline-flex items-center !px-3 sm:!px-4 !py-1 sm:!py-1.5 rounded-full border text-[9px] sm:text-[10px] font-extrabold tracking-[2px] sm:tracking-[2.5px] uppercase !mb-3 sm:!mb-4 font-[Plus_Jakarta_Sans] ${badgeCls}`}>
          {icon} &nbsp; {role}
        </div>

        {/* Main heading — "Our [LABEL] Members" */}
        <h2 className="relative z-10 !m-0 font-[Plus_Jakarta_Sans] font-extrabold text-[#0B1E4B] leading-[1.1] tracking-[-0.5px]"
            style={{ fontSize: "clamp(22px, 5vw, 38px)" }}>
          <span className={accentText}>{label}</span>
        </h2>

        {/* Thin accent underline bar */}
        <div className={`relative z-10 w-10 sm:w-14 h-[3px] sm:h-[4px] rounded-full !mt-3 sm:!mt-4 ${accentBg}`} />

        {/* Description */}
        {description && (
          <p className="relative z-10 !m-0 !mt-3 sm:!mt-5 text-slate-500 leading-[1.75] max-w-2xl font-[Plus_Jakarta_Sans]"
             style={{ fontSize: "clamp(12px, 1.5vw, 14px)" }}>
            {description}
          </p>
        )}
      </div>

      {/* ════════════════════════════════
          MEMBERS GRID
      ════════════════════════════════ */}
      <div className="!px-4 sm:!px-8 lg:!px-12 !pt-4 sm:!pt-6 !pb-8 sm:!pb-12">

        {/*
          Responsive columns:
          - xs (< 400px)   : 2 cols
          - sm (640px+)    : 3 cols
          - md (768px+)    : 4 cols
          - lg (1024px+)   : depends on sidebar — 3 cols in sidebar layout
          - xl (1280px+)   : 4–5 cols
          We use auto-fill + minmax so it wraps naturally
        */}
        <div
          className="grid gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(100px, 18vw, 160px), 1fr))",
          }}
        >
          {members.map((member, i) => (
            <CommitteeMemberCard
              key={`${slug}-member-${i}`}
              member={member}
              variant={cardVariant}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <div className="!px-4 sm:!px-8 !py-2.5 sm:!py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] sm:text-[12px] text-slate-400 font-medium font-[Plus_Jakarta_Sans]">
          {members.length} {members.length === 1 ? "member" : "members"} · {label}
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`text-[11px] sm:text-[12px] font-semibold bg-transparent border-none cursor-pointer flex items-center gap-1 font-[Plus_Jakarta_Sans] transition-opacity hover:opacity-60 ${accentText}`}
        >
          ↑ Top
        </button>
      </div>
    </section>
  )
}