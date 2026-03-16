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

function rewriteResumeUrls(html, relativePath = 'index.html') {
  const currentDir = path.posix.dirname(`/${RESUME_BASE_SEGMENT}/${relativePath}`)

  return html.replace(/\b(href|src)=(['"])(.*?)\2/gi, (match, attr, quote, url) => {
    if (!url || /^(?:[a-z]+:|\/\/|#|data:|mailto:|tel:)/i.test(url)) {
      return match
    }

    if (url.startsWith('/')) {
      return `${attr}=${quote}${url}${quote}`
    }

    const normalizedUrl = path.posix.normalize(path.posix.join(currentDir, url))
    return `${attr}=${quote}${normalizedUrl}${quote}`
  })
}

export function extractDocumentParts(html, fallbackTitle = 'Resume', relativePath = 'index.html') {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const bodyHtml = bodyMatch ? bodyMatch[1] : html

  return {
    bodyHtml: rewriteResumeUrls(bodyHtml, relativePath),
    title: titleMatch ? titleMatch[1] : fallbackTitle,
  }
}
