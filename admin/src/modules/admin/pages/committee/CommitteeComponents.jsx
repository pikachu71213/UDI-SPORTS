// ═══════════════════════════════════════════════════════════════════════════════
//  CommitteeComponents.jsx
//  Feature Components: CommitteeModal · AddMemberForm · EditMemberForm
//                      MemberRow · MembersPanel · CommitteeItem
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef } from "react"
import {
  Ic, VARIANTS, EMOJIS,
  hex, slugify, inits,
  Spin, Btn, Input, Field, ConfirmDialog,
} from "./Committeeutils"

// ─── Committee Form Modal ─────────────────────────────────────────────────────
export function CommitteeModal({ initial, onSave, onClose, saving }) {
  const isEdit = !!initial
  const [f, setF] = useState(
    initial ? {...initial} : { label:"", shortLabel:"", slug:"", icon:"🏛️", role:"", description:"", cardVariant:"orange" }
  )
  const [err, setErr]     = useState({})
  const [emojiOpen, setEmojiOpen] = useState(false)

  const set = (k, v) => {
    setF(p => {
      const n = {...p, [k]:v}
      if (k==="label" && !isEdit) {
        n.slug = slugify(v)
        if (!p.shortLabel) n.shortLabel = v.split(" ").slice(0,2).join(" ")
      }
      return n
    })
    setErr(e => ({...e, [k]:undefined}))
  }

  const submit = () => {
    const e = {}
    if (!f.label.trim())      e.label      = "Required"
    if (!f.shortLabel.trim()) e.shortLabel = "Required"
    if (!f.slug.trim())       e.slug       = "Required"
    if (!f.role.trim())       e.role       = "Required"
    if (Object.keys(e).length) { setErr(e); return }
    onSave(f)
  }

  const selV = VARIANTS.find(v => v.value === f.cardVariant)

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[9980] bg-[rgba(11,30,75,.48)] backdrop-blur-[10px] flex items-center justify-center !p-4"
    >
      <div className="bg-white rounded-[28px] w-full max-w-xl max-h-[93vh] flex flex-col shadow-[0_32px_100px_rgba(0,0,0,.24)] overflow-hidden">

        {/* Header */}
        <div className="!px-7 !pt-5 !pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="!m-0 text-[17px] font-extrabold text-[#0B1E4B] font-[Plus_Jakarta_Sans,sans-serif]">
              {isEdit ? "Edit Committee" : "Add New Committee"}
            </h2>
            <p className="!m-0 !mt-0.5 text-xs text-slate-400 font-[Plus_Jakarta_Sans,sans-serif]">All starred fields are required</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-[10px] border-none bg-slate-50 cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <div className="w-4 h-4"><Ic.X /></div>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto !px-7 !py-5 flex flex-col gap-4 admin-scroll">

          {/* Icon + Name */}
          <div className="flex gap-3 items-start">

<div className="relative w-[50%]">

  {/* ── Label ── */}
  <p className="!m-0 !mb-1.5 text-[11px] font-extrabold text-[#0B1E4B] uppercase tracking-[1px]">
    Icon
  </p>

  {/* ── Trigger button — looks like a select/dropdown ── */}
  <button
    type="button"
    onClick={() => setEmojiOpen(p => !p)}
    className={`
      w-full h-[42px] flex items-center justify-between gap-2
      px-3 rounded-[10px] border-[1.5px] bg-white
      text-[13.5px] font-medium cursor-pointer
      transition-all duration-200
      ${emojiOpen
        ? 'border-[#F05A1A] ring-2 ring-[#F05A1A]/10'
        : 'border-slate-200 hover:border-slate-300'}
    `}
  >
    {/* Left: selected emoji + label */}
    <span className="flex items-center gap-2">
      <span className="text-[20px] leading-none">{f.icon}</span>
      <span className="text-[13px] text-slate-500">
        {f.icon ? 'Change icon' : 'Select an icon'}
      </span>
    </span>

    {/* Right: chevron */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${emojiOpen ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>

  {/* ── Dropdown panel ── */}
  {emojiOpen && (
    <div
      className="
        absolute top-[calc(100%+6px)] left-0 z-30
        bg-white rounded-[16px]
        shadow-[0_12px_40px_rgba(0,0,0,0.13)]
        border border-slate-200
        p-3 w-full min-w-[260px]
      "
    >
      {/* Header */}
      <p className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-[1px] m-0 mb-2 px-1">
        Choose an icon
      </p>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-1">
        {EMOJIS.map(em => (
          <button
            key={em}
            type="button"
            onClick={() => { set("icon", em); setEmojiOpen(false) }}
            title={em}
            className={`
              w-full aspect-square rounded-[8px] text-[18px]
              flex items-center justify-center
              border transition-all duration-150 cursor-pointer
              ${f.icon === em
                ? 'bg-[#FFF3EC] border-[#F05A1A] shadow-[0_0_0_2px_rgba(240,90,26,.15)]'
                : 'bg-transparent border-transparent hover:bg-slate-100 hover:border-slate-200'}
            `}
          >
            {em}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
            <Field label="Committee Name *" error={err.label}>
              <div className="flex-1 min-w-0 w-full">
                <Input value={f.label} onChange={e => set("label", e.target.value)} placeholder="e.g. Managing Community" error={err.label} className="w-full"/>
              </div>
            </Field>
          </div>

          {/* Short Label + Slug */}
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Short Label *" error={err.shortLabel}>
              <Input value={f.shortLabel} onChange={e => set("shortLabel", e.target.value)} placeholder="Managing" error={err.shortLabel}/>
            </Field>
            <Field label="Slug *" error={err.slug}>
              <Input value={f.slug} onChange={e => set("slug", slugify(e.target.value))} placeholder="managing-community" error={err.slug}/>
            </Field>
          </div>

          {/* Role */}
          <Field label="Role / Division *" error={err.role}>
            <Input value={f.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Strategic Leadership & Governance" error={err.role}/>
          </Field>

          {/* Description */}
          <Field label="Description">
            <Input multiline value={f.description} onChange={e => set("description", e.target.value)} placeholder="Brief description of this committee..."/>
          </Field>

          {/* Card Variant */}
          <Field label="Card Color Variant">
            <div className="flex flex-wrap gap-2 !mb-2.5">
              {VARIANTS.map(v => {
                const active = f.cardVariant === v.value
                return (
                  <button
                    key={v.value}
                    onClick={() => set("cardVariant", v.value)}
                    className="flex items-center gap-1.5 !px-3.5 !py-1.5 rounded-full border-2 text-xs font-bold cursor-pointer transition-all duration-150 font-[Plus_Jakarta_Sans,sans-serif]"
                    style={{ borderColor:active?v.hex:"#E2E8F0", background:active?v.hex:"#fff", color:active?"#fff":"#475569" }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:active?"rgba(255,255,255,.55)":v.hex}}/>
                    {v.label}
                  </button>
                )
              })}
            </div>
            {/* Live preview */}
            <div className="!px-3.5 !py-2.5 rounded-xl flex items-center gap-2.5" style={{background:`${selV?.hex}12`, border:`1.5px solid ${selV?.hex}30`}}>
              <span className="text-xl">{f.icon}</span>
              <div>
                <p className="!m-0 text-xs font-extrabold font-[Plus_Jakarta_Sans,sans-serif]" style={{color:selV?.hex}}>Preview — {selV?.label} variant</p>
                <p className="!m-0 text-[11px] text-slate-500 font-[Plus_Jakarta_Sans,sans-serif]">{f.label||"Committee Name"} · {f.role||"Role"}</p>
              </div>
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="!px-7 !py-4 border-t border-slate-100 flex gap-3 justify-end flex-shrink-0">
          <Btn ghost onClick={onClose}>Cancel</Btn>
          <Btn primary onClick={submit} busy={saving}>{isEdit ? "Save Changes" : "Create Committee"}</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Add Member Form ──────────────────────────────────────────────────────────
export function AddMemberForm({ accentHex, onAdd, onCancel }) {
  const [f,    setF]   = useState({ name:"", role:"Member", company:"", image:null })
  const [err,  setErr] = useState({})
  const [busy, setBusy]= useState(false)
  const [prev, setPrev]= useState(null)
  const ref = useRef()

  const set = (k, v) => { setF(p => ({...p, [k]:v})); setErr(e => ({...e, [k]:undefined})) }

  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return
    const rd = new FileReader()
    rd.onload = ev => { setPrev(ev.target.result); set("image", ev.target.result) }
    rd.readAsDataURL(file)
  }

  const submit = async () => {
    const e = {}
    if (!f.name.trim()) e.name = "Required"
    if (!f.role.trim()) e.role = "Required"
    if (Object.keys(e).length) { setErr(e); return }
    setBusy(true)
    try { await onAdd(f) } finally { setBusy(false) }
  }

  return (
    <div className="bg-slate-50 rounded-[18px] !p-4 border-[1.5px] border-dashed border-slate-300 !mb-1">
      <p className="!m-0 !mb-3.5 text-[11px] font-extrabold text-[#0B1E4B] tracking-widest uppercase font-[Plus_Jakarta_Sans,sans-serif]">Add New Member</p>

      <div className="flex items-center gap-3.5 !mb-3.5">
        <div
          onClick={() => ref.current.click()}
          className="w-14 h-14 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-white flex-shrink-0"
          style={{border:`2px dashed ${accentHex}55`}}
        >
          {prev
            ? <img src={prev} className="w-full h-full object-cover" alt=""/>
            : <div className="text-slate-400 w-4.5 h-4.5"><Ic.Upload /></div>
          }
        </div>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
        <div>
          <p className="!m-0 text-xs font-semibold text-slate-500 font-[Plus_Jakarta_Sans,sans-serif]">Upload photo</p>
          <p className="!m-0 !mt-0.5 text-[11px] text-slate-400 font-[Plus_Jakarta_Sans,sans-serif]">Optional · JPG, PNG</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <Field error={err.name}>
          <Input value={f.name} onChange={e => set("name", e.target.value)} placeholder="Full Name *" error={err.name}/>
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field error={err.role}>
            <Input value={f.role} onChange={e => set("role", e.target.value)} placeholder="Role *" error={err.role}/>
          </Field>
          <Input value={f.company} onChange={e => set("company", e.target.value)} placeholder="Company (optional)"/>
        </div>
      </div>

      <div className="flex gap-2.5 justify-end !mt-3.5">
        <Btn ghost small onClick={onCancel}>Cancel</Btn>
        <Btn small accentHex={accentHex} onClick={submit} busy={busy}>Add Member</Btn>
      </div>
    </div>
  )
}

// ─── Edit Member Form ─────────────────────────────────────────────────────────
export function EditMemberForm({ member, accentHex, onSave, onCancel }) {
  const [f,    setF]   = useState({ name:member.name, role:member.role, company:member.company||"", image:member.image||null })
  const [err,  setErr] = useState({})
  const [busy, setBusy]= useState(false)
  const [prev, setPrev]= useState(member.image||null)
  const ref = useRef()

  const set = (k, v) => { setF(p => ({...p, [k]:v})); setErr(e => ({...e, [k]:undefined})) }

  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return
    const rd = new FileReader()
    rd.onload = ev => { setPrev(ev.target.result); set("image", ev.target.result) }
    rd.readAsDataURL(file)
  }

  const submit = async () => {
    const e = {}
    if (!f.name.trim()) e.name = "Required"
    if (!f.role.trim()) e.role = "Required"
    if (Object.keys(e).length) { setErr(e); return }
    setBusy(true)
    try { await onSave(f) } finally { setBusy(false) }
  }

  return (
    <div className="bg-blue-50 rounded-[18px] !p-4 border-[1.5px] border-blue-200 !mb-1">
      <p className="!m-0 !mb-3.5 text-[11px] font-extrabold text-[#0B1E4B] tracking-widest uppercase font-[Plus_Jakarta_Sans,sans-serif]">Edit Member</p>

      <div className="flex items-center gap-3.5 !mb-3.5">
        <div
          onClick={() => ref.current.click()}
          className="w-14 h-14 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-white flex-shrink-0 relative group"
          style={{border:`2px dashed ${accentHex}55`}}
        >
          {prev
            ? <img src={prev} className="w-full h-full object-cover" alt=""/>
            : <div className="text-slate-400 w-5 h-5"><Ic.Upload /></div>
          }
          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-white w-4 h-4"><Ic.Upload /></div>
          </div>
        </div>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
        <div>
          <p className="!m-0 text-xs font-semibold text-slate-500 font-[Plus_Jakarta_Sans,sans-serif]">Change photo</p>
          <p className="!m-0 !mt-0.5 text-[11px] text-slate-400 font-[Plus_Jakarta_Sans,sans-serif]">Optional · JPG, PNG</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <Field error={err.name}>
          <Input value={f.name} onChange={e => set("name", e.target.value)} placeholder="Full Name *" error={err.name}/>
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field error={err.role}>
            <Input value={f.role} onChange={e => set("role", e.target.value)} placeholder="Role *" error={err.role}/>
          </Field>
          <Input value={f.company} onChange={e => set("company", e.target.value)} placeholder="Company (optional)"/>
        </div>
      </div>

      <div className="flex gap-2.5 justify-end !mt-3.5">
        <Btn ghost small onClick={onCancel}>Cancel</Btn>
        <Btn small accentHex={accentHex} onClick={submit} busy={busy}>
          <div className="w-3 h-3"><Ic.Check /></div>
          Save Changes
        </Btn>
      </div>
    </div>
  )
}

// ─── Member Row ───────────────────────────────────────────────────────────────
export function MemberRow({ member, accentHex, onDelete, onEdit }) {
  const [hov,     setHov]    = useState(false)
  const [delBusy, setDelBusy]= useState(false)
  const [editing, setEditing]= useState(false)

  const del        = async ()       => { setDelBusy(true); try { await onDelete(member._id) } finally { setDelBusy(false) } }
  const handleSave = async (data)   => { await onEdit(member._id, data); setEditing(false) }

  if (editing) {
    return <EditMemberForm member={member} accentHex={accentHex} onSave={handleSave} onCancel={() => setEditing(false)}/>
  }

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className={`flex items-center gap-3 !px-3.5 !py-2.5 rounded-2xl border transition-all duration-150 ${hov ? "bg-white border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,.06)]" : "bg-slate-50 border-slate-100"}`}
    >
      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-[13px] font-extrabold font-[Plus_Jakarta_Sans,sans-serif]"
        style={{background:`linear-gradient(135deg,${accentHex},${accentHex}99)`}}
      >
        {member.image
          ? <img src={member.image} alt={member.name} className="w-full h-full object-cover"/>
          : inits(member.name)
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="!m-0 text-[13.5px] font-bold text-slate-800 font-[Plus_Jakarta_Sans,sans-serif] whitespace-nowrap overflow-hidden text-ellipsis">{member.name}</p>
        <p className="!m-0 !mt-0.5 text-[11.5px] text-slate-400 font-[Plus_Jakarta_Sans,sans-serif] whitespace-nowrap overflow-hidden text-ellipsis">
          {member.role}{member.company ? ` · ${member.company}` : ""}
        </p>
      </div>

      {/* Edit + Delete */}
      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => setEditing(true)}
          className={`w-8 h-8 rounded-xl border-none cursor-pointer flex items-center justify-center transition-all duration-150 ${hov ? "bg-blue-50 text-blue-500" : "bg-transparent text-transparent"}`}
          title="Edit member"
        >
          <div className="w-3.5 h-3.5"><Ic.Edit /></div>
        </button>
        <button
          onClick={del} disabled={delBusy}
          className={`w-8 h-8 rounded-xl border-none cursor-pointer flex items-center justify-center transition-all duration-150 flex-shrink-0 ${hov ? "bg-red-50 text-red-500" : "bg-transparent text-transparent"} ${delBusy ? "opacity-60" : ""}`}
          title="Delete member"
        >
          {delBusy ? <Spin size={14} color="#EF4444"/> : <div className="w-3.5 h-3.5"><Ic.Trash /></div>}
        </button>
      </div>
    </div>
  )
}

// ─── Members Panel ────────────────────────────────────────────────────────────
export function MembersPanel({ committee, onMemberAdded, onMemberDeleted, onMemberUpdated }) {
  const [showAdd,    setShowAdd]    = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)
  const [delBusy,    setDelBusy]    = useState(false)
  const accentHex = hex(committee.cardVariant)

  const handleAdd = async (data) => { await onMemberAdded(committee._id, data); setShowAdd(false) }
  const handleDel = async () => {
    setDelBusy(true)
    try { await onMemberDeleted(committee._id, confirmDel) }
    finally { setDelBusy(false); setConfirmDel(null) }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Panel topbar */}
      <div className="!px-4 sm:!px-6 !pt-4 !pb-3 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:`${accentHex}15`}}>
            {committee.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="!m-0 text-[15px] font-extrabold text-[#0B1E4B] font-[Plus_Jakarta_Sans,sans-serif] whitespace-nowrap overflow-hidden text-ellipsis">{committee.label}</h3>
            <p className="!m-0 !mt-0.5 text-xs text-slate-400 font-[Plus_Jakarta_Sans,sans-serif]">{committee.role}</p>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
            <span className="!px-3 !py-1 rounded-full text-xs font-bold font-[Plus_Jakarta_Sans,sans-serif]" style={{background:`${accentHex}15`, color:accentHex}}>
              {committee.members.length} {committee.members.length===1 ? "member" : "members"}
            </span>
            <Btn small accentHex={showAdd ? "#64748B" : accentHex} onClick={() => setShowAdd(p => !p)}>
              <div className="w-3.5 h-3.5">{showAdd ? <Ic.X/> : <Ic.Plus/>}</div>
              {showAdd ? "Cancel" : "Add Member"}
            </Btn>
          </div>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto !px-4 sm:!px-6 !py-3.5 flex flex-col gap-2 admin-scroll">
        {showAdd && (
          <AddMemberForm accentHex={accentHex} onAdd={handleAdd} onCancel={() => setShowAdd(false)}/>
        )}

        {committee.members.length===0 && !showAdd ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 !py-16 text-center">
            <div className="w-14 h-14 rounded-[18px] bg-slate-50 flex items-center justify-center text-slate-300">
              <div className="w-7 h-7"><Ic.Users /></div>
            </div>
            <p className="!m-0 text-[14px] font-bold text-slate-400 font-[Plus_Jakarta_Sans,sans-serif]">No members yet</p>
            <p className="!m-0 text-xs text-slate-300 font-[Plus_Jakarta_Sans,sans-serif]">Click "Add Member" above to get started</p>
          </div>
        ) : (
          committee.members.map(m => (
            <MemberRow
              key={m._id} member={m} accentHex={accentHex}
              onDelete={() => setConfirmDel(m._id)}
              onEdit={(mid, data) => onMemberUpdated(committee._id, mid, data)}
            />
          ))
        )}
      </div>

      {confirmDel && (
        <ConfirmDialog
          title="Remove Member"
          msg={`Remove "${committee.members.find(m => m._id===confirmDel)?.name}" from ${committee.label}? This cannot be undone.`}
          busy={delBusy}
          onConfirm={handleDel}
          onCancel={() => setConfirmDel(null)}
        />
      )}
    </div>
  )
}

// ─── Committee Sidebar Item ───────────────────────────────────────────────────
export function CommitteeItem({ committee, active, onClick, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const accentHex = hex(committee.cardVariant)
  const v = VARIANTS.find(x => x.value === committee.cardVariant)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`flex items-center gap-2.5 !px-3 !py-2.5 rounded-2xl cursor-pointer transition-all duration-200 border ${active ? "bg-white border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,.08)]" : hov ? "bg-white border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,.04)]" : "border-transparent"}`}
    >
      {/* Active bar */}
      <div className="w-0.5 h-7 rounded-sm flex-shrink-0 transition-colors duration-200" style={{background:active?accentHex:"transparent"}}/>
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-colors duration-200" style={{background:active?`${accentHex}15`:"#F8FAFC"}}>
        {committee.icon}
      </div>
      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className={`!m-0 text-[13px] font-bold font-[Plus_Jakarta_Sans,sans-serif] whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ${active ? "text-[#0B1E4B]" : "text-slate-500"}`}>
          {committee.label}
        </p>
        <div className="flex items-center gap-1.5 !mt-0.5">
          <span className="text-[11px] text-slate-400 font-[Plus_Jakarta_Sans,sans-serif]">{committee.members.length} members</span>
          <span className="text-[9px] !px-2 !py-0.5 rounded-full font-bold font-[Plus_Jakarta_Sans,sans-serif]" style={{background:`${accentHex}18`, color:accentHex}}>{v?.label}</span>
        </div>
      </div>
      {/* Edit / Delete */}
      {(hov || active) && (
        <div className="flex gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
          {[
            { icon:<Ic.Edit/>,  fn:onEdit,   hc:"#3B82F6", hbg:"#EFF6FF" },
            { icon:<Ic.Trash/>, fn:onDelete, hc:"#EF4444", hbg:"#FEF2F2" },
          ].map((b, i) => (
            <button
              key={i} onClick={b.fn}
              className="w-7 h-7 rounded-lg border-none bg-transparent text-slate-400 cursor-pointer flex items-center justify-center transition-all duration-150"
              onMouseEnter={e => { e.currentTarget.style.background=b.hbg; e.currentTarget.style.color=b.hc }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#94A3B8" }}
            >
              <div className="w-3.5 h-3.5">{b.icon}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}