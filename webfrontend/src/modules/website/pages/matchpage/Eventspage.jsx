import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicEvents } from "@/shared/services/publicApi";
import {
  FaMapMarkerAlt, FaUsers, FaArrowRight, FaSearch, FaFilter,
  FaCrown, FaCalendarAlt, FaTimes,
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { IoCalendarOutline } from "react-icons/io5";

/* ─── Sport color map ────────────────────────────────────────────────────────── */
const SPORT_COLORS = {
  Cricket:    { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Football:   { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
  Basketball: { bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-500" },
  Kabaddi:    { bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-500" },
  Athletics:  { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500" },
  Volleyball: { bg: "bg-cyan-100",    text: "text-cyan-700",    dot: "bg-cyan-500" },
  Badminton:  { bg: "bg-yellow-100",  text: "text-yellow-700",  dot: "bg-yellow-500" },
  Wrestling:  { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500" },
};

/* ─── Skeleton Card ──────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm animate-pulse">
      {/* Image area */}
      <div className="h-[150px] bg-slate-200" />
      {/* Content */}
      <div className="!p-4 flex flex-col !gap-3">
        <div className="h-3 bg-slate-200 rounded-full w-1/3" />
        <div className="h-4 bg-slate-200 rounded-full w-3/4" />
        <div className="flex !gap-2">
          <div className="h-3 bg-slate-200 rounded-full w-1/4" />
          <div className="h-3 bg-slate-200 rounded-full w-1/4" />
        </div>
        <div className="flex !gap-2">
          <div className="h-10 bg-slate-200 rounded-xl flex-1" />
          <div className="w-6 bg-slate-100 rounded-full self-center" style={{ height: "6px" }} />
          <div className="h-10 bg-slate-200 rounded-xl flex-1" />
        </div>
        <div className="h-9 bg-slate-200 rounded-xl w-full" />
      </div>
    </div>
  );
}

/* ─── Event Card ─────────────────────────────────────────────────────────────── */
function EventCard({ event, onView }) {
  const { teamA, teamB, title, date, location, venue, sport, slug, status } = event;
  const colors = SPORT_COLORS[sport] || SPORT_COLORS["Cricket"];

  const fbA = `https://ui-avatars.com/api/?name=${encodeURIComponent(teamA.name)}&background=0B1E4B&color=fff&size=300&bold=true`;
  const fbB = `https://ui-avatars.com/api/?name=${encodeURIComponent(teamB.name)}&background=F05A1A&color=fff&size=300&bold=true`;

  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-[0_2px_16px_rgba(11,30,75,0.07)] hover:shadow-[0_10px_32px_rgba(11,30,75,0.13)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col">

      {/* ── Split image area ── */}
      <div className="relative flex h-[150px] overflow-hidden flex-shrink-0">
        {/* Team A image */}
        <div className="relative w-1/2 overflow-hidden">
          <img src={teamA.img} alt={teamA.name} loading="lazy" draggable={false}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.currentTarget.src = fbA; }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(11,30,75,0.55), rgba(11,30,75,0.1) 80%, transparent)" }} />
          {/* Team A name overlay */}
          <div className="absolute bottom-2 left-2">
            <p className="!m-0 text-white text-[9px] font-black leading-tight drop-shadow-md line-clamp-2" style={{ maxWidth: "80px" }}>
              {teamA.name}
            </p>
          </div>
        </div>

        {/* Team B image */}
        <div className="relative w-1/2 overflow-hidden">
          <img src={teamB.img} alt={teamB.name} loading="lazy" draggable={false}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.currentTarget.src = fbB; }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(240,90,26,0.55), rgba(240,90,26,0.1) 80%, transparent)" }} />
          {/* Team B name overlay */}
          <div className="absolute bottom-2 right-2 text-right">
            <p className="!m-0 text-white text-[9px] font-black leading-tight drop-shadow-md line-clamp-2" style={{ maxWidth: "80px" }}>
              {teamB.name}
            </p>
          </div>
        </div>

        {/* Center VS bubble */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/25" />
          <div className="relative z-10 w-9 h-9 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.22)] flex items-center justify-center">
            <span className="text-[9px] font-black text-[#F05A1A] tracking-wide">VS</span>
          </div>
        </div>

        {/* Sport badge top-left */}
        <div className={`absolute top-2 left-2 z-10 inline-flex items-center !gap-1 !px-2 !py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide ${colors.bg} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {sport}
        </div>

        {/* Status badge top-right */}
        <div className="absolute top-2 right-2 z-10 inline-flex items-center !gap-1 !px-2 !py-0.5 rounded-full text-[8px] font-extrabold bg-white/90 text-[#0B1E4B] uppercase tracking-wide">
          <HiLightningBolt className="text-[#F05A1A] text-[7px]" />
          {status}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* ── Card body ── */}
      <div className="!px-4 !pt-2 !pb-4 flex flex-col !gap-2.5 flex-1">

        {/* Title */}
        <h3 className="!m-0 text-[13px] font-black text-[#0B1E4B] leading-tight line-clamp-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </h3>

        {/* Date + Location */}
        <div className="flex flex-wrap items-center !gap-x-3 !gap-y-1">
          <span className="inline-flex items-center !gap-1 text-[10px] font-semibold text-slate-400">
            <IoCalendarOutline className="text-[#F05A1A] text-[10px]" />
            {date}
          </span>
          <span className="inline-flex items-center !gap-1 text-[10px] font-semibold text-slate-400">
            <FaMapMarkerAlt className="text-[#F05A1A] text-[8px]" />
            {venue && location && venue !== location ? `${venue}, ${location}` : (location || venue || "—")}
          </span>
        </div>

        {/* Team member pills */}
        <div className="flex items-center !gap-1.5">
          <div className="flex-1 min-w-0 !px-2.5 !py-1.5 rounded-xl bg-[#eef4ff] border border-[#dbeafe]">
            <p className="!m-0 text-[9px] font-extrabold text-[#0B1E4B] truncate leading-none !mb-0.5">{teamA.name}</p>
            <span className="inline-flex items-center !gap-0.5 text-[8px] font-semibold text-[#3b82f6]">
              <FaUsers className="text-[7px]" />{teamA.members} Players
            </span>
          </div>
          <span className="text-[7px] font-black text-slate-300 flex-shrink-0">VS</span>
          <div className="flex-1 min-w-0 !px-2.5 !py-1.5 rounded-xl bg-[#fff4f0] border border-[#fed7aa] text-right">
            <p className="!m-0 text-[9px] font-extrabold text-[#0B1E4B] truncate leading-none !mb-0.5">{teamB.name}</p>
            <span className="inline-flex items-center justify-end !gap-0.5 text-[8px] font-semibold text-[#F05A1A]">
              <FaUsers className="text-[7px]" />{teamB.members} Players
            </span>
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={() => onView(slug)}
          className="mt-auto w-full flex items-center justify-between !px-3.5 !py-2.5 rounded-xl bg-gradient-to-r from-[#0B1E4B] to-[#1e3a8a] hover:from-[#F05A1A] hover:to-[#FF7D42] text-white border-none cursor-pointer transition-all duration-300 shadow-[0_2px_10px_rgba(11,30,75,0.18)] hover:shadow-[0_6px_20px_rgba(240,90,26,0.28)] group/btn"
        >
          <span className="text-[10px] font-extrabold tracking-wide">View Details</span>
          <FaArrowRight className="text-[9px] group-hover/btn:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Events Page ───────────────────────────────────────────────────────── */
export default function EventsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSport, setActiveSport] = useState("All");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPublicEvents();
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const sportPills = useMemo(() => {
    const set = new Set(Object.keys(SPORT_COLORS));
    events.forEach((e) => {
      if (e.sport) set.add(e.sport);
    });
    return ["All", ...set];
  }, [events]);

  /* Filtered list */
  const filtered = events.filter((ev) => {
    const matchSport = activeSport === "All" || ev.sport === activeSport;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      (ev.location || "").toLowerCase().includes(q) ||
      (ev.venue || "").toLowerCase().includes(q) ||
      ev.sport.toLowerCase().includes(q) ||
      ev.teamA.name.toLowerCase().includes(q) ||
      ev.teamB.name.toLowerCase().includes(q);
    return matchSport && matchSearch;
  });

  const hasFilters = search !== "" || activeSport !== "All";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

        @keyframes epFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes epShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .ep-a1 { animation: epFadeUp .5s cubic-bezier(.16,1,.3,1) .04s both; }
        .ep-a2 { animation: epFadeUp .5s cubic-bezier(.16,1,.3,1) .10s both; }
        .ep-a3 { animation: epFadeUp .5s cubic-bezier(.16,1,.3,1) .16s both; }
        .ep-a4 { animation: epFadeUp .5s cubic-bezier(.16,1,.3,1) .22s both; }

        .ep-shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 400px 100%;
          animation: epShimmer 1.4s ease-in-out infinite;
        }

        .ep-card-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 480px) {
          .ep-card-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .ep-card-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1200px) {
          .ep-card-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .sport-pill {
          transition: all .2s cubic-bezier(.34,1.56,.64,1);
        }
        .sport-pill:hover { transform: translateY(-1px); }

        .ep-search-input:focus { outline: none; }

        /* Skeleton shimmer override */
        .animate-pulse .ep-shimmer-block {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 400px 100%;
          animation: epShimmer 1.4s ease-in-out infinite;
          border-radius: 8px;
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(160deg, #f0f4ff 0%, #ffffff 45%, #fff8f4 100%)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* ── Decorative BG ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.12]"
            style={{ background: "radial-gradient(circle, #F05A1A 0%, transparent 70%)" }} />
          <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #0B1E4B 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "radial-gradient(circle, #0B1E4B 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        </div>

        <div className="relative !mx-auto !px-4 sm:!px-6 lg:!px-8 !py-8 sm:!py-12" style={{ maxWidth: "1380px", zIndex: 1 }}>

          {/* ══════════════════════════════════════════
              PAGE HEADER
          ══════════════════════════════════════════ */}
          <div className="ep-a1 !mb-8 sm:!mb-10">
            {/* Back + breadcrumb */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center !gap-2 !mb-5 text-[11px] font-bold text-slate-400 hover:text-[#0B1E4B] transition-colors duration-200 cursor-pointer bg-transparent border-none !p-0"
            >
              ← Back to Home
            </button>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between !gap-4">
              <div>
                {/* Label */}
                <div className="inline-flex items-center !gap-2 !px-3.5 !py-1.5 rounded-full !mb-3 border border-[rgba(240,90,26,0.22)] bg-[rgba(240,90,26,0.07)] text-[#F05A1A] text-[9px] font-extrabold tracking-[2px] uppercase">
                  <HiSparkles />
                  All Events & Matches
                </div>
                <h1
                  className="!m-0 text-[#0B1E4B] leading-none"
                  style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(32px, 6vw, 60px)", letterSpacing: "clamp(1px,0.3vw,3px)" }}
                >
                  UPCOMING{" "}
                  <span className="bg-gradient-to-r from-[#F05A1A] to-[#FF9D42] bg-clip-text text-transparent">
                    EVENTS
                  </span>
                </h1>
              </div>

              {/* Total count pill */}
              {!loading && (
                <div className="flex-shrink-0 !px-4 !py-2 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center !gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F05A1A] animate-pulse" />
                  <span className="text-[11px] font-extrabold text-[#0B1E4B]">
                    {filtered.length}
                    <span className="font-semibold text-slate-400 !ml-1">
                      of {events.length} Events
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              SEARCH + FILTER BAR
          ══════════════════════════════════════════ */}
          <div className="ep-a2 !mb-6 sm:!mb-8 flex flex-col sm:flex-row items-stretch sm:items-center !gap-3">

            {/* Search input */}
            <div className="relative flex-1 max-w-sm">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-[11px] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, teams, cities..."
                className="ep-search-input w-full !pl-9 !pr-9 !py-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-[#0B1E4B] placeholder:text-slate-300 shadow-sm focus:border-[#0B1E4B] focus:shadow-[0_0_0_3px_rgba(11,30,75,0.08)] transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 cursor-pointer bg-transparent border-none !p-0"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* Sport filter pills - horizontally scrollable */}
            <div className="flex items-center !gap-2 overflow-x-auto !pb-1" style={{ scrollbarWidth: "none" }}>
              <FaFilter className="text-slate-300 text-[10px] flex-shrink-0" />
              {sportPills.map((sp) => (
                <button
                  key={sp}
                  onClick={() => setActiveSport(sp)}
                  className={`sport-pill flex-shrink-0 !px-3 !py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border cursor-pointer transition-all duration-200
                    ${activeSport === sp
                      ? "bg-[#0B1E4B] text-white border-[#0B1E4B] shadow-[0_3px_12px_rgba(11,30,75,0.22)]"
                      : "bg-white text-slate-500 border-slate-200 hover:border-[#0B1E4B] hover:text-[#0B1E4B]"
                    }`}
                >
                  {sp}
                </button>
              ))}
              {hasFilters && (
                <button
                  onClick={() => { setSearch(""); setActiveSport("All"); }}
                  className="sport-pill flex-shrink-0 !px-3 !py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border cursor-pointer bg-[rgba(240,90,26,0.08)] text-[#F05A1A] border-[rgba(240,90,26,0.22)] hover:bg-[#F05A1A] hover:text-white transition-all duration-200"
                >
                  Clear ×
                </button>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              SKELETON LOADING
          ══════════════════════════════════════════ */}
          {loading && (
            <div className="ep-card-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
                  {/* Image skeleton */}
                  <div className="h-[150px] ep-shimmer" />
                  {/* Content skeleton */}
                  <div className="!p-4 flex flex-col !gap-3">
                    <div className="h-2.5 ep-shimmer rounded-full w-1/4" />
                    <div className="h-4 ep-shimmer rounded-full w-3/4" />
                    <div className="h-3 ep-shimmer rounded-full w-1/2" />
                    <div className="flex !gap-2">
                      <div className="h-12 ep-shimmer rounded-xl flex-1" />
                      <div className="h-3 ep-shimmer rounded-full w-4 self-center" />
                      <div className="h-12 ep-shimmer rounded-xl flex-1" />
                    </div>
                    <div className="h-9 ep-shimmer rounded-xl w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════
              EVENTS GRID
          ══════════════════════════════════════════ */}
          {!loading && filtered.length > 0 && (
            <div className="ep-a3 ep-card-grid">
              {filtered.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onView={(slug) => navigate(`/events/${slug}`)}
                />
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════
              EMPTY STATE
          ══════════════════════════════════════════ */}
          {!loading && filtered.length === 0 && (
            <div className="ep-a4 flex flex-col items-center justify-center !py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center !mb-4">
                <FaSearch className="text-slate-300 text-xl" />
              </div>
              <h3 className="!m-0 !mb-2 text-[#0B1E4B] font-black text-lg">No Events Found</h3>
              <p className="!m-0 !mb-5 text-slate-400 text-sm font-medium">
                No matches for <span className="font-bold text-[#F05A1A]">"{search || activeSport}"</span>. Try a different search.
              </p>
              <button
                onClick={() => { setSearch(""); setActiveSport("All"); }}
                className="inline-flex items-center !gap-2 !px-5 !py-2.5 rounded-full bg-[#0B1E4B] text-white text-[11px] font-bold border-none cursor-pointer hover:bg-[#F05A1A] transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Bottom space */}
          <div className="!mt-16" />
        </div>
      </div>
    </>
  );
}