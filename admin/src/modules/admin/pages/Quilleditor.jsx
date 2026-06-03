// components/QuillEditor.jsx
// Drop-in replacement for TinyMCE — no API key required
import { useEffect, useRef } from 'react'

// v1.3.7 — stable, window.Quill works correctly
const QUILL_CSS = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css'
const QUILL_JS  = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // If Quill is already available, no need to wait.
    if (window.Quill) {
      resolve()
      return
    }

    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      // Script tag exists but may still be loading. Wait for load/error.
      const handleLoad = () => resolve()
      const handleError = () => reject(new Error(`Failed to load script: ${src}`))
      existing.addEventListener('load', handleLoad, { once: true })
      existing.addEventListener('error', handleError, { once: true })

      // If browser already loaded it before listeners were attached.
      setTimeout(() => {
        if (window.Quill) resolve()
      }, 0)
      return
    }

    const s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function loadStyle(href) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'; l.href = href
  document.head.appendChild(l)
}

// Pass modal open state via isOpen so first render initializes correctly.
export default function QuillEditor({ value = '', onChange, height = 350, isOpen = true }) {
  const containerRef = useRef(null)
  const quillRef     = useRef(null)
  const skipRef      = useRef(false)

  // Re-initialize Quill whenever isOpen toggles (false -> true).
  useEffect(() => {
    if (!isOpen) {
      // Modal closed: clear Quill instance so next open starts fresh.
      if (quillRef.current) {
        quillRef.current = null
      }
      return
    }

    let mounted = true

    const init = async (attempt = 0) => {
      loadStyle(QUILL_CSS)
      await loadScript(QUILL_JS)

      // Wait for full DOM paint before editor initialization.
      await new Promise(res => requestAnimationFrame(() => setTimeout(res, 0)))

      if (!mounted || !containerRef.current || quillRef.current) return

      const QuillConstructor = window.Quill
      if (!QuillConstructor) {
        // Rare race: retry once shortly if script global isn't ready yet.
        if (attempt < 1) {
          setTimeout(() => { if (mounted) init(attempt + 1) }, 120)
        }
        return
      }

      // Clear container first to avoid stale DOM nodes.
      containerRef.current.innerHTML = ''

      const quill = new QuillConstructor(containerRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'blockquote', 'code-block'],
            ['clean'],
          ],
        },
      })

      // Set initial HTML value.
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value)
      }

      quill.on('text-change', () => {
        if (skipRef.current) return
        const html = quill.root.innerHTML
        onChange?.(html === '<p><br></p>' ? '' : html)
      })

      quillRef.current = quill
    }

    init()
    return () => { mounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Sync external value updates (e.g. form reset) while avoiding feedback loops.
  useEffect(() => {
    const quill = quillRef.current
    if (!quill) return
    const current = quill.root.innerHTML
    const isEmpty = current === '<p><br></p>' || current === ''
    if (current === value || (isEmpty && !value)) return
    skipRef.current = true
    quill.clipboard.dangerouslyPasteHTML(value || '')
    setTimeout(() => { skipRef.current = false }, 0)
  }, [value])

  return (
    <div
      style={{ minHeight: height }}
      className="quill-wrapper rounded-[10px] border border-slate-200 overflow-hidden bg-white"
    >
      <div ref={containerRef} style={{ minHeight: height - 42 }} />

      <style>{`
        .quill-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
          padding: 8px 10px;
        }
        .quill-wrapper .ql-container {
          border: none !important;
          font-size: 13.5px;
          font-family: inherit;
        }
        .quill-wrapper .ql-editor {
          min-height: ${height - 42}px;
          padding: 14px 16px;
          color: #334155;
          line-height: 1.7;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
          font-size: 13.5px;
        }
        .quill-wrapper .ql-toolbar button:hover .ql-stroke,
        .quill-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #F05A1A !important;
        }
        .quill-wrapper .ql-toolbar button:hover .ql-fill,
        .quill-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #F05A1A !important;
        }
        .quill-wrapper .ql-toolbar .ql-picker-label:hover,
        .quill-wrapper .ql-toolbar .ql-picker-item:hover {
          color: #F05A1A !important;
        }
      `}</style>
    </div>
  )
}