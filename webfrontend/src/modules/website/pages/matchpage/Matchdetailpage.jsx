import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaCrown, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { IoStatsChart } from "react-icons/io5";
import { getPublicEventBySlug } from "@/shared/services/publicApi";

/* ─── Team Table ─────────────────────────────────────────────────────────────── */
function TeamTable({ team, side, memberCount }) {
  const isLeft = side === "left";

  let serial = 0;

  return (
    <div className={`flex-1 min-w-0 rounded-2xl overflow-hidden border-2 ${isLeft ? "border-blue-200" : "border-orange-200"}`}>

      <div className={`!px-4 !py-3 flex items-center !gap-3 ${isLeft ? "bg-gradient-to-r from-[#0B1E4B] to-[#1e3a8a]" : "bg-gradient-to-l from-[#F05A1A] to-[#FF7D42]"}`}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <FaCrown className="text-yellow-300 text-[12px]" />
        </div>
        <div className="min-w-0">
          <p className="!m-0 text-white text-[11px] font-bold opacity-80 uppercase tracking-widest leading-none !mb-0.5">
            {isLeft ? "🔵 Team A" : "🔴 Team B"}
          </p>
          <p className="!m-0 text-white text-[14px] font-black leading-tight truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {team.name}
          </p>
        </div>
        <div className="ml-auto flex-shrink-0 flex flex-col items-end">
          <span className="text-white/70 text-[16px] font-bold uppercase tracking-wide">Captain</span>
          <span className="text-yellow-300 text-[18px] font-extrabold truncate max-w-[90px]">{team.captain || "—"}</span>
        </div>
      </div>

      <div className={`grid grid-cols-2 !px-3 !py-1.5 border-b ${isLeft ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">#</span>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Player</span>
      </div>

      <div>
        {team.members.map((member, idx) => {
          serial = serial + 1;
          const num = serial;
          const isCaptain = team.captain && member.name === team.captain;
          return (
            <div
              key={`${side}-${member.name}-${idx}`}
              className={`grid grid-cols-2 items-center !px-3 !py-2 border-b last:border-b-0 transition-colors duration-150
                ${isCaptain
                  ? isLeft ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"
                  : "bg-white border-slate-50 hover:bg-slate-50"
                }`}
            >
              <div>
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-black text-white leading-none
                    ${isLeft ? "bg-[#0B1E4B]" : "bg-[#F05A1A]"}
                    ${isCaptain ? "ring-2 ring-yellow-400 ring-offset-1" : ""}`}
                >
                  {num}
                </span>
              </div>

              <div className="min-w-0 !pr-1">
                <p className="!m-0 text-[16px] font-extrabold text-[#0B1E4B] truncate leading-tight">
                  {member.name}
                  {isCaptain && <span className="!ml-1 text-yellow-500 text-[12px]">(C)</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`!px-4 !py-2 flex items-center justify-between ${isLeft ? "bg-blue-50" : "bg-orange-50"}`}>
        <span className={`text-[12px] font-bold ${isLeft ? "text-blue-500" : "text-orange-500"}`}>
          <FaUsers className="inline !mr-1 text-[16px]" />
          {memberCount} Members
        </span>
        <span className={`text-[14px] font-extrabold uppercase tracking-wider ${isLeft ? "text-[#0B1E4B]" : "text-[#F05A1A]"}`}>
          Full Squad
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export default function MatchDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getPublicEventBySlug(slug);
        if (!cancelled) setEvent(data);
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setEvent(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8faff] to-[#fff8f4]">
        <p className="text-slate-400 font-semibold text-sm">Loading match…</p>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8faff] to-[#fff8f4]">
        <div className="text-center !px-6">
          <div className="text-6xl !mb-4">😕</div>
          <h2 className="!m-0 !mb-2 text-[#0B1E4B] text-2xl font-black">Match Not Found</h2>
          <p className="!m-0 !mb-6 text-slate-500 text-sm">This match event does not exist or has been removed.</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center !gap-2 !px-5 !py-2.5 rounded-full bg-[#0B1E4B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#F05A1A] transition-colors duration-200"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const counts = {
    a: event.teamA.members.length,
    b: event.teamB.members.length,
    total: event.teamA.members.length + event.teamB.members.length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

        @keyframes mdFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .md-a1 { animation: mdFadeUp .55s cubic-bezier(.16,1,.3,1) .05s both; }
        .md-a2 { animation: mdFadeUp .55s cubic-bezier(.16,1,.3,1) .12s both; }
        .md-a3 { animation: mdFadeUp .55s cubic-bezier(.16,1,.3,1) .19s both; }

        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 40%, #fff8f4 100%)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(240,90,26,0.3) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(11,30,75,0.25) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "radial-gradient(circle, #0B1E4B 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative !mx-auto !px-4 sm:!px-6 lg:!px-8 !py-6 sm:!py-10" style={{ maxWidth: "1280px", zIndex: 1 }}>

          <div className="md-a1 !mb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center !gap-2 !px-4 !py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-[12px] font-bold shadow-sm hover:bg-[#0B1E4B] hover:text-white hover:border-[#0B1E4B] transition-all duration-200 cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" />
              Back to Events
            </button>
          </div>

          <div className="md-a2 !mb-6 sm:!mb-8">
            <div className="flex flex-wrap items-center !gap-3 !mb-3">
              <div className="inline-flex items-center !gap-2 !px-3 !py-1 rounded-full bg-[rgba(240,90,26,0.1)] border border-[rgba(240,90,26,0.22)] text-[#F05A1A] text-[9px] font-extrabold tracking-[2px] uppercase">
                <HiSparkles />
                {event.status}
              </div>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400 text-[11px] font-semibold">{event.sport}</span>
            </div>

            <h1 className="!m-0 !mb-3 text-[#0B1E4B] leading-none"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(24px, 5vw, 44px)", letterSpacing: "1px" }}>
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center !gap-2 !mb-4">
              <span className="inline-flex items-center !gap-1.5 !px-3 !py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[10px] font-bold text-slate-600">
                <FaCalendarAlt className="text-[#F05A1A] text-[14px]" /> {event.date}
              </span>
              <span className="inline-flex items-center !gap-1.5 !px-3 !py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[10px] font-bold text-slate-600">
                <FaMapMarkerAlt className="text-[#F05A1A] text-[14px]" /> {event.venue}
              </span>
            </div>

            <p className="!m-0 text-slate-500 text-[12px] sm:text-[13px] leading-relaxed font-medium" style={{ maxWidth: "720px" }}>
              {event.description}
            </p>
          </div>

          <div className="md-a3">
            <div className="flex items-center !gap-3 !mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1E4B] to-[#1e3a8a] flex items-center justify-center shadow-md">
                <IoStatsChart className="text-white text-[15px]" />
              </div>
              <div>
                <h2 className="!m-0 text-[#0B1E4B] font-black text-[16px] sm:text-[18px] leading-tight">
                  Full Squad Lineup
                </h2>
                <p className="!m-0 text-slate-400 text-[12px] font-semibold">
                  {counts.total} total players · Captain highlighted with 👑
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch !gap-4 lg:!gap-6">
              <TeamTable team={event.teamA} side="left" memberCount={counts.a} />

              <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0 !gap-2">
                <div className="w-1 flex-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent rounded-full" />
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center">
                  <span className="sm:text-[16px] text-[12px] font-black text-[#F05A1A]" style={{ fontFamily: "'Bebas Neue', cursive" }}>VS</span>
                </div>
                <div className="w-1 flex-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent rounded-full" />
              </div>

              <div className="flex md:hidden items-center justify-center !gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center">
                  <span className="text-[9px] font-black text-[#F05A1A]" style={{ fontFamily: "'Bebas Neue', cursive" }}>VS</span>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <TeamTable team={event.teamB} side="right" memberCount={counts.b} />
            </div>
          </div>

          <div className="!mt-12" />
        </div>
      </div>
    </>
  );
}
