from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'public' / 'cv-noo10mi4km' / 's9v4k2m8q7x1r6t3h5p2'
PDF_DIR = OUTPUT / 'pdf'
FONT_PATH = Path('/System/Library/Fonts/Supplemental/NotoSansGothic-Regular.ttf')
FONT_NAME = 'NotoSansGothic'

pdfmetrics.registerFont(TTFont(FONT_NAME, str(FONT_PATH)))

styles = getSampleStyleSheet()
BASE = ParagraphStyle(
    'Base',
    parent=styles['Normal'],
    fontName=FONT_NAME,
    fontSize=10,
    leading=15,
    textColor=colors.HexColor('#111827'),
)
SMALL = ParagraphStyle('Small', parent=BASE, fontSize=8.6, leading=12, textColor=colors.HexColor('#4b5563'))
TITLE = ParagraphStyle('Title', parent=BASE, fontSize=18, leading=24, alignment=TA_CENTER)
SUBTITLE = ParagraphStyle('Subtitle', parent=BASE, fontSize=10.5, leading=15, alignment=TA_CENTER, textColor=colors.HexColor('#374151'))
SECTION = ParagraphStyle('Section', parent=BASE, fontSize=10.5, leading=14, spaceAfter=6)
ROLE = ParagraphStyle('Role', parent=BASE, fontSize=10.5, leading=14)
META = ParagraphStyle('Meta', parent=BASE, fontSize=9, leading=12, textColor=colors.HexColor('#4b5563'))
BODY = ParagraphStyle('Body', parent=BASE, fontSize=9.6, leading=14)
BULLET = ParagraphStyle('Bullet', parent=BASE, fontSize=9.4, leading=13.6, leftIndent=10, firstLineIndent=0)
HUB_TEXT = '''<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <title>Woori Bank PDF package</title>
    <style>
      :root { color-scheme: light; --bg:#f7f7f5; --panel:#fff; --line:#d7dadd; --ink:#16181d; --muted:#5c6470; --accent:#0f4c81; }
      * { box-sizing: border-box; }
      body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:var(--bg); color:var(--ink); }
      main { max-width: 760px; margin: 0 auto; padding: 32px 18px 56px; }
      .eyebrow { margin:0 0 8px; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--accent); }
      h1 { margin:0 0 10px; font-size:32px; }
      .intro, .note { color:var(--muted); line-height:1.65; }
      .list { display:grid; gap:14px; margin-top:24px; }
      .card { display:block; background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:18px; text-decoration:none; color:inherit; }
      .card:hover { border-color:var(--accent); }
      .label { display:block; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent); margin-bottom:8px; }
      .title { display:block; font-size:18px; font-weight:700; margin-bottom:6px; }
      .desc { display:block; color:var(--muted); line-height:1.55; }
      code { background:#eef2f7; padding:.1rem .35rem; border-radius:6px; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Unlisted PDF package</p>
      <h1>Woori Bank submission set</h1>
      <p class="intro">제출용 기준으로 다시 정리한 표준형 PDF 패키지입니다. 메인 이력서 1부와 보강용 사례 2부만 남겨, 웹 패키지 느낌보다 일반 지원 문서 느낌에 가깝게 구성했습니다.</p>
      <div class="list">
        <a class="card" href="./pdf/wooribank-resume-standard.pdf">
          <span class="label">Main resume PDF</span>
          <span class="title">우리은행 지원 이력서</span>
          <span class="desc">A4 제출용 표준 이력서 형식, 핵심 경력과 적합도 중심 요약</span>
        </a>
        <a class="card" href="./pdf/wooribank-case-a-financial-data.pdf">
          <span class="label">Case study PDF A</span>
          <span class="title">금융 데이터 연동 / 데이터 스펙 / 기획 사례</span>
          <span class="desc">Koscom 포함 금융 데이터 연동, 스펙 검토, 요구사항 해석 관점 정리</span>
        </a>
        <a class="card" href="./pdf/wooribank-case-b-banking-collaboration.pdf">
          <span class="label">Case study PDF B</span>
          <span class="title">은행 협업 / AI 투자 서비스 관련 사례</span>
          <span class="desc">KakaoBank, Shinhan Bank, K Bank, Hana Bank 관련 협업·공급·기획 지원 범위 정리</span>
        </a>
      </div>
      <p class="note">이 경로는 <code>unlisted</code> 수준의 숨김 링크입니다. 실제 인증 경로는 아니며, 검색 노출은 <code>noindex, nofollow, noarchive</code> 정책으로만 최대한 줄였습니다.</p>
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
        start='circle',
        leftPadding=14,
    )


def section_header(text):
    table = Table([[Paragraph(text, SECTION)]], colWidths=[170 * mm])
    table.setStyle(
        TableStyle(
            [
                ('LINEBELOW', (0, 0), (-1, -1), 0.7, colors.HexColor('#9ca3af')),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ]
        )
    )
    return table


def make_doc(path: Path):
    doc = BaseDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title=path.stem,
        author='Jaenam Park',
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='main')
    doc.addPageTemplates([PageTemplate(id='base', frames=[frame])])
    return doc


def build_resume():
    path = PDF_DIR / 'wooribank-resume-standard.pdf'
    story = []
    story += [p('박재남', TITLE), p('우리은행 AI데이터사업부 AI서비스기획 지원', SUBTITLE), Spacer(1, 4 * mm)]
    contact = Table(
        [[
            Paragraph('이메일  jn2@mnpark.info', META),
            Paragraph('웹사이트  https://mnpark.info', META),
            Paragraph('LinkedIn  linkedin.com/in/jnpark1623', META),
            Paragraph('지역  Seoul, KR', META),
        ]],
        colWidths=[178 * mm],
    )
    contact.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    story += [contact, Spacer(1, 5 * mm)]

    story += [section_header('지원 요약'), Spacer(1, 1.8 * mm)]
    story += [
        p('외부 금융 데이터 연동과 데이터 스펙 검토 경험을 바탕으로, 금융 데이터가 실제 서비스 요구사항과 실행 계획으로 이어지도록 정리해 온 백엔드·프로덕트 리더입니다. DeepSearch에서 Koscom 시세 수신을 포함한 금융·레퍼런스 데이터 벤더 연동과 안정적 재전달 체계를 다뤘고, 금융기관·공공금융 조직 대상 데이터 스펙 검토와 요구사항 해석을 반복 수행했습니다. 또한 DeepSearch AI 및 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 함께 맡아 제품 방향, 우선순위, 협업 구조를 조율했습니다.', BODY),
        Spacer(1, 4 * mm),
    ]

    story += [section_header('핵심 적합도'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        'Koscom 시세 수신을 포함한 외부 금융 데이터 벤더 연동과 데이터 재전달 체계를 직접 다룸',
        '금융기관·공공금융 조직 대상 데이터 스펙 검토 및 요구사항 해석 경험 보유',
        'KakaoBank 협업, Shinhan Bank 데이터 공급, K Bank/Hana Bank 데이터 활용 기획 협업 지원 경험 보유',
        'DeepSearch AI와 Finorma에서 리드·PO 역할을 수행하며 제품화와 실행 우선순위 조율',
        '엔지니어링·퀀트·디자인·AI 서비스 기획·영업을 잇는 크로스펑셔널 협업 구조 운영',
    ]), Spacer(1, 4 * mm)]

    story += [section_header('경력 요약'), Spacer(1, 1.8 * mm)]
    experience = [
        ('DeepSearch', 'Backend Engineer → Team Lead / PO', '외부 금융·레퍼런스 데이터 벤더 연동과 안정적 재전달 체계를 맡았고, Koscom 시세 수신을 포함한 데이터 파이프라인을 다뤘습니다. 금융기관·공공금융 조직 대상 데이터 스펙 검토를 반복 수행했으며, DeepSearch AI와 금융 데이터 엔진 Finorma에서 리드와 PO 역할을 함께 수행해 제품 방향·우선순위·협업 구조를 조율했습니다.'),
        ('Goodoc', 'Backend Engineer / Growth Organization · 2022.06', '병원 예약·접수 서비스와 B2B2C 접수 서버를 다루며 마이그레이션과 운영 개선을 수행했습니다. 제품 운영 관점과 실행 조직 협업 방식을 확장한 경험입니다.'),
        ('Pentasecurity Systems', 'Software Engineer · 2015.10 — 2022.05', '데이터 암호화 플랫폼 운영·관리 솔루션 개발을 담당했습니다. 안정성·신뢰성·조직 간 협업이 중요한 환경에서 장기간 제품 개발 경험을 쌓았습니다.'),
    ]
    for company, role, desc in experience:
        story += [Paragraph(company, ROLE), Paragraph(role, META), Spacer(1, 1 * mm), p(desc), Spacer(1, 2.7 * mm)]

    story += [section_header('우리은행 관련 사례 포인트'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        '금융 데이터 기반 이해: 외부 데이터 소스의 제약, 정합성, 전달 구조를 고려해 서비스 관점으로 연결',
        '데이터 스펙 기반 협업: 요구사항을 단순 전달받지 않고 데이터 구조와 활용 가능 범위를 해석해 정리',
        '은행권 접점 경험: KakaoBank, Shinhan Bank, K Bank, Hana Bank 관련 협업·공급·기획 지원 범위를 사실대로 설명 가능',
        'AI·데이터 제품화: 데이터 기반 기능을 실험 수준이 아니라 제품·운영·조직 실행 관점으로 연결',
    ]), Spacer(1, 4 * mm)]

    story += [section_header('업무 방식'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        '기술 설명 자체보다 데이터가 서비스 요구사항과 우선순위로 번역되는 구조를 정리하는 역할에 강점이 있습니다.',
        '직접 구현한 영역과 협업·기획 지원 범위를 구분해 설명하며, 방어 가능한 서술을 우선합니다.',
        '실행 조직 관점에서 엔지니어링, 기획, 사업 사이의 해석 비용을 줄이는 데 익숙합니다.',
    ])]

    make_doc(path).build(story)


def build_case_a():
    path = PDF_DIR / 'wooribank-case-a-financial-data.pdf'
    story = [p('보강자료 A', SUBTITLE), p('금융 데이터 연동 / 데이터 스펙 / 기획 사례', TITLE), Spacer(1, 4 * mm)]
    story += [p('목적: 우리은행 AI서비스기획 직무와 가장 직접적으로 연결되는 “데이터 기반 이해력”과 “실행 가능한 서비스 기획 감각”을 보강하기 위한 사례 정리입니다.', BODY), Spacer(1, 4 * mm)]
    story += [section_header('1. 직접 맡았던 영역'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        'DeepSearch에서 외부 금융·레퍼런스 데이터 벤더 연동과 안정적 재전달 체계를 직접 담당',
        'Koscom 시세 수신을 포함한 데이터 파이프라인을 다룸',
        '단순 수집이 아니라 실제 서비스가 활용 가능한 형태로 데이터가 안정적으로 전달되도록 운영 기반 관리',
    ]), Spacer(1, 4 * mm)]
    story += [section_header('2. 데이터 스펙 기반 기획 지원'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        '금융기관·공공금융 조직 대상 제품을 다루며 데이터 스펙을 반복 검토',
        '어떤 데이터가 필요한지, 어떤 형태로 연결되는지, 서비스에서 어디까지 활용 가능한지 해석하는 역할 수행',
        '엔지니어링·기획·사업 조직이 서로 다른 언어를 쓰는 문제를 줄이고 실행 우선순위를 맞추는 데 기여',
    ]), Spacer(1, 4 * mm)]
    story += [section_header('3. 우리은행 직무와의 연결'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        'AI 서비스 기획은 모델 설명 이전에 데이터의 제약과 활용 가능 범위를 파악하는 일에서 출발함',
        '외부 데이터 소스와 내부 서비스 사이의 해석 비용을 줄인 경험은 데이터 활용 설계에 직접 연결됨',
        '정확성·시의성·정합성이 중요한 금융 데이터 운영 경험은 현실적인 기획 판단의 기반이 됨',
    ]), Spacer(1, 4 * mm)]
    story += [section_header('4. 표현 원칙'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        '직접 구현으로 말할 수 있는 부분: 외부 금융 데이터 벤더 연동, Koscom 시세 수신, 안정적 재전달 체계',
        '기획·협업으로 말할 수 있는 부분: 데이터 스펙 검토, 요구사항 해석, 활용 설계 지원, 협업 조율',
        '피해야 할 과장: 근거 없는 은행 내부 시스템 직접 구축 주장, 증빙 없는 AI 모델 구현 주장',
    ])]
    make_doc(path).build(story)


def build_case_b():
    path = PDF_DIR / 'wooribank-case-b-banking-collaboration.pdf'
    story = [p('보강자료 B', SUBTITLE), p('은행 협업 / AI 투자 서비스 관련 사례', TITLE), Spacer(1, 4 * mm)]
    story += [p('목적: 은행권과의 실질 접점을 과장 없이 설명하고, AI·데이터 서비스 기획 맥락 이해를 보강하기 위한 사례 정리입니다.', BODY), Spacer(1, 4 * mm)]
    story += [section_header('1. 설명 가능한 협업 사례'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        'KakaoBank AI 투자 챗봇 협업에 깊게 관여한 경험',
        'Shinhan Bank 대상 DeepSearch 데이터 공급 경험',
        'K Bank 투자 서비스 개편에서 DeepSearch 데이터 활용 기획 협업 지원 경험',
        'Hana Bank OneQ Pro MTS에서 DeepSearch 데이터 활용 기획 협업 지원 경험',
    ]), Spacer(1, 4 * mm)]
    story += [section_header('2. 우리은행 직무와의 연결'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        '금융기관이 데이터를 어떤 방식으로 활용하려 하는지 가까이에서 본 경험이 있음',
        '데이터 공급과 활용 기획 지원 경험은 AI 서비스 기획에서 필요한 현실적 제약 이해로 이어짐',
        '외부 파트너 관점에서 금융기관과 협업해 본 경험은 내부 기획·기술·사업 조직 사이의 조율에도 도움 됨',
    ]), Spacer(1, 4 * mm)]
    story += [section_header('3. 방어 가능한 서술 기준'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        '권장: “KakaoBank AI 투자 챗봇 협업에 깊게 관여했습니다.”',
        '권장: “Shinhan Bank에는 DeepSearch 데이터를 공급했습니다.”',
        '권장: “K Bank 투자 서비스 개편과 Hana Bank OneQ Pro MTS에서 DeepSearch 데이터 활용 기획 협업을 지원했습니다.”',
        '비권장: 근거 없이 은행 서비스 자체를 직접 구축·출시했다고 단정하는 표현',
    ]), Spacer(1, 4 * mm)]
    story += [section_header('4. 사례의 의미'), Spacer(1, 1.8 * mm)]
    story += [bullet_list([
        '은행권 프로젝트를 직접 운영했다는 과장 없이도 금융기관과의 실질 접점 경험을 보여줄 수 있음',
        '데이터 공급, 협업, 활용 기획 지원을 분리해 설명하면 오히려 신뢰도 높은 지원 문서가 됨',
        '우리은행 지원 맥락에서는 “은행권 AI·데이터 서비스 환경을 이해하는 후보”라는 메시지로 연결 가능',
    ])]
    make_doc(path).build(story)


def main():
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    build_resume()
    build_case_a()
    build_case_b()
    (OUTPUT / 'index.html').write_text(HUB_TEXT, encoding='utf-8')
    print('Exported standard Woori Bank PDF package to', OUTPUT)


if __name__ == '__main__':
    main()
