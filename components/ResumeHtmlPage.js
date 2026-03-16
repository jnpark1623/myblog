import Head from 'next/head'

export default function ResumeHtmlPage({ bodyHtml, title, styles }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  )
}

ResumeHtmlPage.disableLayout = true
