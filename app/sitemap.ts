import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.haru2end.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/diary-site`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/online-diary`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/emotional-diary`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/private-diary`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/?lang=ko`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/?lang=en`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/?lang=ja`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/?lang=zh`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
