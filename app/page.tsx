import type { Metadata } from "next";
import DiaryPage from "../diary-page";
import {
  getCanonicalUrl,
  getLanguageAlternates,
  getOpenGraphLocales,
  getSeoContent,
  normalizeLang,
  OG_IMAGE_URL,
} from "@/lib/seo";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getLangFromSearchParams(searchParams?: Record<string, string | string[] | undefined>) {
  const raw = searchParams?.lang;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return normalizeLang(value);
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lang = getLangFromSearchParams(resolvedSearchParams);
  const seo = getSeoContent(lang);
  const { locale, alternateLocale } = getOpenGraphLocales(lang);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: getCanonicalUrl(lang),
      siteName: seo.siteName,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${seo.siteName} preview image`,
        },
      ],
      locale,
      alternateLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [OG_IMAGE_URL],
    },
    alternates: {
      canonical: getCanonicalUrl(lang),
      languages: getLanguageAlternates(),
    },
  };
}

export default function Page() {
  return (
    <div>
      <DiaryPage />
    </div>
  );
}
