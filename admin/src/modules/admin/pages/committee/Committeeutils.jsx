// ═══════════════════════════════════════════════════════════════════════════════
//  committeeUtils.jsx
//  Shared: Icons · Constants · Helpers · Primitive UI (Spin, Toast, ConfirmDialog, Btn, Input, Field)
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from "react"

// ─── SVG Icons ────────────────────────────────────────────────────────────────
export const Ic = {
  Plus:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  X:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Users:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Warn:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Menu:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Back:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const VARIANTS = [
  { value:"orange", label:"Orange", hex:"#F05A1A" },
  { value:"purple", label:"Purple", hex:"#7C3AED" },
  { value:"blue",   label:"Blue",   hex:"#0EA5E9" },
  { value:"green",  label:"Green",  hex:"#10B981" },
  { value:"amber",  label:"Amber",  hex:"#F59E0B" },
  { value:"red",    label:"Red",    hex:"#EF4444" },
  { value:"indigo", label:"Indigo", hex:"#6366F1" },
  { value:"teal",   label:"Teal",   hex:"#14B8A6" },
  { value:"lime",   label:"Lime",   hex:"#84CC16" },
]

export const EMOJIS = ["🏛️","👑","🌐","🚀","🤝","🏆","⚖️","🏥","⚽","🎯","💼","📋","🌟","🔬","🏗️","🎓","💰","📢","🛡️","🌍","🏋️","🎪","🧬","💡","🏄","🎨","🎖️","🧩","🏇","🎻"]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const hex     = (v) => VARIANTS.find(x => x.value === v)?.hex || "#F05A1A"
export const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")
export const inits   = (n) => { const p = n.trim().split(/\s+/); return p.length===1 ? p[0].slice(0,2).toUpperCase() : (p[0][0]+p[p.length-1][0]).toUpperCase() }

// ─── Spin ─────────────────────────────────────────────────────────────────────
export const Spin = ({ size=18, color="#F05A1A" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin block flex-shrink-0">
    <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="3" strokeOpacity=".2"/>
    <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ data }) {
  if (!data) return null
  const colors = { success:"bg-emerald-500", error:"bg-red-500", info:"bg-[#0B1E4B]" }
  return (
    <div className={`fixed bottom-6 right-4 sm:right-6 z-[9999] ${colors[data.type]||colors.info} text-white rounded-2xl !px-5 !py-3 text-[13px] font-bold flex items-center gap-2.5 shadow-2xl font-[Plus_Jakarta_Sans,sans-serif] animate-[toastIn_.3s_cubic-bezier(.16,1,.3,1)]`}>
      <span className="w-4 h-4 flex flex-shrink-0"><Ic.Check /></span>
      {data.msg}
    </div>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ title, msg, onConfirm, onCancel, busy }) {
  return (
    <div className="fixed inset-0 z-[9990] bg-[rgba(11,30,75,.52)] backdrop-blur-md flex items-center justify-center !p-4">
      <div className="bg-white rounded-3xl !p-7 max-w-sm w-full shadow-2xl">
        <div className="flex gap-3.5 items-start !mb-5">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
            <div className="w-5 h-5"><Ic.Warn /></div>
          </div>
          <div>
            <p className="!m-0 text-[15px] font-extrabold text-[#0B1E4B] font-[Plus_Jakarta_Sans,sans-serif]">{title}</p>
            <p className="!m-0 !mt-1.5 text-[13px] text-slate-500 font-[Plus_Jakarta_Sans,sans-serif] leading-relaxed">{msg}</p>
          </div>
        </div>
        <div className="flex gap-2.5 justify-end">
          <Btn ghost onClick={onCancel}>Cancel</Btn>
          <Btn danger onClick={onConfirm} busy={busy}>Delete</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, ghost, danger, busy, primary, accentHex, small, disabled, fullWidth }) {
  const base = `inline-flex items-center justify-center gap-2 rounded-xl border-none font-bold cursor-pointer font-[Plus_Jakarta_Sans,sans-serif] transition-all duration-150 ${fullWidth?"w-full":""} ${(busy||disabled)?"opacity-60 cursor-not-allowed":""} ${small?"!text-xs !px-3.5 !py-1.5":"!text-[13px] !px-5 !py-2.5"}`
  const variant = danger  ? "bg-red-500 hover:bg-red-600 text-white"
                : ghost   ? "bg-slate-100 hover:bg-slate-200 text-slate-500"
                : primary ? "text-white shadow-[0_4px_14px_rgba(240,90,26,.35)] hover:-translate-y-px"
                : "bg-slate-100 hover:bg-slate-200 text-slate-500"
  const bgStyle = primary   ? { background:"linear-gradient(135deg,#F05A1A,#FF7D42)" }
                : accentHex ? { background:accentHex, color:"#fff", boxShadow:`0 4px 14px ${accentHex}40` }
                : {}
  return (
    <button onClick={onClick} disabled={busy||disabled} className={`${base} ${variant}`} style={bgStyle}>
      {busy && <Spin size={13} color={danger||primary||accentHex?"#fff":"#94A3B8"} />}
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, error, multiline, rows=3 }) {
  const cls = `w-full !px-3.5 !py-2.5 rounded-xl border-[1.5px] text-[13px] text-slate-800 outline-none font-[Plus_Jakarta_Sans,sans-serif] bg-white transition-colors duration-200 resize-y leading-relaxed ${error?"border-red-400":"border-slate-200 focus:border-slate-400"}`
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={cls} />
    : <input    value={value} onChange={onChange} placeholder={placeholder} className={cls} />
}

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({ label, error, children }) {
  return (
    <div>
      {label && <p className="!m-0 !mb-1.5 text-[11px] font-extrabold text-[#0B1E4B] tracking-widest uppercase font-[Plus_Jakarta_Sans,sans-serif]">{label}</p>}
      {children}
      {error  && <p className="!m-0 !mt-1 text-[11px] text-red-500 font-[Plus_Jakarta_Sans,sans-serif]">{error}</p>}
    </div>
  )
}