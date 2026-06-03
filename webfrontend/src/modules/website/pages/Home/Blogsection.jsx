import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { FaArrowRight, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { getPublicBlogs } from '../../../../shared/services/publicApi'

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="!rounded-xl sm:!rounded-2xl !bg-white !overflow-hidden"
    style={{ boxShadow: '0 4px 20px rgba(11,30,75,.07)', border: '1px solid #e8ecf4' }}
  >
    {/* Image area */}
    <div className="blog-skel" style={{ height: 'clamp(140px,18vw,175px)', width: '100%' }} />

    <div style={{ padding: 'clamp(10px,1.8vw,16px)' }}>
      {/* Category */}
      <div className="blog-skel" style={{ width: '40%', height: 10, borderRadius: 6, marginBottom: 10 }} />
      {/* Title line 1 */}
      <div className="blog-skel" style={{ width: '90%', height: 13, borderRadius: 6, marginBottom: 7 }} />
      {/* Title line 2 */}
      <div className="blog-skel" style={{ width: '70%', height: 13, borderRadius: 6, marginBottom: 12 }} />
      {/* Excerpt line 1 */}
      <div className="blog-skel" style={{ width: '100%', height: 10, borderRadius: 6, marginBottom: 6 }} />
      {/* Excerpt line 2 */}
      <div className="blog-skel" style={{ width: '80%', height: 10, borderRadius: 6, marginBottom: 14 }} />
      {/* Footer row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="blog-skel" style={{ width: '35%', height: 10, borderRadius: 6 }} />
        <div className="blog-skel" style={{ width: '25%', height: 10, borderRadius: 6 }} />
      </div>
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const BlogSection = () => {
  const navigate  = useNavigate()
  const swiperRef = useRef(null)
  const [blogs,   setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    getPublicBlogs({ page: 1, limit: 8 })
      .then((data) => {
        if (cancelled) return
        setBlogs(Array.isArray(data?.blogs) ? data.blogs : [])
      })
      .catch((err) => {
        if (!cancelled) { setError(err?.message || 'Failed to load blogs'); setBlogs([]) }
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return (
    <>
      <style>{`
        @keyframes blogSkelShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .blog-skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 1200px 100%;
          animation: blogSkelShimmer 1.4s ease-in-out infinite;
          display: block;
        }

        .blog-swiper .swiper-button-next,
        .blog-swiper .swiper-button-prev { display: none !important; }
        .blog-swiper .swiper-pagination   { position: static !important; margin-top: 18px; }
        .blog-swiper .swiper-pagination-bullet {
          width: 6px; height: 6px; background: #cbd5e1; opacity: 1; transition: all .25s ease;
        }
        .blog-swiper .swiper-pagination-bullet-active {
          background: #F05A1A; width: 20px; border-radius: 4px;
        }

        .blog-nav-btn {
          transition: all .25s cubic-bezier(.16,1,.3,1); cursor: pointer;
        }
        .blog-nav-btn:hover {
          background: linear-gradient(135deg,#F05A1A,#FF7D42) !important;
          color: #fff !important; border-color: transparent !important;
          transform: scale(1.08);
          box-shadow: 0 8px 24px rgba(240,90,26,.35) !important;
        }

        .blog-card {
          transition: transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease, border-color .25s ease;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .blog-card:hover {
          transform: translateY(-7px) !important;
          box-shadow: 0 22px 48px rgba(11,30,75,.12) !important;
          border-color: rgba(240,90,26,.2) !important;
        }
        .blog-img { transition: transform .45s cubic-bezier(.16,1,.3,1); }
        .blog-card:hover .blog-img { transform: scale(1.06); }
        .blog-overlay { transition: opacity .3s ease; opacity: 0; }
        .blog-card:hover .blog-overlay { opacity: 1; }
        .read-arrow { transition: transform .25s ease; }
        .blog-card:hover .read-arrow { transform: translateX(4px); }
        .blog-title { transition: color .2s ease; }
        .blog-card:hover .blog-title { color: #F05A1A !important; }

        .view-all-btn {
          position: relative; overflow: hidden;
          transition: all .28s cubic-bezier(.16,1,.3,1);
        }
        .view-all-btn::after {
          content: ''; position: absolute; top: 0; left: -80%;
          width: 60%; height: 100%;
          background: linear-gradient(120deg,transparent,rgba(240,90,26,.1),transparent);
          transform: skewX(-15deg); transition: left .4s ease;
        }
        .view-all-btn:hover::after { left: 130%; }
        .view-all-btn:hover {
          background: #F05A1A !important; color: #fff !important;
          border-color: #F05A1A !important; transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(240,90,26,.3) !important;
        }
        .view-all-btn:hover .va-arrow { transform: translateX(4px); }
        .va-arrow { transition: transform .25s ease; }

        @media (max-width: 639px) {
          .blog-nav-btn { display: none !important; }
        }
      `}</style>

      <section
        className="blog-section"
        style={{
          background: '#F4F6FB',
          padding: 'clamp(24px,5vw,60px) clamp(12px,3vw,32px)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(16px,3.5vw,48px)' }}>
            <div
              className="inline-flex items-center !rounded-full"
              style={{
                padding: '4px 14px', display: 'inline-flex',
                border: '1.5px solid rgba(240,90,26,.4)',
                background: 'rgba(240,90,26,.05)',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '2.5px', textTransform: 'uppercase',
                color: '#F05A1A',
                marginBottom: 'clamp(6px,1.2vw,14px)',
              }}
            >
              Latest Updates
            </div>
            <h2
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(26px,6vw,62px)',
                letterSpacing: 3, lineHeight: 1.05,
                color: '#0B1E4B', margin: 0,
                marginBottom: 'clamp(6px,1vw,10px)',
              }}
            >
              From Our <span style={{ color: '#F05A1A' }}>Blog</span>
            </h2>
            <div style={{
              width: 36, height: 3, borderRadius: 2,
              background: 'linear-gradient(90deg,#F05A1A,#FF7D42)',
              margin: '0 auto',
            }} />
          </div>

          {/* ── Slider wrapper ── */}
          <div style={{ position: 'relative' }}>

            {/* Prev arrow */}
            <button
              className="blog-nav-btn"
              style={{
                position: 'absolute', left: -16, top: '42%',
                transform: 'translateY(-50%)', zIndex: 10,
                width: 38, height: 38, borderRadius: '50%',
                background: '#fff', border: '1.5px solid #e2e8f0',
                color: '#0B1E4B', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(11,30,75,.1)',
              }}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <FaChevronLeft style={{ fontSize: 12 }} />
            </button>

            {/* Next arrow */}
            <button
              className="blog-nav-btn"
              style={{
                position: 'absolute', right: -16, top: '42%',
                transform: 'translateY(-50%)', zIndex: 10,
                width: 38, height: 38, borderRadius: '50%',
                background: '#fff', border: '1.5px solid #e2e8f0',
                color: '#0B1E4B', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(11,30,75,.1)',
              }}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <FaChevronRight style={{ fontSize: 12 }} />
            </button>

            <Swiper
              className="blog-swiper"
              style={{ padding: '2px 2px clamp(28px,4vw,40px)' }}
              modules={[Pagination, Autoplay, Navigation]}
              pagination={{ clickable: true }}
              onSwiper={(s) => { swiperRef.current = s }}
              autoplay={!loading && blogs.length > 1
                ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }
                : false
              }
              loop={!loading && blogs.length > 1}
              breakpoints={{
                0:    { slidesPerView: 1.2,   spaceBetween: 10 },
                480:  { slidesPerView: 1.5, spaceBetween: 12 },
                640:  { slidesPerView: 2,   spaceBetween: 14 },
                900:  { slidesPerView: 2,   spaceBetween: 16 },
                1024: { slidesPerView: 3,   spaceBetween: 18 },
              }}
            >
              {/* ── Skeleton slides ── */}
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide key={`skel-${i}`}>
                  <SkeletonCard />
                </SwiperSlide>
              ))}

              {/* ── Real blog slides ── */}
              {!loading && blogs.map((blog) => (
                <SwiperSlide key={blog.id}>
                  <div
                    className="blog-card !rounded-xl sm:!rounded-2xl !bg-white !overflow-hidden"
                    style={{ boxShadow: '0 4px 20px rgba(11,30,75,.07)', border: '1px solid #e8ecf4' }}
                    onClick={() => navigate(`/blogs/${blog.slug || blog.id}`)}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', overflow: 'hidden', height: 'clamp(140px,18vw,210px)' }}>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        loading="lazy"
                        draggable={false}
                        className="blog-img !w-full !h-full !object-fill"
                        style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.category || 'Blog')}&background=0B1E4B&color=fff&size=600`
                        }}
                      />
                      <div className="blog-overlay !absolute !inset-0" style={{ background: 'rgba(11,30,75,.25)' }} />
                      <div style={{
                        position: 'absolute', top: 9, left: 9,
                        padding: '3px 10px',
                        background: 'rgba(11,30,75,.7)', backdropFilter: 'blur(6px)',
                        borderRadius: 999, fontSize: 9.5, fontWeight: 700,
                        color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase',
                        userSelect: 'none',
                      }}>
                        {blog.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'clamp(10px,1.8vw,16px)' }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: '#F05A1A',
                        letterSpacing: '1.8px', textTransform: 'uppercase',
                        marginBottom: 4,
                      }}>
                        {blog.category}
                      </div>
                      <h3
                        className="blog-title line-clamp-2"
                        style={{
                          margin: 0, marginBottom: 5,
                          fontSize: 'clamp(12px,1.4vw,13.5px)',
                          fontWeight: 800, color: '#0B1E4B', lineHeight: 1.4,
                        }}
                      >
                        {blog.title}
                      </h3>
                      <p
                        className="line-clamp-2"
                        style={{
                          margin: 0, marginBottom: 'clamp(8px,1.2vw,12px)',
                          fontSize: 'clamp(11px,1.2vw,11.5px)',
                          color: '#64748b', lineHeight: 1.65,
                        }}
                      >
                        {blog.excerpt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                          <FaCalendarAlt style={{ fontSize: 10, color: '#F05A1A' }} />
                          {blog.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: '#F05A1A' }}>
                          Read More <FaArrowRight className="read-arrow" style={{ fontSize: 10 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* ── States ── */}
            {!loading && error && (
              <div style={{ textAlign: 'center', color: '#b91c1c', fontSize: 13, marginTop: 12 }}>
                {error}
              </div>
            )}
            {!loading && !error && blogs.length === 0 && (
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 12 }}>
                No blogs available.
              </div>
            )}
          </div>

          {/* ── View All ── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(18px,3vw,40px)' }}>
            <button
              className="view-all-btn !flex !items-center !gap-2 !rounded-full !cursor-pointer"
              style={{
                padding: 'clamp(8px,1.2vw,11px) clamp(18px,2.5vw,26px)',
                background: 'transparent',
                border: '2px solid #F05A1A',
                fontSize: 'clamp(12px,1.3vw,13px)',
                fontWeight: 700, color: '#F05A1A',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '0.3px',
              }}
              onClick={() => navigate('/blogs')}
            >
              View All Blogs
              <FaArrowRight className="va-arrow" style={{ fontSize: 12 }} />
            </button>
          </div>

        </div>
      </section>
    </>
  )
}

export default BlogSection