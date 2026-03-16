import Head from 'next/head'

export default function ResumeHtmlPage({ bodyHtml, title, styles }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="color-scheme" content="light" />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </Head>
      <div className="resume-viewer-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  )
}

ResumeHtmlPage.disableLayout = true
