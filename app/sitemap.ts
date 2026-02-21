import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.haru2end.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/?lang=ko`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/?lang=en`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/?lang=ja`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/?lang=zh`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
