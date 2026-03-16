import ResumeHtmlPage from '@/components/ResumeHtmlPage'
import {
  extractDocumentParts,
  listHtmlFiles,
  readResumeFile,
  readResumeStyles,
} from '@/lib/resumeRoute'

export async function getStaticPaths() {
  return {
    paths: listHtmlFiles('resumes').map((file) => ({
      params: {
        slug: file,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const html = readResumeFile(`resumes/${params.slug}`)
  const { bodyHtml, title } = extractDocumentParts(html, params.slug, `resumes/${params.slug}`)

  return {
    props: {
      bodyHtml,
      title,
      styles: readResumeStyles(),
    },
  }
}

export default ResumeHtmlPage
