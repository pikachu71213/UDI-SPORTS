import { useState } from 'react'
import { FaAngleDoubleRight, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const contactInfo = [
  {
    icon: <FaMapMarkerAlt />,
    label: 'Our Office',
    value: '5091, 9th Floor, Tower 5, Parker Residency, Tehsil Rai, District Sonipat, Haryana',
    color: '#F05A1A',
    bg: 'rgba(240,90,26,.08)',
  },
  {
    icon: <FaPhone />,
    label: 'Phone',
    value: '+91 83075 98050',
    color: '#1a6b3a',
    bg: 'rgba(26,107,58,.08)',
  },
  {
    icon: <FaEnvelope />,
    label: 'Email',
    value: 'info@udisports.in',
    color: '#2563eb',
    bg: 'rgba(37,99,235,.08)',
  },
]

export default function ContactUs() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState('')
  const navigate = useNavigate()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({
      name:    form.name.trim(),
      email:   form.email.trim(),
      message: form.message.trim(),
    })
    // Navigate to full contact page with pre-filled data
    navigate(`/contact-us?${params.toString()}`)
  }

  return (
    <>
      <style>{`
        .hc-input, .hc-textarea {
          outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color .25s, box-shadow .25s;
        }
        .hc-input:focus, .hc-textarea:focus {
          border-color: #F05A1A !important;
          box-shadow: 0 0 0 3px rgba(240,90,26,.12) !important;
        }
        .hc-input::placeholder, .hc-textarea::placeholder {
          color: #94a3b8;
          font-size: 13px;
        }
        .hc-info-item { transition: transform .25s ease; }
        .hc-info-item:hover { transform: translateX(5px); }
        .hc-info-icon {
          transition: transform .3s cubic-bezier(.16,1,.3,1), background .25s;
          flex-shrink: 0;
        }
        .hc-info-item:hover .hc-info-icon {
          transform: scale(1.12) rotate(-6deg);
          background: linear-gradient(135deg,#F05A1A,#FF7D42) !important;
          box-shadow: 0 8px 24px rgba(240,90,26,.35) !important;
        }
        .hc-info-item:hover .hc-info-icon svg { color: #fff !important; }

        .hc-btn {
          position: relative; overflow: hidden;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .hc-btn::after {
          content:''; position:absolute; top:0; left:-80%;
          width:60%; height:100%;
          background:linear-gradient(120deg,transparent,rgba(255,255,255,.22),transparent);
          transform:skewX(-15deg); transition:left .4s ease;
        }
        .hc-btn:hover::after { left:130%; }
        .hc-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(240,90,26,.45) !important;
        }
        .hc-btn:hover .hc-arrow { transform:translateX(4px); }
        .hc-arrow { transition:transform .25s; }
      `}</style>

      <section style={{
        background: '#fff',
        padding: 'clamp(32px,6vw,80px) clamp(16px,4vw,32px)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            gap: 'clamp(28px,6vw,80px)',
          }}>

            {/* ── LEFT: Info ── */}
            <div style={{ flex: '1 1 300px' }}>

              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '4px 14px', borderRadius: 50,
                border: '1.5px solid rgba(240,90,26,.4)',
                background: 'rgba(240,90,26,.05)',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '2.5px', textTransform: 'uppercase',
                color: '#F05A1A', marginBottom: 14,
              }}>
                Get In Touch
              </div>

              <h2 style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(30px,5.5vw,58px)',
                letterSpacing: 2, lineHeight: 1.05,
                color: '#0B1E4B', margin: 0,
              }}>
                Let's Start A<br />
                <span style={{ color: '#F05A1A' }}>Conversation</span>
              </h2>

              {/* Animated accent bar */}
              <div style={{
                width: 48, height: 4, borderRadius: 3,
                background: 'linear-gradient(90deg,#F05A1A,#FF7D42)',
                margin: '14px 0 18px',
              }} />

              <p style={{
                fontSize: 'clamp(13px,1.4vw,15px)',
                color: '#475569', lineHeight: 1.7,
                maxWidth: 400, marginBottom: 28,
              }}>
                Have a question or want to partner with us? We'd love to hear from you. Fill in the quick form and we'll take it from there.
              </p>

              {/* Contact info items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {contactInfo.map((item, i) => (
                  <div key={i} className="hc-info-item"
                       style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div className="hc-info-icon"
                         style={{
                           width: 40, height: 40, borderRadius: 12,
                           background: item.bg,
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                         }}>
                      <span style={{ color: item.color, fontSize: 15 }}>{item.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0B1E4B',
                        letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55 }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Quick Form ── */}
            <div style={{ flex: '1 1 320px' }}>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(18px,2.5vw,28px)',
                fontWeight: 800, color: '#F05A1A',
                margin: '0 0 20px',
              }}>
                Quick Message
              </h3>

              <form onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    type="text" placeholder="Your Name" required
                    value={form.name} onChange={e => set('name', e.target.value)}
                    className="hc-input"
                    style={{
                      padding: '11px 14px', borderRadius: 12,
                      border: '1.5px solid rgba(240,90,26,.3)',
                      fontSize: 13, color: '#0B1E4B', background: '#fff',
                      width: '100%', boxSizing: 'border-box',
                    }}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                  />
                  <input
                    type="email" placeholder="Your Email" required
                    value={form.email} onChange={e => set('email', e.target.value)}
                    className="hc-input"
                    style={{
                      padding: '11px 14px', borderRadius: 12,
                      border: '1.5px solid rgba(240,90,26,.3)',
                      fontSize: 13, color: '#0B1E4B', background: '#fff',
                      width: '100%', boxSizing: 'border-box',
                    }}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                  />
                </div>

                {/* Message */}
                <textarea
                  placeholder="Your Message..." rows={4} required
                  value={form.message} onChange={e => set('message', e.target.value)}
                  className="hc-textarea"
                  style={{
                    padding: '11px 14px', borderRadius: 12,
                    border: '1.5px solid rgba(240,90,26,.3)',
                    fontSize: 13, color: '#0B1E4B', background: '#fff',
                    resize: 'none', width: '100%', boxSizing: 'border-box',
                  }}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused('')}
                />

                {/* Note */}
                <p style={{
                  fontSize: 12, color: '#94a3b8', margin: 0,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 14 }}>💬</span>
                  You'll be taken to the full form to complete your details.
                </p>

                {/* Submit */}
                <button type="submit" className="hc-btn"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          alignSelf: 'flex-start',
                          padding: '12px 28px', borderRadius: 12, border: 'none',
                          background: 'linear-gradient(135deg,#F05A1A,#FF7D42)',
                          color: '#fff', fontSize: 13.5, fontWeight: 700,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          cursor: 'pointer',
                          boxShadow: '0 6px 20px rgba(240,90,26,.32)',
                          letterSpacing: '0.3px',
                        }}>
                  Continue to Full Form
                  <FaAngleDoubleRight className="hc-arrow" style={{ fontSize: 13 }} />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}