import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.elliceinvestmentgroup.com";
  const now = new Date();

  return [
    { url: base,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/portfolio`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/market`,        lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/calculator`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn`,         lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];
}
