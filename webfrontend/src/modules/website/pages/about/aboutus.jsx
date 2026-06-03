import {
  FaTrophy, FaUsers, FaMapMarkerAlt, FaMedal,
  FaHandshake, FaHeart, FaRocket, FaStar,
  FaQuoteLeft, FaArrowRight, FaCheckCircle,
  FaLinkedin, FaTwitter,
} from 'react-icons/fa'
import {
  MdSportsCricket, MdEmojiEvents, MdSchool,
  MdGroups, MdVerified, MdAutoGraph,
  MdOutlinePlace, MdVolunteerActivism,
} from 'react-icons/md'
import { HiSparkles, HiLightningBolt } from 'react-icons/hi'
import { BsShieldFillCheck, BsStarFill } from 'react-icons/bs'
import { GiLaurelCrown, GiTargetArrows } from 'react-icons/gi'
import PageHero from '../../../../shared/components/PageHero'
import aboutimg from '@/assets/images/about-img.webp'
/* ═══════════════════════════════════════════════════════
   DATA MAPS — edit here to update all sections
═══════════════════════════════════════════════════════ */

const PILLARS = [
  {
    icon: <GiTargetArrows className="text-[28px]" />,
    label: "Our Mission",
    color: "from-[#0B1E4B] to-[#152B6B]",
    accent: "bg-white/20",
    text: "Our mission is to identify talented and gifted players from schools, colleges, and sports academies who are unable to pursue their dreams due to financial limitations. We aim to support them with resources, guidance, and opportunities so they can focus entirely on their development and excellence in sports.",
  },
  {
    icon: <HiLightningBolt className="text-[28px]" />,
    label: "Our Vision",
    color: "from-[#F05A1A] to-[#FF7D42]",
    accent: "bg-white/20",
    text: "To create a future where no talented player is held back due to lack of resources. We aspire to nurture sporting talent, support their training and education, and help them grow into confident individuals and future champions who represent discipline, integrity, and excellence.",
  },
  {
    icon: <BsShieldFillCheck className="text-[28px]" />,
    label: "Our Purpose",
    color: "from-[#1565C0] to-[#1976D2]",
    accent: "bg-white/20",
    text: "Our commitment goes beyond discovering talent. We invest in dreams by removing financial barriers and supporting players so they can train with confidence, compete with pride, and grow with dignity.",
  },
]

const ROADMAP = [
  {
    year: "2026",
    title: "Foundation of UDI International Sports Association",
    desc: "UDI International Sports Association was established as a non-profit organization dedicated to identifying and supporting talented players across India.",
    icon: <FaRocket className="text-[16px]" />,
    side: "left",
  },
  {
    year: "2026",
    title: "Talent Identification Initiative",
    desc: "The organization began visiting schools, colleges, and sports academies to identify talented players who need support to continue their sports journey.",
    icon: <MdEmojiEvents className="text-[16px]" />,
    side: "right",
  },
  {
    year: "2026",
    title: "Financial Support Program",
    desc: "Financial assistance programs were introduced to help players cover training, equipment, and competition expenses.",
    icon: <FaHandshake className="text-[16px]" />,
    side: "left",
  },
  {
    year: "2026",
    title: "Mentorship & Development",
    desc: "Players began receiving mentorship, guidance, and long-term support to improve their performance and confidence in sports.",
    icon: <MdSchool className="text-[16px]" />,
    side: "right",
  },
  {
    year: "Future",
    title: "National Expansion",
    desc: "UDI International Sports Association aims to expand nationwide, supporting more talented players and building stronger sports development programs.",
    icon: <GiLaurelCrown className="text-[16px]" />,
    side: "left",
    isUpcoming: true,
  },
]
const VALUES = [
  { icon: <FaHeart className="text-[18px]" />,        label: 'Compassion',   desc: 'Every player is a person first. We lead with empathy.' },
  { icon: <MdVerified className="text-[18px]" />,     label: 'Integrity',    desc: 'Transparent in governance, honest in our impact.' },
  { icon: <HiSparkles className="text-[18px]" />,     label: 'Excellence',   desc: 'We set the highest bar in everything we do.' },
  { icon: <FaUsers className="text-[18px]" />,        label: 'Inclusivity',  desc: 'Sport for all — no barriers of gender, class, or region.' },
  { icon: <FaCheckCircle className="text-[18px]" />,  label: 'Accountability', desc: 'We measure our success through player outcomes.' },
  { icon: <MdSportsCricket className="text-[18px]" />, label: 'Passion',     desc: 'Sport is our language, progress is our game.' },
]

/* Section label pill */
function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-[7px] !px-[16px] !py-[6px] rounded-full bg-[rgba(240,90,26,0.08)] border border-[rgba(240,90,26,0.18)] text-[#F05A1A] text-[11px] font-extrabold tracking-[2px] uppercase !mb-[14px]">
      <HiSparkles className="text-[12px]" />
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function AboutUs() {

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif]">
      <style>{`
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideLeft{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6}70%{transform:scale(1.4);opacity:0}100%{transform:scale(1.4);opacity:0}}
        .anim-fadeUp{animation:fadeUp 0.7s ease both}
        .anim-fadeIn{animation:fadeIn 0.7s ease both}
        .anim-slideLeft{animation:slideLeft 0.7s ease both}
        .anim-slideRight{animation:slideRight 0.7s ease both}
        .pulse-ring::before{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid #F05A1A;animation:pulse-ring 2s ease-out infinite}
        .roadmap-line::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,#0B1E4B,#F05A1A,#0B1E4B);transform:translateX(-50%)}
      `}</style>
{/* 1. Hero banner */}
 <PageHero
      badge="UDI International Sports Association"
      heading="About"
      highlight="Us"
      description="For over a decade, UDI Sports has been India's most dedicated grassroots sports NGO —
              discovering talent in the dust, developing it with discipline, and delivering it to the national stage."
      bgImage="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=85&fit=crop"
      />
      {/* ══════════════════════════════════
          2. WHO WE ARE — Split Layout
      ══════════════════════════════════ */}
      <section className="!py-[60px] !px-[16px] sm:!px-[24px] bg-white">
        <div className="max-w-[1280px] !mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] items-center">

            {/* Left: Image composition */}
            <div className="relative anim-slideLeft">
              {/* Main image */}
              <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#0B1E4B] to-[#1565C0] aspect-[4/3]">
                <img
                  src={aboutimg}
                  alt="UDI Sports Players"
                  loading="lazy"
                  className="w-full h-full"
                  onError={e => { e.target.style.display = 'none' }}
                />
               
              </div>
            </div>

            {/* Right: Content */}
            <div className="anim-slideRight">
              <SectionLabel>Who We Are</SectionLabel>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold text-[#0B1E4B] !m-0 !mb-[18px] leading-[1.2]">
                India's Most Dedicated{' '}
                <span className="text-[#F05A1A]">Grassroots Sports</span> NGO
              </h2>
              <p className="text-slate-600 text-[15px] leading-[1.8] !m-0 !mb-[16px]">
Welcome to <strong className="text-[#0B1E4B]">UDI International Sports Association</strong>,
a Non-Government, Non-Political and Charitable Organization.  
We believe that true talent should never be limited by financial boundaries.
Across schools, colleges and sports academies there are many gifted players
with extraordinary potential who are unable to pursue their dreams due to
lack of resources.
</p>

<p className="text-slate-500 text-[14.5px] leading-[1.8] !m-0 !mb-[28px]">
Our mission is to identify such talent, support them with guidance,
training opportunities and financial assistance, and walk beside them on
their journey towards excellence. By creating equal opportunities,
we aim to help players achieve their dreams while contributing to the
growth and pride of the nation.
</p>

              {/* Feature checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] !mb-[28px]">
                {[
  'Talent identification from schools & academies',
  'Selection of deserving players',
  'Financial support for training',
  'Mentorship & guidance programs',
  'Placement in top sports academies',
  'Support for girl players in sports',
].map((item, i) => (
                  <div key={i} className="flex items-center gap-[8px]">
                    <FaCheckCircle className="text-[#F05A1A] text-[13px] flex-shrink-0" />
                    <span className="text-[13.5px] text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          3. MISSION / VISION / VALUES
      ══════════════════════════════════ */}
      <section className="!py-[80px] !px-[16px] sm:!px-[24px] bg-white">
        <div className="max-w-[1100px] !mx-auto">
          <div className="text-center !mb-[48px]">
            <SectionLabel>Our Purpose</SectionLabel>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold text-[#0B1E4B] !m-0 leading-[1.2]">
              What Drives <span className="text-[#F05A1A]">Everything We Do</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] !mb-[48px]">
            {PILLARS.map((p, i) => (
              <div
                key={i}
                className={`rounded-[22px] bg-gradient-to-br ${p.color} !p-[28px] text-white relative overflow-hidden hover:-translate-y-[4px] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.12)]`}
              >
                <div className="absolute -top-[30px] -right-[30px] w-[120px] h-[120px] rounded-full bg-white/08" />
                <div className={`w-[52px] h-[52px] rounded-[14px] ${p.accent} flex items-center justify-center !mb-[18px] relative z-10`}>
                  {p.icon}
                </div>
                <h3 className="text-[18px] font-extrabold !m-0 !mb-[12px] relative z-10">{p.label}</h3>
                <p className="text-white/75 text-[13.5px] leading-[1.75] !m-0 relative z-10">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Values grid */}
          <div className="text-center !mb-[28px]">
            <h3 className="text-[20px] font-extrabold text-[#0B1E4B] !m-0">Core Values</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[14px]">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="bg-[#F4F6FB] rounded-[16px] !p-[18px] text-center hover:bg-[#FFF3EC] hover:border-[rgba(240,90,26,0.2)] border border-transparent transition-all duration-250 hover:-translate-y-[2px]"
              >
                <div className="w-[40px] h-[40px] rounded-[10px] bg-white shadow-[0_2px_8px_rgba(11,30,75,0.1)] flex items-center justify-center text-[#F05A1A] !mx-auto !mb-[10px]">
                  {v.icon}
                </div>
                <p className="text-[12.5px] font-extrabold text-[#0B1E4B] !m-0 !mb-[5px]">{v.label}</p>
                <p className="text-[11px] text-slate-500 !m-0 leading-snug">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          4. ROADMAP / JOURNEY TIMELINE
      ══════════════════════════════════ */}
      <section id="journey" className="!py-[80px] !px-[16px] sm:!px-[24px] bg-[#F4F6FB]">
        <div className="max-w-[1000px] !mx-auto">
          <div className="text-center !mb-[56px]">
            <SectionLabel>Our Journey</SectionLabel>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-extrabold text-[#0B1E4B] !m-0 leading-[1.2]">
              A Decade of <span className="text-[#F05A1A]">Impact & Growth</span>
            </h2>
            <p className="text-slate-500 text-[15px] !m-0 !mt-[10px] max-w-[520px] !mx-auto leading-[1.7]">
              Every milestone is a story of Players believed in, opportunities created, and barriers broken.
            </p>
          </div>

          {/* Timeline — desktop: alternating, mobile: single column */}
          <div className="relative roadmap-line hidden md:block">
            <div className="flex flex-col gap-0">
              {ROADMAP.map((item, i) => (
                <div key={i} className="relative grid grid-cols-2 gap-0 min-h-[120px]">
                  {/* LEFT column */}
                  <div className={`!pr-[48px] !pb-[40px] ${item.side === 'left' ? 'flex justify-end' : ''}`}>
                    {item.side === 'left' && (
                      <div className={`
                        max-w-[340px] bg-white rounded-[18px] !p-[22px]
                        border border-slate-100
                        shadow-[0_4px_20px_rgba(11,30,75,0.08)]
                        hover:shadow-[0_8px_32px_rgba(11,30,75,0.12)]
                        hover:-translate-y-[2px] transition-all duration-300
                        ${item.isUpcoming ? 'border-dashed border-[#F05A1A]/30' : ''}
                      `}>
                       
                        <h4 className="text-[15px] font-extrabold text-[#0B1E4B] !m-0 !mb-[8px]">{item.title}</h4>
                        <p className="text-slate-500 text-[13px] leading-[1.65] !m-0 !mb-[10px]">{item.desc}</p>
                        <span className="inline-flex items-center gap-[5px] bg-[#e8ecf8] text-[#0B1E4B] text-[11px] font-extrabold !px-[10px] !py-[4px] rounded-full">
                          <BsStarFill className="text-[9px] text-[#F05A1A]" /> {item.highlight}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CENTER dot */}
                  <div className="absolute left-1/2 top-[20px] -translate-x-1/2 z-10">
                    <div className={`
                      relative w-[40px] h-[40px] rounded-full
                      flex items-center justify-center
                      ${item.isUpcoming
                        ? 'bg-[#FFF3EC] border-2 border-dashed border-[#F05A1A]'
                        : 'bg-gradient-to-br from-[#0B1E4B] to-[#F05A1A]'
                      }
                      shadow-[0_4px_14px_rgba(11,30,75,0.2)] text-white
                    `}>
                      {item.icon}
                    </div>
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] rounded-full border border-[rgba(240,90,26,0.2)] animate-ping opacity-20" />
                  </div>

                  {/* RIGHT column */}
                  <div className={`!pl-[48px] !pb-[40px] ${item.side === 'right' ? 'flex justify-start' : ''}`}>
                    {item.side === 'right' && (
                      <div className={`
                        max-w-[340px] bg-white rounded-[18px] !p-[22px]
                        border border-slate-100
                        shadow-[0_4px_20px_rgba(11,30,75,0.08)]
                        hover:shadow-[0_8px_32px_rgba(11,30,75,0.12)]
                        hover:-translate-y-[2px] transition-all duration-300
                        ${item.isUpcoming ? 'border-dashed border-[#F05A1A]/30' : ''}
                      `}>
                       
                        <h4 className="text-[15px] font-extrabold text-[#0B1E4B] !m-0 !mb-[8px]">{item.title}</h4>
                        <p className="text-slate-500 text-[13px] leading-[1.65] !m-0 !mb-[10px]">{item.desc}</p>
                        <span className="inline-flex items-center gap-[5px] bg-[#e8ecf8] text-[#0B1E4B] text-[11px] font-extrabold !px-[10px] !py-[4px] rounded-full">
                          <BsStarFill className="text-[9px] text-[#F05A1A]" /> {item.highlight}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile timeline — single column */}
          <div className="md:hidden flex flex-col gap-[16px] relative">
            <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#0B1E4B] via-[#F05A1A] to-[#0B1E4B]" />
            {ROADMAP.map((item, i) => (
              <div key={i} className="!pl-[50px] relative">
                {/* Dot */}
                <div className={`absolute left-[6px] top-[18px] w-[30px] h-[30px] rounded-full flex items-center justify-center text-white z-10 shadow-md ${item.isUpcoming ? 'bg-[#FFF3EC] border-2 border-dashed border-[#F05A1A]' : 'bg-gradient-to-br from-[#0B1E4B] to-[#F05A1A]'}`}>
                  <span className={item.isUpcoming ? 'text-[#F05A1A]' : 'text-white'}>{item.icon}</span>
                </div>

                <div className={`bg-white rounded-[16px] !p-[18px] border border-slate-100 shadow-[0_2px_14px_rgba(11,30,75,0.07)] ${item.isUpcoming ? 'border-dashed border-[#F05A1A]/30' : ''}`}>
                  <div className="flex items-center gap-[8px] !mb-[8px]">
                    <span className="text-[#F05A1A] text-[11px] font-extrabold uppercase tracking-[1.5px]">{item.year}</span>
                    {item.isUpcoming && <span className="bg-[#FFF3EC] text-[#F05A1A] border border-[#F05A1A]/20 text-[9px] font-extrabold uppercase tracking-[1px] !px-[7px] !py-[2px] rounded-full">Upcoming</span>}
                  </div>
                  <h4 className="text-[14px] font-extrabold text-[#0B1E4B] !m-0 !mb-[6px]">{item.title}</h4>
                  <p className="text-slate-500 text-[12.5px] leading-[1.6] !m-0 !mb-[8px]">{item.desc}</p>
                  <span className="inline-flex items-center gap-[5px] bg-[#e8ecf8] text-[#0B1E4B] text-[11px] font-extrabold !px-[10px] !py-[4px] rounded-full">
                    <BsStarFill className="text-[9px] text-[#F05A1A]" /> {item.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
        5. QUOTE BANNER
      ══════════════════════════════════ */}
      <section className="!py-[64px] !px-[16px] sm:!px-[24px] bg-gradient-to-r from-[#F05A1A] to-[#FF7D42]">
        <div className="max-w-[760px] !mx-auto text-center">
          <FaQuoteLeft className="text-white/30 text-[40px] !mx-auto !mb-[16px]" />
          <blockquote className="text-white text-[clamp(18px,2.5vw,26px)] font-extrabold leading-[1.5] !m-0 !mb-[20px]">
            "Talent is everywhere. Opportunity is not. We exist to change that."
          </blockquote>
        </div>
      </section>
    </div>
  )
}