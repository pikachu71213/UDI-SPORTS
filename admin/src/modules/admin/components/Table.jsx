// admin/components/Table.jsx
import Spinner from './Spinner'
import { FaInbox } from 'react-icons/fa'

/**
 * Reusable Table
 * Props:
 *   columns: [{ key, label, render? }]
 *   data:    array of objects
 *   loading: bool
 *   emptyText: string
 */
export default function Table({ columns, data, loading, emptyText = 'No records found' }) {
  return (
    <div className="w-full overflow-x-auto rounded-[14px] border border-slate-100 bg-white shadow-[0_2px_12px_rgba(11,30,75,0.06)]">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-[#0B1E4B] to-[#152B6B]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-[16px] py-[13px] text-left text-[11px] font-extrabold text-white uppercase tracking-[1.5px] whitespace-nowrap first:rounded-tl-[14px] last:rounded-tr-[14px]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-[40px]">
                <Spinner center size="md" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center py-[48px] gap-[10px]">
                  <FaInbox className="text-slate-200 text-[40px]" />
                  <p className="text-slate-400 text-[13px] font-semibold">{emptyText}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr
                key={row.id || row._id || rIdx}
                className="border-b border-slate-50 hover:bg-[#fafbff] transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-[16px] py-[12px] text-[13px] text-slate-700 font-medium"
                  >
                    {col.render ? col.render(row[col.key], row, rIdx) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}