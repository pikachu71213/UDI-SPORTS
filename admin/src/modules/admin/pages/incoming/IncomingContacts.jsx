// admin/pages/incoming/IncomingContacts.jsx
import { useEffect, useState } from 'react'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'
import ActionButtons from '../../components/ActionButtons'
import ConfirmDialog from '../../components/ConfirmDialog'
import PageHeader from '../../components/PageHeader'
import { useAdminToast } from '../../hooks/ToastContext'
import { useDebounce } from '../../hooks/useDebounce'
import incomingService from '../../services/incomingService'
import { formatDate } from '../../utils/helpers'

const hasValue = (value) => {
  if (value === null || value === undefined) return false
  const str = String(value).trim()
  return str !== '' && str !== '—'
}

export default function IncomingContacts() {
  const toast = useAdminToast()
  const [forms,    setForms]   = useState([])
  const [loading,  setLoading] = useState(false)
  const [deleting, setDeleting]= useState(false)
  const [search,   setSearch]  = useState('')
  const dSearch = useDebounce(search)
  const [viewOpen, setViewOpen]= useState(false)
  const [delOpen,  setDelOpen] = useState(false)
  const [selected, setSelected]= useState(null)

  useEffect(() => {
    let mounted = true

    const loadContacts = async () => {
      setLoading(true)
      try {
        const res = await incomingService.getContactForms(dSearch ? { search: dSearch } : {})
        const list = Array.isArray(res?.data) ? res.data : []
        if (!mounted) return

        setForms(
          list.map((item) => ({
            id: item._id,
            name: item.fullName || '—',
            email: item.email || '—',
            phone: item.phone || '—',
            gender: item.gender ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : '',
            age: item.age ?? '',
            aadhar: item.aadharNumber || '',
            address: item.address || '',
            qualification: item.qualification || '',
            // Website contact form sends "Your Message", not a separate subject.
            subject: item.message || item.subject || '—',
            message: item.message || '—',
            submittedAt: item.createdAt,
          }))
        )
      } catch (e) {
        if (!mounted) return
        toast.error(e?.response?.data?.message || 'Failed to fetch contact forms')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadContacts()
    return () => { mounted = false }
  }, [dSearch, toast])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await incomingService.deleteContactForm(selected.id)
      setForms(prev => prev.filter(f => f.id !== selected.id))
      toast.success('Contact form deleted!')
      setDelOpen(false)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete')
    }
    finally { setDeleting(false) }
  }

  const columns = [
    {
      key: '__serial',
      label: '#',
      render: (_, __, i) => (
        <span className="inline-flex min-w-[28px] h-[22px] items-center justify-center rounded-[6px] bg-slate-100 text-slate-700 text-[11px] font-extrabold">
          {String(i + 1).padStart(2, '0')}
        </span>
      ),
    },
    { key: 'name',    label: 'Name' },
    { key: 'email',   label: 'Email' },
    { key: 'phone',   label: 'Phone' },
    { key: 'subject', label: 'Subject', render: (v) => <span className="line-clamp-1 max-w-[180px] block">{v}</span> },
    { key: 'submittedAt', label: 'Date', render: (v) => formatDate(v) },
    {
      key: 'act', label: 'Actions',
      render: (_, row) => (
        <ActionButtons
          onView={() => { setSelected(row); setViewOpen(true) }}
          onDelete={() => { setSelected(row); setDelOpen(true) }}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Incoming Contact Forms"
        subtitle="Review and manage contact form submissions"
      />
      <div className="mb-[16px]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, subject…" />
      </div>
      <Table columns={columns} data={forms} loading={loading} emptyText="No contact form submissions" />

      {/* View Modal */}
      <Modal isOpen={viewOpen} onClose={() => setViewOpen(false)} title="Contact Form Details" size="md">
        {selected && (
          <div className="flex flex-col gap-[12px]">
            <div className="grid grid-cols-2 gap-[10px]">
              {[
                ['Name',      selected.name],
                ['Email',     selected.email],
                ['Phone',     selected.phone],
                ['Gender',     selected.gender],
                ['Aadhaar',    selected.aadhar],
                ['Age',        selected.age],
                ['Qualification', selected.qualification],
                ['Submitted', formatDate(selected.submittedAt)],
              ].filter(([, val]) => hasValue(val)).map(([label, val]) => (
                <div key={label} className="bg-slate-50 rounded-[10px] p-[12px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.8px] m-0">{label}</p>
                  <p className="text-[13px] font-semibold text-slate-700 m-0 mt-[3px]">{val || '—'}</p>
                </div>
              ))}
            </div>
            {hasValue(selected.address) && (
              <div className="bg-slate-50 rounded-[10px] p-[12px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.8px] m-0">Address</p>
                <p className="text-[13.5px] text-slate-700 m-0 mt-[6px] leading-relaxed">{selected.address}</p>
              </div>
            )}
            <div className="bg-slate-50 rounded-[10px] p-[12px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.8px] m-0">Message</p>
              <p className="text-[13.5px] text-slate-700 m-0 mt-[6px] leading-relaxed">{selected.message}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={delOpen} onClose={() => setDelOpen(false)} onConfirm={handleDelete} loading={deleting} message="Delete this contact form submission?" />
    </div>
  )
}