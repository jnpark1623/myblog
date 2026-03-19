from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, ListFlowable, ListItem, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'public' / 'cv-noo10mi4km' / 's9v4k2m8q7x1r6t3h5p2'
PDF_DIR = OUTPUT / 'pdf'
HTML_DIR = OUTPUT / 'html'
FONT_PATH = Path('/System/Library/Fonts/Supplemental/NotoSansGothic-Regular.ttf')
FONT_NAME = 'NotoSansGothic'

pdfmetrics.registerFont(TTFont(FONT_NAME, str(FONT_PATH)))

styles = getSampleStyleSheet()
BASE = ParagraphStyle(
    'Base',
    parent=styles['Normal'],
    fontName=FONT_NAME,
    fontSize=11.2,
    leading=17,
    textColor=colors.HexColor('#111111'),
)
TITLE = ParagraphStyle('Title', parent=BASE, fontSize=20, leading=26, alignment=TA_CENTER, spaceAfter=3)
SUBTITLE = ParagraphStyle('Subtitle', parent=BASE, fontSize=11.5, leading=16, alignment=TA_CENTER)
META = ParagraphStyle('Meta', parent=BASE, fontSize=10.2, leading=14, alignment=TA_CENTER, textColor=colors.HexColor('#333333'))
SECTION = ParagraphStyle('Section', parent=BASE, fontSize=11.5, leading=15, spaceAfter=0)
BODY = ParagraphStyle('Body', parent=BASE, fontSize=11.2, leading=17)
ROLE = ParagraphStyle('Role', parent=BASE, fontSize=11.2, leading=16)
ROLE_META = ParagraphStyle('RoleMeta', parent=BASE, fontSize=10.4, leading=14, textColor=colors.HexColor('#333333'))
BULLET = ParagraphStyle('Bullet', parent=BASE, fontSize=11.0, leading=16.5, leftIndent=9)
FOOT = ParagraphStyle('Foot', parent=BASE, fontSize=9.2, leading=13, textColor=colors.HexColor('#555555'), alignment=TA_CENTER)

HUB_TEXT = '''<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <title>Woori Bank resume PDF</title>
    <style>
      :root { color-scheme: light; --bg:#ffffff; --panel:#ffffff; --line:#d8d8d8; --ink:#111111; --muted:#555555; }
      * { box-sizing: border-box; }
      body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic","Segoe UI",sans-serif; background:var(--bg); color:var(--ink); }
      main { max-width:720px; margin:0 auto; padding:32px 20px 56px; }
      .eyebrow { margin:0 0 8px; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#444; }
      h1 { margin:0 0 10px; font-size:30px; line-height:1.2; }
      p { margin:0; line-height:1.7; }
      .intro, .note { color:var(--muted); }
      .list { display:grid; gap:14px; margin-top:24px; }
      .card { display:block; background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:18px; text-decoration:none; color:inherit; }
      .label { display:block; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:#444; margin-bottom:8px; }
      .title { display:block; font-size:18px; font-weight:700; margin-bottom:6px; }
      .desc { display:block; color:var(--muted); }
      code { background:#f3f3f3; padding:.1rem .35rem; border-radius:6px; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Unlisted resume PDF</p>
      <h1>Woori Bank main resume</h1>
      <p class="intro">모바일 PDF 뷰어에서도 읽기 쉽도록 다시 만든 우리은행 제출용 메인 이력서입니다. 이번 경로에는 메인 PDF 1부만 연결했습니다.</p>
      <div class="list">
        <a class="card" href="./pdf/wooribank-resume-standard.pdf">
          <span class="label">Main resume PDF</span>
          <span class="title">우리은행 지원 이력서</span>
          <span class="desc">흰 배경, 진한 본문, 큰 글자, 단순한 표준 이력서 형식</span>
        </a>
      </div>
      <p class="note">이 경로는 <code>unlisted</code> 수준의 숨김 링크이며, <code>noindex, nofollow, noarchive</code> 정책을 사용합니다.</p>
    </main>
  </body>
</html>
'''

HTML_TEXT = '''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="robots" content="noindex, nofollow, noarchive" />
  <title>우리은행 지원 이력서</title>
  <style>
    :root { --ink:#111111; --muted:#555555; --line:#d8d8d8; --paper:#ffffff; }
    * { box-sizing:border-box; }
    body {
      margin:0;
      background:#ffffff;
      color:var(--ink);
      font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic","Segoe UI",sans-serif;
      line-height:1.7;
    }
    .page {
      width:min(210mm, 100%);
      margin:0 auto;
      padding:16mm;
      background:var(--paper);
    }
    h1,h2,h3,p,ul { margin:0; }
    .header { text-align:center; padding-bottom:10mm; border-bottom:1px solid var(--line); }
    .header h1 { font-size:30px; line-height:1.2; }
    .header .role { font-size:18px; margin-top:6px; }
    .meta { margin-top:10px; color:var(--muted); font-size:15px; }
    .section { padding-top:8mm; }
    .section h2 {
      font-size:18px; line-height:1.3; padding-bottom:2.5mm; margin-bottom:4mm;
      border-bottom:1px solid var(--line);
    }
    p, li { font-size:16px; }
    ul { padding-left:20px; }
    li + li { margin-top:6px; }
    .job + .job { margin-top:6mm; }
    .job-title { font-size:17px; font-weight:700; }
    .job-meta { color:var(--muted); margin-top:2px; font-size:15px; }
    .job-desc { margin-top:4px; }
    .foot { padding-top:8mm; color:var(--muted); font-size:13px; text-align:center; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { width:auto; margin:0; padding:14mm 15mm; }
      a { color:inherit; text-decoration:none; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="header">
      <h1>박재남</h1>
      <p class="role">우리은행 AI서비스기획 (AI데이터사업부) 지원</p>
      <p class="meta">이메일 jn2@mnpark.info · 지역 Seoul, KR · 웹사이트 https://mnpark.info · LinkedIn linkedin.com/in/jnpark1623</p>
    </header>

    <section class="section">
      <h2>지원 요약</h2>
      <p>외부 금융 데이터 연동과 데이터 스펙 검토 경험을 바탕으로, 금융 데이터가 실제 서비스 요구사항과 실행 계획으로 이어지도록 정리해 온 백엔드·프로덕트 리더입니다. DeepSearch에서 Koscom 시세 수신을 포함한 금융·레퍼런스 데이터 벤더 연동과 안정적 재전달 체계를 다뤘고, 금융기관·공공금융 조직 대상 데이터 스펙 검토와 요구사항 해석을 반복 수행했습니다. 또한 DeepSearch AI와 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 함께 맡아 제품 방향, 우선순위, 협업 구조를 조율했습니다.</p>
    </section>

    <section class="section">
      <h2>핵심 역량</h2>
      <ul>
        <li>Koscom 시세 수신을 포함한 외부 금융 데이터 벤더 연동과 데이터 재전달 체계를 직접 다뤘습니다.</li>
        <li>금융기관·공공금융 조직 대상 데이터 스펙 검토와 요구사항 해석 경험을 보유하고 있습니다.</li>
        <li>KakaoBank 협업, Shinhan Bank 데이터 공급, K Bank 및 Hana Bank 데이터 활용 기획 협업 지원 경험을 보유하고 있습니다.</li>
        <li>DeepSearch AI와 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 수행하며 제품화와 실행 우선순위를 조율했습니다.</li>
        <li>엔지니어링, 퀀트, 디자인, AI 서비스 기획, 영업을 잇는 크로스펑셔널 협업 구조를 운영했습니다.</li>
      </ul>
    </section>

    <section class="section">
      <h2>경력</h2>
      <div class="job">
        <p class="job-title">DeepSearch</p>
        <p class="job-meta">Backend Engineer → Team Lead / PO</p>
        <p class="job-desc">외부 금융·레퍼런스 데이터 벤더 연동과 안정적 재전달 체계를 맡았고, Koscom 시세 수신을 포함한 데이터 파이프라인을 다뤘습니다. 금융기관·공공금융 조직 대상 데이터 스펙 검토를 반복 수행했으며, DeepSearch AI와 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 함께 수행해 제품 방향과 협업 구조를 조율했습니다.</p>
      </div>
      <div class="job">
        <p class="job-title">Goodoc</p>
        <p class="job-meta">Backend Engineer / Growth Organization · 2022/06</p>
        <p class="job-desc">병원 예약·접수 서비스와 B2B2C 접수 서버를 다루며 마이그레이션과 운영 개선을 수행했습니다. 제품 운영 관점과 실행 조직 협업 방식을 확장한 경험입니다.</p>
      </div>
      <div class="job">
        <p class="job-title">Pentasecurity Systems</p>
        <p class="job-meta">Software Engineer · 2015/10 — 2022/05</p>
        <p class="job-desc">데이터 암호화 플랫폼 운영·관리 솔루션을 개발했습니다. 안정성, 신뢰성, 부서 간 협업이 중요한 환경에서 장기간 제품 개발 경험을 쌓았습니다.</p>
      </div>
      <div class="job">
        <p class="job-title">Media Solutions</p>
        <p class="job-meta">Software Engineer (industrial service alternative) · 2012/10 — 2015/10</p>
        <p class="job-desc">산업기능요원으로 근무하며 디지털 사이니지와 키오스크용 미디어 콘텐츠를 개발했습니다. 약 3년간 서비스형 소프트웨어 개발의 기본기와 현장 대응 경험을 쌓았습니다.</p>
      </div>
    </section>

    <section class="section">
      <h2>우리은행 관련 경험 포인트</h2>
      <ul>
        <li>금융 데이터 기반 이해: 외부 데이터 소스의 제약, 정합성, 전달 구조를 고려해 서비스 관점으로 연결했습니다.</li>
        <li>데이터 스펙 기반 협업: 요구사항을 단순 전달받지 않고 데이터 구조와 활용 가능 범위를 해석해 정리했습니다.</li>
        <li>은행권 접점 경험: KakaoBank, Shinhan Bank, K Bank, Hana Bank 관련 협업·공급·기획 지원 범위를 사실대로 설명할 수 있습니다.</li>
        <li>AI·데이터 제품화: 데이터 기반 기능을 실험 수준이 아니라 제품·운영·조직 실행 관점으로 연결했습니다.</li>
      </ul>
    </section>

    <section class="section">
      <h2>업무 방식</h2>
      <ul>
        <li>기술 설명 자체보다 데이터가 서비스 요구사항과 우선순위로 번역되는 구조를 정리하는 역할에 강점이 있습니다.</li>
        <li>직접 구현한 영역과 협업·기획 지원 범위를 구분해 설명하며, 방어 가능한 서술을 우선합니다.</li>
        <li>실행 조직 관점에서 엔지니어링, 기획, 사업 사이의 해석 비용을 줄이는 데 익숙합니다.</li>
      </ul>
    </section>

    <p class="foot">모바일 PDF 가독성을 우선해 단색, 큰 본문, 단순 섹션 구조로 정리한 제출용 버전</p>
  </main>
</body>
</html>
'''


def p(text, style=BODY):
    return Paragraph(text.replace('\n', '<br/>'), style)


def bullet_list(items):
    return ListFlowable(
        [ListItem(Paragraph(item, BULLET)) for item in items],
        bulletType='bullet',
        start='bullet',
        leftPadding=14,
    )


def section_header(text):
    table = Table([[Paragraph(text, SECTION)]], colWidths=[178 * mm])
    table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 0.8, colors.HexColor('#8a8a8a')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
    ]))
    return table


def make_doc(path: Path):
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title='Woori Bank main resume',
        author='Jaenam Park',
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='main')
    doc.addPageTemplates([PageTemplate(id='base', frames=[frame])])
    return doc


def build_resume_pdf(target_names):
    story = []
    story += [p('박재남', TITLE)]
    story += [p('우리은행 AI서비스기획 (AI데이터사업부) 지원', SUBTITLE)]
    story += [Spacer(1, 2.5 * mm)]
    contact = Table([[Paragraph('이메일 jn2@mnpark.info · 지역 Seoul, KR · 웹사이트 https://mnpark.info · LinkedIn linkedin.com/in/jnpark1623', META)]], colWidths=[180 * mm])
    contact.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER')]))
    story += [contact, Spacer(1, 5 * mm)]

    story += [section_header('지원 요약'), Spacer(1, 2 * mm)]
    story += [p('외부 금융 데이터 연동과 데이터 스펙 검토 경험을 바탕으로, 금융 데이터가 실제 서비스 요구사항과 실행 계획으로 이어지도록 정리해 온 백엔드·프로덕트 리더입니다. DeepSearch에서 Koscom 시세 수신을 포함한 금융·레퍼런스 데이터 벤더 연동과 안정적 재전달 체계를 다뤘고, 금융기관·공공금융 조직 대상 데이터 스펙 검토와 요구사항 해석을 반복 수행했습니다. 또한 DeepSearch AI와 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 함께 맡아 제품 방향, 우선순위, 협업 구조를 조율했습니다.'), Spacer(1, 4 * mm)]

    story += [section_header('핵심 역량'), Spacer(1, 2 * mm)]
    story += [bullet_list([
        'Koscom 시세 수신을 포함한 외부 금융 데이터 벤더 연동과 데이터 재전달 체계를 직접 다뤘습니다.',
        '금융기관·공공금융 조직 대상 데이터 스펙 검토와 요구사항 해석 경험을 보유하고 있습니다.',
        'KakaoBank 협업, Shinhan Bank 데이터 공급, K Bank 및 Hana Bank 데이터 활용 기획 협업 지원 경험을 보유하고 있습니다.',
        'DeepSearch AI와 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 수행하며 제품화와 실행 우선순위를 조율했습니다.',
        '엔지니어링, 퀀트, 디자인, AI 서비스 기획, 영업을 잇는 크로스펑셔널 협업 구조를 운영했습니다.',
    ]), Spacer(1, 4 * mm)]

    story += [section_header('경력'), Spacer(1, 2 * mm)]
    experience = [
        ('DeepSearch', 'Backend Engineer → Team Lead / PO', '외부 금융·레퍼런스 데이터 벤더 연동과 안정적 재전달 체계를 맡았고, Koscom 시세 수신을 포함한 데이터 파이프라인을 다뤘습니다. 금융기관·공공금융 조직 대상 데이터 스펙 검토를 반복 수행했으며, DeepSearch AI와 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 함께 수행해 제품 방향과 협업 구조를 조율했습니다.'),
        ('Goodoc', 'Backend Engineer / Growth Organization · 2022/06', '병원 예약·접수 서비스와 B2B2C 접수 서버를 다루며 마이그레이션과 운영 개선을 수행했습니다. 제품 운영 관점과 실행 조직 협업 방식을 확장한 경험입니다.'),
        ('Pentasecurity Systems', 'Software Engineer · 2015/10 — 2022/05', '데이터 암호화 플랫폼 운영·관리 솔루션을 개발했습니다. 안정성, 신뢰성, 부서 간 협업이 중요한 환경에서 장기간 제품 개발 경험을 쌓았습니다.'),
        ('Media Solutions', 'Software Engineer (industrial service alternative) · 2012/10 — 2015/10', '산업기능요원으로 근무하며 디지털 사이니지와 키오스크용 미디어 콘텐츠를 개발했습니다. 약 3년간 서비스형 소프트웨어 개발의 기본기와 현장 대응 경험을 쌓았습니다.'),
    ]
    for company, role, desc in experience:
        story += [Paragraph(company, ROLE), Paragraph(role, ROLE_META), Spacer(1, 1.4 * mm), p(desc), Spacer(1, 3 * mm)]

    story += [PageBreak(), section_header('우리은행 관련 경험 포인트'), Spacer(1, 2 * mm)]
    story += [bullet_list([
        '금융 데이터 기반 이해: 외부 데이터 소스의 제약, 정합성, 전달 구조를 고려해 서비스 관점으로 연결했습니다.',
        '데이터 스펙 기반 협업: 요구사항을 단순 전달받지 않고 데이터 구조와 활용 가능 범위를 해석해 정리했습니다.',
        '은행권 접점 경험: KakaoBank, Shinhan Bank, K Bank, Hana Bank 관련 협업·공급·기획 지원 범위를 사실대로 설명할 수 있습니다.',
        'AI·데이터 제품화: 데이터 기반 기능을 실험 수준이 아니라 제품·운영·조직 실행 관점으로 연결했습니다.',
    ]), Spacer(1, 4 * mm)]

    story += [section_header('업무 방식'), Spacer(1, 2 * mm)]
    story += [bullet_list([
        '기술 설명 자체보다 데이터가 서비스 요구사항과 우선순위로 번역되는 구조를 정리하는 역할에 강점이 있습니다.',
        '직접 구현한 영역과 협업·기획 지원 범위를 구분해 설명하며, 방어 가능한 서술을 우선합니다.',
        '실행 조직 관점에서 엔지니어링, 기획, 사업 사이의 해석 비용을 줄이는 데 익숙합니다.',
    ]), Spacer(1, 5 * mm)]

    story += [p('모바일 PDF 가독성을 우선해 단색, 큰 본문, 단순 섹션 구조로 정리한 제출용 버전', FOOT)]

    for target_name in target_names:
        make_doc(PDF_DIR / target_name).build(story[:])


def main():
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    build_resume_pdf(['wooribank-resume-standard.pdf', 'resume.pdf'])
    (OUTPUT / 'index.html').write_text(HUB_TEXT, encoding='utf-8')
    (HTML_DIR / 'resume.html').write_text(HTML_TEXT, encoding='utf-8')
    print('Exported readable Woori Bank main resume package to', OUTPUT)


if __name__ == '__main__':
    main()
