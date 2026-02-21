import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://www.haru2end.com/online-diary";
const PAGE_TITLE = "온라인 일기장 추천 | 감정 기록과 사진 첨부까지 - 하루의 끝";
const PAGE_DESCRIPTION =
  "온라인 일기장을 찾는 분들을 위한 가이드입니다. 감정 기록, 사진 첨부, 목록 관리, 모바일 사용성까지 하루의 끝에서 간편하게.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ["온라인 일기장", "일기 사이트", "일기 앱", "감정 기록", "하루의 끝"],
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
      name: "온라인 일기장과 메모 앱의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "온라인 일기장은 날짜 기반 기록, 감정/사진 정리, 과거 회고에 최적화되어 있어 일상 기록 관리에 더 적합합니다.",
      },
    },
    {
      "@type": "Question",
      name: "모바일에서 온라인 일기장을 쓰기 편한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "짧은 입력 흐름과 목록 이동이 잘 설계되어 있으면 모바일에서도 빠르게 작성할 수 있습니다.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: "https://www.haru2end.com/" },
    { "@type": "ListItem", position: 2, name: "온라인 일기장", item: PAGE_URL },
  ],
};

export default function OnlineDiaryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-900">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <p className="text-sm font-semibold text-blue-600">ONLINE DIARY</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">온라인 일기장, 꾸준히 쓰기 쉬운 구조가 중요합니다</h1>
        <p className="mt-5 text-base leading-7 text-slate-700 md:text-lg">
          온라인 일기장은 단순 기록 도구가 아니라, 하루를 회고하는 루틴입니다.
          <strong> 하루의 끝</strong>은 감정 선택, 본문 작성, 사진 첨부, 목록 조회를 한 흐름으로 연결해
          꾸준한 기록을 돕습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            온라인 일기 시작하기
          </Link>
          <Link href="/diary-site" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            일기 사이트 비교 보기
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-2xl font-bold md:text-3xl">온라인 일기장을 고를 때 확인할 항목</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          <li className="rounded-xl border border-blue-100 bg-white p-5">
            <h3 className="text-lg font-semibold">작성 진입 속도</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">앱을 켜고 기록까지 걸리는 시간이 짧아야 꾸준함이 유지됩니다.</p>
          </li>
          <li className="rounded-xl border border-blue-100 bg-white p-5">
            <h3 className="text-lg font-semibold">기록 탐색 편의</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">과거 기록을 쉽게 찾아볼 수 있어야 회고 가치가 생깁니다.</p>
          </li>
          <li className="rounded-xl border border-blue-100 bg-white p-5">
            <h3 className="text-lg font-semibold">모바일 최적화</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">작은 화면에서도 메뉴 탐색과 입력이 자연스러워야 합니다.</p>
          </li>
          <li className="rounded-xl border border-blue-100 bg-white p-5">
            <h3 className="text-lg font-semibold">개인화 요소</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">감정, 사진, 테마 등 개인화 기능이 있으면 기록 몰입도가 올라갑니다.</p>
          </li>
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
