// admin/components/Modal.jsx
import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm:  'max-w-[440px]',
    md:  'max-w-[620px]',
    lg:  'max-w-[820px]',
    xl:  'max-w-[1020px]',
    full:'max-w-[95vw]',
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[16px] bg-[rgba(7,20,46,0.55)] backdrop-blur-[3px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`
        w-full ${sizes[size]} bg-white rounded-[20px]
        shadow-[0_24px_80px_rgba(11,30,75,0.22)]
        flex flex-col max-h-[90vh]
        animate-[modalIn_0.25s_ease]
      `}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[18px] border-b border-slate-100 flex-shrink-0">
          <h3 className="font-extrabold text-[#0B1E4B] text-[16px] m-0">{title}</h3>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <FaTimes className="text-[12px]" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-[24px]">
          {children}
        </div>
      </div>
    </div>
  )
}