// admin/hooks/ToastContext.js
import { createContext, useContext } from 'react'
export const ToastContext = createContext(null)
export const useAdminToast = () => useContext(ToastContext)