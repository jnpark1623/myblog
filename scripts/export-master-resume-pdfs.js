// Print the master resume pages to PDF using headless Chrome so the PDFs always
// match the current card-layout design and latest content.
//
// Source HTML: cv-private/resumes/<slug>.html (NOT the public hub path). Each is
// turned into a self-contained temp file (inline CSS) and printed to
// public/r/<token>.pdf, so the master resumes are never published under the
// hidden hub path (cv-noo10mi4km) and a shared PDF link cannot reveal it.
//
// Tokens come from cv-private/share-tokens.json. Run any time after the master
// HTML/CSS have been refreshed (no dev server needed).
const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const RESUMES_DIR = path.join(ROOT, 'cv-private', 'resumes')
const CSS_PATH = path.join(ROOT, 'public', 'cv-noo10mi4km', 'assets', 'resume-viewer.css')
const PDF_DIR = path.join(ROOT, 'public', 'r')
const TOKENS = JSON.parse(fs.readFileSync(path.join(ROOT, 'cv-private', 'share-tokens.json'), 'utf8'))
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const SLUGS = ['master-base-resume', 'master-backend-resume', 'master-po-pm-resume']

function makeStandalone(html, css) {
  // Replace the external stylesheet link with an inline <style> so the temp file
  // is fully self-contained (Chrome file:// print needs no sibling assets).
  if (/<link[^>]+resume-viewer\.css[^>]*>/i.test(html)) {
    return html.replace(/<link[^>]+resume-viewer\.css[^>]*>/i, `<style>${css}</style>`)
  }
  return html.replace(/<\/head>/i, `<style>${css}</style></head>`)
}

fs.mkdirSync(PDF_DIR, { recursive: true })
const css = fs.readFileSync(CSS_PATH, 'utf8')
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-pdf-'))

for (const slug of SLUGS) {
  const token = TOKENS[slug]
  if (!token) throw new Error(`missing token for ${slug} in share-tokens.json`)
  const src = path.join(RESUMES_DIR, `${slug}.html`)
  if (!fs.existsSync(src)) throw new Error(`missing source: ${src}`)

  const tmpFile = path.join(tmpDir, `${slug}.html`)
  fs.writeFileSync(tmpFile, makeStandalone(fs.readFileSync(src, 'utf8'), css))

  const out = path.join(PDF_DIR, `${token}.pdf`)
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${out}`,
    `file://${tmpFile}`,
  ], { stdio: ['ignore', 'ignore', 'ignore'] })
  console.log(`[export-pdf] ${slug} -> /r/${token}.pdf`)
}

fs.rmSync(tmpDir, { recursive: true, force: true })
console.log(`[export-pdf] done -> ${PDF_DIR}`)
