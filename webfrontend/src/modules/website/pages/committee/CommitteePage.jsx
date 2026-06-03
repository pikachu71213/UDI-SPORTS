// CommitteePage.jsx — full Tailwind, no inline style
// Route: /committee

import { useEffect, useState } from "react"
import CommitteeSection from "./Committeesection"
import { getPublicCommittees } from "@/shared/services/publicApi"

export default function CommitteePage() {
  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState("")

  useEffect(() => {
    const scrollToHash = (attempt = 0) => {
      const hash = window.location.hash.replace("#", "")
      if (!hash) return

      const el = document.getElementById(hash)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo({ top, behavior: "smooth" })
        return
      }

      // Sections are API-driven; retry briefly until DOM is rendered.
      if (attempt < 8) {
        setTimeout(() => scrollToHash(attempt + 1), 120)
      }
    }

    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)
    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [])

  useEffect(() => {
    let active = true
    const loadCommittees = async () => {
      setLoading(true)
      setApiError("")
      try {
        const list = await getPublicCommittees()
        if (active) setCommittees(Array.isArray(list) ? list : [])
      } catch (err) {
        if (active) setApiError(err?.response?.data?.message || "Unable to load committees right now.")
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCommittees()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!loading && committees.length > 0 && window.location.hash) {
      const hash = window.location.hash.replace("#", "")
      const el = document.getElementById(hash)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo({ top, behavior: "smooth" })
      }
    }
  }, [loading, committees])

  const jumpTo = (slug) => { window.location.hash = slug }

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hero-up { animation: heroFadeUp .8s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* ════ HERO BANNER ════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1E4B] via-[#162d6e] to-[#1e3a8a] !px-4 sm:!px-6 lg:!px-8 !pt-[clamp(48px,7vw,80px)] !pb-[clamp(40px,6vw,64px)]">

        {/* Grid overlay — kept as style because CSS repeating-linear-gradient can't be expressed in Tailwind */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.025) 60px,rgba(255,255,255,.025) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.025) 60px,rgba(255,255,255,.025) 61px)" }}
        />

        {/* Glow blobs */}
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-[rgba(240,90,26,.12)] blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full bg-[rgba(14,165,233,.1)] blur-[50px] pointer-events-none" />

        <div className="hero-up relative z-10 max-w-[1200px] !mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 !px-4 !py-1.5 rounded-full !mb-5 bg-[rgba(240,90,26,.18)] border border-[rgba(240,90,26,.3)]">
            <span className="text-[14px]">🏛️</span>
            <span className="text-[11px] font-extrabold text-[#FFAD5C] tracking-[1.8px] uppercase font-[Plus_Jakarta_Sans]">
              Organizational Structure
            </span>
          </div>

          {/* Heading */}
          <h1 className="!m-0 !mb-4 font-[Bebas_Neue] text-[clamp(44px,7vw,80px)] tracking-[4px] text-white leading-none">
            OUR <span className="text-[#F05A1A]">COMMITTEES</span>
          </h1>

          <p className="!m-0 !mb-8 text-[clamp(14px,1.5vw,16px)] text-white/60 leading-[1.75] max-w-[560px] font-[Plus_Jakarta_Sans]">
            UDIISA is governed by{" "}
            <strong className="text-white/90">{committees.length} specialized committees</strong>,
            each dedicated to driving excellence, integrity, and growth across every dimension of our organisation.
          </p>

          {/* Quick-jump pills */}
          <div className="flex flex-wrap gap-2.5">
            {committees.map(c => (
              <button
                key={c.slug}
                onClick={() => jumpTo(c.slug)}
                className="flex items-center gap-1.5 !px-3.5 !py-1.5 rounded-full text-[12px] font-semibold font-[Plus_Jakarta_Sans] bg-white/[0.08] text-white/80 border border-white/15 cursor-pointer transition-all duration-200 hover:bg-[#F05A1A] hover:text-white hover:border-[#F05A1A] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(240,90,26,.3)]"
              >
                <span>{c.icon}</span>
                {c.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════ MAIN LAYOUT ════ */}
      <div className="flex gap-7 max-w-[1200px] !mx-auto !px-4 sm:!px-6 lg:!px-7 !py-9 items-start">

        {/* ── Sticky Sidebar (hidden on mobile/tablet) ── */}
        <aside className="hidden lg:flex flex-col gap-0.5 w-[250px] flex-shrink-0 sticky top-[90px] bg-white rounded-[18px] border border-slate-200 !p-3.5 shadow-[0_4px_24px_rgba(11,30,75,.07)] max-h-[calc(100vh-110px)] overflow-y-auto">
          <p className="!m-0 !mb-2.5 !px-1 text-[10px] font-extrabold text-slate-400 tracking-[1.8px] uppercase font-[Plus_Jakarta_Sans]">
            Jump to Committee
          </p>
          {committees.map(c => (
            <button
              key={c.slug}
              onClick={() => jumpTo(c.slug)}
              className="flex items-center gap-2.5 !px-3 !py-2 rounded-[10px] text-[12.5px] font-semibold text-slate-600 cursor-pointer border-none bg-transparent w-full text-left font-[Plus_Jakarta_Sans] transition-all duration-150 hover:bg-[#FFF3EC] hover:text-[#F05A1A] hover:translate-x-0.5"
            >
              <span className="text-[17px] w-6 text-center">{c.icon}</span>
              <span className="leading-snug">{c.shortLabel}</span>
            </button>
          ))}
        </aside>

        {/* ── Committee Sections ── */}
        <div className="flex-1 flex flex-col gap-7 min-w-0">
          {loading && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_32px_rgba(11,30,75,.07)] !p-8 text-center text-slate-500 font-[Plus_Jakarta_Sans]">
              Loading committees...
            </div>
          )}

          {!loading && apiError && (
            <div className="bg-red-50 rounded-3xl border border-red-200 !p-8 text-center text-red-600 font-[Plus_Jakarta_Sans]">
              {apiError}
            </div>
          )}

          {!loading && !apiError && committees.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_32px_rgba(11,30,75,.07)] !p-8 text-center text-slate-500 font-[Plus_Jakarta_Sans]">
              No committees available yet.
            </div>
          )}

          {!loading && !apiError && committees.map(committee => (
            <CommitteeSection key={committee._id || committee.slug} committee={committee} />
          ))}
        </div>
      </div>
    </>
  )
}