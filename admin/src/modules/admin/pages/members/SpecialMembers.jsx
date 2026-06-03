// admin/pages/members/SpecialMembers.jsx
import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'
import ActionButtons from '../../components/ActionButtons'
import ConfirmDialog from '../../components/ConfirmDialog'
import PageHeader from '../../components/PageHeader'
import { FormField, Input, PhotoUpload, SubmitBtn, CancelBtn } from '../../components/FormField'
import { useAdminToast } from '../../hooks/ToastContext'
import { useDebounce } from '../../hooks/useDebounce'
import memberService from '../../services/memberService'
import { validateRequired, buildFormData, API_IMG, formatDate } from '../../utils/helpers'

const EMPTY = { name: '', companyName: '', membershipCategory: 'Silver', photo: null }

// ── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = [
 
  {
    value: 'Body Corporate',
    label: '🏢 Body Corporate',
    bg: '#ecfdf5',
    color: '#065f46',
    border: '#a7f3d0',
    dot: '#10b981',
  },
 
  {
    value: 'Diamond',
    label: '💎 Diamond',
    bg: '#eef6ff',
    color: '#1a6bc4',
    border: '#bfdbfe',
    dot: '#3b82f6',
  },
  {
    value: 'Gold',
    label: '🥇 Gold',
    bg: '#fffbeb',
    color: '#b45309',
    border: '#fde68a',
    dot: '#f59e0b',
  },
  {
    value: 'Silver',
    label: '🥈 Silver',
    bg: '#f8fafc',
    color: '#475569',
    border: '#e2e8f0',
    dot: '#94a3b8',
  },
  {
    value: 'Dignitaries',
    label: '👑 Dignitaries',
    bg: '#fdf4ff',
    color: '#7e22ce',
    border: '#e9d5ff',
    dot: '#a855f7',
  },
  {
    value: 'Celebrity',
    label: '🌟 Celebrity',
    bg: '#fdf2f8',
    color: '#9d174d',
    border: '#f9a8d4',
    dot: '#ec4899',
  },
 
]

const getCat = (val) => CATEGORIES.find(c => c.value === val) || CATEGORIES[2]

// ── Category Badge ────────────────────────────────────────────────────────────
function CategoryBadge({ value }) {
  const cat = getCat(value)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      background: cat.bg, color: cat.color,
      border: `1px solid ${cat.border}`,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.3px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.dot, flexShrink: 0 }} />
      {cat.value}
    </span>
  )
}

// ── Category Dropdown ─────────────────────────────────────────────────────────
function CategorySelect({ value, onChange }) {
  const selected = getCat(value)
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 38px 10px 14px',
          borderRadius: 10,
          border: `1.5px solid ${selected.border}`,
          background: selected.bg,
          color: selected.color,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          appearance: 'none',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          fontFamily: 'inherit',
          boxShadow: `0 1px 4px ${selected.border}`,
        }}
        onFocus={e => e.target.style.boxShadow = `0 0 0 3px ${selected.border}`}
        onBlur={e => e.target.style.boxShadow = `0 1px 4px ${selected.border}`}
      >
        {CATEGORIES.map(cat => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      <div style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: selected.color, fontSize: 10,
      }}>
        ▼
      </div>
    </div>
  )
}

export default function SpecialMembers() {
  const toast = useAdminToast()
  const [members,  setMembers]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search,   setSearch]   = useState('')
  const dSearch = useDebounce(search)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [delOpen,  setDelOpen]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [form,     setForm]     = useState(EMPTY)
  const [preview,  setPreview]  = useState(null)
  const [errors,   setErrors]   = useState({})

  const [activeFilter, setActiveFilter] = useState('All')
  const FILTER_TABS = ['All', ...CATEGORIES.map(c => c.value)]

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res  = await memberService.getSpecialMembers(dSearch ? { search: dSearch } : {})
        const list = Array.isArray(res?.data) ? res.data : []
        if (!mounted) return
        setMembers(
          list.map(m => ({
            id:                 m._id,
            name:               m.name               || '',
            companyName:        m.companyName        || '',
            membershipCategory: m.membershipCategory || 'Silver',
            photo:              m.photo              || null,
            createdAt:          m.createdAt,
          }))
        )
      } catch (e) {
        if (!mounted) return
        toast.error(e?.response?.data?.message || 'Failed to fetch special members')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [dSearch, toast])

  const openAdd = () => {
    setSelected(null)
    setForm(EMPTY)
    setPreview(null)
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setSelected(row)
    setForm({
      name:               row.name,
      companyName:        row.companyName,
      membershipCategory: row.membershipCategory || 'Silver',
      photo:              null,
    })
    setPreview(row.photo ? API_IMG(row.photo) : null)
    setErrors({})
    setFormOpen(true)
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('Photo must be under 10MB'); return }
    setForm(f => ({ ...f, photo: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    const err = validateRequired(['name'], form)
    setErrors(err)
    if (Object.keys(err).length > 0) return
    setSaving(true)
    try {
      const payload = buildFormData({
        name:               form.name?.trim(),
        companyName:        form.companyName?.trim(),
        membershipCategory: form.membershipCategory,
        photo:              form.photo || undefined,
      })

      if (selected) {
        const res = await memberService.updateSpecialMember(selected.id, payload)
        const m   = res?.data || {}
        const updated = {
          id:                 m._id                || selected.id,
          name:               m.name               || form.name,
          companyName:        m.companyName        || form.companyName        || '',
          membershipCategory: m.membershipCategory || form.membershipCategory || 'Silver',
          photo:              m.photo              || selected.photo          || null,
          createdAt:          m.createdAt          || selected.createdAt,
        }
        setMembers(prev => prev.map(item => item.id === selected.id ? updated : item))
        toast.success('Special member updated!')
      } else {
        const res = await memberService.addSpecialMember(payload)
        const m   = res?.data || {}
        const created = {
          id:                 m._id,
          name:               m.name               || form.name,
          companyName:        m.companyName        || form.companyName        || '',
          membershipCategory: m.membershipCategory || form.membershipCategory || 'Silver',
          photo:              m.photo              || null,
          createdAt:          m.createdAt          || new Date().toISOString(),
        }
        setMembers(prev => [created, ...prev])
        toast.success('Special member added!')
      }
      setFormOpen(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await memberService.deleteSpecialMember(selected.id)
      setMembers(prev => prev.filter(m => m.id !== selected.id))
      toast.success('Deleted successfully!')
      setDelOpen(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const filteredMembers = activeFilter === 'All'
    ? members
    : members.filter(m => m.membershipCategory === activeFilter)

  const columns = [
    {
      key: 'photo', label: '#',
      render: (v, row, i) => (
        <div className="flex items-center gap-[10px]">
          {v
            ? <img src={API_IMG(v)} className="w-[36px] h-[36px] rounded-[8px] object-cover" alt="" />
            : <div className="w-[36px] h-[36px] rounded-[8px] bg-gradient-to-br from-[#F05A1A] to-[#0B1E4B] flex items-center justify-center text-white text-[12px] font-extrabold">{row.name?.[0]}</div>
          }
          <span className="text-slate-400 text-[11px]">#{i + 1}</span>
        </div>
      ),
    },
    { key: 'name',        label: 'Name' },
    { key: 'companyName', label: 'Company / Organization' },
    {
      key: 'membershipCategory', label: 'Category',
      render: (v) => <CategoryBadge value={v || 'Silver'} />,
    },
    { key: 'createdAt', label: 'Joined', render: (v) => formatDate(v) },
    {
      key: 'act', label: 'Actions',
      render: (_, row) => (
        <ActionButtons
          onView={() => { setSelected(row); setViewOpen(true) }}
          onEdit={() => openEdit(row)}
          onDelete={() => { setSelected(row); setDelOpen(true) }}
        />
      ),
    },
  ]

  return (
    <div className="px-2 sm:px-0">
      <PageHeader
        title="Special Members"
        subtitle="Manage Diamond, Gold, Silver, Dignitaries, Celebrity and Body Corporate members"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-[6px] sm:gap-[8px] px-[10px] sm:px-[16px] h-[34px] sm:h-[40px] rounded-[8px] sm:rounded-[10px] bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] text-white text-[11px] sm:text-[13px] font-extrabold shadow-[0_4px_14px_rgba(240,90,26,0.3)] hover:-translate-y-[1px] transition-all"
          >
            <FaPlus className="text-[9px] sm:text-[11px]" /> Add Member
          </button>
        }
      />

      {/* Search + Filter row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[10px] sm:gap-[16px] mb-[16px] sm:mb-[20px]">

        {/* Filter tabs — scrollable on mobile */}
        <div className="flex gap-[5px] sm:gap-[6px] overflow-x-auto pb-1 flex-nowrap sm:flex-wrap"
          style={{ scrollbarWidth: 'none' }}
        >
          {FILTER_TABS.map(tab => {
            const cat = tab === 'All' ? null : getCat(tab)
            const isActive = activeFilter === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 9,
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all .2s ease',
                  flexShrink: 0, whiteSpace: 'nowrap',
                  background: isActive
                    ? (cat ? cat.bg : 'linear-gradient(135deg,#0B1E4B,#1e3a8a)')
                    : '#fff',
                  color: isActive ? (cat ? cat.color : '#fff') : '#64748b',
                  border: `1.5px solid ${isActive ? (cat ? cat.border : '#0B1E4B') : '#e2e8f0'}`,
                  boxShadow: isActive
                    ? `0 4px 12px ${cat ? cat.border : 'rgba(11,30,75,0.2)'}`
                    : '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {tab !== 'All' && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.dot, flexShrink: 0 }} />
                )}
                {tab}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 16, height: 16, borderRadius: 999, padding: '0 4px',
                  background: isActive ? (cat ? `${cat.dot}22` : 'rgba(255,255,255,0.2)') : '#f1f5f9',
                  color: isActive ? (cat ? cat.color : '#fff') : '#94a3b8',
                  fontSize: 9, fontWeight: 800,
                }}>
                  {tab === 'All'
                    ? members.length
                    : members.filter(m => m.membershipCategory === tab).length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="w-full sm:w-[33%]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search special members…" />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={filteredMembers} loading={loading} emptyText="No special members found" />

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={`${selected ? 'Edit' : 'Add'} Special Member`}
        size="sm"
      >
        <div className="flex flex-col gap-[10px] sm:gap-[14px] px-1 sm:px-0">
          <PhotoUpload preview={preview} onChange={handlePhoto} />

          <FormField label="Name" required error={errors.name}>
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              error={errors.name}
            />
          </FormField>

          <FormField label="Company / Organization">
            <Input
              placeholder="Company or Organisation name"
              value={form.companyName}
              onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
            />
          </FormField>

          <FormField label="Membership Category" required>
            <CategorySelect
              value={form.membershipCategory}
              onChange={val => setForm(f => ({ ...f, membershipCategory: val }))}
            />
          </FormField>

          <div className="flex gap-[8px] sm:gap-[10px] justify-end pt-[4px] sm:pt-[6px]">
            <CancelBtn onClick={() => setFormOpen(false)} />
            <SubmitBtn loading={saving} onClick={handleSave}>
              {selected ? 'Update' : 'Add Member'}
            </SubmitBtn>
          </div>
        </div>
      </Modal>

      {/* ── View Details Modal ── */}
      <Modal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Special Member Details"
        size="sm"
      >
        {selected && (
          <div className="flex flex-col items-center gap-[14px] sm:gap-[16px] text-center px-1 sm:px-0">
            {selected.photo
              ? <img src={API_IMG(selected.photo)} className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-[14px] sm:rounded-[16px] object-cover shadow-lg" alt="" />
              : <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] rounded-[14px] sm:rounded-[16px] bg-gradient-to-br from-[#F05A1A] to-[#0B1E4B] flex items-center justify-center text-white text-[26px] sm:text-[30px] font-extrabold shadow-lg">{selected.name?.[0]}</div>
            }
            <div>
              <h3 className="text-[16px] sm:text-[18px] font-extrabold text-[#0B1E4B] m-0">{selected.name}</h3>
              <p className="text-[13px] sm:text-[14px] text-slate-500 m-0">{selected.companyName || '—'}</p>
            </div>
            <CategoryBadge value={selected.membershipCategory || 'Silver'} />
            <div className="w-full bg-slate-50 rounded-[10px] sm:rounded-[12px] p-[12px] sm:p-[14px] text-left">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.8px] m-0">Joined</p>
              <p className="text-[12px] sm:text-[13px] font-semibold text-slate-700 m-0 mt-[2px]">{formatDate(selected.createdAt)}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        isOpen={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${selected?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}