// admin/components/ActionButtons.jsx
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'

export default function ActionButtons({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-[8px]">
      {onView && (
        <button
          onClick={onView}
          title="View"
          className="w-[30px] h-[30px] rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200"
        >
          <FaEye className="text-[12px]" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          title="Edit"
          className="w-[30px] h-[30px] rounded-[8px] bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all duration-200"
        >
          <FaEdit className="text-[12px]" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          title="Delete"
          className="w-[30px] h-[30px] rounded-[8px] bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <FaTrash className="text-[12px]" />
        </button>
      )}
    </div>
  )
}