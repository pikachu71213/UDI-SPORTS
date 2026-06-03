import { useState, useMemo } from 'react'
import {
  FaTrophy,  FaUsers,
} from 'react-icons/fa'

const SPORT_COLORS = {
  'Cricket':    { badge: 'bg-[#1a6b3a]',   text: 'text-[#1a6b3a]',   dot: 'bg-[#1a6b3a]',   shadow: 'shadow-[0_4px_14px_#1a6b3a55]' },
  'Football':   { badge: 'bg-[#1565C0]',   text: 'text-[#1565C0]',   dot: 'bg-[#1565C0]',   shadow: 'shadow-[0_4px_14px_#1565C055]' },
  'Badminton':  { badge: 'bg-[#6a1b9a]',   text: 'text-[#6a1b9a]',   dot: 'bg-[#6a1b9a]',   shadow: 'shadow-[0_4px_14px_#6a1b9a55]' },
  'Athletics':  { badge: 'bg-[#e65100]',   text: 'text-[#e65100]',   dot: 'bg-[#e65100]',   shadow: 'shadow-[0_4px_14px_#e6510055]' },
  'Boxing':     { badge: 'bg-[#b71c1c]',   text: 'text-[#b71c1c]',   dot: 'bg-[#b71c1c]',   shadow: 'shadow-[0_4px_14px_#b71c1c55]' },
  'Wrestling':  { badge: 'bg-[#004d40]',   text: 'text-[#004d40]',   dot: 'bg-[#004d40]',   shadow: 'shadow-[0_4px_14px_#004d4055]' },
  'Swimming':   { badge: 'bg-[#0277bd]',   text: 'text-[#0277bd]',   dot: 'bg-[#0277bd]',   shadow: 'shadow-[0_4px_14px_#0277bd55]' },
  'Tennis':     { badge: 'bg-[#558b2f]',   text: 'text-[#558b2f]',   dot: 'bg-[#558b2f]',   shadow: 'shadow-[0_4px_14px_#558b2f55]' },
  'Hockey':     { badge: 'bg-[#4527a0]',   text: 'text-[#4527a0]',   dot: 'bg-[#4527a0]',   shadow: 'shadow-[0_4px_14px_#4527a055]' },
  'Kabaddi':    { badge: 'bg-[#f57f17]',   text: 'text-[#f57f17]',   dot: 'bg-[#f57f17]',   shadow: 'shadow-[0_4px_14px_#f57f1755]' },
  'Archery':    { badge: 'bg-[#37474f]',   text: 'text-[#37474f]',   dot: 'bg-[#37474f]',   shadow: 'shadow-[0_4px_14px_#37474f55]' },
  'Gymnastics': { badge: 'bg-[#ad1457]',   text: 'text-[#ad1457]',   dot: 'bg-[#ad1457]',   shadow: 'shadow-[0_4px_14px_#ad145755]' },
}
const FALLBACK_COLOR = {
  badge: 'bg-[#F05A1A]', text: 'text-[#F05A1A]',
  dot:   'bg-[#F05A1A]', shadow: 'shadow-[0_4px_14px_#F05A1A55]',
}
const getSC = (sport) => SPORT_COLORS[sport] || FALLBACK_COLOR

const SAMPLE_PLAYERS = [
  { id: 1,  name: 'Aryan Kapoor',   sport: 'Cricket',   role: 'Cricket Player',   achievement: 'U-19 State Champion 2023, Selected for National Camp',            gender: 'Male',   photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&fit=crop&crop=face' },
  { id: 2,  name: 'Priya Sharma',   sport: 'Badminton', role: 'Badminton Player', achievement: 'National Ranking #5, Commonwealth Games Contender',                gender: 'Female', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fit=crop&crop=face' },
  { id: 3,  name: 'Mohammed Akram', sport: 'Boxing',    role: 'Boxing Player',    achievement: 'National Youth Boxing Champion, 3 Gold Medals',                    gender: 'Male',   photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fit=crop&crop=face' },
  { id: 4,  name: 'Sunita Devi',    sport: 'Athletics', role: 'Athletics Player', achievement: '100m State Record Holder, Asian Games Qualifier',                  gender: 'Female', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&fit=crop&crop=face' },
  { id: 5,  name: 'Rahul Singh',    sport: 'Football',  role: 'Football Player',  achievement: 'ISL Academy Selection, U-17 National Squad',                      gender: 'Male',   photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&fit=crop&crop=face' },
  { id: 6,  name: 'Kavya Nair',     sport: 'Wrestling', role: 'Wrestling Player', achievement: 'National School Games Gold, Wrestling Federation Award',            gender: 'Female', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&fit=crop&crop=face' },
  { id: 7,  name: 'Tejinder Kumar', sport: 'Athletics', role: 'Athletics Player', achievement: 'Shot Put National Record, Olympics Preparation Program',            gender: 'Male',   photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&fit=crop&crop=face' },
  { id: 8,  name: 'Ananya Roy',     sport: 'Badminton', role: 'Badminton Player', achievement: 'Junior National Champion, BWF Junior Circuit Participant',         gender: 'Female', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&fit=crop&crop=face' },
  { id: 9,  name: 'Vikas Yadav',    sport: 'Cricket',   role: 'Cricket Player',   achievement: 'Ranji Trophy Selection, BPJL Emerging Talent Award',               gender: 'Male',   photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&fit=crop&crop=face' },
  { id: 10, name: 'Deepti Joshi',   sport: 'Boxing',    role: 'Boxing Player',    achievement: "Women's National Boxing Champion, International Debut",             gender: 'Female', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80&fit=crop&crop=face' },
  { id: 11, name: 'Rohit Mehta',    sport: 'Cricket',   role: 'Cricket Player',   achievement: 'Under-23 IPL Trials, State A Team Selection',                      gender: 'Male',   photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80&fit=crop&crop=face' },
  { id: 12, name: 'Sakshi Patil',   sport: 'Swimming',  role: 'Swimmer',          achievement: 'National Aquatics Champion, Commonwealth Selection',                gender: 'Female', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&fit=crop&crop=face' },
  { id: 13, name: 'Harpreet Singh', sport: 'Hockey',    role: 'Hockey Player',    achievement: 'Junior World Cup Squad Member, SAI Centre Trainee',                 gender: 'Male',   photo: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?w=400&q=80&fit=crop&crop=face' },
  { id: 14, name: 'Nidhi Kumari',   sport: 'Kabaddi',   role: 'Kabaddi Player',   achievement: 'Pro Kabaddi League Scout, National Gold Medalist',                  gender: 'Female', photo: 'https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?w=400&q=80&fit=crop&crop=face' },
  { id: 15, name: 'Akash Dubey',    sport: 'Football',  role: 'Football Player',  achievement: 'Santosh Trophy Player, I-League Academy Contract',                  gender: 'Male',   photo: 'https://images.unsplash.com/photo-1507081323647-4d250478b919?w=400&q=80&fit=crop&crop=face' },
]

/* ═════════════════════════════════════════════
   PLAYER CARD
═════════════════════════════════════════════ */
const PlayerCard = ({ player }) => {
  const sc   = getSC(player.sport)

  return (
    <div className="
      group relative bg-white rounded-[20px] overflow-hidden
      border-[1.5px] border-slate-100
      shadow-[0_4px_18px_rgba(11,30,75,0.07)]
      hover:-translate-y-[8px]
      hover:shadow-[0_22px_52px_rgba(11,30,75,0.13),0_4px_14px_rgba(240,90,26,0.09)]
      hover:border-[#F05A1A]/20
      transition-all duration-300 cursor-default
    ">

      {/* ── PHOTO AREA ── */}
      <div className="relative h-[255px] overflow-hidden bg-gradient-to-br from-[#0B1E4B] to-[#1e3a8a]">

        {/* Photo */}
        <img
          src={player.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=F05A1A&color=fff&size=400`}
          alt={player.name}
          loading="lazy"
          className="w-full h-full object-cover object-[35%_20%] group-hover:scale-[1.06] transition-transform duration-500"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=0B1E4B&color=fff&size=400`
          }}
        />

        {/* Dark overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(10,20,50,0.65)] pointer-events-none" />

        {/* Sport badge — top right */}
        <div className={`
          absolute top-[12px] right-[12px]
          flex items-center gap-[4px]
          !px-[10px] !py-[4px] rounded-full
          ${sc.badge}
          shadow-[0_2px_8px_rgba(0,0,0,0.25)]
        `}>
          <span className="text-white text-[10px] font-extrabold tracking-[1px]">
            {player.sport}
          </span>
        </div>

<div className="
  absolute top-[12px] left-[12px]
  !px-[10px] !py-[2px]
  rounded-[6px]
  bg-white/20 backdrop-blur-sm
  border border-white/30
">
  <p className="text-white text-[10px] font-bold ">
    {player.gender}
  </p>
</div>

      </div>

      {/* ── CONTENT ── */}
      <div className="!px-[16px] !pt-[14px] !pb-[16px]">

        {/* Name */}
        <h3 className="
          text-[#0B1E4B] font-extrabold text-[15.5px]
          leading-snug !mb-[2px] !mt-0
          group-hover:text-[#F05A1A] transition-colors duration-200
          font-[Plus_Jakarta_Sans]
        ">
          {player.name}
        </h3>

        {/* Role */}
        <p className={`
          ${sc.text} font-bold text-[11.5px]
          uppercase tracking-[0.6px]
          !mb-[10px] !mt-0
        `}>
          {player.role}
        </p>

        {/* Divider */}
        <div className="h-px bg-slate-100 !mb-[10px]" />

        {/* Achievement */}
        <div className="flex items-start gap-[7px]">
          <FaTrophy className="text-[#F05A1A] text-[11px] flex-shrink-0 mt-[3px]" />
          <p className="text-slate-500 text-[12px] leading-[1.55] font-medium !m-0 line-clamp-2 cursor-pointer" title={player.achievement}>
            {player.achievement}
          </p>
        </div>

      </div>

      {/* Bottom hover bar */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-[3px]
        ${sc.badge}
        scale-x-0 origin-left
        group-hover:scale-x-100
        transition-transform duration-300
      `} />

    </div>
  )
}

/* ═════════════════════════════════════════════
   EMPTY STATE
═════════════════════════════════════════════ */
const EmptyState = ({ sport }) => (
  <div className="col-span-full flex flex-col items-center justify-center !py-[72px] !px-[24px] text-center">
    <div className="w-[80px] h-[80px] rounded-full bg-[#FFF3EC] flex items-center justify-center !mb-[20px]">
      <FaUsers className="text-[#F05A1A] text-[32px]" />
    </div>
    <h3 className="font-[Bebas_Neue] text-[26px] tracking-[2px] text-[#0B1E4B] !mb-[8px] !mt-0">
      No Players Found
    </h3>
    <p className="text-slate-400 text-[14px] max-w-[300px] leading-[1.6] !m-0">
      No players listed under{' '}
      <strong className="text-[#F05A1A]">{sport}</strong> yet. Check back soon!
    </p>
  </div>
)

/* ═════════════════════════════════════════════
   SPORT TAB BUTTON
═════════════════════════════════════════════ */
const TabButton = ({ sport, count, isActive, isAllSports, onClick }) => {
  const sc = isAllSports
    ? { badge: 'bg-[#F05A1A]', shadow: 'shadow-[0_4px_14px_#F05A1A55]' }
    : getSC(sport)

  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 inline-flex items-center gap-[7px]
        !px-[16px] !py-[8px] rounded-full
        text-[13px] font-[Plus_Jakarta_Sans] cursor-pointer
        transition-all duration-200
        ${isActive
          ? `${sc.badge} text-white border-transparent ${sc.shadow} font-extrabold`
          : 'bg-white text-slate-500 border-[1.5px] border-slate-200 hover:text-[#0B1E4B] hover:border-slate-300 shadow-[0_1px_4px_rgba(11,30,75,0.06)] font-semibold'
        }
      `}
    >
      {sport}
      <span className={`
        inline-flex items-center justify-center
        min-w-[20px] h-[20px] rounded-full !px-[5px]
        text-[10px] font-extrabold
        ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}
      `}>
        {count}
      </span>
    </button>
  )
}

/* ═════════════════════════════════════════════
   STAT CARD
═════════════════════════════════════════════ */
const StatCard = ({ label, value }) => (
  <div>
    <div className="font-[Bebas_Neue] text-[36px] tracking-[1px] text-[#F05A1A] leading-none">
      {value}+
    </div>
    <div className="text-[11px] font-semibold text-white/40 !mt-[3px] uppercase tracking-[1px]">
      {label}
    </div>
  </div>
)

/* ═════════════════════════════════════════════
   MAIN COMPONENT — TalentedPlayers
═════════════════════════════════════════════ */
const TalentedPlayersCards = ({ players = SAMPLE_PLAYERS }) => {

  /* Auto-derive sport tabs from data */
  const sportTabs = useMemo(() => {
    const unique = [...new Set(players.map(p => p.sport))].sort()
    return ['All Sports', ...unique]
  }, [players])

  const [activeTab, setActiveTab] = useState('All Sports')

  /* Safety: reset if tab removed from data */
  const safeTab = sportTabs.includes(activeTab) ? activeTab : 'All Sports'

  /* Filter */
  const filtered = useMemo(() =>
    safeTab === 'All Sports'
      ? players
      : players.filter(p => p.sport === safeTab),
    [players, safeTab]
  )


  return (
    <section className="min-h-screen bg-gradient-to-b from-[#F4F6FB] to-white font-[Plus_Jakarta_Sans] !pb-[80px]">

      {/* Google Fonts */}
      <style>{`
        /* Tabs horizontal scroll */
        .tp-tabs-scroll {
          display: flex;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 8px;
        }
        .tp-tabs-scroll::-webkit-scrollbar { display: none; }

        /* Players grid */
        .tp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .tp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .tp-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }

        /* Stats grid on mobile */
        .tp-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
        }

        /* Fade-up on tab switch */
        @keyframes tp-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tp-fade-up { animation: tp-fade-up 0.3s ease both; }

        /* BG dot-grid texture */
        .tp-dotgrid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* ════════════════════════════════
          HERO HEADER
      ════════════════════════════════ */}
      

      {/* ════════════════════════════════
          STICKY TABS BAR
      ════════════════════════════════ */}
      <div className="
        sticky top-0 z-50
        bg-white border-b-[1.5px] border-slate-200
        shadow-[0_4px_20px_rgba(11,30,75,0.06)]
      ">
        <div className="max-w-[1280px] !mx-auto !px-[16px] sm:!px-[24px] lg:!px-[32px]">
          <div className="tp-tabs-scroll !py-[14px]">
            {sportTabs.map(sport => {
              const isActive   = safeTab === sport
              const isAllSports = sport === 'All Sports'
              const count = isAllSports
                ? players.length
                : players.filter(p => p.sport === sport).length

              return (
                <TabButton
                  key={sport}
                  sport={sport}
                  count={count}
                  isActive={isActive}
                  isAllSports={isAllSports}
                  onClick={() => setActiveTab(sport)}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          CONTENT AREA
      ════════════════════════════════ */}
      <div className="max-w-[1280px] !mx-auto !px-[16px] sm:!px-[24px] lg:!px-[32px] !pt-[36px]">

        {/* Result meta row */}
        <div className="flex items-center justify-between flex-wrap gap-[10px] !mb-[24px]">

          <div className="flex items-center gap-[8px]">
            {safeTab !== 'All Sports' && (
              <span className={`
                inline-block w-[10px] h-[10px] rounded-full flex-shrink-0
                ${getSC(safeTab).dot}
              `} />
            )}
            <span className="text-[14px] font-bold text-[#0B1E4B]">
              {filtered.length} Player{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[14px] text-slate-400">
              in{' '}
              <span className={`font-bold ${safeTab === 'All Sports' ? 'text-[#F05A1A]' : getSC(safeTab).text}`}>
                {safeTab}
              </span>
            </span>
          </div>

          {safeTab !== 'All Sports' && (
            <button
              onClick={() => setActiveTab('All Sports')}
              className="
                text-[12px] font-bold text-slate-500
                bg-slate-50 border-[1.5px] border-slate-200
                rounded-[8px] !px-[12px] !py-[5px]
                hover:text-[#F05A1A] hover:border-[rgba(240,90,26,0.3)]
                transition-all duration-200 cursor-pointer
              "
            >
              ← All Sports
            </button>
          )}

        </div>

        {/* Players Grid */}
        <div key={safeTab} className="tp-grid tp-fade-up">
          {filtered.length === 0
            ? <EmptyState sport={safeTab} />
            : filtered.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))
          }
        </div>

      </div>
    </section>
  )
}

export default TalentedPlayersCards