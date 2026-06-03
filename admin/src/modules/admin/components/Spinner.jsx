// admin/components/Spinner.jsx
export default function Spinner({ size = 'md', center = false }) {
  const sz = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' }[size]
  return (
    <div className={center ? 'flex items-center justify-center py-12' : 'inline-flex'}>
      <div className={`${sz} rounded-full border-slate-200 border-t-[#F05A1A] animate-spin`} />
    </div>
  )
}