import fs from 'fs'
import path from 'path'

export const RESUME_BASE_SEGMENT = 'cv-noo10mi4km'
const RESUME_BASE_DIR = path.join(process.cwd(), 'cv-private')

export function readResumeFile(relativePath) {
  return fs.readFileSync(path.join(RESUME_BASE_DIR, relativePath), 'utf8')
}

export function fileExists(relativePath) {
  return fs.existsSync(path.join(RESUME_BASE_DIR, relativePath))
}

export function listHtmlFiles(section) {
  const dir = path.join(RESUME_BASE_DIR, section)
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs.readdirSync(dir).filter((file) => file.endsWith('.html'))
}

export function readResumeStyles() {
  const cssPath = path.join(
    process.cwd(),
    'public',
    RESUME_BASE_SEGMENT,
    'assets',
    'resume-viewer.css'
  )
  return fs.readFileSync(cssPath, 'utf8')
}

export function extractDocumentParts(html, fallbackTitle = 'Resume') {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)

  return {
    bodyHtml: bodyMatch ? bodyMatch[1] : html,
    title: titleMatch ? titleMatch[1] : fallbackTitle,
  }
}
