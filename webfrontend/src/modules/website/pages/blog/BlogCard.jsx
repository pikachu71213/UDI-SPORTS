/**
 * BlogCard.jsx  ← /src/blogs/BlogCard.jsx
 * ─────────────────────────────────────────────
 * Single blog item card used in BlogList.
 *
 * Props:
 *   blog : object — single blog data from API / mock
 */

import { useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa'
import { getCatColor } from './blogData'

export default function BlogCard ({ blog }) {
  const navigate = useNavigate()
  const color    = getCatColor(blog.category)

  return (
    <article
      onClick={() => navigate(`/blogs/${blog.slug}`)}
      className="
        group relative flex items-start !gap-[18px]
        bg-white rounded-[18px]
        border-[1.5px] border-slate-100
        shadow-[0_2px_12px_rgba(11,30,75,0.06)]
        !p-[18px] overflow-hidden cursor-pointer
        hover:shadow-[0_10px_36px_rgba(11,30,75,0.12),0_2px_10px_rgba(240,90,26,0.07)]
        hover:border-[rgba(240,90,26,0.22)]
        hover:-translate-y-[4px]
        transition-all duration-300
      "
    >
      {/* ── Thumbnail ── */}
      <div className="w-[110px] h-[90px] sm:w-[180px] sm:h-[120px] rounded-[12px] overflow-hidden flex-shrink-0 bg-slate-100">
        <img
          src={blog.image}
          alt={blog.title}
          loading="lazy"
          className="w-full h-full object-fill group-hover:scale-[1.08] transition-transform duration-500"
          decoding="async"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.category)}&background=0B1E4B&color=fff&size=300`
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 min-w-0 flex flex-col !gap-[6px]">

        {/* Category badge */}
        <span className={`
          inline-flex items-center self-start
          !px-[9px] !py-[3px] rounded-full
          text-[10px] font-extrabold uppercase tracking-[1.2px]
          border-[1.5px] ${color.bg} ${color.text} ${color.border}
        `}>
          {blog.category}
        </span>

        {/* Title */}
        <h2 className="
          text-[#0B1E4B] font-extrabold leading-snug !m-0
          text-[14.5px] sm:text-[15.5px]
          group-hover:text-[#F05A1A] transition-colors duration-200
          overflow-hidden line-clamp-2
        ">
          {blog.title}
        </h2>

        {/* Excerpt */}
        <p className="text-slate-500 text-[12.5px] leading-[1.6] !m-0 overflow-hidden line-clamp-2">
          {blog.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center !gap-[14px] !mt-[2px] flex-wrap">
          <span className="flex items-center !gap-[5px] text-[11px] text-slate-400 font-medium">
            <FaCalendarAlt className="text-[#F05A1A] text-[9px]" />
            {blog.date}
          </span>
          <span className="flex items-center !gap-[5px] text-[11px] text-slate-400 font-medium">
            <FaClock className="text-[9px] text-slate-300" />
            {blog.readTime}
          </span>
        </div>
      </div>

      {/* ── Arrow button ── */}
      <div className="
        flex-shrink-0 w-[30px] h-[30px] rounded-full self-center
        bg-slate-50 border border-slate-200
        flex items-center justify-center
        group-hover:bg-[#F05A1A] group-hover:border-[#F05A1A]
        transition-all duration-250
      ">
        <FaArrowRight className="text-[10px] text-slate-400 group-hover:text-white transition-colors duration-250" />
      </div>

      {/* Bottom bar */}
      <div className="
        absolute bottom-0 left-0 right-0 h-[3px]
        bg-gradient-to-r from-[#F05A1A] to-[#FF7D42]
        scale-x-0 origin-left group-hover:scale-x-100
        transition-transform duration-300
      " />
    </article>
  )
}