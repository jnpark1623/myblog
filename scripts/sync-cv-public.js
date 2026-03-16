const fs = require('fs')
const path = require('path')

const projectRoot = process.cwd()
const sourceRoot = path.join(projectRoot, 'cv-private')
const publicRoot = path.join(projectRoot, 'public', 'cv-noo10mi4km')
const stylePath = path.join(publicRoot, 'assets', 'resume-viewer.css')

const sections = ['resumes', 'tailored-resumes']

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function clearHtmlFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      fs.unlinkSync(path.join(dirPath, entry.name))
    }
  }
}

function readViewerStyles() {
  return fs.readFileSync(stylePath, 'utf8')
}

function makeStandaloneHtml(html, css) {
  let output = html

  if (!/<meta[^>]+name=["']color-scheme["']/i.test(output)) {
    output = output.replace(
      /<head([^>]*)>/i,
      '<head$1>\n  <meta name="color-scheme" content="light only" />'
    )
  }

  if (/<link[^>]+href=["'][^"']*resume-viewer\.css["'][^>]*>/i.test(output)) {
    output = output.replace(
      /<link[^>]+href=["'][^"']*resume-viewer\.css["'][^>]*>/i,
      `<style>${css}</style>`
    )
  } else if (!/<style[^>]*>/.test(output)) {
    output = output.replace(/<\/head>/i, `  <style>${css}</style>\n</head>`)
  }

  return output
}

function syncSection(section, css) {
  const sourceDir = path.join(sourceRoot, section)
  const targetDir = path.join(publicRoot, section)

  ensureDir(targetDir)
  clearHtmlFiles(targetDir)

  if (!fs.existsSync(sourceDir)) {
    return { section, copied: 0 }
  }

  const htmlFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.html'))

  for (const file of htmlFiles) {
    const sourceHtml = fs.readFileSync(path.join(sourceDir, file), 'utf8')
    const standaloneHtml = makeStandaloneHtml(sourceHtml, css)
    fs.writeFileSync(path.join(targetDir, file), standaloneHtml)
  }

  return { section, copied: htmlFiles.length }
}

const css = readViewerStyles()
const results = sections.map((section) => syncSection(section, css))

for (const { section, copied } of results) {
  console.log(`[sync-cv-public] ${section}: copied ${copied} html files`)
}
