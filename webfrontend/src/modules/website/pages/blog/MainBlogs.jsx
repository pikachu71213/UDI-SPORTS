/**
 * main.jsx  ← /src/blogs/main.jsx
 * ─────────────────────────────────────────────────────────
 * Blog module router — attach this inside your main App router.
 *
 * ── FOLDER STRUCTURE ─────────────────────────────────────
 *   src/
 *   └── blogs/
 *       ├── main.jsx        ← this file (router + lazy loading)
 *       ├── blogData.js     ← mock data + API hooks
 *       ├── BlogList.jsx    ← /blogs  (list + search + filter)
 *       ├── BlogDetail.jsx  ← /blogs/:slug  (full post)
 *       ├── BlogCard.jsx    ← reusable card for list items
 *       └── BlogSidebar.jsx ← reusable sidebar
 *
 * ── HOW TO ATTACH IN YOUR APP ────────────────────────────
 *
 *  Option A — In your main App.jsx / App router:
 *
 *    import BlogRoutes from './blogs/main'
 *
 *    <Routes>
 *      <Route path="/"          element={<Home />} />
 *      <Route path="/members/*" element={<MembersData />} />
 *      {BlogRoutes}             ← spread blog routes here
 *    </Routes>
 *
 *  Option B — Nested route (all under /blogs/*):
 *
 *    import { Route } from 'react-router-dom'
 *    import BlogRoutes from './blogs/main'
 *
 *    <Route path="/blogs/*" element={<BlogLayout />}>
 *      {BlogRoutes}
 *    </Route>
 *
 * ── URL STRUCTURE ─────────────────────────────────────────
 *
 *   /blogs                                   → All blogs list
 *   /blogs?search=boxing                     → Search results
 *   /blogs?category=Event                    → Filter by category
 *   /blogs?category=Mentorship&page=2        → Category + pagination
 *   /blogs?search=arjun&category=Success+Story → Search + category
 *   /blogs/from-fields-to-glory-boxing       → Full blog detail
 *   /blogs/annual-sports-talent-hunt-2024    → Full blog detail
 *
 * ── ADMIN CKEditor DATA SHAPE ─────────────────────────────
 *
 *   Each blog saved to DB as:
 *   {
 *     id        : number          — auto-increment
 *     slug      : string          — URL-safe unique identifier
 *     title     : string          — Blog title (plain text)
 *     category  : string          — One of CATEGORIES array
 *     image     : string          — Uploaded image URL
 *     excerpt   : string          — Short description (plain text)
 *     content   : string          — CKEditor HTML output
 *     author    : string          — Author name
 *     authorImg : string          — Author photo URL
 *     date      : string          — Display date e.g. "Dec 15, 2024"
 *     dateISO   : string          — ISO date "2024-12-15"
 *     readTime  : string          — e.g. "5 min read"
 *     tags      : string[]        — Tag array
 *   }
 *
 * ─────────────────────────────────────────────────────────
 */

import { Routes, Route } from 'react-router-dom'
import BlogList   from './BlogList'
import BlogDetail from './BlogDetail'

/**
 * BlogRoutes component — use inside your <Routes> wrapper
 *
 * Usage in App.jsx:
 *   import BlogRoutes from './blogs/main'
 *   ...
 *   <BlogRoutes />
 */
export default function BlogRoutes () {
  return (
    <Routes>
      {/* /blogs → list page */}
      <Route index element={<BlogList />} />

      {/* /blogs/:slug → detail page */}
      <Route path=":slug" element={<BlogDetail />} />

    </Routes>
  )
}

/**
 * If you prefer to spread routes directly (Option A above):
 *
 * export const blogRouteElements = [
 *   <Route key="blog-list"   path="/blogs"       element={<BlogList />} />,
 *   <Route key="blog-detail" path="/blogs/:slug" element={<BlogDetail />} />,
 * ]
 */