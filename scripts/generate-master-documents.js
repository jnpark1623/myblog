const fs = require('fs')
const path = require('path')

// Renders the two master documents from cv-private/resume-profile.json:
//   - 이력서 (master-base-resume): prose-first summary of who he is and what he did.
//   - 경력기술서 (master-career-description): selected cases, told in detail.
// The split is deliberate: the resume carries the narrative, the career
// description carries the depth. Neither repeats the other's sentences.

const ROOT = path.join(__dirname, '..')
const PROFILE_PATH = path.join(ROOT, 'cv-private', 'resume-profile.json')
const TOKENS_PATH = path.join(ROOT, 'cv-private', 'share-tokens.json')
const OUTPUT_DIR = path.join(ROOT, 'cv-private', 'resumes')

const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'))
const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'))

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// A company either splits its cases into labelled groups (사업 성과 /
// 엔지니어링 성과) or has a single unlabelled set. Normalise both to groups.
function caseGroupsFor(experience) {
  if (experience.caseGroups) {
    return experience.caseGroups
  }
  const cases = experience.cases || []
  return cases.length ? [{ label: null, cases }] : []
}

function caseCountFor(experience) {
  return caseGroupsFor(experience).reduce((total, group) => total + group.cases.length, 0)
}

function assertProfile() {
  for (const document of Object.values(profile.documents)) {
    if (tokens[document.slug] !== document.token) {
      throw new Error(`token mismatch for ${document.slug}`)
    }
  }

  const anchors = new Set()
  for (const experience of profile.experiences) {
    if (!experience.resumeSummary.length || !experience.overview.length) {
      throw new Error(`${experience.company} is missing prose`)
    }
    if (anchors.has(experience.anchor)) {
      throw new Error(`duplicate anchor: ${experience.anchor}`)
    }
    anchors.add(experience.anchor)

    for (const group of caseGroupsFor(experience)) {
      for (const caseItem of group.cases) {
        if (!caseItem.problem || !caseItem.body.length || !caseItem.result) {
          throw new Error(`incomplete case in ${experience.company}: ${caseItem.title}`)
        }
      }
    }
  }
}

function docPath(document) {
  return `/r/${escapeHtml(document.token)}`
}

function docUrl(document) {
  return `${profile.siteOrigin}/r/${escapeHtml(document.token)}`
}

function paragraphs(items) {
  return items.map((text) => `<p>${escapeHtml(text)}</p>`).join('\n            ')
}

function contactList() {
  const basics = profile.basics
  return [
    ['생년월일', basics.birthDate],
    ['이메일', basics.email],
    ['전화', basics.phone],
    ['지역', basics.location],
    ['LinkedIn', basics.linkedinUrl],
  ]
    .map(
      ([label, value]) =>
        `            <li><span class="label">${escapeHtml(label)}</span><br/>${escapeHtml(
          value
        )}</li>`
    )
    .join('\n')
}

function documentNav(active) {
  const links = [
    ['resume', profile.documents.resume],
    ['career', profile.documents.careerDescription],
  ]
    .map(([key, document]) => {
      const state = key === active ? ' class="active" aria-current="page"' : ''
      return `        <a${state} href="${docPath(document)}">${escapeHtml(document.navLabel)}</a>`
    })
    .join('\n')

  return `      <nav class="document-nav" aria-label="문서 전환">
${links}
      </nav>`
}

function documentHead(document, active, intro) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(document.title)}</title>
  <link rel="stylesheet" href="../assets/resume-viewer.css" />
</head>
<body>
  <main class="wrapper">
    <article class="page">
${documentNav(active)}
      <header class="resume-header">
        <div>
          <h1>${escapeHtml(profile.basics.fullName)}</h1>
          <div class="intro">
            ${paragraphs(intro)}
          </div>
        </div>
        <aside class="contact-card">
          <ul class="contact-list">
${contactList()}
          </ul>
        </aside>
      </header>`
}

function crosslinkFooter(sibling, label) {
  return `      <footer class="doc-crosslink">
        <span class="label">${escapeHtml(label)}</span> ${escapeHtml(docUrl(sibling))}
      </footer>`
}

function documentEnd() {
  return `    </article>
  </main>
</body>
</html>
`
}

function roleLine(experience) {
  const suffix = experience.role.includes(experience.period) ? '' : ` · ${experience.period}`
  return `${escapeHtml(experience.role)}${escapeHtml(suffix)}`
}

function resumeExperience(experience) {
  const career = profile.documents.careerDescription
  const more = caseCountFor(experience)
    ? `\n            <p class="job-more"><a href="${docPath(career)}#${escapeHtml(
        experience.anchor
      )}">경력기술서에서 자세히 보기 →</a></p>`
    : ''

  return `          <article class="job-block">
            <h4>${escapeHtml(experience.company)}</h4>
            <div class="role-line">${roleLine(experience)}</div>
            ${paragraphs(experience.resumeSummary)}${more}
          </article>`
}

function renderResume() {
  const resume = profile.resume
  const strengths = resume.strengths
    .map((item) => `              <li>${escapeHtml(item)}</li>`)
    .join('\n')
  const experiences = profile.experiences.map(resumeExperience).join('\n')
  const keywords = resume.keywords
    .map((keyword) => `              <span class="pill">${escapeHtml(keyword)}</span>`)
    .join('\n')
  const education = profile.education
    .map(
      (item) =>
        `              <li><strong>${escapeHtml(item.school)}</strong><br/>${escapeHtml(
          item.major
        )}</li>`
    )
    .join('\n')
  const awards = profile.awards
    .map(
      (award) =>
        `              <li><strong>${escapeHtml(award.name)}</strong><br/>${escapeHtml(
          award.org
        )} <span class="label">${escapeHtml(award.year)}</span></li>`
    )
    .join('\n')

  return `${documentHead(profile.documents.resume, 'resume', resume.intro)}
      <section class="resume-body">
        <div class="main-column">
          <section class="section">
            <h3>강점</h3>
            <p class="section-lead">${escapeHtml(resume.strengthsLead)}</p>
            <ul class="bullet-list">
${strengths}
            </ul>
          </section>
          <section class="section">
            <h3>경력</h3>
${experiences}
          </section>
        </div>
        <aside class="side-column">
          <section class="section">
            <h3>핵심 키워드</h3>
            <div class="pill-row">
${keywords}
            </div>
          </section>
          <section class="section">
            <h3>학력</h3>
            <ul class="meta-list">
${education}
            </ul>
          </section>
          <section class="section">
            <h3>수상경력</h3>
            <ul class="meta-list">
${awards}
            </ul>
          </section>
        </aside>
      </section>
${crosslinkFooter(profile.documents.careerDescription, '경력기술서')}
${documentEnd()}`
}

function careerCase(caseItem) {
  const body = caseItem.body.map((text) => `                <p>${escapeHtml(text)}</p>`).join('\n')
  const tags = caseItem.tech.length
    ? `\n              <div class="case-tags">${caseItem.tech
        .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
        .join('')}</div>`
    : ''

  return `            <article class="case-card">
              <h5>${escapeHtml(caseItem.title)}</h5>
              <p class="case-problem"><span class="case-label">문제</span>${escapeHtml(
                caseItem.problem
              )}</p>
              <div class="case-body">
${body}
              </div>
              <p class="case-result"><span class="case-label">결과</span>${escapeHtml(
                caseItem.result
              )}</p>${tags}
            </article>`
}

function careerCaseGroup(group) {
  const heading = group.label
    ? `\n            <h4 class="case-group-title">${escapeHtml(group.label)}</h4>`
    : ''

  return `          <section class="case-group">${heading}
            <div class="case-list">
${group.cases.map(careerCase).join('\n')}
            </div>
          </section>`
}

function careerCompany(experience) {
  const groups = caseGroupsFor(experience)
  const cases = groups.length ? `\n${groups.map(careerCaseGroup).join('\n')}` : ''

  return `        <section class="career-company" id="${escapeHtml(experience.anchor)}">
          <header class="company-header">
            <h3>${escapeHtml(experience.company)}</h3>
            <div class="role-line">${roleLine(experience)}</div>
            ${paragraphs(experience.overview)}
          </header>${cases}
        </section>`
}

function renderCareerDescription() {
  const career = profile.careerDescription
  const companies = profile.experiences.map(careerCompany).join('\n')

  return `${documentHead(profile.documents.careerDescription, 'career', career.intro)}
      <div class="career-body">
${companies}
      </div>
${crosslinkFooter(profile.documents.resume, '이력서')}
${documentEnd()}`
}

assertProfile()
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const outputs = [
  [profile.documents.resume.slug, renderResume()],
  [profile.documents.careerDescription.slug, renderCareerDescription()],
]

for (const [slug, html] of outputs) {
  const outputPath = path.join(OUTPUT_DIR, `${slug}.html`)
  fs.writeFileSync(outputPath, html, 'utf8')
  console.log(`[generate-master-documents] ${path.relative(ROOT, outputPath)}`)
}
