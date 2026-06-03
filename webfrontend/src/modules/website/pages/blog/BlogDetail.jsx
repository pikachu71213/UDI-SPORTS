/**
 * BlogDetail.jsx  ← /src/blogs/BlogDetail.jsx
 * ─────────────────────────────────────────────────────────
 * Full blog detail page.
 *
 * Features:
 *  • Renders CKEditor HTML content safely via dangerouslySetInnerHTML
 *  • Hero image with category badge + title overlay
 *  • Author info, date, read time, tags
 *  • Back navigation
 *  • Related posts section
 *  • Sidebar with categories + recent posts
 *
 * Route: /blogs/:slug
 */

import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaCalendarAlt, FaClock, FaArrowLeft,
  FaTag, FaUser, FaShareAlt, FaTwitter,
  FaLinkedin, FaWhatsapp,
} from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { MdArticle }  from 'react-icons/md'
import BlogSidebar from './BlogSidebar'
import BlogCard    from './BlogCard'
import { useBlogDetail, useRecentBlogs, getCatColor } from './blogData'

/* ── Skeleton loader ── */
const DetailSkeleton = () => (
  <div className="animate-pulse flex flex-col !gap-[24px]">
    <div className="h-[380px] rounded-[24px] bg-slate-200" />
    <div className="flex flex-col !gap-[12px] !px-[4px]">
      <div className="h-[16px] w-[80px] bg-slate-200 rounded-full" />
      <div className="h-[34px] w-[85%] bg-slate-200 rounded-[8px]" />
      <div className="h-[34px] w-[60%] bg-slate-200 rounded-[8px]" />
      <div className="flex !gap-[16px] !mt-[4px]">
        <div className="h-[14px] w-[100px] bg-slate-100 rounded-full" />
        <div className="h-[14px] w-[80px]  bg-slate-100 rounded-full" />
      </div>
    </div>
    <div className="flex flex-col !gap-[10px]">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className={`h-[14px] bg-slate-100 rounded-full ${i % 3 === 2 ? 'w-[65%]' : 'w-full'}`} />
      ))}
    </div>
  </div>
)

/* ── Share button ── */
const ShareBtn = ({ Icon, label, onClick, colorCls }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center !gap-[7px] !px-[14px] !py-[7px] rounded-full
      text-[12px] font-bold border-[1.5px]
      transition-all duration-200 cursor-pointer
      hover:-translate-y-[2px] active:scale-[0.97]
      ${colorCls}
    `}
  >
    <Icon className="text-[12px]" /> {label}
  </button>
)

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════ */
export default function BlogDetail () {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const { blog, loading, error } = useBlogDetail(slug)
  const recentBlogs = useRecentBlogs(10)

  /* Related posts — same category, exclude current */
  const related = recentBlogs.filter(
    (b) => b.slug !== slug && b.category === blog?.category
  ).slice(0, 3)

  useEffect(() => {
    if (!blog) return
  }, [blog, slug])

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(blog?.title || '')

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F6FB] to-white">
      <style>{`
        /* CKEditor HTML content styles */
        .ck-content h1,.ck-content h2,.ck-content h3 {
          color: #0B1E4B;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 28px;
          margin-bottom: 12px;
        }
        .ck-content h2 { font-size: 22px; }
        .ck-content h3 { font-size: 18px; }
        .ck-content p {
          color: #374151;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .ck-content ul, .ck-content ol {
          padding-left: 20px;
          margin-bottom: 16px;
        }
        .ck-content li {
          color: #374151;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 6px;
        }
        .ck-content blockquote {
          border-left: 4px solid #F05A1A;
          margin: 24px 0;
          padding: 14px 20px;
          background: #FFF3EC;
          border-radius: 0 12px 12px 0;
          color: #374151;
          font-size: 15px;
          font-style: italic;
          line-height: 1.7;
        }
        .ck-content strong { color: #0B1E4B; font-weight: 700; }
        .ck-content a { color: #F05A1A; text-decoration: underline; }
        .ck-content img { border-radius: 12px; max-width: 100%; margin: 16px 0; }
      `}</style>

      <div className="max-w-[1280px] !mx-auto !px-[16px] sm:!px-[24px] lg:!px-[32px] !py-[40px]">

        {/* ── BACK BUTTON ── */}
        <button
          onClick={() => navigate('/blogs')}
          className="
            inline-flex items-center !gap-[8px]
            !px-[16px] !py-[9px] rounded-[10px] !mb-[28px]
            bg-white border-[1.5px] border-slate-200
            text-[13px] font-bold text-slate-600
            hover:text-[#F05A1A] hover:border-[rgba(240,90,26,0.3)]
            shadow-[0_2px_10px_rgba(11,30,75,0.06)]
            transition-all duration-200 active:scale-[0.97]
          "
        >
          <FaArrowLeft className="text-[12px]" />
          Back to Blog
        </button>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row !gap-[28px] items-start">

          {/* LEFT: Blog content (75%) */}
          <div className="flex-1 min-w-0">

            {loading ? (
              <div className="bg-white rounded-[24px] border-[1.5px] border-slate-100 shadow-[0_4px_24px_rgba(11,30,75,0.08)] !p-[32px]">
                <DetailSkeleton />
              </div>
            ) : error ? (
              <div className="bg-white rounded-[24px] border-[1.5px] border-red-200 !p-[48px] text-center flex flex-col items-center !gap-[14px]">
                <MdArticle className="text-slate-300 text-[52px]" />
                <h3 className="text-[#0B1E4B] font-extrabold text-[20px] !m-0">Post Not Found</h3>
                <p className="text-slate-400 text-[14px] !m-0">{error}</p>
                <button
                  onClick={() => navigate('/blogs')}
                  className="!mt-[8px] !px-[20px] !py-[10px] rounded-[10px] bg-[#F05A1A] text-white font-extrabold text-[13px] hover:bg-[#d44f15] transition-colors"
                >
                  Browse All Posts
                </button>
              </div>
            ) : blog ? (
              <article>

                {/* ── HERO IMAGE ── */}
                <div className="relative w-full h-[300px] sm:h-[401px] rounded-[24px] overflow-hidden !mb-[28px] bg-slate-200">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-fill"
                    fetchPriority="high"
                    decoding="async"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.category)}&background=0B1E4B&color=fff&size=800`
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,30,75,0.7)] via-[rgba(11,30,75,0.2)] to-transparent" />

                  {/* Category badge over image */}
                  <div className="absolute top-[20px] left-[20px]">
                    <span className={`
                      inline-flex items-center !px-[12px] !py-[5px] rounded-full
                      text-[11px] font-extrabold uppercase tracking-[1.2px]
                      border-[1.5px] ${getCatColor(blog.category).bg} ${getCatColor(blog.category).text} ${getCatColor(blog.category).border}
                      shadow-[0_2px_8px_rgba(0,0,0,0.15)]
                    `}>
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* ── TITLE + META ── */}
                <div className="!mb-[24px]">
                  <h1 className="
                    font-extrabold text-[#0B1E4B] leading-snug !m-0 !mb-[16px]
                    text-[clamp(22px,3.5vw,34px)] tracking-[-0.3px]
                  ">
                    {blog.title}
                  </h1>


                  {/* Divider */}
                  <div className="h-px bg-slate-100 !mb-[0px]" />
                </div>

                {/* ── BLOG CONTENT (CKEditor HTML) ── */}
                <div
                  className="ck-content !mb-[32px]"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* ── SHARE ── */}
                <div className="flex items-center flex-wrap !gap-[10px] !mb-[40px]">
                  <span className="text-[12px] font-extrabold text-slate-500 uppercase tracking-[1.2px] flex items-center !gap-[6px]">
                    <FaShareAlt className="text-[11px]" /> Share:
                  </span>
                  <ShareBtn
                    Icon={FaTwitter} label="Twitter"
                    colorCls="bg-[#e8f4fd] text-[#1DA1F2] border-[#1DA1F2]/20 hover:bg-[#1DA1F2] hover:text-white"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`, '_blank')}
                  />
                  <ShareBtn
                    Icon={FaLinkedin} label="LinkedIn"
                    colorCls="bg-[#e8f0fb] text-[#0A66C2] border-[#0A66C2]/20 hover:bg-[#0A66C2] hover:text-white"
                    onClick={() => window.open(`https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')}
                  />
                  <ShareBtn
                    Icon={FaWhatsapp} label="WhatsApp"
                    colorCls="bg-[#e8f9ee] text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366] hover:text-white"
                    onClick={() => window.open(`https://wa.me/?text=${shareTitle}%20${shareUrl}`, '_blank')}
                  />
                </div>

                {/* ── RELATED POSTS ── */}
                {related.length > 0 && (
                  <div>
                    <div className="flex items-center !gap-[8px] !mb-[18px]">
                      <HiSparkles className="text-[#F05A1A] text-[16px]" />
                      <h3 className="font-extrabold text-[#0B1E4B] text-[16px] tracking-[0.5px] !m-0">
                        Related Posts
                      </h3>
                    </div>
                    <div className="flex flex-col !gap-[12px]">
                      {related.map(r => <BlogCard key={r.id} blog={r} />)}
                    </div>
                  </div>
                )}

              </article>
            ) : null}
          </div>

          {/* RIGHT: Sidebar (25%) */}
          <div className="w-full lg:w-[290px] xl:w-[310px] flex-shrink-0">
            <div className="lg:sticky lg:top-[24px]">
              <BlogSidebar
                currentSlug={slug}
                activeCategory={blog?.category || 'All'}
                onCategoryChange={(cat) => navigate(`/blogs?category=${encodeURIComponent(cat)}`)}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}