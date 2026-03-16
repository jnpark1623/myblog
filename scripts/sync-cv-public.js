const fs = require('fs')
const path = require('path')

const projectRoot = process.cwd()
const sourceRoot = path.join(projectRoot, 'cv-private')
const publicRoot = path.join(projectRoot, 'public', 'cv-noo10mi4km')

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

function syncSection(section) {
  const sourceDir = path.join(sourceRoot, section)
  const targetDir = path.join(publicRoot, section)

  ensureDir(targetDir)
  clearHtmlFiles(targetDir)

  if (!fs.existsSync(sourceDir)) {
    return { section, copied: 0 }
  }

  const htmlFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.html'))

  for (const file of htmlFiles) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file))
  }

  return { section, copied: htmlFiles.length }
}

const results = sections.map(syncSection)

for (const { section, copied } of results) {
  console.log(`[sync-cv-public] ${section}: copied ${copied} html files`)
}
