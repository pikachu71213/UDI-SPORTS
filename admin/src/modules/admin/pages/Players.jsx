// admin/pages/Players.jsx
import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import Table from '../components/Table'
import Modal from '../components/Modal'
import SearchBar from '../components/SearchBar'
import ActionButtons from '../components/ActionButtons'
import ConfirmDialog from '../components/ConfirmDialog'
import PageHeader from '../components/PageHeader'
import { FormField, Input, PhotoUpload, SubmitBtn, CancelBtn } from '../components/FormField'
import { useAdminToast } from '../hooks/ToastContext'
import { useDebounce } from '../hooks/useDebounce'
import playerService from '../services/playerService'
import { validateRequired, buildFormData, API_IMG, formatDate } from '../utils/helpers'

const EMPTY_FORM = {
  playerName:  '',
  sportsName:  '',
  gender:      '',
  achievement: '',
  photo:       null,
}

const GENDER_OPTIONS = [
  { value: 'male',   label: 'Male'   },
  { value: 'female', label: 'Female' },
  { value: 'other',  label: 'Other'  },
]

// Gender badge colours for View modal
const GENDER_BADGE = {
  male:   'bg-blue-100 text-blue-600',
  female: 'bg-pink-100 text-pink-600',
  other:  'bg-purple-100 text-purple-600',
}

export default function Players() {
  const toast = useAdminToast()
  const [players,  setPlayers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search,   setSearch]   = useState('')
  const dSearch = useDebounce(search)

  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [delOpen,  setDelOpen]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [preview,  setPreview]  = useState(null)
  const [errors,   setErrors]   = useState({})

  // ── Fetch players ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      setLoading(true)
      try {
        const res  = await playerService.getPlayers(dSearch ? { search: dSearch } : {})
        const list = Array.isArray(res?.data) ? res.data : []
        if (!mounted) return
        setPlayers(list.map(p => ({
          id:          p._id,
          playerName:  p.playerName  || '',
          sportsName:  p.sportsName  || '',
          gender:      p.gender      || '',
          achievement: p.achievement || '',
          photo:       p.photo       || null,
          createdAt:   p.createdAt,
        })))
      } catch (e) {
        if (!mounted) return
        toast.error(e?.response?.data?.message || 'Failed to load players')
      } finally {
        setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [dSearch, toast])

  // ── Open helpers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setSelected(null)
    setForm(EMPTY_FORM)
    setPreview(null)
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (player) => {
    setSelected(player)
    setForm({
      playerName:  player.playerName,
      sportsName:  player.sportsName,
      gender:      player.gender      || '',
      achievement: player.achievement || '',
      photo:       null,
    })
    setPreview(player.photo ? API_IMG(player.photo) : null)
    setErrors({})
    setFormOpen(true)
  }

  const openView   = (player) => { setSelected(player); setViewOpen(true) }
  const openDelete = (player) => { setSelected(player); setDelOpen(true)  }

  // ── Photo ──────────────────────────────────────────────────────────────────
  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('Photo must be under 10MB'); return }
    setForm(f => ({ ...f, photo: file }))
    setPreview(URL.createObjectURL(file))
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const err = validateRequired(['playerName', 'sportsName', 'gender'], form)
    setErrors(err)
    return Object.keys(err).length === 0
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const fd = buildFormData({
        playerName:  form.playerName?.trim(),
        sportsName:  form.sportsName?.trim(),
        gender:      form.gender,
        achievement: form.achievement?.trim(),
        photo:       form.photo || undefined,
      })

      if (selected) {
        const res = await playerService.updatePlayer(selected.id, fd)
        const p   = res?.data || {}
        const updated = {
          id:          p._id          || selected.id,
          playerName:  p.playerName   || form.playerName,
          sportsName:  p.sportsName   || form.sportsName,
          gender:      p.gender       || form.gender,
          achievement: p.achievement  || form.achievement,
          photo:       p.photo        || selected.photo || null,
          createdAt:   p.createdAt    || selected.createdAt,
        }
        setPlayers(prev => prev.map(item => item.id === selected.id ? updated : item))
        toast.success('Player updated successfully!')
      } else {
        const res = await playerService.addPlayer(fd)
        const p   = res?.data || {}
        const created = {
          id:          p._id,
          playerName:  p.playerName   || form.playerName,
          sportsName:  p.sportsName   || form.sportsName,
          gender:      p.gender       || form.gender,
          achievement: p.achievement  || form.achievement,
          photo:       p.photo        || null,
          createdAt:   p.createdAt    || new Date().toISOString(),
        }
        setPlayers(prev => [created, ...prev])
        toast.success('Player added successfully!')
      }
      setFormOpen(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save player')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await playerService.deletePlayer(selected.id)
      setPlayers(prev => prev.filter(p => p.id !== selected.id))
      toast.success('Player deleted successfully!')
      setDelOpen(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete player')
    } finally {
      setDeleting(false)
    }
  }

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'photo',
      label: '#',
      render: (val, row, idx) => (
        <div className="flex items-center gap-[10px]">
          {val
            ? <img src={API_IMG(val)} className="w-[36px] h-[36px] rounded-[8px] object-cover" alt="" />
            : <div className="w-[36px] h-[36px] rounded-[8px] bg-gradient-to-br from-[#0B1E4B] to-[#F05A1A] flex items-center justify-center text-white text-[12px] font-extrabold">{row.playerName?.[0]}</div>
          }
          <span className="text-slate-400 text-[11px]">#{idx + 1}</span>
        </div>
      ),
    },
    { key: 'playerName', label: 'Player Name' },
    { key: 'sportsName', label: 'Sport' },
    {
      key: 'gender',
      label: 'Gender',
      render: (val) => val
        ? <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${GENDER_BADGE[val] || 'bg-slate-100 text-slate-500'}`}>{val}</span>
        : <span className="text-slate-300 text-[12px]">—</span>,
    },
    { key: 'createdAt', label: 'Added On', render: (v) => formatDate(v) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <ActionButtons
          onView={() => openView(row)}
          onEdit={() => openEdit(row)}
          onDelete={() => openDelete(row)}
        />
      ),
    },
  ]

  // ── Shared input class ─────────────────────────────────────────────────────
  const inputCls = (err) =>
    `w-full px-[14px] py-[10px] rounded-[12px] border text-[13px] text-slate-800 outline-none transition-all bg-white font-[Plus_Jakarta_Sans] ${err ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-[#F05A1A] focus:ring-2 focus:ring-orange-100'}`

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Talented Players"
        subtitle="Manage all talented sports players"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-[8px] px-[16px] h-[40px] rounded-[10px] bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] text-white text-[13px] font-extrabold shadow-[0_4px_14px_rgba(240,90,26,0.3)] hover:-translate-y-[1px] transition-all duration-200"
          >
            <FaPlus className="text-[11px]" /> Add Player
          </button>
        }
      />

      {/* Search */}
      <div className="mb-[16px]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search players…" />
      </div>

      {/* Table */}
      <Table columns={columns} data={players} loading={loading} emptyText="No players found" />

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={selected ? 'Edit Player' : 'Add New Player'}
        size="sm"
      >
        <div className="flex flex-col gap-[16px]">

          {/* Photo */}
          <PhotoUpload
            label="Player Photo"
            preview={preview}
            onChange={handlePhoto}
          />

          {/* Player Name */}
          <FormField label="Player Name" required error={errors.playerName}>
            <Input
              placeholder="Enter player name"
              value={form.playerName}
              onChange={e => setForm(f => ({ ...f, playerName: e.target.value }))}
              error={errors.playerName}
            />
          </FormField>

          {/* Sport Name + Gender — side by side */}
          <div className="grid grid-cols-2 gap-[12px]">
            <FormField label="Sport Name" required error={errors.sportsName}>
              <Input
                placeholder="e.g. Cricket, Boxing"
                value={form.sportsName}
                onChange={e => setForm(f => ({ ...f, sportsName: e.target.value }))}
                error={errors.sportsName}
              />
            </FormField>

            <FormField label="Gender" required error={errors.gender}>
              <select
                value={form.gender}
                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                className={inputCls(errors.gender)}
              >
                <option value="" disabled>Select gender</option>
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.gender && (
                <p className="m-0 mt-1 text-[11px] text-red-500">{errors.gender}</p>
              )}
            </FormField>
          </div>

          {/* Achievement */}
          <FormField label="Achievement" error={errors.achievement}>
            <textarea
              rows={3}
              placeholder="e.g. Gold Medal – National Games 2023, State Champion…"
              value={form.achievement}
              onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))}
              className={`${inputCls(errors.achievement)} resize-none leading-relaxed`}
            />
          </FormField>

          <div className="flex gap-[10px] justify-end pt-[8px]">
            <CancelBtn onClick={() => setFormOpen(false)} />
            <SubmitBtn loading={saving} onClick={handleSave}>
              {selected ? 'Update' : 'Add Player'}
            </SubmitBtn>
          </div>
        </div>
      </Modal>

      {/* ── View Modal ── */}
      <Modal isOpen={viewOpen} onClose={() => setViewOpen(false)} title="Player Details" size="sm">
        {selected && (
          <div className="flex flex-col items-center gap-[16px] text-center">

            {/* Avatar */}
            {selected.photo
              ? <img src={API_IMG(selected.photo)} className="w-[100px] h-[100px] rounded-[16px] object-cover shadow-lg" alt="" />
              : <div className="w-[100px] h-[100px] rounded-[16px] bg-gradient-to-br from-[#0B1E4B] to-[#F05A1A] flex items-center justify-center text-white text-[32px] font-extrabold shadow-lg">{selected.playerName?.[0]}</div>
            }

            {/* Name + sport */}
            <div>
              <h3 className="text-[18px] font-extrabold text-[#0B1E4B] m-0">{selected.playerName}</h3>
              <p className="text-[14px] text-[#F05A1A] font-bold m-0">{selected.sportsName}</p>
              {selected.gender && (
                <span className={`inline-block mt-[6px] text-[11px] font-bold px-3 py-1 rounded-full capitalize ${GENDER_BADGE[selected.gender] || 'bg-slate-100 text-slate-500'}`}>
                  {selected.gender}
                </span>
              )}
            </div>

            {/* Info grid */}
            <div className="w-full bg-slate-50 rounded-[12px] p-[14px] grid grid-cols-2 gap-[10px] text-left">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.8px] m-0">Added On</p>
                <p className="text-[13px] font-semibold text-slate-700 m-0 mt-[2px]">{formatDate(selected.createdAt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.8px] m-0">Sport</p>
                <p className="text-[13px] font-semibold text-slate-700 m-0 mt-[2px]">{selected.sportsName}</p>
              </div>
            </div>

            {/* Achievement — full width, only if present */}
            {selected.achievement && (
              <div className="w-full bg-orange-50 border border-orange-100 rounded-[12px] p-[14px] text-left">
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.8px] m-0 mb-[6px]">
                  🏆 Achievement
                </p>
                <p className="text-[13px] font-semibold text-slate-700 m-0 leading-relaxed whitespace-pre-line">
                  {selected.achievement}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Delete confirm ── */}
      <ConfirmDialog
        isOpen={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${selected?.playerName}"? This action cannot be undone.`}
      />
    </div>
  )
}