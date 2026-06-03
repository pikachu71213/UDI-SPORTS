// admin/index.jsx — Entry point for admin module
// Import this in your main App.jsx

// export { default as AdminRoutes } from './routes/AdminRoutes'

/**
 * ══════════════════════════════════════════════════
 * HOW TO USE IN YOUR App.jsx:
 * ══════════════════════════════════════════════════
 *
 * import { BrowserRouter, Routes, Route } from 'react-router-dom'
 * import { AdminRoutes } from './admin'
 * // OR import directly: import AdminRoutes from './admin/routes/AdminRoutes'
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/"        element={<Home />} />
 *         <Route path="/blogs"   element={<BlogList />} />
 *         <Route path="/blogs/:slug" element={<BlogDetail />} />
 *         <Route path="/admin/*" element={<AdminRoutes />} />  ← ADD THIS
 *       </Routes>
 *     </BrowserRouter>
 *   )
 * }
 *
 * ══════════════════════════════════════════════════
 * ADMIN URLS:
 * ══════════════════════════════════════════════════
 *   /admin/login                  → Login page
 *   /admin/dashboard              → Dashboard
 *   /admin/players                → Talented Players
 *   /admin/members/general        → General Members
 *   /admin/members/special        → Special Members
 *   /admin/members/committee      → Managing Committee
 *   /admin/incoming/members       → Incoming Member Forms
 *   /admin/incoming/contacts      → Incoming Contact Forms
 *   /admin/blogs                  → Blog Management
 *   /admin/settings               → Settings
 *
 * ══════════════════════════════════════════════════
 * REQUIRED PACKAGES:
 * ══════════════════════════════════════════════════
 *   npm install axios react-router-dom react-icons
 *
 * OPTIONAL (for CKEditor in Blogs page):
 *   npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-classic-build
 *
 * ══════════════════════════════════════════════════
 * ENV VARIABLE:
 * ══════════════════════════════════════════════════
 *   VITE_API_URL=http://localhost:5000/api   (in .env)
 *
 * ══════════════════════════════════════════════════
 * FONT (add to index.html or CSS):
 * ══════════════════════════════════════════════════
 *   <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
 * ══════════════════════════════════════════════════
 */