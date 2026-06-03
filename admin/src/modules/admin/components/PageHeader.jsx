// admin/components/PageHeader.jsx
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-[12px] mb-[24px]">
      <div>
        <h1 className="text-[22px] font-extrabold text-[#0B1E4B] m-0 leading-tight">{title}</h1>
        {subtitle && <p className="text-[13px] text-slate-500 mt-[4px] m-0">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-[10px]">{action}</div>}
    </div>
  )
}