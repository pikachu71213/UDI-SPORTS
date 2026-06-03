// admin/components/SearchBar.jsx
import { FaSearch, FaTimes } from 'react-icons/fa'

export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative w-full max-w-[520px]">
      <FaSearch className="absolute left-[13px] top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-[40px] pl-[38px] pr-[36px] rounded-[10px]
          border border-slate-200 bg-white
          text-[13px] font-medium text-slate-700
          placeholder:text-slate-300
          focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10
          transition-all duration-200
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-[10px] top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <FaTimes className="text-[11px]" />
        </button>
      )}
    </div>
  )
}