import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://www.haru2end.com/diary-site";
const PAGE_TITLE = "일기 사이트 추천 | 감성 온라인 일기장 - 하루의 끝";
const PAGE_DESCRIPTION =
  "일기 사이트를 찾고 있다면 하루의 끝을 사용해보세요. 감성 테마, 사진 첨부, 커뮤니티 공유까지 가능한 온라인 일기장입니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "일기 사이트",
    "온라인 일기장",
    "감성 일기",
    "비밀 일기",
    "일기 앱",
    "하루의 끝",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "일기 사이트를 고를 때 무엇을 봐야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "기록 편의성, 모바일 사용성, 이미지 첨부, 프라이버시 보호, 검색/목록 기능을 확인하는 것이 좋습니다.",
      },
    },
    {
      "@type": "Question",
      name: "하루의 끝은 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "기본 일기 작성, 목록 조회, 커뮤니티 공유 기능은 무료로 사용할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "모바일에서도 사용할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 모바일 웹에서 바로 이용할 수 있고 앱 다운로드도 지원합니다.",
      },
    },
  ],
};

export default function DiarySitePage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://www.haru2end.com/" },
      { "@type": "ListItem", position: 2, name: "일기 사이트", item: PAGE_URL },
    ],
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "하루의 끝",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    url: "https://www.haru2end.com/",
    description: PAGE_DESCRIPTION,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50 text-slate-900">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <p className="text-sm font-semibold text-rose-600">ONLINE DIARY GUIDE</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          일기 사이트, 어떤 기준으로 고르면 좋을까요?
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-700 md:text-lg">
          일기 사이트를 찾는 사용자에게 중요한 건 기록의 편리함과 오래 남길 수 있는 구조입니다.
          <strong> 하루의 끝</strong>은 오늘의 감정, 생각, 사진을 빠르게 정리하고 다시 찾아볼 수 있는
          감성 온라인 일기장입니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">
            지금 일기 쓰기
          </Link>
          <Link href="/online-diary" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            온라인 일기장 가이드
          </Link>
          <Link href="/?lang=en" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            English Page
          </Link>
          <Link href="/?lang=ja" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            日本語ページ
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-2xl font-bold md:text-3xl">좋은 일기 사이트의 핵심 4가지</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-rose-100 bg-white p-5">
            <h3 className="text-lg font-semibold">1. 빠른 작성 흐름</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">오늘의 감정 선택, 제목 입력, 본문 작성이 한 화면에서 자연스럽게 이어져야 합니다.</p>
          </article>
          <article className="rounded-xl border border-rose-100 bg-white p-5">
            <h3 className="text-lg font-semibold">2. 기록 보존과 복구</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">작성 중 이탈해도 초안 복구가 가능해야 실제 사용에서 불편이 줄어듭니다.</p>
          </article>
          <article className="rounded-xl border border-rose-100 bg-white p-5">
            <h3 className="text-lg font-semibold">3. 목록/검색 접근성</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">지난 기록을 쉽게 찾을 수 있어야 일기장이 단순 메모가 아닌 자산이 됩니다.</p>
          </article>
          <article className="rounded-xl border border-rose-100 bg-white p-5">
            <h3 className="text-lg font-semibold">4. 모바일 사용성</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">대부분의 기록은 휴대폰에서 시작됩니다. 모바일 UI 완성도가 매우 중요합니다.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-2xl font-bold md:text-3xl">자주 묻는 질문</h2>
        <div className="mt-6 space-y-4">
          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">일기 사이트를 고를 때 무엇을 봐야 하나요?</summary>
            <p className="mt-2 text-sm text-slate-700">기록 편의성, 모바일 사용성, 이미지 첨부, 프라이버시 보호, 목록 조회 기능을 우선 확인하세요.</p>
          </details>
          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">하루의 끝은 무료인가요?</summary>
            <p className="mt-2 text-sm text-slate-700">기본 일기 작성, 목록 조회, 커뮤니티 공유 기능은 무료로 제공합니다.</p>
          </details>
          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold">모바일에서도 사용할 수 있나요?</summary>
            <p className="mt-2 text-sm text-slate-700">네. 모바일 웹에서 바로 사용 가능하며 앱 다운로드도 지원합니다.</p>
          </details>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
    </main>
  );
}
