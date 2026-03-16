import Head from 'next/head'

const RESUME_BASE_SEGMENT = 'cv-noo10mi4km'

export async function getStaticProps() {
  const fs = require('fs')
  const path = require('path')
  const manifestPath = path.join(
    process.cwd(),
    'public',
    RESUME_BASE_SEGMENT,
    'tailored-resumes',
    'manifest.json'
  )

  let drafts = []
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    drafts = Array.isArray(manifest.drafts) ? manifest.drafts : []
  }

  return {
    props: {
      drafts,
    },
  }
}

export default function TailoredResumeIndexPage({ drafts }) {
  return (
    <>
      <Head>
        <title>Tailored Resume Drafts</title>
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Head>
      <main style={styles.page}>
        <div style={styles.container}>
          <p style={styles.eyebrow}>Private CV Workspace</p>
          <h1 style={styles.title}>Tailored resume drafts</h1>
          <p style={styles.description}>
            One stable entry point for reviewing job-specific resume drafts.
          </p>

          <ul style={styles.list}>
            {drafts.map((draft) => {
              const href = `/${RESUME_BASE_SEGMENT}/tailored-resumes/${draft.fileName}`
              return (
                <li key={draft.fileName} style={styles.card}>
                  <a href={href} style={styles.link}>
                    <div style={styles.linkHeader}>
                      <strong style={styles.company}>
                        {draft.companyName || 'Unknown company'}
                      </strong>
                      <span style={styles.score}>score {draft.totalScore ?? '-'}</span>
                    </div>
                    <div style={styles.role}>{draft.jobTitle || draft.title || draft.fileName}</div>
                    {draft.narrativeTitle ? (
                      <div style={styles.narrative}>{draft.narrativeTitle}</div>
                    ) : null}
                    <div style={styles.meta}>
                      <span>{draft.applicationState || 'unknown state'}</span>
                      {draft.closingAt ? <span>마감 {draft.closingAt}</span> : null}
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>

          {drafts.length === 0 ? <p style={styles.empty}>No tailored drafts found yet.</p> : null}
        </div>
      </main>
    </>
  )
}

TailoredResumeIndexPage.disableLayout = true

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px',
    background: '#0b1020',
    color: '#e5e7eb',
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  eyebrow: {
    margin: 0,
    color: '#93c5fd',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    margin: '10px 0 12px',
    fontSize: '2.1rem',
  },
  description: {
    margin: '0 0 24px',
    color: '#cbd5e1',
    lineHeight: 1.6,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '14px',
  },
  card: {
    border: '1px solid #243041',
    borderRadius: '14px',
    background: '#111827',
    overflow: 'hidden',
  },
  link: {
    display: 'block',
    padding: '18px 20px',
    color: 'inherit',
    textDecoration: 'none',
  },
  linkHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'baseline',
    marginBottom: '8px',
  },
  company: {
    fontSize: '1rem',
  },
  score: {
    fontSize: '0.9rem',
    color: '#93c5fd',
    whiteSpace: 'nowrap',
  },
  role: {
    fontSize: '1.05rem',
    fontWeight: 600,
    marginBottom: '6px',
  },
  narrative: {
    color: '#cbd5e1',
    marginBottom: '8px',
    lineHeight: 1.5,
  },
  meta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
  empty: {
    marginTop: '18px',
    color: '#94a3b8',
  },
}
