import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://www.haru2end.com/emotional-diary";
const PAGE_TITLE = "감성 일기장 추천 | 분위기 있는 온라인 일기 기록 - 하루의 끝";
const PAGE_DESCRIPTION =
  "감성 일기장을 찾고 있다면 하루의 끝을 사용해보세요. 분위기 있는 테마와 음악, 사진 첨부로 오늘의 감정을 자연스럽게 기록할 수 있습니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ["감성 일기장", "일기 사이트", "온라인 일기장", "감정 기록", "하루의 끝"],
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
      name: "감성 일기장은 일반 일기 앱과 무엇이 다른가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "감성 일기장은 기록 기능뿐 아니라 분위기, 몰입감, 회고 경험을 중요하게 설계합니다.",
      },
    },
    {
      "@type": "Question",
      name: "사진과 감정을 함께 기록할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 감정 선택, 본문 작성, 사진 첨부를 한 흐름으로 기록할 수 있습니다.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: "https://www.haru2end.com/" },
    { "@type": "ListItem", position: 2, name: "감성 일기장", item: PAGE_URL },
  ],
};

export default function EmotionalDiaryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-rose-50 text-slate-900">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <p className="text-sm font-semibold text-fuchsia-600">EMOTIONAL DIARY</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          감성 일기장, 분위기가 기록 습관을 만듭니다
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-700 md:text-lg">
          감성 일기장은 오래 쓰기 위해 필요한 요소를 갖춰야 합니다. 하루의 끝은
          분위기 있는 테마와 음악, 감정 기반 작성 흐름으로 오늘의 마음을 편하게 남길 수 있게 돕습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg bg-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-700">
            감성 일기 시작하기
          </Link>
          <Link href="/diary-site" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            일기 사이트 비교 보기
          </Link>
          <Link href="/online-diary" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            온라인 일기장 가이드
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-2xl font-bold md:text-3xl">감성 일기장을 고를 때 체크할 포인트</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-fuchsia-100 bg-white p-5">
            <h3 className="text-lg font-semibold">테마와 시각적 몰입감</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">디자인 톤이 기록 의지를 높여주는지 확인하세요.</p>
          </article>
          <article className="rounded-xl border border-fuchsia-100 bg-white p-5">
            <h3 className="text-lg font-semibold">감정 태깅의 편의성</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">감정 선택이 직관적이면 기록의 맥락이 더 잘 남습니다.</p>
          </article>
          <article className="rounded-xl border border-fuchsia-100 bg-white p-5">
            <h3 className="text-lg font-semibold">사진/텍스트 균형</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">사진과 글을 함께 저장하고 읽기 편한 레이아웃이 중요합니다.</p>
          </article>
          <article className="rounded-xl border border-fuchsia-100 bg-white p-5">
            <h3 className="text-lg font-semibold">모바일 기록 속도</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">짧은 시간에도 빠르게 기록할 수 있어야 습관이 유지됩니다.</p>
          </article>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
