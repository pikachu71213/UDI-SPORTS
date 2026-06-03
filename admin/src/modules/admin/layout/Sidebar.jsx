// admin/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  MdDashboard, MdPeople, MdStar, MdEmail,
  MdArticle, MdSettings, MdSportsCricket, MdSportsScore 
} from 'react-icons/md'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'

const logo = `${import.meta.env.BASE_URL}white-short-logo.webp`
const fallbackLogo = `${import.meta.env.BASE_URL}short-logo.webp`

const NAV = [
  {
    to: '/admin/dashboard',
    icon: <MdDashboard />,
    label: 'Dashboard',
  },
  {
    label: 'Community', icon: <MdPeople />, isGroup: true,
    children: [
      { to: '/admin/members/general',  label: 'General Members' },
      { to: '/admin/players',          label: 'Talented Players' },
    ],
  },
  {
    to: '/admin/members/special',
    icon: <MdStar />,
    label: 'Special Members',
  },
  {
    to: '/admin/committees',
    icon: <MdPeople />,
    label: 'Committees',
  },
  {
  label: 'Events',
  icon:  <MdSportsScore />,
  to:  '/admin/events',
},
  {
    to: '/admin/blogs',
    icon: <MdArticle />,
    label: 'Blog Management',
  },
  {
    label: 'Incoming', icon: <MdEmail />, isGroup: true,
    children: [
      { to: '/admin/incoming/members',  label: 'Member Forms' },
      { to: '/admin/incoming/contacts', label: 'Contact Forms' },
    ],
  },
  {
    to: '/admin/settings',
    icon: <MdSettings />,
    label: 'Settings',
  },
]

function NavGroup({ item, collapsed }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="
          w-full flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px]
          text-white/60 hover:text-white hover:bg-white/10
          transition-all duration-200 text-left
        "
      >
        <span className="text-[18px] flex-shrink-0">{item.icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 text-[13px] font-semibold">{item.label}</span>
            <span className="text-[10px] transition-transform duration-200" style={{ display: 'inline-block', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="ml-[28px] flex flex-col gap-[2px] mt-[2px]">
          {item.children.map(child => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) => `
                block px-[12px] py-[8px] rounded-[8px] text-[12.5px] font-semibold
                transition-all duration-200 no-underline
                ${isActive
                  ? 'bg-[#F05A1A] text-white shadow-[0_4px_12px_rgba(240,90,26,0.35)]'
                  : 'text-white/55 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[40] bg-[rgba(7,20,46,0.5)] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-[50]
        bg-gradient-to-b from-[#07142e] via-[#0B1E4B] to-[#0f2560]
        flex flex-col
        transition-all duration-300 ease-in-out
        shadow-[4px_0_24px_rgba(11,30,75,0.25)]
        ${collapsed ? 'w-[70px]' : 'w-[240px]'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`
          flex items-center gap-[10px] px-[16px] py-[18px]
          border-b border-white/10 flex-shrink-0
          ${collapsed ? 'justify-center' : ''}
        `}>
          <img
            src={logo}
            alt="logo"
            className="w-full max-w-[45px]"
            onError={(e) => {
              // Fallback for environments where white logo is missing.
              e.currentTarget.src = fallbackLogo
            }}
          />
          {!collapsed && (
            <div>
              <p className="text-white font-extrabold text-[14px] m-0 leading-none">UDIISA</p>
              <p className="text-white/40 text-[10px] m-0 mt-[2px]">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-[10px] py-[14px] flex flex-col gap-[4px]">
          {NAV.map((item, i) =>
            item.isGroup ? (
              <NavGroup key={i} item={item} collapsed={collapsed} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px]
                  no-underline transition-all duration-200
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-[#F05A1A] text-white shadow-[0_4px_14px_rgba(240,90,26,0.38)]'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
                title={collapsed ? item.label : ''}
              >
                <span className="text-[18px] flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-[13px] font-semibold">{item.label}</span>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="px-[10px] py-[14px] border-t border-white/10 hidden lg:block">
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`
              w-full flex items-center gap-[10px] px-[14px] py-[9px] rounded-[10px]
              text-white/50 hover:text-white hover:bg-white/10
              transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {collapsed
              ? <FaChevronRight className="text-[12px]" />
              : <><FaChevronLeft className="text-[12px]" /><span className="text-[12px] font-semibold">Collapse</span></>
            }
          </button>
        </div>
      </aside>
    </>
  )
}