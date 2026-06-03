// admin/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'
import authService from '../services/authService'
// In production admin runs under /admin/, so use base-aware public asset paths.
const logo = `${import.meta.env.BASE_URL}white-short-logo.webp`
const fallbackLogo = `${import.meta.env.BASE_URL}short-logo.webp`

// ── Field MUST be outside Login component ─────────────────────────────────────
// Defining it inside causes re-mount on every keystroke → input loses focus
function Field({ name, label, type, icon: Icon, placeholder, value, onChange, showPass, onTogglePass, error }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[12px] font-bold text-slate-600 uppercase tracking-[0.8px]">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-[13px] top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none" />
        <input
          type={name === 'password' ? (showPass ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full h-[46px] pl-[38px] ${name === 'password' ? 'pr-[42px]' : 'pr-[14px]'} rounded-[12px]
            border ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'}
            text-[13.5px] font-medium text-slate-700 placeholder:text-slate-300
            focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10
            transition-all duration-200
          `}
        />
        {name === 'password' && (
          <button
            type="button"
            onClick={onTogglePass}
            className="absolute right-[13px] top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPass ? <FaEyeSlash className="text-[13px]" /> : <FaEye className="text-[13px]" />}
          </button>
        )}
      </div>
      {error && <p className="text-[11.5px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  const validate = () => {
    const err = {}
    if (!form.email)    err.email    = 'Email is required'
    if (!form.password) err.password = 'Password is required'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiErr('')
    try {
      const { data } = await authService.login(form)
      localStorage.setItem('adminToken', data.token)
      const loggedInEmail = data?.admin?.email || form.email
      if (loggedInEmail) localStorage.setItem('adminEmail', loggedInEmail)
      navigate('/admin/dashboard')
    } catch (err) {
      setApiErr(err?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07142e] via-[#0B1E4B] to-[#0f2560] flex items-center justify-center p-[16px]">

      {/* BG decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[rgba(240,90,26,0.08)]" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[rgba(240,90,26,0.05)]" />
      </div>

      <div className="relative w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-[32px] flex justify-center flex-col items-center gap-[4px]">
          <img
            src={logo}
            alt="logo"
            className="w-full max-w-[45px]"
            onError={(e) => {
              // Fallback for deployments where white logo is unavailable.
              e.currentTarget.src = fallbackLogo
            }}
          />
          <h1 className="text-white text-[26px] font-extrabold m-0 leading-tight">UDIISA</h1>
          <p className="text-white/50 text-[13px] m-0 mt-[4px]">Admin Panel</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.3)] p-[32px] flex flex-col gap-[18px]"
        >
          <div>
            <h2 className="text-[20px] font-extrabold text-[#0B1E4B] m-0">Welcome Back</h2>
            <p className="text-[13px] text-slate-400 m-0 mt-[3px]">Sign in to your admin account</p>
          </div>

          {apiErr && (
            <div className="bg-red-50 border border-red-200 rounded-[10px] px-[14px] py-[10px] text-red-600 text-[13px] font-semibold">
              {apiErr}
            </div>
          )}

          <Field
            name="email"
            label="Email"
            type="email"
            icon={FaEnvelope}
            placeholder="admin@udisports.in"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
            error={errors.email}
          />

          <Field
            name="password"
            label="Password"
            type="password"
            icon={FaLock}
            placeholder="Enter your password"
            value={form.password}
            onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
            showPass={show}
            onTogglePass={() => setShow(s => !s)}
            error={errors.password}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-[46px] rounded-[12px]
              bg-gradient-to-r from-[#F05A1A] to-[#FF7D42]
              text-white text-[14px] font-extrabold
              shadow-[0_6px_20px_rgba(240,90,26,0.35)]
              hover:shadow-[0_8px_28px_rgba(240,90,26,0.5)] hover:-translate-y-[1px]
              active:scale-[0.98] transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-[8px]
            "
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-center text-[12px] text-slate-400">
            Forgot password?{' '}
            <a href="/admin/forgot-password" className="text-[#F05A1A] font-bold hover:underline">
              Reset here
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}