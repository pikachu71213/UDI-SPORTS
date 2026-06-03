import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight } from 'react-icons/fa'
import { VscInfo } from "react-icons/vsc";

const quickLinks = [
  { label: 'UDIISA Home',                     href: '/' },
  { label: 'General Members',                 href: '/members/general-members' },
  { label: 'Special Members',                 href: '/members/special-members' },
  { label: 'Talented Players',                href: '/talented-players' },
  { label: 'Sports NGO Blogs',                href: '/blogs/' },
  { label: 'Contact UDIISA',                  href: '/contact-us' },
  { label: 'UDIISA Membership Application',   href: '/membership/individual-patron' },
]

const programs = [
  { label: 'Managing Committee', href: '/committee#managing-community' },
  { label: 'About us',           href: '/about-us' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]

const contactInfo = [
  { icon: <FaMapMarkerAlt />, value: '5091, 9th Floor, Tower 5, Parker Residency, Tehsil Rai, District Sonipat, Haryana' },
  { icon: <FaPhone />,        value: '+91 83075 98050' },
  { icon: <FaEnvelope />,     value: 'info@udisports.in' },
]

const socials = [
  { icon: <FaFacebookF />,  href: 'https://www.facebook.com/share/14ZtTFp2Aii/?mibextid=wwXIfr' },
  // { icon: <FaTwitter />,    href: '#' },
  { icon: <FaInstagram />,  href: 'https://www.instagram.com/udiisa_ngo?igsh=MTVhb3J3aWd0cjZxMw%3D%3D&utm_source=qr' },
  { icon: <FaYoutube />,    href: 'https://www.youtube.com/@udisportsin' },
  // { icon: <FaLinkedinIn />, href: '#' },
]

const Footer = () => {
  return (
    <>
      <style>{`
        .f-link {
          transition: color .2s ease, transform .2s ease;
          cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none;
        }
        .f-link:hover { color: #F05A1A !important; transform: translateX(4px); }
        .f-link:hover .f-chevron { color: #F05A1A !important; }

        .soc-btn { transition: all .25s cubic-bezier(.16,1,.3,1); cursor: pointer; }
        .soc-btn:hover {
          background: linear-gradient(135deg,#F05A1A,#FF7D42) !important;
          border-color: transparent !important; color: #fff !important;
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 8px 20px rgba(240,90,26,.4) !important;
        }

        .c-item { transition: transform .2s ease; }
        .c-item:hover { transform: translateX(4px); }
        .c-item:hover .c-icon { color: #FF7D42 !important; }

        @keyframes shim {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .footer-shimmer {
          height: 3px;
          background: linear-gradient(90deg,#F05A1A,#FFAD5C,#F05A1A,#FFAD5C);
          background-size: 300% 100%;
          animation: shim 3s linear infinite;
        }

        @media (max-width: 639px) {
          .footer-links-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }
        }

      `}</style>

      <footer style={{ background: 'linear-gradient(160deg,#0B1E4B 0%,#0d2258 50%,#0B1E4B 100%)' }}>

        <div className="footer-shimmer" />

        <div className="!max-w-[1280px] !mx-auto" style={{ padding: '40px 16px 36px' }}>
          <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-[28px] sm:!gap-[32px] lg:!gap-[40px]">

            {/* Col 1 — Brand */}
            <div className="sm:col-span-2 lg:!col-span-1">
              <a href="/" className="flex items-center gap-3 no-underline" style={{ textDecoration: 'none' }}>
                <img
                  src="/white-logo.webp"
                  alt="UDIISA logo"
                  className="w-full max-w-[180px] sm:max-w-[200px]"
                  decoding="async"
                />
              </a>
              <p className="!mt-[12px] !mb-[16px]" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 280 }}>
               UDIISA Sports NGO (India) is a non-profit organization dedicated to identifying, nurturing, and empowering talented sportspeople across India.
              </p>
              <div className="!flex !items-center !gap-[8px] !flex-wrap">
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    className="soc-btn !flex !items-center !justify-center !rounded-xl !no-underline"
                    style={{ width: 34, height: 34, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.7)', fontSize: 13 }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2+3 — Quick Links + Info */}
            <div className="footer-links-row sm:!contents">
              <div>
                <h4 className="!mt-0 !mb-[12px] sm:!mb-[16px]" style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#fff' }}>
                  Quick Links
                </h4>
                <ul className="!m-0 !p-0 !list-none !flex !flex-col !gap-[9px] sm:!gap-[11px]">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="f-link" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', fontWeight: 500 }}>
                        <FaChevronRight className="f-chevron" style={{ fontSize: 8, color: '#F05A1A', flexShrink: 0 }} />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="!mt-0 !mb-[12px] sm:!mb-[16px]" style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#fff' }}>
                  Info
                </h4>
                <ul className="!m-0 !p-0 !list-none !flex !flex-col !gap-[9px] sm:!gap-[11px]">
                  {programs.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="f-link" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', fontWeight: 500 }}>
                        <FaChevronRight className="f-chevron" style={{ fontSize: 8, color: '#F05A1A', flexShrink: 0 }} />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Col 4 — Contact Info */}
            <div>
              <h4 className="!mt-0 !mb-[12px] sm:!mb-[16px]" style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#fff' }}>
                Contact Info
              </h4>
              <div className="!flex !flex-col !gap-[12px] sm:!gap-[14px]">
                {contactInfo.map((item, i) => (
                  <div key={i} className="c-item !flex !items-start !gap-[10px]">
                    <span className="c-icon !flex-shrink-0 !mt-[2px]" style={{ color: '#F05A1A', fontSize: 13, transition: 'color .2s ease' }}>
                      {item.icon}
                    </span>
                    <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Copyright Bar ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div
            className="!max-w-[1200px] !mx-auto !flex !items-center !justify-between !flex-wrap !gap-[8px]"
            style={{ padding: '12px 16px' }}
          >
            <p className="!m-0" style={{ fontSize: 11.5, color: 'rgba(255,255,255,.3)', fontWeight: 400 }}>
              © {new Date().getFullYear()} UDIISA NGO. All rights reserved.
            </p>
            <p className="!m-0" style={{ fontSize: 11, color: 'rgba(255,255,255,.2)' }}>
              CIN No. U94990HR2026NPL141182
            </p>
          </div>
        </div>

      </footer>
    </>
  )
}

export default Footer