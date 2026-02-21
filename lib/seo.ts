export type SupportedLang = "ko" | "en" | "ja" | "zh";

const DEFAULT_LANG: SupportedLang = "ko";
export const SITE_URL = "https://www.haru2end.com";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

type SeoContent = {
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  ogLocale: string;
  orgName: string;
  articleAuthor: string;
};

const SEO_BY_LANG: Record<SupportedLang, SeoContent> = {
  ko: {
    siteName: "하루의 끝",
    title: "하루의 끝 - 감성 온라인 일기장 | 매일의 생각과 감정 기록, 다이어리 꾸미기",
    description:
      "하루의 끝에서 당신의 하루를 특별하게 마무리하세요. 감성적인 온라인 일기장에 오늘의 순간, 감정, 생각을 기록하며 나만의 다이어리를 만들고 꾸밀 수 있습니다.",
    keywords: ["하루의 끝", "온라인 일기장", "감성 다이어리", "감정 기록", "다이어리 꾸미기"],
    ogLocale: "ko_KR",
    orgName: "하루의 끝",
    articleAuthor: "하루의 끝 개발팀",
  },
  en: {
    siteName: "End of Day",
    title: "End of Day - Online Diary for Daily Thoughts and Feelings",
    description:
      "End your day with calm reflection. Write your moments, feelings, and thoughts in a cozy online diary.",
    keywords: ["end of day", "online diary", "daily journal", "mood tracker", "personal diary"],
    ogLocale: "en_US",
    orgName: "End of Day",
    articleAuthor: "End of Day Team",
  },
  ja: {
    siteName: "一日の終わり",
    title: "一日の終わり - 気持ちを記録するオンライン日記",
    description:
      "静かな夜に一日を振り返り、考えや感情を記録できるオンライン日記サービスです。",
    keywords: ["一日の終わり", "オンライン日記", "日記アプリ", "感情記録", "ジャーナル"],
    ogLocale: "ja_JP",
    orgName: "一日の終わり",
    articleAuthor: "一日の終わり開発チーム",
  },
  zh: {
    siteName: "一天结束",
    title: "一天结束 - 记录想法与情绪的在线日记",
    description:
      "在安静的夜晚回顾一天，记录你的想法、情绪与瞬间，打造属于自己的在线日记。",
    keywords: ["一天结束", "在线日记", "日记应用", "情绪记录", "个人日志"],
    ogLocale: "zh_CN",
    orgName: "一天结束",
    articleAuthor: "一天结束开发团队",
  },
};

const LOCALE_BY_LANG: Record<SupportedLang, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

export function normalizeLang(input?: string | null): SupportedLang {
  if (!input) return DEFAULT_LANG;
  const lowered = input.toLowerCase();
  if (lowered.startsWith("en")) return "en";
  if (lowered.startsWith("ja")) return "ja";
  if (lowered.startsWith("zh")) return "zh";
  if (lowered.startsWith("ko")) return "ko";
  return DEFAULT_LANG;
}

export function detectLangFromHeader(acceptLanguage?: string | null): SupportedLang {
  if (!acceptLanguage) return DEFAULT_LANG;
  return normalizeLang(acceptLanguage.split(",")[0]);
}

export function getSeoContent(lang: SupportedLang): SeoContent {
  return SEO_BY_LANG[lang] ?? SEO_BY_LANG[DEFAULT_LANG];
}

export function getCanonicalUrl(lang: SupportedLang): string {
  if (lang === DEFAULT_LANG) return SITE_URL;
  return `${SITE_URL}/?lang=${lang}`;
}

export function getLanguageAlternates() {
  return {
    "ko-KR": `${SITE_URL}/?lang=ko`,
    "en-US": `${SITE_URL}/?lang=en`,
    "ja-JP": `${SITE_URL}/?lang=ja`,
    "zh-CN": `${SITE_URL}/?lang=zh`,
    "x-default": SITE_URL,
  };
}

export function getOpenGraphLocales(lang: SupportedLang) {
  const locale = LOCALE_BY_LANG[lang];
  const alternateLocale = Object.entries(LOCALE_BY_LANG)
    .filter(([key]) => key !== lang)
    .map(([, value]) => value);
  return { locale, alternateLocale };
}
