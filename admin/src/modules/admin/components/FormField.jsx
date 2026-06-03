// admin/components/FormField.jsx

export function FormField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-[5px]">
      {label && (
        <label className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.8px]">
          {label}{required && <span className="text-[#F05A1A] ml-[3px]">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-[11.5px] text-red-500 font-medium mt-[1px]">{error}</p>}
    </div>
  )
}

const inputCls = (error) => `
  w-full h-[42px] px-[12px] rounded-[10px]
  border border-slate-200 bg-white
  text-[13.5px] font-medium text-slate-700
  placeholder:text-slate-300
  focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10
  transition-all duration-200
  ${error ? 'border-red-400 bg-red-50' : ''}
`

export function Input({ error, ...props }) {
  return <input className={inputCls(error)} {...props} />
}

export function Select({ error, children, ...props }) {
  return (
    <select className={inputCls(error) + ' cursor-pointer'} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ error, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`
        w-full px-[12px] py-[10px] rounded-[10px]
        border border-slate-200 bg-white resize-none
        text-[13.5px] font-medium text-slate-700
        placeholder:text-slate-300
        focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10
        transition-all duration-200
        ${error ? 'border-red-400 bg-red-50' : ''}
      `}
      {...props}
    />
  )
}

export function PhotoUpload({ label = 'Upload Photo', value, onChange, preview, error }) {
  return (
    <div className="flex flex-col gap-[5px]">
      {label && (
        <label className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.8px]">
          {label}
        </label>
      )}
      <div className={`
        relative border-2 border-dashed rounded-[12px] p-[16px]
        flex flex-col items-center justify-center gap-[8px]
        cursor-pointer transition-all duration-200
        ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-[#F05A1A] hover:bg-[#FFF3EC]'}
      `}>
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {preview ? (
          <img src={preview} alt="preview" className="w-[80px] h-[80px] rounded-[10px] object-cover" />
        ) : (
          <>
            <div className="w-[44px] h-[44px] rounded-full bg-[#FFF3EC] flex items-center justify-center">
              <span className="text-[20px]">📷</span>
            </div>
            <p className="text-[12.5px] text-slate-500 font-medium text-center">
              Click to upload photo<br />
              <span className="text-[11px] text-slate-400">All image formats — max 10MB</span>
            </p>
          </>
        )}
      </div>
      {error && <p className="text-[11.5px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}

export function SubmitBtn({ loading, children = 'Save', onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
        px-[24px] h-[42px] rounded-[10px]
        bg-gradient-to-r from-[#F05A1A] to-[#FF7D42]
        text-white text-[13px] font-extrabold
        shadow-[0_4px_14px_rgba(240,90,26,0.3)]
        hover:-translate-y-[1px] hover:shadow-[0_6px_18px_rgba(240,90,26,0.4)]
        active:scale-[0.97] transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center gap-[8px]
      "
    >
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />}
      {children}
    </button>
  )
}

export function CancelBtn({ onClick, children = 'Cancel' }) {
  return (
    <button
      onClick={onClick}
      className="
        px-[20px] h-[42px] rounded-[10px]
        border border-slate-200 bg-white
        text-[13px] font-bold text-slate-600
        hover:bg-slate-50 hover:border-slate-300
        active:scale-[0.97] transition-all duration-200
      "
    >
      {children}
    </button>
  )
}