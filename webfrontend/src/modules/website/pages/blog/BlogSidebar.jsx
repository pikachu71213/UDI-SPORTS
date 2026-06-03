/**
 * BlogSidebar.jsx  ← /src/blogs/BlogSidebar.jsx
 * ──────────────────────────────────────────────
 * Right-side sidebar with:
 *  • Category filter pills
 *  • Recent Posts list (latest 4)
 *  • Promo / CTA card
 *
 * Props:
 *   activeCategory   : string   — currently selected category
 *   onCategoryChange : fn(cat)  — fires on pill click
 *   currentSlug?     : string   — to highlight active in recent posts
 */

import { useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaChevronRight, FaTag } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { MdTrendingUp } from 'react-icons/md'
import { CATEGORIES, getCatColor, useRecentBlogs } from './blogData'

export default function BlogSidebar ({ activeCategory = 'All', onCategoryChange, currentSlug }) {
  const navigate    = useNavigate()
  const recentPosts = useRecentBlogs(4)

  return (
    <aside className="flex flex-col !gap-[20px] w-full">

      {/* ══ CATEGORIES ══ */}
      <div className="bg-white rounded-[18px] border-[1.5px] border-slate-100 shadow-[0_4px_18px_rgba(11,30,75,0.07)] !p-[22px]">

        <h3 className="flex items-center !gap-[8px] text-[11px] font-extrabold text-[#0B1E4B] uppercase tracking-[2px] !m-0 !mb-[16px]">
          <FaTag className="text-[#F05A1A] text-[12px]" />
          Categories
        </h3>

        <div className="flex flex-wrap !gap-[8px]">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat
            const color    = getCatColor(cat)

            return (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(cat)}
                className={`
                  !px-[14px] !py-[7px] rounded-full
                  text-[12px] font-bold border-[1.5px]
                  cursor-pointer transition-all duration-200
                  ${isActive
                    ? cat === 'All'
                      ? 'bg-[#F05A1A] text-white border-[#F05A1A] shadow-[0_4px_12px_rgba(240,90,26,0.3)]'
                      : `${color.bg} ${color.text} ${color.border} shadow-[0_2px_8px_rgba(0,0,0,0.07)]`
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-[#0B1E4B]'
                  }
                `}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ══ RECENT POSTS ══ */}
      <div className="bg-white rounded-[18px] border-[1.5px] border-slate-100 shadow-[0_4px_18px_rgba(11,30,75,0.07)] !p-[22px]">

        <h3 className="flex items-center !gap-[8px] text-[11px] font-extrabold text-[#0B1E4B] uppercase tracking-[2px] !m-0 !mb-[16px]">
          <MdTrendingUp className="text-[#F05A1A] text-[15px]" />
          Recent Posts
        </h3>

        <div className="flex flex-col">
          {recentPosts.map((post, i) => {
            const isActive = post.slug === currentSlug
            const isLast   = i === recentPosts.length - 1

            return (
              <button
                key={post.id}
                onClick={() => navigate(`/blogs/${post.slug}`)}
                className={`
                  group flex items-start !gap-[12px]
                  !py-[12px] w-full text-left cursor-pointer
                  transition-all duration-200
                  ${!isLast ? 'border-b border-slate-100' : ''}
                `}
              >
                {/* Thumbnail */}
                <div className="w-[52px] h-[52px] rounded-[9px] overflow-hidden flex-shrink-0 bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-300"
                    decoding="async"
                    onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=Blog&background=F05A1A&color=fff&size=100' }}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`
                    text-[12.5px] font-bold leading-snug !m-0 !mb-[5px]
                    overflow-hidden line-clamp-2
                    transition-colors duration-200
                    ${isActive ? 'text-[#F05A1A]' : 'text-[#0B1E4B] group-hover:text-[#F05A1A]'}
                  `}>
                    {post.title}
                  </p>
                  <span className="flex items-center !gap-[4px] text-[11px] text-slate-400 font-medium">
                    <FaCalendarAlt className="text-[9px]" />
                    {post.date}
                  </span>
                </div>

                <FaChevronRight className="text-[10px] text-slate-300 flex-shrink-0 !mt-[4px] group-hover:text-[#F05A1A] transition-colors" />
              </button>
            )
          })}
        </div>
      </div>

      {/* ══ PROMO CTA ══ */}
      <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0B1E4B] via-[#152B6B] to-[#1a3560] !p-[24px] text-center">
        <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full bg-[rgba(240,90,26,0.18)]" />
        <div className="relative z-10 flex flex-col items-center !gap-[10px]">
          <div className="text-[30px]">🏆</div>
          <h4 className="text-white font-extrabold text-[15px] !m-0 leading-snug">Join UDI Sports NGO</h4>
          <p className="text-white/50 text-[12px] leading-[1.6] !m-0">
            Be part of India's grassroots sports revolution.
          </p>
          <button
            onClick={() => navigate('/membership/individual-patron')}
            className="
              !mt-[4px] !px-[20px] !py-[9px] rounded-[10px]
              bg-gradient-to-r from-[#F05A1A] to-[#FF7D42]
              text-white text-[12px] font-extrabold
              shadow-[0_4px_14px_rgba(240,90,26,0.4)]
              hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(240,90,26,0.5)]
              active:scale-[0.97] transition-all duration-200
            "
          >
            Become a Member →
          </button>
        </div>
      </div>

    </aside>
  )
}