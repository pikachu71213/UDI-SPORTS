import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicEvents } from "@/shared/services/publicApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import { HiSparkles } from "react-icons/hi";
import { FaUsers, FaArrowRight, FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import "swiper/css";
import "swiper/css/pagination";

/* ─── Compact Match Card ─────────────────────────────────────────────────────── */
function MatchCard({ event, onView }) {
  const { teamA, teamB, title, date, location, sport, slug } = event;
  const fbA = `https://ui-avatars.com/api/?name=${encodeURIComponent(teamA.name)}&background=0B1E4B&color=fff&size=300&bold=true`;
  const fbB = `https://ui-avatars.com/api/?name=${encodeURIComponent(teamB.name)}&background=F05A1A&color=fff&size=300&bold=true`;

  return (
    <div className="group rounded-xl overflow-hidden bg-white border border-slate-100 shadow-[0_2px_12px_rgba(11,30,75,0.08)] hover:shadow-[0_8px_28px_rgba(11,30,75,0.14)] hover:-translate-y-1 transition-all duration-300">

      {/* ── Image area: 140px tall, split 50/50 ── */}
      <div className="relative flex h-[140px] overflow-hidden">

        {/* Team A */}
        <div className="relative w-1/2 overflow-hidden">
          <img
            src={teamA.img} alt={teamA.name} loading="lazy" draggable={false}
            className="absolute inset-0 w-full object-top h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.currentTarget.src = fbA; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/20" />
        </div>

        {/* Team B */}
        <div className="relative w-1/2 overflow-hidden">
          <img
            src={teamB.img} alt={teamB.name} loading="lazy" draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.currentTarget.src = fbB; }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/45 via-black/10 to-black/20" />
        </div>

        {/* Center VS circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/20" />
          <div className="relative z-10 w-8 h-8 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <span className="text-[9px] font-black text-[#F05A1A] tracking-wider">VS</span>
          </div>
        </div>

        {/* Sport chip */}
        {sport && (
          <span className="absolute top-2 right-2 z-10 !px-1.5 !py-0.5 rounded-full text-[8px] font-extrabold bg-white/90 text-[#F05A1A] uppercase tracking-wide">
            {sport}
          </span>
        )}

        {/* Bottom white fade */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* ── Info below image ── */}
      <div className="!px-3 !pt-2 !pb-3 flex flex-col !gap-2">

        {/* Title */}
        <p className="!m-0 text-[12px] font-black text-[#0B1E4B] truncate leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </p>

        {/* Date · Location */}
        <div className="flex items-center !gap-1.5">
          {date && (
            <span className="inline-flex items-center !gap-1 text-[9px] font-semibold text-slate-400">
              <IoCalendarOutline className="text-[#F05A1A] text-[9px]" />
              {date}
            </span>
          )}
          {date && location && <span className="text-slate-200 text-[9px]">·</span>}
          {location && (
            <span className="inline-flex items-center !gap-1 text-[9px] font-semibold text-slate-400">
              <FaMapMarkerAlt className="text-[#F05A1A] text-[8px]" />
              {location}
            </span>
          )}
        </div>

        {/* Team boxes */}
        <div className="flex items-center !gap-1.5">
          {/* Team A */}
          <div className="flex-1 min-w-0 !px-2 !py-1.5 rounded-lg bg-[#eef4ff] border border-[#dbeafe]">
            <p className="!m-0 text-[10px] font-extrabold text-[#0B1E4B] truncate leading-none">{teamA.name}</p>
            <span className="inline-flex items-center !gap-0.5 !mt-0.5 text-[9px] font-semibold text-[#3b82f6]">
              <FaUsers className="text-[7px]" />{teamA.members} Members
            </span>
          </div>

          <span className="flex-shrink-0 text-[8px] font-black text-slate-300">VS</span>

          {/* Team B */}
          <div className="flex-1 min-w-0 !px-2 !py-1.5 rounded-lg bg-[#fff4f0] border border-[#fed7aa] text-right">
            <p className="!m-0 text-[10px] font-extrabold text-[#0B1E4B] truncate leading-none">{teamB.name}</p>
            <span className="inline-flex items-center justify-end !gap-0.5 !mt-0.5 text-[9px] font-semibold text-[#F05A1A]">
              <FaUsers className="text-[7px]" />{teamB.members} Members
            </span>
          </div>
        </div>

        {/* View button */}
        <button
          onClick={() => onView(slug)}
          className="w-full flex items-center justify-between !px-3 !py-2 rounded-lg bg-gradient-to-r from-[#0B1E4B] to-[#1e3a8a] hover:from-[#F05A1A] hover:to-[#FF7D42] text-white border-none cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(11,30,75,0.20)] hover:shadow-[0_5px_16px_rgba(240,90,26,0.30)] group/btn"
        >
          <span className="text-[10px] font-extrabold tracking-wide">View Match</span>
          <FaArrowRight className="text-[8px] group-hover/btn:translate-x-0.5 transition-transform duration-200" />
        </button>

      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────────── */
export default function EventsMatchSection() {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPublicEvents({ limit: 12 });
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative overflow-hidden !py-12 sm:!py-16 lg:!py-20 bg-gradient-to-b from-[#f8faff] via-white to-[#fff8f4]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        @keyframes evHeadUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .ev-a1{animation:evHeadUp .6s cubic-bezier(.16,1,.3,1) .05s both}
        .ev-a2{animation:evHeadUp .6s cubic-bezier(.16,1,.3,1) .14s both}
        .ev-a3{animation:evHeadUp .6s cubic-bezier(.16,1,.3,1) .22s both}

        .ev-swiper{padding-bottom:36px !important;overflow:visible !important}
        .ev-swiper .swiper-slide{height:auto;display:flex;align-items:stretch}
        .ev-swiper .swiper-slide>*{width:100%}
        .ev-swiper .swiper-pagination{bottom:0 !important}
        .ev-swiper .swiper-pagination-bullet{
          width:5px;height:5px;border-radius:999px;
          background:#cbd5e1;opacity:1;
          transition:all .3s cubic-bezier(.34,1.56,.64,1)
        }
        .ev-swiper .swiper-pagination-bullet-active{
          width:20px;background:#F05A1A;
          box-shadow:0 0 6px rgba(240,90,26,0.45)
        }
      `}</style>

      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "radial-gradient(circle,#d1d5db 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
      {/* glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(240,90,26,0.07) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(11,30,75,0.05) 0%,transparent 70%)" }} />

      <div className="relative !mx-auto !px-4 sm:!px-6 lg:!px-8 max-w-[1200px]">

        {/* Header */}
        <div className="text-center !mb-8 sm:!mb-10">
          <div className="ev-a1 inline-flex items-center !gap-2 !px-4 !py-1.5 rounded-full !mb-3 border border-[rgba(240,90,26,0.22)] bg-[rgba(240,90,26,0.07)] text-[#F05A1A] text-[10px] font-extrabold tracking-[2px] uppercase">
            <HiSparkles className="text-[10px]" />
            Upcoming Events & Matches
          </div>
          <h2
            className="ev-a2 !m-0 !mb-2 text-[#0B1E4B] leading-none"
            style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(28px,5.5vw,52px)", letterSpacing: "clamp(1px,0.3vw,3px)" }}
          >
            LIVE <span className="bg-gradient-to-r from-[#F05A1A] to-[#FF9D42] bg-clip-text text-transparent">MATCH</span> EVENTS
          </h2>
          <p className="ev-a3 !m-0 text-slate-500 font-medium !mx-auto text-[12px] sm:text-[13px]" style={{ maxWidth: 400 }}>
            Follow live matches, track your favourite teams across India
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center !py-16">
              <p className="text-sm font-semibold text-slate-400">Loading events…</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex justify-center !py-16">
              <p className="text-sm font-semibold text-slate-400 text-center !max-w-md">
                No upcoming matches yet. Add events from the admin panel to show them here.
              </p>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                className="hidden sm:flex absolute -left-5 lg:-left-6 top-[38%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-500 shadow-md hover:bg-[#0B1E4B] hover:text-white hover:border-[#0B1E4B] transition-all duration-200 cursor-pointer"
              >
                <FaChevronLeft className="text-[11px]" />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                className="hidden sm:flex absolute -right-5 lg:-right-6 top-[38%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-gradient-to-br from-[#F05A1A] to-[#FF7D42] items-center justify-center text-white border-none shadow-[0_3px_12px_rgba(240,90,26,0.35)] hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                <FaChevronRight className="text-[11px]" />
              </button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y]}
                className="ev-swiper"
                loop={events.length > 3}
                keyboard={{ enabled: true }}
                pagination={{ clickable: true }}
                grabCursor
                onSwiper={setSwiper}
                breakpoints={{
                  0:    { slidesPerView: 1,    spaceBetween: 12 },
                  480:  { slidesPerView: 1.15, spaceBetween: 12 },
                  640:  { slidesPerView: 2,    spaceBetween: 14 },
                  900:  { slidesPerView: 2.5,    spaceBetween: 16 },
                  1200: { slidesPerView: 3,    spaceBetween: 16 },
                }}
              >
                {events.map((ev) => (
                  <SwiperSlide key={ev.id}>
                    <MatchCard event={ev} onView={(s) => navigate(`/events/${s}`)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>

        {/* View All */}
        <div className="flex justify-center !mt-7 sm:!mt-8">
          <button
            onClick={() => navigate("/events-list")}
            className="inline-flex items-center !gap-2 !px-6 !py-2.5 rounded-full text-[12px] font-extrabold text-white bg-gradient-to-br from-[#0B1E4B] to-[#1e3a8a] shadow-[0_4px_18px_rgba(11,30,75,0.22)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(11,30,75,0.28)] transition-all duration-300 border-none cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            View All Events
            <FaArrowRight className="text-[10px]" />
          </button>
        </div>

      </div>
    </section>
  );
}