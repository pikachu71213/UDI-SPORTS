// admin/components/Badge.jsx
const VARIANTS = {
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  orange: 'bg-[#FFF3EC] text-[#F05A1A] border-[#F05A1A]/20',
  red:    'bg-red-50 text-red-700 border-red-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  slate:  'bg-slate-100 text-slate-600 border-slate-200',
  navy:   'bg-[#e8ecf8] text-[#0B1E4B] border-[#0B1E4B]/20',
}

export default function Badge({ children, variant = 'slate' }) {
  return (
    <span className={`
      inline-flex items-center px-[9px] py-[3px] rounded-full
      text-[10.5px] font-extrabold uppercase tracking-[0.8px]
      border ${VARIANTS[variant] || VARIANTS.slate}
    `}>
      {children}
    </span>
  )
}