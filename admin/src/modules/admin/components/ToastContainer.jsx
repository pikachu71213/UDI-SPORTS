// admin/components/ToastContainer.jsx
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa'

const ICONS = {
  success: <FaCheckCircle className="text-green-500 text-[16px] flex-shrink-0" />,
  error:   <FaTimesCircle className="text-red-500 text-[16px] flex-shrink-0" />,
  info:    <FaInfoCircle className="text-blue-500 text-[16px] flex-shrink-0" />,
  warning: <FaExclamationTriangle className="text-yellow-500 text-[16px] flex-shrink-0" />,
}

const BG = {
  success: 'border-l-green-500',
  error:   'border-l-red-500',
  info:    'border-l-blue-500',
  warning: 'border-l-yellow-500',
}

function Toast({ toast, onRemove }) {
  return (
    <div className={`
      flex items-start gap-[10px]
      bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]
      border border-slate-100 border-l-4 ${BG[toast.type]}
      px-[16px] py-[12px] min-w-[280px] max-w-[380px]
      animate-[slideIn_0.3s_ease]
    `}>
      {ICONS[toast.type]}
      <p className="flex-1 text-[13px] font-semibold text-slate-700 leading-snug">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
        <FaTimes className="text-[11px]" />
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-[16px] right-[16px] z-[9999] flex flex-col gap-[8px]">
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
      {toasts.map(t => <Toast key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  )
}