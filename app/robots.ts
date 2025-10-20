import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/debug-time/", "/_next/", "/admin/", "/private/"],
    },
    sitemap: "https://econecta.io/sitemap.xml",
  };
}
