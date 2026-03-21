/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'

const HIDDEN_SEGMENT = 'wz-7mN4pQ2x9L'

function sourcePalette(source) {
  if (source === 'xwine.club') return { bg: '#1e3a8a', fg: '#eff6ff', label: 'XW' }
  if (source === 'selectwine.kr') return { bg: '#7f1d1d', fg: '#fef2f2', label: 'SW' }
  if (source === 'purpler.co.kr') return { bg: '#4a044e', fg: '#faf5ff', label: 'PP' }
  return { bg: '#334155', fg: '#f8fafc', label: 'WW' }
}

function buildFallbackImageDataUri(source) {
  const { bg, fg, label } = sourcePalette(source)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120" font-family="Arial, Helvetica, sans-serif" fill="${fg}">${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    ...item,
    id: item.id || `${item.source || 'unknown'}:${item.externalId || index}`,
    position: Number(item.position || index + 1),
    firstSeenAt: item.firstSeenAt || null,
    lastSeenAt: item.lastSeenAt || null,
    fallbackImageUrl: item.fallbackImageUrl || buildFallbackImageDataUri(item.source || 'unknown'),
  }))
}

function getTimeValue(value) {
  if (!value) return Number.NEGATIVE_INFINITY
  const normalized = typeof value === 'string' ? value.replace(' ', 'T') : value
  const timestamp = new Date(normalized).getTime()
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp
}

function resolveApiUrl(initialApiUrl) {
  return initialApiUrl || '/api/wine-watch'
}

function WatchImage({ item, compact }) {
  const [src, setSrc] = useState(item.imageUrl || item.fallbackImageUrl)

  useEffect(() => {
    setSrc(item.imageUrl || item.fallbackImageUrl)
  }, [item.fallbackImageUrl, item.imageUrl])

  return (
    <div style={compact ? styles.thumbSmallFrame : styles.thumbFrame}>
      <img
        src={src}
        alt={`${item.name} preview`}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={compact ? styles.thumbSmall : styles.thumb}
        onError={() => {
          if (src !== item.fallbackImageUrl) {
            setSrc(item.fallbackImageUrl)
          }
        }}
      />
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      apiUrl: '/api/wine-watch',
    },
  }
}

export default function HiddenWineWatchPage({ apiUrl }) {
  const [isCompact, setIsCompact] = useState(false)
  const [items, setItems] = useState([])
  const [capturedAt, setCapturedAt] = useState(null)
  const [sourceLabel, setSourceLabel] = useState(apiUrl || 'API not configured')
  const [readError, setReadError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const targetUrl = resolveApiUrl(apiUrl)
    setSourceLabel(targetUrl || 'No API URL configured')

    if (!targetUrl) {
      setReadError('Same-domain API route is unavailable.')
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setIsLoading(true)

      try {
        const response = await fetch(targetUrl, { cache: 'no-store' })
        const payload = await response.json()

        if (!response.ok || payload.ok === false) {
          throw new Error(payload.error || `Request failed: ${response.status}`)
        }

        if (!cancelled) {
          setItems(normalizeItems(payload.items))
          setCapturedAt(payload.capturedAt || payload.generatedAt || null)
          setReadError(null)
        }
      } catch (error) {
        if (!cancelled) {
          setItems([])
          setCapturedAt(null)
          setReadError(error.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [apiUrl])

  const groupedCount = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1
      return acc
    }, {})
  }, [items])

  const displayItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const firstSeenDelta = getTimeValue(b.firstSeenAt) - getTimeValue(a.firstSeenAt)
      if (firstSeenDelta !== 0) return firstSeenDelta

      const snapshotDelta = getTimeValue(b.snapshotCapturedAt) - getTimeValue(a.snapshotCapturedAt)
      if (snapshotDelta !== 0) return snapshotDelta

      const positionDelta = (a.position || 0) - (b.position || 0)
      if (positionDelta !== 0) return positionDelta

      return (a.source || '').localeCompare(b.source || '')
    })
  }, [items])

  const orderingLabel = useMemo(() => {
    if (items.some((item) => item.firstSeenAt)) {
      return 'Order: latest collected first (first seen time)'
    }

    return 'Order: snapshot position fallback'
  }, [items])

  return (
    <>
      <Head>
        <title>Wine Watch Viewer</title>
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Head>
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <p style={styles.eyebrow}>Hidden watcher view</p>
            <h1 style={styles.title}>Current watched items</h1>
            <p style={styles.description}>
              Live snapshot from <code>{sourceLabel}</code>
            </p>
            <div style={styles.metaRow}>
              <span>Path: /{HIDDEN_SEGMENT}</span>
              <span>Items: {items.length}</span>
              <span>Captured: {capturedAt || 'unknown'}</span>
              <span style={styles.orderTag}>{orderingLabel}</span>
            </div>
            <div style={styles.metaRow}>
              {Object.entries(groupedCount).map(([source, count]) => (
                <span key={source} style={styles.pill}>
                  {source}: {count}
                </span>
              ))}
            </div>
            <button
              type="button"
              style={styles.toggle}
              onClick={() => setIsCompact((prev) => !prev)}
              aria-pressed={isCompact}
            >
              {isCompact ? 'Switch to grid cards' : 'Switch to compact list'}
            </button>
          </header>

          {isLoading ? <section style={styles.emptyBox}>Loading latest snapshot…</section> : null}

          {readError ? (
            <section style={styles.errorBox}>
              Failed to read watcher API.
              <br />
              <code>{readError}</code>
            </section>
          ) : null}

          {!isLoading && !readError && items.length === 0 ? (
            <section style={styles.emptyBox}>No watched items found in the API response.</section>
          ) : null}

          {!readError && items.length > 0 ? (
            <section style={isCompact ? styles.list : styles.grid}>
              {displayItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.cardLink}
                >
                  <article style={isCompact ? styles.listRow : styles.card}>
                    <WatchImage item={item} compact={isCompact} />
                    <div style={styles.content}>
                      <p style={styles.name}>{item.name}</p>
                      <div style={styles.detailRow}>
                        <span style={styles.platform}>{item.source}</span>
                        <span style={styles.price}>{item.price}</span>
                      </div>
                      <span style={styles.link}>Open seller page ↗</span>
                    </div>
                  </article>
                </a>
              ))}
            </section>
          ) : null}
        </div>
      </main>
    </>
  )
}

HiddenWineWatchPage.disableLayout = true

const styles = {
  page: {
    minHeight: '100vh',
    padding: '20px 12px 36px',
    background: 'linear-gradient(160deg, #0b1324 0%, #15132a 55%, #0f172a 100%)',
    color: '#e5e7eb',
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '1080px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '18px',
  },
  eyebrow: {
    margin: 0,
    color: '#93c5fd',
    letterSpacing: '0.08em',
    fontSize: '0.84rem',
    textTransform: 'uppercase',
  },
  title: {
    margin: '8px 0 10px',
    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
    lineHeight: 1.2,
  },
  description: {
    margin: '0 0 10px',
    color: '#cbd5e1',
    wordBreak: 'break-all',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 12px',
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginBottom: '8px',
  },
  pill: {
    padding: '2px 10px',
    border: '1px solid #2f3f56',
    borderRadius: '999px',
  },
  orderTag: {
    padding: '2px 10px',
    border: '1px solid #32506f',
    borderRadius: '999px',
    color: '#bfdbfe',
    background: 'rgba(30, 41, 59, 0.45)',
  },
  toggle: {
    marginTop: '6px',
    border: '1px solid #304566',
    borderRadius: '10px',
    background: '#111d33',
    color: '#dbeafe',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  errorBox: {
    marginTop: '12px',
    marginBottom: '12px',
    border: '1px solid #ef4444',
    borderRadius: '12px',
    background: 'rgba(127, 29, 29, 0.4)',
    color: '#fee2e2',
    padding: '12px 14px',
    lineHeight: 1.5,
  },
  emptyBox: {
    marginTop: '12px',
    marginBottom: '12px',
    border: '1px solid #334155',
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.45)',
    color: '#cbd5e1',
    padding: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
    gap: '10px',
  },
  list: {
    display: 'grid',
    gap: '8px',
  },
  cardLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  card: {
    border: '1px solid #2a3b52',
    borderRadius: '14px',
    background: 'rgba(12, 21, 37, 0.88)',
    overflow: 'hidden',
    height: '100%',
    boxShadow: '0 16px 34px rgba(2, 6, 23, 0.24)',
  },
  listRow: {
    border: '1px solid #2a3b52',
    borderRadius: '12px',
    background: 'rgba(12, 21, 37, 0.78)',
    display: 'grid',
    gridTemplateColumns: '96px minmax(0, 1fr)',
    overflow: 'hidden',
  },
  thumbFrame: {
    width: '100%',
    aspectRatio: '4 / 5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.94) 0%, rgba(15, 23, 42, 0.98) 100%)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
  },
  thumbSmallFrame: {
    width: '100%',
    height: '100%',
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.94) 0%, rgba(15, 23, 42, 0.98) 100%)',
    borderRight: '1px solid rgba(148, 163, 184, 0.14)',
  },
  thumb: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
    display: 'block',
    background: 'transparent',
  },
  thumbSmall: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
    display: 'block',
    background: 'transparent',
  },
  content: {
    padding: '10px 10px 11px',
  },
  name: {
    margin: 0,
    fontWeight: 700,
    lineHeight: 1.32,
    marginBottom: '6px',
    fontSize: '0.95rem',
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    marginBottom: '8px',
    color: '#cbd5e1',
    fontSize: '0.84rem',
  },
  platform: {
    color: '#93c5fd',
    fontWeight: 600,
  },
  price: {
    whiteSpace: 'nowrap',
    fontWeight: 700,
    color: '#f8fafc',
  },
  link: {
    color: '#7dd3fc',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    fontSize: '0.82rem',
  },
}
