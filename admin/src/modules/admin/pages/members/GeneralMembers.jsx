// admin/pages/members/GeneralMembers.jsx
import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'
import ActionButtons from '../../components/ActionButtons'
import ConfirmDialog from '../../components/ConfirmDialog'
import PageHeader from '../../components/PageHeader'
import { FormField, Input, SubmitBtn, CancelBtn } from '../../components/FormField'
import { useAdminToast } from '../../hooks/ToastContext'
import { useDebounce } from '../../hooks/useDebounce'
import memberService from '../../services/memberService'
import { validateRequired, formatDate } from '../../utils/helpers'

// ── Label change: 'Individual' → 'General Members', 'Players' → 'Sports Participants'
const TABS = ['General Members', 'Sports Participants']

const TYPE_BY_TAB = {
  'General Members':      'individual',
  'Sports Participants':  'players',
}

const TAB_BY_TYPE = Object.fromEntries(
  Object.entries(TYPE_BY_TAB).map(([tab, type]) => [type, tab])
)

const makeEmptyForm = (tab) => ({ type: TYPE_BY_TAB[tab], name: '', companyName: '' })

// ── Serial number cell ─────────────────────────────────────────────────────────
const Serial = (_, __, i) => (
  <span className="inline-flex min-w-[24px] sm:min-w-[28px] h-[20px] sm:h-[22px] items-center justify-center rounded-[5px] sm:rounded-[6px] bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-extrabold">
    {String(i + 1).padStart(2, '0')}
  </span>
)

export default function GeneralMembers() {
  const toast = useAdminToast()

  const [activeTab, setActiveTab] = useState('General Members')
  const [data,      setData]      = useState({ 'General Members': [], 'Sports Participants': [] })
  const [loading,   setLoading]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [search,    setSearch]    = useState('')
  const dSearch = useDebounce(search)

  const [formOpen, setFormOpen] = useState(false)
  const [delOpen,  setDelOpen]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [form,     setForm]     = useState(makeEmptyForm('General Members'))
  const [errors,   setErrors]   = useState({})

  const currentData = data[activeTab] || []
  const emptyForm   = makeEmptyForm(activeTab)
  const modalTypeLabel = form.type === 'players' ? 'Sports Participant' : 'General Member'

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res  = await memberService.getGeneralMembers({
          type: TYPE_BY_TAB[activeTab],
          ...(dSearch ? { search: dSearch } : {}),
        })
        const list = Array.isArray(res?.data) ? res.data : []
        if (!mounted) return
        setData(prev => ({
          ...prev,
          [activeTab]: list.map(m => ({
            id:          m._id,
            name:        m.name        || '',
            companyName: m.companyName || '',
            createdAt:   m.createdAt,
            type:        m.type || TYPE_BY_TAB[activeTab],
          })),
        }))
      } catch (e) {
        if (!mounted) return
        toast.error(e?.response?.data?.message || 'Failed to fetch members')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [activeTab, dSearch, toast])

  // ── Open helpers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setSelected(null)
    setForm(emptyForm)
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setSelected(row)
    setForm({
      type: row.type || TYPE_BY_TAB[activeTab],
      name: row.name || '',
      companyName: row.companyName || '',
    })
    setErrors({})
    setFormOpen(true)
  }

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const required = ['type', 'name', 'companyName']
    const err = validateRequired(required, form)
    setErrors(err)
    return Object.keys(err).length === 0
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        type:        form.type || TYPE_BY_TAB[activeTab],
        name:        form.name?.trim(),
        companyName: (form.companyName || '').trim(),
      }

      if (selected) {
        const res = await memberService.updateGeneralMember(selected.id, payload)
        const m   = res?.data || {}
        const targetType = m.type || payload.type
        const targetTab  = TAB_BY_TYPE[targetType] || activeTab
        const updated = {
          id:          m._id          || selected.id,
          name:        m.name         || payload.name,
          companyName: m.companyName  || payload.companyName,
          createdAt:   m.createdAt    || selected.createdAt,
          type:        targetType,
        }
        setData((d) => {
          const next = Object.fromEntries(
            TABS.map((tab) => [tab, (d[tab] || []).filter((item) => item.id !== selected.id)])
          )
          next[targetTab] = [updated, ...(next[targetTab] || [])]
          return next
        })
        if (targetTab !== activeTab) {
          setActiveTab(targetTab)
          setSearch('')
        }
        toast.success('Member updated!')
      } else {
        const res = await memberService.addGeneralMember(payload)
        const m   = res?.data || {}
        const targetType = m.type || payload.type
        const targetTab  = TAB_BY_TYPE[targetType] || activeTab
        const created = {
          id:          m._id,
          name:        m.name         || payload.name,
          companyName: m.companyName  || payload.companyName,
          createdAt:   m.createdAt    || new Date().toISOString(),
          type:        targetType,
        }
        setData(d => ({ ...d, [targetTab]: [created, ...(d[targetTab] || [])] }))
        if (targetTab !== activeTab) {
          setActiveTab(targetTab)
          setSearch('')
        }
        toast.success('Member added!')
      }
      setFormOpen(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await memberService.deleteGeneralMember(selected.id)
      setData(d => ({ ...d, [activeTab]: d[activeTab].filter(m => m.id !== selected.id) }))
      toast.success('Member deleted!')
      setDelOpen(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  // ── Table columns ──────────────────────────────────────────────────────────
  const indCols = [
    { key: '__serial',    label: '#',            render: Serial },
    { key: 'name',        label: 'Name' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'createdAt',   label: 'Joined',       render: (v) => formatDate(v) },
    { key: 'act',         label: 'Actions',      render: (_, row) => <ActionButtons onEdit={() => openEdit(row)} onDelete={() => { setSelected(row); setDelOpen(true) }} /> },
  ]

  const playerCols = [
    { key: '__serial',    label: '#',             render: Serial },
    { key: 'name',        label: 'Participant Name' },
    { key: 'companyName', label: 'Organization' },
    { key: 'createdAt',   label: 'Joined',        render: (v) => formatDate(v) },
    { key: 'act',         label: 'Actions',       render: (_, row) => <ActionButtons onEdit={() => openEdit(row)} onDelete={() => { setSelected(row); setDelOpen(true) }} /> },
  ]

  const columns = activeTab === 'General Members' ? indCols : playerCols

  // ── Helpers for label-based conditionals ───────────────────────────────────
  const isSports = activeTab === 'Sports Participants'

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="px-2 sm:px-0">
      <PageHeader
        title="General Members"
        subtitle="Manage General members and Sports Participants"
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-[6px] sm:gap-[8px] px-[10px] sm:px-[16px] h-[34px] sm:h-[40px] rounded-[8px] sm:rounded-[10px] bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] text-white text-[11px] sm:text-[13px] font-extrabold shadow-[0_4px_14px_rgba(240,90,26,0.3)] hover:-translate-y-[1px] transition-all duration-200"
          >
            <FaPlus className="text-[9px] sm:text-[11px]" />
            <span className="hidden xs:inline">Add </span>
            {isSports ? 'Participant' : 'Member'}
          </button>
        }
      />

      {/* ── Tabs + Search row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[10px] sm:gap-[16px] mb-[16px] sm:mb-[20px]">

        {/* Tabs */}
        <div className="flex gap-[3px] sm:gap-[4px] bg-white rounded-[10px] sm:rounded-[12px] p-[3px] sm:p-[4px] border border-slate-100 shadow-[0_2px_8px_rgba(11,30,75,0.05)] w-full sm:w-fit overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch('') }}
              className={`flex-1 sm:flex-none px-[10px] sm:px-[20px] h-[32px] sm:h-[36px] rounded-[8px] sm:rounded-[10px] text-[11px] sm:text-[13px] font-extrabold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#0B1E4B] to-[#152B6B] text-white shadow-[0_4px_12px_rgba(11,30,75,0.25)]'
                  : 'text-slate-500 hover:text-[#0B1E4B]'
              }`}
            >
              {tab}
              <span className={`ml-[4px] sm:ml-[6px] text-[9px] sm:text-[10px] px-[5px] sm:px-[6px] py-[1px] rounded-full font-extrabold ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {data[tab]?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-[33%]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={isSports ? 'Search sports participants…' : 'Search general members…'}
          />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={currentData} loading={loading} emptyText="No members found" />

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={`${selected ? 'Edit' : 'Add'} ${modalTypeLabel}`}
        size="sm"
      >
        <div className="flex flex-col gap-[10px] sm:gap-[14px] px-1 sm:px-0">

          {/* Category */}
          <FormField label="Category" required error={errors.type}>
            <select
              value={form.type || TYPE_BY_TAB[activeTab]}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className={`h-[34px] sm:h-[38px] w-full rounded-[8px] sm:rounded-[10px] border px-[10px] sm:px-[12px] text-[12px] sm:text-[13px] font-semibold text-slate-700 outline-none transition-all ${
                errors.type ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-[#F05A1A]'
              }`}
            >
              {TABS.map((tab) => (
                <option key={tab} value={TYPE_BY_TAB[tab]}>
                  {tab}
                </option>
              ))}
            </select>
          </FormField>

          {/* Name */}
          <FormField
            label={form.type === 'players' ? 'Participant Name' : 'Name'}
            required
            error={errors.name}
          >
            <Input
              placeholder={form.type === 'players' ? "Participant's full name" : 'Full name'}
              value={form.name || ''}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              error={errors.name}
            />
          </FormField>

          {/* Company / Organization */}
          <FormField
            label={form.type === 'players' ? 'Organization' : 'Company Name'}
            required
            error={errors.companyName}
          >
            <Input
              placeholder={form.type === 'players' ? 'Club / Academy / Organization' : 'Enter company name'}
              value={form.companyName || ''}
              onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
              error={errors.companyName}
            />
          </FormField>

          <div className="flex gap-[8px] sm:gap-[10px] justify-end pt-[4px] sm:pt-[6px]">
            <CancelBtn onClick={() => setFormOpen(false)} />
            <SubmitBtn loading={saving} onClick={handleSave}>
              {selected ? 'Update' : (form.type === 'players' ? 'Add Participant' : 'Add Member')}
            </SubmitBtn>
          </div>
        </div>
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