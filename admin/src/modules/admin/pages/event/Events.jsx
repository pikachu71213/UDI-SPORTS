import { useState, useMemo, useRef, useEffect } from 'react'
import eventService from './Eventservice'
import {
  FaPlus, FaSearch, FaCrown, FaUsers, FaEdit, FaTrash,
  FaTimes, FaChevronRight, FaMapMarkerAlt, FaCalendarAlt,
  FaUserPlus, FaCamera, FaImage, FaArrowLeft,
} from 'react-icons/fa'
import { MdSportsScore } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi'

const SPORT_OPTIONS = [
  'Cricket', 'Football', 'Basketball', 'Kabaddi',
  'Athletics', 'Wrestling', 'Badminton', 'Volleyball',
  'Hockey', 'Tennis', 'Swimming', 'Other',
]

const mid = () => 'm' + Date.now() + Math.random().toString(36).slice(2, 5)

const formatDate = (d) => {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return d }
}

const toSlug = (str) =>
  str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .concat('-', new Date().getFullYear())

const fileToDataUrl = (file) =>
  new Promise((res) => {
    const r = new FileReader()
    r.onload = (e) => res(e.target.result)
    r.readAsDataURL(file)
  })

/* ─── Image Upload Box ──────────────────────────────────────────── */
function ImageUploadBox({ preview, onChange, label, isA }) {
  const ref = useRef()
  const borderCls = isA
    ? 'border-blue-200 hover:border-[#0B1E4B] bg-blue-50/40'
    : 'border-orange-200 hover:border-[#F05A1A] bg-orange-50/40'
  const iconCls = isA ? 'text-blue-300' : 'text-orange-300'
  const textCls = isA ? 'text-[#0B1E4B]' : 'text-[#F05A1A]'

  return (
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
      <div
        onClick={() => ref.current.click()}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${preview ? 'border-transparent' : borderCls}`}
      >
        {preview ? (
          <div className="relative group h-28">
            <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <FaCamera className="text-white text-lg" />
              <span className="text-white text-[10px] font-bold">Change Photo</span>
            </div>
          </div>
        ) : (
          <div className="h-28 flex flex-col items-center justify-center gap-2">
            <FaImage className={`text-2xl ${iconCls}`} />
            <span className={`text-[11px] font-bold ${textCls}`}>Upload Photo</span>
            <span className="text-[9px] text-slate-400">JPG, PNG · Max 5MB</span>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  )
}

/* ─── Add / Edit Event Modal ────────────────────────────────────── */
const EMPTY_FORM = {
  title: '', sport: 'Cricket', date: '', location: '', slug: '',
  teamAName: '', teamACaptain: '',
  teamBName: '', teamBCaptain: '',
}

function EventModal({ isOpen, onClose, onSave, editEvent }) {
  const isEdit = !!editEvent

  const [form, setForm] = useState(EMPTY_FORM)
  const [previewA, setPreviewA] = useState(null)
  const [previewB, setPreviewB] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!isOpen) return
    if (editEvent) {
      setForm({
        title: editEvent.title,
        sport: editEvent.sport,
        date: editEvent.date || '',
        location: editEvent.location || '',
        slug: editEvent.slug || '',
        teamAName: editEvent.teamA.name,
        teamACaptain: editEvent.teamA.captain || '',
        teamBName: editEvent.teamB.name,
        teamBCaptain: editEvent.teamB.captain || '',
      })
      setPreviewA(editEvent.teamA.img || null)
      setPreviewB(editEvent.teamB.img || null)
    } else {
      setForm(EMPTY_FORM)
      setPreviewA(null)
      setPreviewB(null)
    }
    setErrors({})
    setStep(1)
  }, [isOpen, editEvent])

  if (!isOpen) return null

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleTitle = (val) =>
    setForm(p => ({ ...p, title: val, slug: isEdit ? p.slug : toSlug(val) }))

  const handleImgA = async (e) => {
    const f = e.target.files[0]
    if (!f || f.size > 5 * 1024 * 1024) return
    setPreviewA(await fileToDataUrl(f))
  }

  const handleImgB = async (e) => {
    const f = e.target.files[0]
    if (!f || f.size > 5 * 1024 * 1024) return
    setPreviewB(await fileToDataUrl(f))
  }

  const validateStep = (s) => {
    const err = {}
    if (s === 1 && !form.title.trim()) err.title = 'Event title is required'
    if (s === 2 && !form.teamAName.trim()) err.teamAName = 'Team A name is required'
    if (s === 3 && !form.teamBName.trim()) err.teamBName = 'Team B name is required'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStep(s => s + 1)
  }

  const handleSave = async () => {
    if (!validateStep(3)) return
    setSaving(true)
    try {
      if (isEdit) {
        const updatedEvent = {
          ...editEvent,
          title: form.title.trim(),
          sport: form.sport,
          date: form.date,
          location: form.location.trim(),
          slug: form.slug.trim() || toSlug(form.title),
          teamA: {
            ...editEvent.teamA,
            name: form.teamAName.trim(),
            captain: form.teamACaptain.trim(),
            img: previewA || editEvent.teamA.img || null,
          },
          teamB: {
            ...editEvent.teamB,
            name: form.teamBName.trim(),
            captain: form.teamBCaptain.trim(),
            img: previewB || editEvent.teamB.img || null,
          },
        }
        await onSave(updatedEvent)
      } else {
        const newEvent = {
          title: form.title.trim(),
          sport: form.sport,
          date: form.date,
          location: form.location.trim(),
          slug: form.slug.trim() || toSlug(form.title),
          teamA: {
            name: form.teamAName.trim(),
            captain: form.teamACaptain.trim(),
            img: previewA || null,
            members: form.teamACaptain.trim()
              ? [{ id: mid(), name: form.teamACaptain.trim() }]
              : [],
          },
          teamB: {
            name: form.teamBName.trim(),
            captain: form.teamBCaptain.trim(),
            img: previewB || null,
            members: form.teamBCaptain.trim()
              ? [{ id: mid(), name: form.teamBCaptain.trim() }]
              : [],
          },
        }
        await onSave(newEvent)
      }
      handleClose()
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Save failed'
      window.alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setPreviewA(null); setPreviewB(null)
    setErrors({}); setStep(1)
    onClose()
  }

  const steps = [
    { num: 1, label: 'Event Info' },
    { num: 2, label: 'Team A' },
    { num: 3, label: 'Team B' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1E4B] to-[#1a3272] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              {isEdit ? <FaEdit className="text-white text-sm" /> : <FaPlus className="text-white text-sm" />}
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">
                {isEdit ? 'Edit Event' : 'Add New Event'}
              </p>
              <p className="text-white/50 text-[10px] font-semibold">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center px-6 py-3 border-b border-slate-100 flex-shrink-0">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <button
                onClick={() => step > s.num && setStep(s.num)}
                className={`flex items-center gap-1.5 ${step > s.num ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step === s.num ? 'bg-[#F05A1A] text-white' : step > s.num ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-[11px] font-bold ${step === s.num ? 'text-[#0B1E4B]' : 'text-slate-400'}`}>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-colors ${step > s.num ? 'bg-green-300' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1 — Event Info */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Event Title <span className="text-red-400">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  value={form.title}
                  onChange={e => { handleTitle(e.target.value); setErrors({}) }}
                  placeholder="e.g. UDIISA Cricket Championship 2025"
                  className={`w-full h-10 px-3 rounded-xl border-2 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 bg-slate-50 ${errors.title ? 'border-red-400' : 'border-slate-200 focus:border-[#F05A1A]'}`}
                />
                {errors.title && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.title}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sport</label>
                  <select
                    value={form.sport}
                    onChange={e => set('sport', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 focus:border-[#F05A1A] text-sm font-semibold text-slate-700 outline-none bg-slate-50 transition-all"
                  >
                    {SPORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 focus:border-[#F05A1A] text-sm font-semibold text-slate-700 outline-none bg-slate-50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="City / Venue"
                    className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 focus:border-[#F05A1A] text-sm font-semibold text-slate-700 outline-none bg-slate-50 transition-all placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => set('slug', e.target.value)}
                    placeholder="auto-generated"
                    className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 focus:border-[#F05A1A] text-sm font-semibold text-slate-700 outline-none bg-slate-50 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Team A */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-7 h-7 rounded-lg bg-[#0B1E4B] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-black">A</span>
                </div>
                <p className="text-[#0B1E4B] text-xs font-bold">Team A Details</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={form.teamAName}
                    onChange={e => { set('teamAName', e.target.value); setErrors({}) }}
                    placeholder="e.g. Delhi Dynamos"
                    className={`w-full h-10 px-3 rounded-xl border-2 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 bg-slate-50 ${errors.teamAName ? 'border-red-400' : 'border-slate-200 focus:border-[#0B1E4B]'}`}
                  />
                  {errors.teamAName && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.teamAName}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Captain Name</label>
                  <input
                    type="text"
                    value={form.teamACaptain}
                    onChange={e => set('teamACaptain', e.target.value)}
                    placeholder="Captain's full name"
                    className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 focus:border-[#0B1E4B] text-sm font-semibold text-slate-700 outline-none bg-slate-50 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
              <ImageUploadBox preview={previewA} onChange={handleImgA} label="Team A Photo" isA={true} />
            </div>
          )}

          {/* Step 3 — Team B */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-100">
                <div className="w-7 h-7 rounded-lg bg-[#F05A1A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-black">B</span>
                </div>
                <p className="text-[#F05A1A] text-xs font-bold">Team B Details</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={form.teamBName}
                    onChange={e => { set('teamBName', e.target.value); setErrors({}) }}
                    placeholder="e.g. Mumbai Strikers"
                    className={`w-full h-10 px-3 rounded-xl border-2 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 bg-slate-50 ${errors.teamBName ? 'border-red-400' : 'border-slate-200 focus:border-[#F05A1A]'}`}
                  />
                  {errors.teamBName && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.teamBName}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Captain Name</label>
                  <input
                    type="text"
                    value={form.teamBCaptain}
                    onChange={e => set('teamBCaptain', e.target.value)}
                    placeholder="Captain's full name"
                    className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 focus:border-[#F05A1A] text-sm font-semibold text-slate-700 outline-none bg-slate-50 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
              <ImageUploadBox preview={previewB} onChange={handleImgB} label="Team B Photo" isA={false} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B1E4B] transition-colors"
              >
                <FaArrowLeft className="text-[10px]" /> Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="h-9 px-4 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button
                onClick={goNext}
                className="h-9 px-5 rounded-xl bg-[#0B1E4B] text-white text-sm font-bold hover:bg-[#1a3272] transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-9 px-5 rounded-xl bg-gradient-to-r from-[#F05A1A] to-[#ff7d42] text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60 active:scale-95"
              >
                {saving ? 'Saving…' : isEdit ? '✓ Update Event' : '✓ Create Event'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Delete Event Confirm Modal ────────────────────────────────── */
function DeleteEventModal({ isOpen, onClose, onConfirm, eventTitle }) {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <FaTrash className="text-red-500 text-xl" />
          </div>
          <h3 className="font-black text-slate-800 text-base mb-2">Delete Event?</h3>
          <p className="text-xs text-slate-500 mb-1">Yeh event permanently delete ho jaayega:</p>
          <p className="text-sm font-bold text-slate-800 mb-5 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            "{eventTitle}"
          </p>
          <p className="text-[11px] text-red-400 font-semibold mb-5">
            Dono teams ke saath saath sabhi members bhi delete ho jaayenge. Yeh action undo nahi ho sakta.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all active:scale-95"
            >
              Haan, Delete Karo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Member Modal ──────────────────────────────────────────────── */
function MemberModal({ isOpen, onClose, onSave, editMember, teamName, isA }) {
  const [name, setName] = useState(editMember?.name || '')
  const [err, setErr] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    if (!name.trim()) { setErr('Name is required'); return }
    onSave(name.trim())
    setName(''); setErr(''); onClose()
  }

  const accent = isA ? 'bg-[#0B1E4B]' : 'bg-[#F05A1A]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={`${accent} px-5 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <FaUserPlus className="text-white text-sm" />
            <span className="text-white font-bold text-sm">
              {editMember ? 'Edit Member' : 'Add Member'} — {teamName}
            </span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <FaTimes className="text-sm" />
          </button>
        </div>
        <div className="p-5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Member Name <span className="text-red-400">*</span>
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setErr('') }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Enter full name..."
            className={`w-full h-10 px-3 rounded-xl border-2 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 ${err ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#F05A1A] bg-slate-50'}`}
          />
          {err && <p className="text-xs text-red-500 mt-1 font-semibold">{err}</p>}
        </div>
        <div className="px-5 pb-5 flex gap-2 justify-end">
          <button onClick={onClose} className="h-9 px-4 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSave} className={`h-9 px-5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95 ${accent}`}>
            {editMember ? 'Update' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Confirm Delete Member Modal ───────────────────────────────── */
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, memberName }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <FaTrash className="text-red-500 text-sm" />
          </div>
          <h3 className="font-black text-slate-800 text-sm mb-1">Remove Member?</h3>
          <p className="text-xs text-slate-500 mb-4">
            <span className="font-bold text-slate-700">"{memberName}"</span> will be removed from the squad.
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 h-9 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 h-9 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Remove</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Team Members Panel ────────────────────────────────────────── */
function TeamMembersPanel({ team, isA, eventId, onUpdate }) {
  const [search, setSearch] = useState('')
  const [memberModal, setMemberModal] = useState({ open: false, editMember: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, member: null })

  const filtered = useMemo(() =>
    team.members.filter(m => m.name.toLowerCase().includes(search.toLowerCase())),
    [team.members, search]
  )

  const handleAddMember = (name) => onUpdate(eventId, isA ? 'A' : 'B', {
    ...team, members: [...team.members, { id: mid(), name }]
  })

  const handleEditMember = (name) => {
    const wasCapt = memberModal.editMember?.name === team.captain
    onUpdate(eventId, isA ? 'A' : 'B', {
      ...team,
      captain: wasCapt ? name : team.captain,
      members: team.members.map(m => m.id === memberModal.editMember.id ? { ...m, name } : m),
    })
  }

  const handleDelete = () => {
    const m = deleteModal.member
    const wasCapt = m.name === team.captain
    const newMembs = team.members.filter(x => x.id !== m.id)
    onUpdate(eventId, isA ? 'A' : 'B', {
      ...team, captain: wasCapt ? (newMembs[0]?.name || '') : team.captain, members: newMembs,
    })
    setDeleteModal({ open: false, member: null })
  }

  const makeCaptain = (m) => onUpdate(eventId, isA ? 'A' : 'B', { ...team, captain: m.name })

  const hdrBg = isA ? 'bg-gradient-to-r from-[#0B1E4B] to-[#1a3272]' : 'bg-gradient-to-r from-[#F05A1A] to-[#ff7d42]'
  const addBtn = isA ? 'bg-[#0B1E4B] hover:bg-[#1a3272]' : 'bg-[#F05A1A] hover:bg-[#d44d14]'
  const footerCls = isA ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-orange-50 border-orange-100 text-orange-500'
  const capRowCls = isA ? 'bg-blue-50 border border-blue-100' : 'bg-orange-50 border border-orange-100'
  const serialBg = isA ? 'bg-[#0B1E4B]' : 'bg-[#F05A1A]'

  return (
    <div className="flex flex-col h-full">
      <div className={`${hdrBg} px-4 py-3 flex items-center gap-3`}>
        {team.img ? (
          <img src={team.img} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-2 ring-white/30" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 font-black text-white text-sm">
            {team.name?.[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest">{isA ? 'Team A' : 'Team B'}</p>
          <p className="text-white font-black text-sm truncate leading-tight">{team.name}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-wide">Captain</p>
          <p className="text-yellow-300 text-[11px] font-extrabold truncate max-w-[90px]">{team.captain || '—'}</p>
        </div>
      </div>

      <div className="px-3 py-2.5 flex items-center gap-2 border-b border-slate-100 bg-white">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full h-8 pl-7 pr-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 placeholder:text-slate-300 outline-none focus:border-orange-400 bg-slate-50 transition-colors"
          />
        </div>
        <button
          onClick={() => setMemberModal({ open: true, editMember: null })}
          className={`h-8 px-3 rounded-lg text-white text-[11px] font-bold flex items-center gap-1.5 flex-shrink-0 transition-all active:scale-95 ${addBtn}`}
        >
          <FaPlus className="text-[9px]" /> Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 bg-slate-50/50">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <FaUsers className="text-slate-200 text-2xl" />
            <p className="text-xs text-slate-400 font-semibold">{search ? 'No members found' : 'No members yet'}</p>
            {!search && (
              <button onClick={() => setMemberModal({ open: true, editMember: null })} className="text-xs font-bold text-orange-500 hover:underline">
                + Add first member
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {filtered.map((member, idx) => {
              const isCaptain = member.name === team.captain
              return (
                <div
                  key={member.id}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${isCaptain ? capRowCls : 'bg-white border border-transparent hover:border-slate-200'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 ${serialBg} ${isCaptain ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-[12px] font-semibold text-slate-700 truncate min-w-0">{member.name}</span>
                  {isCaptain && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-yellow-600 bg-yellow-100 border border-yellow-300 px-1.5 py-0.5 rounded-full flex-shrink-0">
                      <FaCrown className="text-[8px]" /> C
                    </span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!isCaptain && (
                      <button onClick={() => makeCaptain(member)} title="Make Captain" className="w-6 h-6 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 flex items-center justify-center text-yellow-500 transition-colors">
                        <FaCrown className="text-[9px]" />
                      </button>
                    )}
                    <button onClick={() => setMemberModal({ open: true, editMember: member })} title="Edit" className="w-6 h-6 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
                      <FaEdit className="text-[9px]" />
                    </button>
                    <button onClick={() => setDeleteModal({ open: true, member })} title="Remove" className="w-6 h-6 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                      <FaTrash className="text-[9px]" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className={`px-4 py-2 border-t flex items-center justify-between ${footerCls}`}>
        <span className="text-[10px] font-bold flex items-center gap-1">
          <FaUsers className="text-[9px]" />{team.members.length} Members
        </span>
        {search && filtered.length !== team.members.length && (
          <span className="text-[10px] text-slate-400 font-semibold">{filtered.length} shown</span>
        )}
      </div>

      <MemberModal
        isOpen={memberModal.open}
        onClose={() => setMemberModal({ open: false, editMember: null })}
        onSave={memberModal.editMember ? handleEditMember : handleAddMember}
        editMember={memberModal.editMember}
        teamName={team.name}
        isA={isA}
      />
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, member: null })}
        onConfirm={handleDelete}
        memberName={deleteModal.member?.name}
      />
    </div>
  )
}

/* ─── Event Detail Panel ────────────────────────────────────────── */
function EventDetailPanel({ event, onTeamUpdate }) {
  const [activeTab, setActiveTab] = useState('A')

  if (!event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-50/50 p-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <MdSportsScore className="text-slate-300 text-3xl" />
        </div>
        <p className="text-sm font-bold text-slate-400">Select an event to manage members</p>
        <p className="text-xs text-slate-300">Click any event card from the left</p>
      </div>
    )
  }

  const total = event.teamA.members.length + event.teamB.members.length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-[#0B1E4B] to-[#1a3272] px-5 py-4 flex-shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <MdSportsScore className="text-white text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-orange-500/30 text-orange-200 border border-orange-400/30">
                <HiSparkles className="text-[9px]" /> {event.sport}
              </span>
            </div>
            <h2 className="text-white font-black text-base leading-tight truncate">{event.title}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
              {event.date && (
                <span className="text-white/60 text-[10px] font-semibold flex items-center gap-1">
                  <FaCalendarAlt className="text-[9px]" /> {formatDate(event.date)}
                </span>
              )}
              {event.location && (
                <span className="text-white/60 text-[10px] font-semibold flex items-center gap-1">
                  <FaMapMarkerAlt className="text-[9px]" /> {event.location}
                </span>
              )}
              <span className="text-white/60 text-[10px] font-semibold flex items-center gap-1">
                <FaUsers className="text-[9px]" /> {total} total players
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-white border-b border-slate-100 px-4 pt-3 gap-2 flex-shrink-0">
        {[
          { key: 'A', team: event.teamA, activeCls: 'border-[#0B1E4B] text-[#0B1E4B] bg-blue-50', countCls: 'bg-[#0B1E4B] text-white' },
          { key: 'B', team: event.teamB, activeCls: 'border-[#F05A1A] text-[#F05A1A] bg-orange-50', countCls: 'bg-[#F05A1A] text-white' },
        ].map(({ key, team, activeCls, countCls }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-all ${activeTab === key ? activeCls : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {team.img
              ? <img src={team.img} alt="" className="w-4 h-4 rounded object-cover flex-shrink-0" />
              : <div className={`w-2 h-2 rounded-sm ${key === 'A' ? 'bg-[#0B1E4B]' : 'bg-[#F05A1A]'}`} />
            }
            <span className="truncate max-w-[90px]">{team.name}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === key ? countCls : 'bg-slate-100 text-slate-500'}`}>
              {team.members.length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'A'
          ? <TeamMembersPanel key={event.id + 'A'} team={event.teamA} isA={true} eventId={event.id} onUpdate={onTeamUpdate} />
          : <TeamMembersPanel key={event.id + 'B'} team={event.teamB} isA={false} eventId={event.id} onUpdate={onTeamUpdate} />
        }
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [mobileView, setMobileView] = useState('list')

  // Modal states
  const [addOpen, setAddOpen] = useState(false)
  const [editEvent, setEditEvent] = useState(null)   // event object to edit
  const [deleteTarget, setDeleteTarget] = useState(null) // event object to delete

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setListError('')
      try {
        const { data } = await eventService.getEvents()
        if (!cancelled) setEvents(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!cancelled) {
          setListError(e?.response?.data?.message || e?.message || 'Failed to load events')
          setEvents([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return events
    const q = search.toLowerCase()
    return events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.sport.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.teamA.name.toLowerCase().includes(q) ||
      e.teamB.name.toLowerCase().includes(q)
    )
  }, [events, search])

  const selectedEvent = events.find(e => e.id === selectedId) || null

  const handleSelectEvent = (id) => { setSelectedId(id); setMobileView('detail') }

  const handleTeamUpdate = async (eventId, side, updatedTeam) => {
    let next
    setEvents((prev) => {
      const ev = prev.find((e) => e.id === eventId)
      if (!ev) return prev
      next = side === 'A' ? { ...ev, teamA: updatedTeam } : { ...ev, teamB: updatedTeam }
      return prev.map((e) => (e.id === eventId ? next : e))
    })
    if (!next) return
    try {
      const { data } = await eventService.updateEvent(eventId, next)
      setEvents((prev) => prev.map((e) => (e.id === eventId ? data : e)))
    } catch (e) {
      try {
        const { data } = await eventService.getEvents()
        setEvents(Array.isArray(data) ? data : [])
      } catch (_) { /* keep optimistic state */ }
      window.alert(e?.response?.data?.message || e?.message || 'Could not save squad')
    }
  }

  const handleAddEvent = async (newEvent) => {
    const { data } = await eventService.addEvent(newEvent)
    setEvents((prev) => [data, ...prev])
    setSelectedId(data.id)
    setMobileView('detail')
  }

  const handleEditSave = async (updatedEvent) => {
    const { data } = await eventService.updateEvent(updatedEvent.id, updatedEvent)
    setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? data : ev)))
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    try {
      await eventService.deleteEvent(id)
      setEvents((prev) => prev.filter((ev) => ev.id !== id))
      if (selectedId === id) {
        setSelectedId(null)
        setMobileView('list')
      }
      setDeleteTarget(null)
    } catch (e) {
      window.alert(e?.response?.data?.message || e?.message || 'Delete failed')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] min-h-[500px]">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-black text-[#0B1E4B]">Events</h1>
          <p className="text-xs text-slate-400 font-semibold">Manage events &amp; squad members</p>
          {listError && (
            <p className="text-[11px] text-red-500 font-semibold mt-1">{listError}</p>
          )}
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-[#F05A1A] to-[#ff7d42] text-white text-xs font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          <FaPlus className="text-[10px]" /> Add Event
        </button>
      </div>

      {/* Split Panel */}
      <div className="flex-1 flex rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm min-h-0">

        {/* LEFT — Event List */}
        <div className={`flex flex-col border-r border-slate-100 bg-slate-50/80 ${mobileView === 'detail' ? 'hidden lg:flex' : 'flex'} w-full lg:w-[300px] xl:w-[340px] flex-shrink-0`}>

          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[11px]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 placeholder:text-slate-300 outline-none focus:border-orange-400 bg-white transition-colors"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-1.5 px-0.5">
              {filtered.length} event{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <p className="text-xs text-slate-400 font-semibold">Loading events…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                {!search ? (
                  <>
                    <MdSportsScore className="text-slate-200 text-3xl" />
                    <p className="text-xs text-slate-400 font-semibold">No events yet</p>
                    <button
                      onClick={() => setAddOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:underline"
                    >
                      <FaPlus className="text-[9px]" /> Add your first event
                    </button>
                  </>
                ) : (
                  <>
                    <FaSearch className="text-slate-200 text-xl" />
                    <p className="text-xs text-slate-400 font-semibold">No events found</p>
                  </>
                )}
              </div>
            ) : (
              filtered.map(ev => {
                const isActive = selectedId === ev.id
                return (
                  <div key={ev.id} className="relative group/card mb-1.5">
                    <button
                      onClick={() => handleSelectEvent(ev.id)}
                      className={`w-full text-left rounded-xl border transition-all overflow-hidden ${isActive ? 'bg-white border-orange-200 shadow-sm' : 'bg-white/60 border-transparent hover:bg-white hover:border-slate-200'}`}
                    >
                      {/* Images Banner */}
                      <div className="relative h-20 flex overflow-hidden rounded-t-xl">
                        <div className="flex-1 relative overflow-hidden">
                          {ev.teamA.img ? (
                            <img src={ev.teamA.img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0B1E4B] to-[#1a3272] flex items-center justify-center">
                              <span className="text-white/20 text-4xl font-black select-none">{ev.teamA.name?.[0]}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          <p className="absolute bottom-1.5 left-2 right-0.5 text-white text-[9px] font-black truncate leading-tight drop-shadow">
                            {ev.teamA.name}
                          </p>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100">
                            <span className="text-[7px] font-black text-[#F05A1A] leading-none">VS</span>
                          </div>
                        </div>

                        <div className="flex-1 relative overflow-hidden">
                          {ev.teamB.img ? (
                            <img src={ev.teamB.img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-bl from-[#F05A1A] to-[#d44d14] flex items-center justify-center">
                              <span className="text-white/20 text-4xl font-black select-none">{ev.teamB.name?.[0]}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                          <p className="absolute bottom-1.5 left-0.5 right-2 text-right text-white text-[9px] font-black truncate leading-tight drop-shadow">
                            {ev.teamB.name}
                          </p>
                        </div>

                        <div className="absolute top-1.5 left-2 z-10">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-black/50 text-white backdrop-blur-sm border border-white/10">
                            {ev.sport}
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="px-3 pt-2 pb-2.5">
                        <p className={`text-[12px] font-bold leading-tight mb-1 ${isActive ? 'text-[#0B1E4B]' : 'text-slate-700'}`}>
                          {ev.title}
                        </p>
                        <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-semibold mb-2">
                          {ev.date && <span className="flex items-center gap-0.5"><FaCalendarAlt className="text-[8px]" />{formatDate(ev.date)}</span>}
                          {ev.location && <span className="flex items-center gap-0.5"><FaMapMarkerAlt className="text-[8px]" />{ev.location}</span>}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                            <FaUsers className="text-[8px]" />{ev.teamA.members.length}
                          </span>
                          <span className="text-[9px] text-slate-300 font-semibold">
                            {ev.teamA.members.length + ev.teamB.members.length} players
                          </span>
                          <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1">
                            {ev.teamB.members.length}<FaUsers className="text-[8px]" />
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* ── Edit / Delete Action Buttons ── */}
                    <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditEvent(ev) }}
                        title="Edit Event"
                        className="w-7 h-7 rounded-lg bg-white/90 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all shadow-sm"
                      >
                        <FaEdit className="text-[10px]" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(ev) }}
                        title="Delete Event"
                        className="w-7 h-7 rounded-lg bg-white/90 border border-slate-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all shadow-sm"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT — Detail */}
        <div className={`flex-1 flex flex-col overflow-hidden min-w-0 ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
          {mobileView === 'detail' && selectedEvent && (
            <div className="lg:hidden flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-white flex-shrink-0">
              <button
                onClick={() => { setMobileView('list'); setSelectedId(null) }}
                className="flex items-center gap-2 text-xs font-bold text-[#0B1E4B] hover:text-orange-500 transition-colors"
              >
                <FaChevronRight className="rotate-180 text-[10px]" /> Back to Events
              </button>
            </div>
          )}
          <EventDetailPanel event={selectedEvent} onTeamUpdate={handleTeamUpdate} />
        </div>
      </div>

      {/* Add Event Modal */}
      <EventModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddEvent}
        editEvent={null}
      />

      {/* Edit Event Modal */}
      <EventModal
        isOpen={!!editEvent}
        onClose={() => setEditEvent(null)}
        onSave={handleEditSave}
        editEvent={editEvent}
      />

      {/* Delete Event Confirm Modal */}
      <DeleteEventModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        eventTitle={deleteTarget?.title}
      />
    </div>
  )
}