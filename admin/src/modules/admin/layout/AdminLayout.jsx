// admin/layout/AdminLayout.jsx
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'
import ToastContainer from '../components/ToastContainer'
import { useToast } from '../hooks/useToast'
import { ToastContext } from '../hooks/ToastContext'

const PAGE_TITLES = {
  '/admin/dashboard':          'Dashboard',
  '/admin/players':            'Talented Players',
  '/admin/members/general':    'General Members',
  '/admin/members/special':    'Special Members',
  '/admin/members/committee':  'Managing Committee',
  '/admin/incoming/members':   'Incoming Member Forms',
  '/admin/incoming/contacts':  'Incoming Contact Forms',
  '/admin/blogs':              'Blog Management',
  '/admin/settings':           'Settings',
}

export default function AdminLayout() {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const location = useLocation()
  const { toasts, toast, removeToast } = useToast()

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin Panel'

  return (
    <ToastContext.Provider value={toast}>
      <div className="min-h-screen bg-[#F0F3FA] font-['Plus_Jakarta_Sans',sans-serif]">

        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <Topbar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          pageTitle={pageTitle}
        />

        {/* Main content area */}
        <main className={`
          pt-[64px] min-h-screen
          transition-all duration-300
          ${collapsed ? 'lg:pl-[70px]' : 'lg:pl-[240px]'}
        `}>
          <div className="p-[16px] sm:p-[24px] lg:p-[28px]">
            <Outlet />
          </div>
        </main>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  )
}