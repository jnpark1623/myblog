import Head from 'next/head'
import { useCallback, useMemo, useRef } from 'react'

export default function ResumeHtmlPage({ bodyHtml, title, styles }) {
  const iframeRef = useRef(null)

  const syncHeight = useCallback(() => {
    const iframe = iframeRef.current
    const doc = iframe?.contentDocument

    if (!iframe || !doc) {
      return
    }

    const nextHeight = Math.max(
      doc.documentElement?.scrollHeight || 0,
      doc.body?.scrollHeight || 0,
      window.innerHeight
    )

    iframe.style.height = `${nextHeight}px`
  }, [])

  const srcDoc = useMemo(
    () => `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow, noarchive" />
  <meta name="color-scheme" content="light only" />
  <base target="_top" />
  <title>${escapeHtml(title)}</title>
  <style>${styles}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`,
    [bodyHtml, styles, title]
  )

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current
    const win = iframe?.contentWindow
    const doc = iframe?.contentDocument

    syncHeight()

    if (!win || !doc) {
      return
    }

    const scheduleHeightSync = () => win.requestAnimationFrame(syncHeight)

    win.addEventListener('resize', scheduleHeightSync)
    doc.fonts?.ready?.then(scheduleHeightSync).catch(() => {})

    if (typeof win.ResizeObserver === 'function') {
      const observer = new win.ResizeObserver(scheduleHeightSync)
      observer.observe(doc.documentElement)
      observer.observe(doc.body)
      iframe.__resumeObserver = observer
    }
  }, [syncHeight])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="color-scheme" content="light only" />
      </Head>
      <iframe
        ref={iframeRef}
        title={title}
        srcDoc={srcDoc}
        onLoad={handleLoad}
        sandbox="allow-same-origin allow-top-navigation-by-user-activation"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '100vh',
          border: 0,
          background: '#f7f9fc',
          colorScheme: 'light',
        }}
      />
    </>
  )
}

ResumeHtmlPage.disableLayout = true

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
