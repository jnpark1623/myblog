import ResumeHtmlPage from '@/components/ResumeHtmlPage'
import { extractDocumentParts, readResumeFile, readResumeStyles } from '@/lib/resumeRoute'

export async function getStaticProps() {
  const html = readResumeFile('index.html')
  const { bodyHtml, title } = extractDocumentParts(html, 'Resume Index')

  return {
    props: {
      bodyHtml,
      title,
      styles: readResumeStyles(),
    },
  }
}

export default ResumeHtmlPage
