import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://www.haru2end.com/private-diary";
const PAGE_TITLE = "비밀 일기장 추천 | 개인 기록 중심 온라인 다이어리 - 하루의 끝";
const PAGE_DESCRIPTION =
  "비밀 일기장을 찾는 사용자에게 필요한 기준을 정리했습니다. 개인 기록, 안전한 관리, 모바일 작성 흐름을 고려한 온라인 일기장 가이드.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ["비밀 일기장", "개인 일기", "온라인 일기장", "일기 사이트", "하루의 끝"],
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
      name: "비밀 일기장은 어떤 점이 중요한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "개인 계정 보호, 접근 제어, 작성/조회 편의성, 기록 복구 가능 여부를 우선 확인하는 것이 좋습니다.",
      },
    },
    {
      "@type": "Question",
      name: "내 일기를 공개하지 않고 보관할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 개인 일기 작성/보관 중심으로 사용할 수 있고, 원할 때만 일부 글을 커뮤니티에 공유할 수 있습니다.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: "https://www.haru2end.com/" },
    { "@type": "ListItem", position: 2, name: "비밀 일기장", item: PAGE_URL },
  ],
};

export default function PrivateDiaryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-cyan-50 text-slate-900">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <p className="text-sm font-semibold text-emerald-600">PRIVATE DIARY</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          비밀 일기장, 공개보다 보관이 중요한 사용자에게
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-700 md:text-lg">
          비밀 일기장은 ‘기록의 안전성’과 ‘꾸준한 작성 흐름’이 핵심입니다.
          하루의 끝은 개인 기록 중심 사용을 기본으로, 필요한 경우에만 선택적으로 공유할 수 있게 설계되어 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
            비밀 일기 쓰기
          </Link>
          <Link href="/diary-site" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            일기 사이트 가이드 보기
          </Link>
          <Link href="/online-diary" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">
            온라인 일기장 가이드 보기
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-2xl font-bold md:text-3xl">개인 일기 중심 사용자 체크리스트</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-emerald-100 bg-white p-5">
            <h3 className="text-lg font-semibold">개인 계정 보호</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">로그인/비밀번호 재설정 등 기본 계정 보호 흐름을 확인하세요.</p>
          </article>
          <article className="rounded-xl border border-emerald-100 bg-white p-5">
            <h3 className="text-lg font-semibold">비공개 기록 중심 UX</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">공유 기능보다 개인 기록 작성/조회 흐름이 편한지 살펴보세요.</p>
          </article>
          <article className="rounded-xl border border-emerald-100 bg-white p-5">
            <h3 className="text-lg font-semibold">기록 누락 방지</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">임시저장/복구 기능 유무가 실제 사용 만족도를 크게 좌우합니다.</p>
          </article>
          <article className="rounded-xl border border-emerald-100 bg-white p-5">
            <h3 className="text-lg font-semibold">모바일 우선 사용성</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">폰에서 빠르게 쓰고 이전 기록을 쉽게 찾을 수 있어야 합니다.</p>
          </article>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
