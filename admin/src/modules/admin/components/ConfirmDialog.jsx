// admin/components/ConfirmDialog.jsx
import Modal from './Modal'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Delete', message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-[14px]">
        <div className="w-[56px] h-[56px] rounded-full bg-red-50 flex items-center justify-center">
          <FaExclamationTriangle className="text-red-500 text-[22px]" />
        </div>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          {message || 'Are you sure you want to delete this record? This action cannot be undone.'}
        </p>
        <div className="flex gap-[10px] mt-[4px]">
          <button
            onClick={onClose}
            className="px-[20px] h-[40px] rounded-[10px] border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-[20px] h-[40px] rounded-[10px] bg-red-500 text-white text-[13px] font-extrabold hover:bg-red-600 disabled:opacity-60 flex items-center gap-[8px] transition-all"
          >
            {loading && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}