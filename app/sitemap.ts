import type { MetadataRoute } from "next";
import { ALL_NAV_ITEMS } from "@/config/navigation";
import { ALLOW_INDEXING, SITE_URL } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING) return [];
  return ALL_NAV_ITEMS.map((item) => ({ url: `${SITE_URL}${item.href === "/" ? "" : item.href}`, changeFrequency: "daily" }));
}
