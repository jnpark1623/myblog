import ResumeHtmlPage from '@/components/ResumeHtmlPage'
import {
  extractDocumentParts,
  fileExists,
  readResumeFile,
  readResumeStyles,
  readShareTokens,
} from '@/lib/resumeRoute'

// Shareable, hub-independent resume detail pages. Each master resume is served
// at /r/<random-token> so a shared link never reveals the hidden hub path
// (cv-noo10mi4km). The master resume bodies contain no relative URLs, and the
// CSS is inlined, so nothing here leaks the hub.
function slugForToken(token) {
  const tokens = readShareTokens()
  const entry = Object.entries(tokens).find(([, value]) => value === token)
  return entry ? entry[0] : null
}

export async function getStaticPaths() {
  const tokens = readShareTokens()
  return {
    paths: Object.values(tokens).map((token) => ({ params: { token } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const slug = slugForToken(params.token)
  const relativePath = slug ? `resumes/${slug}.html` : null

  if (!relativePath || !fileExists(relativePath)) {
    return { notFound: true }
  }

  const html = readResumeFile(relativePath)
  const { bodyHtml, title } = extractDocumentParts(html, slug, relativePath)

  return {
    props: {
      bodyHtml,
      title,
      styles: readResumeStyles(),
    },
  }
}

export default ResumeHtmlPage
