import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Everything may be crawled; the sitemap lists every page in both languages. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
