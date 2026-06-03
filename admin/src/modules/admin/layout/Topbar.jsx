// admin/layout/Topbar.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBars, FaTimes, FaUserCircle,
  FaSignOutAlt, FaCog, FaChevronDown,
} from 'react-icons/fa'

export default function Topbar({ collapsed, mobileOpen, setMobileOpen, pageTitle }) {
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)
  const navigate = useNavigate()
  const adminEmail = localStorage.getItem('adminEmail') || '—'

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/admin/login')
  }

  return (
    <header className={`
      fixed top-0 right-0 z-[30] h-[64px]
      bg-white border-b border-slate-100
      shadow-[0_2px_12px_rgba(11,30,75,0.06)]
      flex items-center justify-between
      px-[16px] sm:px-[24px]
      transition-all duration-300
      ${collapsed ? 'left-[70px]' : 'left-[240px]'}
      max-lg:left-0
    `}>
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-[14px]">
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="lg:hidden w-[36px] h-[36px] rounded-[10px] bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#F05A1A] hover:text-white transition-all duration-200"
        >
          {mobileOpen ? <FaTimes className="text-[14px]" /> : <FaBars className="text-[14px]" />}
        </button>
        <div>
          <h2 className="text-[16px] font-extrabold text-[#0B1E4B] m-0 leading-none">{pageTitle}</h2>
          <p className="text-[11px] text-slate-400 m-0 mt-[2px] hidden sm:block">UDI Sports Admin</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-[10px]">
        {/* Settings + Account dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen(o => !o)}
            className="flex items-center gap-[8px] px-[12px] h-[36px] rounded-[10px] bg-slate-100 hover:bg-[#FFF3EC] transition-all duration-200"
          >
            <FaUserCircle className="text-[18px] text-[#0B1E4B]" />
            <span className="text-[13px] font-bold text-[#0B1E4B] hidden sm:block">Admin</span>
            <FaChevronDown className={`text-[10px] text-slate-500 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-[44px] w-[200px] bg-white rounded-[14px] shadow-[0_12px_40px_rgba(11,30,75,0.15)] border border-slate-100 py-[8px] z-[100] animate-[modalIn_0.2s_ease]">
              <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(-8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

              <div className="px-[14px] py-[10px] border-b border-slate-100 mb-[4px]">
                <p className="text-[13px] font-extrabold text-[#0B1E4B] m-0">Admin User</p>
                <p className="text-[11px] text-slate-400 m-0">{adminEmail}</p>
              </div>

              <button
                onClick={() => { navigate('/admin/settings'); setDropOpen(false) }}
                className="w-full flex items-center gap-[10px] px-[14px] py-[9px] text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#0B1E4B] transition-colors text-left"
              >
                <FaCog className="text-[13px] text-slate-400" /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-[10px] px-[14px] py-[9px] text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
              >
                <FaSignOutAlt className="text-[13px]" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}