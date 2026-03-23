import Head from 'next/head'

const RESUME_BASE_SEGMENT = 'cv-noo10mi4km'

export async function getStaticProps() {
  const fs = require('fs')
  const path = require('path')
  const dashboardPath = path.join(
    process.cwd(),
    'public',
    RESUME_BASE_SEGMENT,
    'headhunter-dashboard.json'
  )

  let dashboard = {
    updatedAt: null,
    generatedForWeek: null,
    weeklyBaseline: [],
    additionalCandidates: [],
    excluded: [],
    reasoningSteps: [],
    debugLog: [],
  }

  if (fs.existsSync(dashboardPath)) {
    dashboard = JSON.parse(fs.readFileSync(dashboardPath, 'utf8'))
  }

  return {
    props: {
      dashboard,
    },
  }
}

function CandidateCard({ item, ranked = false, excluded = false }) {
  return (
    <article style={styles.card}>
      <div style={styles.topline}>
        <div>
          {ranked && item.rank ? <div style={styles.rank}>#{item.rank}</div> : null}
          <div style={styles.company}>{item.company || 'Unknown company'}</div>
        </div>
        <div style={styles.score}>{item.score != null ? `score ${item.score}` : ''}</div>
      </div>
      <div style={styles.role}>{item.position || ''}</div>
      <div style={styles.metaRow}>
        <span style={{ ...styles.chip, ...styles.stateChip }}>{item.status || 'unknown'}</span>
        <span style={{ ...styles.chip, ...(item.urgency === 'urgent' ? styles.urgentChip : {}) }}>
          {item.deadline || 'deadline unknown'}
        </span>
        <span style={styles.chip}>{item.preferenceGroup || item.source || ''}</span>
      </div>
      {Array.isArray(item.whyIncluded) && item.whyIncluded.length ? (
        <ul style={styles.whyList}>
          {item.whyIncluded.map((line, index) => (
            <li key={`${item.jobId}-${index}`}>{line}</li>
          ))}
        </ul>
      ) : null}
      {excluded ? (
        <div style={styles.excludeText}>제외 사유: {item.exclusionReason || '-'}</div>
      ) : null}
      <div style={styles.links}>
        <a href={item.resumeUrl} style={styles.link}>
          resume
        </a>
        {item.canonicalUrl ? (
          <a href={item.canonicalUrl} target="_blank" rel="noreferrer" style={styles.link}>
            JD
          </a>
        ) : null}
      </div>
    </article>
  )
}

function LineBlock({ lines }) {
  if (!lines.length) {
    return <div style={styles.empty}>항목이 없습니다.</div>
  }

  return (
    <div style={styles.logBlock}>
      {lines.map((line, index) => (
        <div key={index} style={styles.logLine}>
          {line}
        </div>
      ))}
    </div>
  )
}

export default function HeadhunterDashboardPage({ dashboard }) {
  const updatedLabel = dashboard.updatedAt
    ? new Date(dashboard.updatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    : '-'

  return (
    <>
      <Head>
        <title>Headhunter Dashboard</title>
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Head>
      <main style={styles.page}>
        <div style={styles.container}>
          <p style={styles.eyebrow}>Private Headhunter Workspace</p>
          <h1 style={styles.title}>헤드헌터 대시보드</h1>
          <p style={styles.description}>
            하나의 링크에서 금주 baseline, 신규 편입 후보, 제외 항목, reasoning steps, debug log를
            함께 보는 운영용 대시보드입니다.
          </p>
          <p style={styles.meta}>
            업데이트: {updatedLabel} · 기준 주차: {dashboard.generatedForWeek || '-'}
          </p>

          <h2 style={styles.sectionTitle}>금주 지원대상</h2>
          <section style={styles.grid}>
            {dashboard.weeklyBaseline.length ? (
              dashboard.weeklyBaseline.map((item) => (
                <CandidateCard key={item.jobId} item={item} ranked />
              ))
            ) : (
              <div style={styles.empty}>금주 baseline이 없습니다.</div>
            )}
          </section>

          <h2 style={styles.sectionTitle}>신규 지원대상 / 추가 검토 후보</h2>
          <section style={styles.grid}>
            {dashboard.additionalCandidates.length ? (
              dashboard.additionalCandidates.map((item) => (
                <CandidateCard key={item.jobId} item={item} />
              ))
            ) : (
              <div style={styles.empty}>추가 후보가 없습니다.</div>
            )}
          </section>

          <h2 style={styles.sectionTitle}>지원 제외 / 완료 / 종료</h2>
          <section style={styles.grid}>
            {dashboard.excluded.length ? (
              dashboard.excluded.map((item) => (
                <CandidateCard key={`ex-${item.jobId}`} item={item} excluded />
              ))
            ) : (
              <div style={styles.empty}>제외 항목이 없습니다.</div>
            )}
          </section>

          <h2 style={styles.sectionTitle}>지원대상회사 검출/선별 리즈닝</h2>
          <LineBlock lines={dashboard.reasoningSteps} />

          <h2 style={styles.sectionTitle}>디버그 로그</h2>
          <LineBlock lines={dashboard.debugLog} />
        </div>
      </main>
    </>
  )
}

HeadhunterDashboardPage.disableLayout = true

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px 60px',
    background: '#0b1020',
    color: '#e5e7eb',
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '1100px',
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
    margin: '0 0 8px',
    color: '#cbd5e1',
    lineHeight: 1.6,
  },
  meta: {
    color: '#94a3b8',
    margin: '0 0 24px',
  },
  sectionTitle: {
    margin: '30px 0 12px',
    fontSize: '1.15rem',
  },
  grid: {
    display: 'grid',
    gap: '14px',
  },
  card: {
    border: '1px solid #243041',
    borderRadius: '14px',
    background: '#111827',
    padding: '16px 18px',
  },
  topline: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '8px',
  },
  rank: {
    color: '#93c5fd',
    fontWeight: 700,
    marginBottom: '2px',
  },
  score: {
    color: '#93c5fd',
    fontWeight: 700,
  },
  company: {
    fontWeight: 700,
  },
  role: {
    fontSize: '1.02rem',
    fontWeight: 600,
    marginBottom: '8px',
  },
  metaRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  chip: {
    fontSize: '.84rem',
    padding: '4px 8px',
    borderRadius: '999px',
    background: '#172033',
    color: '#cbd5e1',
    border: '1px solid #243041',
  },
  stateChip: {
    background: '#132238',
    color: '#bfdbfe',
    borderColor: '#23405f',
  },
  urgentChip: {
    background: '#3a1620',
    color: '#fecdd3',
    borderColor: '#6b2334',
  },
  whyList: {
    margin: '0 0 10px 18px',
    color: '#cbd5e1',
    lineHeight: 1.55,
  },
  excludeText: {
    color: '#fca5a5',
    marginBottom: '10px',
  },
  links: {
    display: 'flex',
    gap: '12px',
  },
  link: {
    color: '#93c5fd',
    textDecoration: 'none',
  },
  logBlock: {
    border: '1px solid #243041',
    borderRadius: '14px',
    background: '#111827',
    overflow: 'hidden',
  },
  logLine: {
    padding: '10px 14px',
    borderTop: '1px solid #1b2433',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '.9rem',
    color: '#cbd5e1',
  },
  empty: {
    color: '#94a3b8',
    border: '1px dashed #243041',
    borderRadius: '14px',
    padding: '16px',
  },
}
