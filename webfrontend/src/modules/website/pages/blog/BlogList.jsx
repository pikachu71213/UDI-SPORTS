/**
 * BlogList.jsx  ← /src/blogs/BlogList.jsx
 * ──────────────────────────────────────────────────────────
 * Main blog listing page.
 *
 * Features:
 *  • Search bar → synced to URL ?search=
 *  • Category click → synced to URL ?category=
 *  • Pagination → synced to URL ?page=
 *  • Debounced search (400ms) → URL updates automatically
 *  • Shareable / bookmarkable URLs
 *
 * Routes:
 *   /blogs                        → all blogs
 *   /blogs?search=boxing          → search results
 *   /blogs?category=Event         → filtered category
 *   /blogs?page=2                 → page 2
 *   /blogs?search=youth&category=Mentorship&page=1 → combined
 */

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate }      from 'react-router-dom'
import { FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { MdArticle }  from 'react-icons/md'
import BlogCard    from './BlogCard'
import BlogSidebar from './BlogSidebar'
import { useBlogs } from './blogData'
import PageHero from '../../../../shared/components/PageHero'

const LIMIT = 5

/* ── Card skeleton ── */
const CardSkeleton = () => (
  <div className="flex items-start !gap-[18px] bg-white rounded-[18px] border-[1.5px] border-slate-100 !p-[18px] animate-pulse">
    <div className="w-[130px] h-[100px] rounded-[12px] bg-slate-200 flex-shrink-0" />
    <div className="flex-1 flex flex-col !gap-[10px]">
      <div className="h-[16px] w-[80px] bg-slate-200 rounded-full" />
      <div className="h-[18px] w-[90%] bg-slate-200 rounded-[6px]" />
      <div className="h-[14px] w-[72%] bg-slate-200 rounded-[6px]" />
      <div className="h-[12px] w-[42%] bg-slate-100 rounded-[6px]" />
    </div>
  </div>
)

/* ── Empty state ── */
const EmptyState = ({ search, category }) => (
  <div className="flex flex-col items-center justify-center text-center !py-[72px] !px-[24px] !gap-[14px]">
    <div className="w-[72px] h-[72px] rounded-full bg-[#FFF3EC] flex items-center justify-center">
      <MdArticle className="text-[#F05A1A] text-[32px]" />
    </div>
    <div>
      <h3 className="text-[#0B1E4B] font-extrabold text-[18px] !m-0 !mb-[6px]">No posts found</h3>
      <p className="text-slate-400 text-[13.5px] max-w-[280px] leading-[1.65] !m-0">
        {search
          ? `No results for "${search}". Try different keywords.`
          : category !== 'All'
            ? `No posts in "${category}" yet.`
            : 'No blog posts available right now.'
        }
      </p>
    </div>
  </div>
)

/* ── Pagination ── */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null
  const pages = []
  const add = (value) => {
    if (!pages.includes(value)) pages.push(value)
  }

  add(1)
  if (totalPages > 1) add(totalPages)
  for (let p = page - 1; p <= page + 1; p += 1) {
    if (p > 1 && p < totalPages) add(p)
  }

  pages.sort((a, b) => a - b)
  const view = []
  for (let i = 0; i < pages.length; i += 1) {
    const current = pages[i]
    const prev = pages[i - 1]
    if (i > 0 && current - prev > 1) {
      view.push('dots-left-' + i)
    }
    view.push(current)
  }

  return (
    <div className="flex items-center justify-center !gap-[8px] !mt-[8px] flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="
          w-[36px] h-[36px] rounded-full flex items-center justify-center
          border-[1.5px] border-slate-200 bg-white text-slate-400
          hover:border-[#F05A1A] hover:text-[#F05A1A]
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <FaChevronLeft className="text-[11px]" />
      </button>

      {view.map((item) => {
        if (typeof item === 'string') {
          return (
            <span key={item} className="w-[28px] text-center text-slate-300 font-extrabold select-none">
              ...
            </span>
          )
        }
        return (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`
              w-[36px] h-[36px] rounded-full flex items-center justify-center
              text-[13px] font-extrabold border-[1.5px]
              transition-all duration-200
              ${item === page
                ? 'bg-[#F05A1A] text-white border-[#F05A1A] shadow-[0_4px_12px_rgba(240,90,26,0.32)]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-[#F05A1A] hover:text-[#F05A1A]'
              }
            `}
          >
            {item}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="
          w-[36px] h-[36px] rounded-full flex items-center justify-center
          border-[1.5px] border-slate-200 bg-white text-slate-400
          hover:border-[#F05A1A] hover:text-[#F05A1A]
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <FaChevronRight className="text-[11px]" />
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
export default function BlogList () {
  const [searchParams, setSearchParams] = useSearchParams()

  /* Read from URL */
  const search   = searchParams.get('search')   || ''
  const category = searchParams.get('category') || 'All'
  const parsedPage = parseInt(searchParams.get('page') || '1', 10)
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage

  /* Local input (debounced → URL) */
  const [inputVal, setInputVal] = useState(search)

  /* Sync if URL changes externally */
  useEffect(() => { setInputVal(search) }, [search])

  /* Helper: update URL params */
  const updateParams = useCallback((updates) => {
    const cur  = Object.fromEntries(searchParams.entries())
    const next = { ...cur, ...updates }
    if (!next.search   || next.search   === '')    delete next.search
    if (!next.category || next.category === 'All') delete next.category
    if (!next.page     || next.page     === '1')   delete next.page
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  /* Debounce input → URL */
  useEffect(() => {
    if (inputVal === search) return
    const t = setTimeout(() => updateParams({ search: inputVal, page: '1' }), 400)
    return () => clearTimeout(t)
  }, [inputVal, search, updateParams])

  /* Fetch */
  const { blogs, total, loading, error } = useBlogs({ search, category, page, limit: LIMIT })
  const totalPages = Math.ceil(total / LIMIT)

  useEffect(() => {
    if (!loading && totalPages > 0 && page > totalPages) {
      updateParams({ page: String(totalPages) })
    }
  }, [loading, page, totalPages, updateParams])

  const handleCategory = (cat) => updateParams({ category: cat, page: '1' })
  const handlePage     = (p)   => {
    if (totalPages <= 0) return
    const nextPage = Math.min(Math.max(1, p), totalPages)
    if (nextPage === page) return
    updateParams({ page: String(nextPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const clearAll       = ()    => { setInputVal(''); updateParams({ search: '', category: 'All', page: '1' }) }

  return (
    <div className=" bg-gradient-to-b from-[#F4F6FB] to-white">
 <PageHero
      badge="Stories & Updates"
      heading="OUR"
      highlight="Blog"
      description="Insights, stories, and News from the world of sports."
      bgImage="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=85&fit=crop"
      />
      <div className="max-w-[1280px] !mx-auto !px-[16px] sm:!px-[24px] lg:!px-[32px] !py-[40px]">
        {/* ── SEARCH BAR ── */}
        <div className="relative !mb-[28px]">
          <FaSearch className="absolute left-[16px] top-1/2 -translate-y-1/2 text-slate-400 text-[14px] pointer-events-none" />
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Search by title, category, tag…"
            className="
              w-full h-[50px] !pl-[46px] !pr-[52px] rounded-[14px]
              border-[1.5px] border-slate-200 bg-white
              text-[#0B1E4B] text-[14px] font-medium
              placeholder:text-slate-300
              focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10
              shadow-[0_2px_12px_rgba(11,30,75,0.06)]
              transition-all duration-200
            "
          />
          {inputVal && (
            <button
              onClick={() => { setInputVal(''); updateParams({ search: '', page: '1' }) }}
              className="
                absolute right-[14px] top-1/2 -translate-y-1/2
                w-[26px] h-[26px] rounded-full bg-slate-100
                flex items-center justify-center
                hover:bg-[#F05A1A] group transition-all duration-200
              "
            >
              <FaTimes className="text-[11px] text-slate-500 group-hover:text-white" />
            </button>
          )}
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row !gap-[24px] items-start">

          {/* LEFT — Blog list (75%) */}
          <div className="flex-1 min-w-0 flex flex-col !gap-[14px]">

            {/* Result meta row */}
            {!loading && (
              <div className="flex items-center justify-between flex-wrap !gap-[8px] !mb-[2px]">
                <p className="text-[13px] text-slate-500 !m-0 font-medium">
                  {total > 0 ? (
                    <>
                      <strong className="text-[#0B1E4B]">{total}</strong>
                      {' '}post{total !== 1 ? 's' : ''}
                      {search ? ` for "${search}"` : ''}
                      {category !== 'All' ? ` in ${category}` : ''}
                    </>
                  ) : 'No posts found'}
                </p>
                {(search || category !== 'All') && (
                  <button onClick={clearAll} className="text-[12px] font-bold text-[#F05A1A] hover:underline">
                    ✕ Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Cards / skeleton / error / empty */}
            {loading ? (
              Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-[14px] !p-[20px] text-center text-red-500 text-[14px] font-semibold">
                {error}
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white rounded-[18px] border-[1.5px] border-slate-100 shadow-[0_2px_12px_rgba(11,30,75,0.06)]">
                <EmptyState search={search} category={category} />
              </div>
            ) : (
              blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)
            )}

            {/* Pagination */}
            {!loading && blogs.length > 0 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePage} />
            )}
          </div>

          {/* RIGHT — Sidebar (25%) */}
          <div className="w-full lg:w-[290px] xl:w-[310px] flex-shrink-0">
            <div className="lg:sticky lg:top-[24px]">
              <BlogSidebar
                activeCategory={category}
                onCategoryChange={handleCategory}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}