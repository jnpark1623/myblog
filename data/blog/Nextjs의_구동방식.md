---
title: Next.js의 구동 방식 _app.js / _document.js
date: '2022-04-01'
tags: ['next.js', '개발']
draft: false
summary: 'Next.js의 _app.js와 _document.js가 어떻게 동작하는지 알아보자'
---

Next.js는 React의 SSR을 구현하기 위한 가장 보편적인 framework이다.

미리 얘기하자면 이 포스팅에서는 SSR과 CSR의 차이 / 무엇이 어떻게 좋은가 이러한 내용들은 다루지 않는다. 기회가 되면 다른 포스팅으로 다뤄보도록 노력하겠다.

이 포스팅은 어떤 구동 방식으로 SSR을 구현했을까에 초점이 맞춰져 있다.

## SSG, SSR

SSG, SSR 이 둘은 뭘까. 둘 다 서버 사이드에서 무언가 이뤄지는 것은 맞다.

Next의 최대 장점 중 하나는 페이지별 렌더링 방식을 다르게 가져갈 수 있다는 것인데, 구현한 방식에 따라 Html을 구성하고 이를 Client로 전달하는 과정을 순서에 기반하여 알아보자.

## \_app.js, \_document.js

tailwind 블로그 템플릿을 사용하니 \_app.js와 \_document.js가 있었다.

Next.js를 모르면 도대체 어떤 것을 진입점으로 두고 추적해야 하는지 어려움이 있을 수 있다.

이를 알기 위해서는 어떤 순서로 동작하는지에 대한 이해가 필요한데, 이는 아래와 같다.

- 첫번째로 실행되는 것은 \_app.js

\_app.js는 쉽게말해 \_document.js의 `<Main/>` 아래에 생성되는 object로 이해하면 좋을 것 같다.

```js
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
)
```

내 블로그의 \_app.js를 잠깐 살펴보자면, props로 받은 Component는 브라우저가 요청한 페이지가 되는것이다.

pageProps는 렌더링 전략에 따라 다른 방법을 통해 내려받은 props인 것인데, 위에서 페이지별로 렌더링 전략을 다르게 가져갈 수 있다고 잠깐 얘기했을 것이다.

이는 다음 Next.js 포스팅에서 다뤄보도록 하겠다.

아무튼 이렇게 \_app.js가 실행되며 object가 생성되었으면,

- 두번째로 실행되는 것은 \_document.js

SSG, SSR의 특징은 서버에서 페이지를 받아올 때 static html을 재구성하여 전달하게 되는데, 첫번째로 실행되어 생성된 object를 어떤 형태로 넣을지 구성하는 곳이다.

```js
import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicons/sun.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicons/sun.png"
          />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" content="#000000" />
        </Head>
        <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
```

내 블로그의 \_document.js이다 ` <Main/>` Component 아래에 \_app.js에서 생성한 object들이 들어가는 것이다.

이 \_document.js의 특징은 뼈대만 갖추고 있을 뿐, init되는 부분은 Main밖에 없다는 점인데, 이는 무엇을 의미하냐면 사실상 `_app.js`를 시작점으로 개발을 진행해야 한다는 점이다.

## 요약

### Cycle

1. Next에 요청이 들어온 Page를 찾는다.

2. 해당 Page Component에 정의된 렌더링 전략에 따라 pageProps를 받아온다.

3. 모든 props들이 구성되었으면 \_app.js > page Component 순서로 렌더링된다. 페이지의 렌더링 전략에 따라 조금 다를 수 있다.

4. 모든 object들이 구성되었으면 \_document.js가 실행되며 static html을 전달한다.

이러한 순서로 server의 로직이 동작한다. 페이지별 렌더링 전략이 조금 다를 수 있어 많은 부분을 생략했지만 대략적으로 이러하다.

설명하다보니 페이지의 렌더링 전략을 포스팅 안할 수 없겠더라.. 다음 포스팅은 Next.js에서 사용하는 렌더링 전략을 포스팅 할 예정이다.
